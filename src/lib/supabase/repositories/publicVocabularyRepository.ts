// filepath: src/lib/supabase/repositories/publicVocabularyRepository.ts
import { supabase } from '../client';
import { getCurrentUserId, withRepositoryErrorCatching } from './helper';
import { RepositoryResult } from '../../../types/repositories';
import { 
  PublicVocabularyEntry, 
  PublicVocabularyContribution,
  PublicVocabularyFilterParams
} from '../../../features/publicVocabulary/types';

export const publicVocabularyRepository = {
  async listPublicEntries(params: PublicVocabularyFilterParams): Promise<RepositoryResult<PublicVocabularyEntry[]>> {
    return withRepositoryErrorCatching(async () => {
      let query = supabase.from('public_vocabulary_entries').select('*').eq('is_active', true);
      
      if (params.searchQuery) {
        // Simple ilike search for foundation
        query = query.or(`canonical_hanzi.ilike.%${params.searchQuery}%,canonical_pinyin.ilike.%${params.searchQuery}%,canonical_meaning_vi.ilike.%${params.searchQuery}%`);
      }
      
      if (params.hsk20Level) {
        query = query.eq('hsk20_level', params.hsk20Level);
      }
      
      // Mặc định sort theo độ phổ biến
      query = query.order('usage_count', { ascending: false }).limit(params.limit || 50);

      const { data, error } = await query;
      if (error) throw error;
      return data as PublicVocabularyEntry[];
    });
  },

  async getPublicEntryById(id: string): Promise<RepositoryResult<PublicVocabularyEntry>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('public_vocabulary_entries')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as PublicVocabularyEntry;
    });
  },

  async createContribution(payload: Partial<PublicVocabularyContribution>): Promise<RepositoryResult<PublicVocabularyContribution>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('public_vocabulary_contributions')
        .insert([{ ...payload, user_id: userId }])
        .select()
        .single();
        
      if (error) throw error;
      return data as PublicVocabularyContribution;
    });
  },

  async listUserContributions(): Promise<RepositoryResult<PublicVocabularyContribution[]>> {
    return withRepositoryErrorCatching(async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('public_vocabulary_contributions')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });
        
      if (error) throw error;
      return data as PublicVocabularyContribution[];
    });
  }
};