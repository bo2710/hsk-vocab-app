// filepath: src/lib/supabase/repositories/publicVocabularyRepository.ts
// CẦN CHỈNH SỬA
import { supabase } from '../client';
import { getCurrentUserId, withRepositoryErrorCatching } from './helper';
import { RepositoryResult } from '../../../types/repositories';
import { PublicVocabularyEntry, PublicVocabularyContribution, PublicVocabularyFilterParams } from '../../../features/publicVocabulary/types';

export const publicVocabularyRepository = {
  async browseEntries(params: PublicVocabularyFilterParams): Promise<RepositoryResult<PublicVocabularyEntry[]>> {
    return withRepositoryErrorCatching(async () => {
      let query = supabase.from('public_vocabulary_entries').select('*').eq('is_active', true);
      
      if (params.searchQuery) {
        query = query.ilike('canonical_hanzi', `%${params.searchQuery}%`);
      }
      if (params.hsk20Level) query = query.eq('hsk20_level', params.hsk20Level);
      if (params.hsk30Level) query = query.eq('hsk30_level', params.hsk30Level);
      if (params.hsk30Band) query = query.eq('hsk30_band', params.hsk30Band);
      if (params.limit) query = query.limit(params.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data as PublicVocabularyEntry[];
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
  },

  async getPendingContributions(): Promise<RepositoryResult<PublicVocabularyContribution[]>> {
    return withRepositoryErrorCatching(async () => {
      const { data, error } = await supabase
        .from('public_vocabulary_contributions')
        .select('*')
        .eq('validation_status', 'pending')
        .order('submitted_at', { ascending: true });
      if (error) throw error;
      return data as PublicVocabularyContribution[];
    });
  },

  async resolveContributions(ids: string[], status: 'approved' | 'rejected', note?: string): Promise<RepositoryResult<void>> {
    return withRepositoryErrorCatching(async () => {
      if (!ids.length) return;
      
      // BƯỚC 1: Nếu phê duyệt, phải đẩy vào Kho CỘNG ĐỒNG TRƯỚC
      if (status === 'approved') {
        const { data: contribs } = await supabase.from('public_vocabulary_contributions').select('*').in('id', ids);
        
        if (contribs && contribs.length > 0) {
          const newEntries = contribs.map((c: any) => ({
            canonical_hanzi: c.normalized_hanzi,
            canonical_pinyin: c.payload?.canonical_pinyin || c.payload?.pinyin || null,
            canonical_meaning_vi: c.payload?.canonical_meaning_vi || c.payload?.meaning_vi || 'N/A',
            canonical_han_viet: c.payload?.canonical_han_viet || c.payload?.han_viet || null,
            canonical_note: c.payload?.canonical_note || c.payload?.note || null,
            canonical_example: c.payload?.canonical_example || c.payload?.example || null,
            canonical_example_translation_vi: c.payload?.canonical_example_translation_vi || c.payload?.example_translation_vi || null,
            hsk20_level: c.payload?.hsk20_level || null,
            hsk30_level: c.payload?.hsk30_level || null,
            hsk30_band: c.payload?.hsk30_band || null,
            tags: Array.isArray(c.payload?.tags) ? c.payload.tags : [],
            is_active: true,
            accepted_at: new Date().toISOString()
            // ĐÃ XÓA created_by_user_id vì trường này là nguyên nhân chính gây lỗi ngầm Insert
          }));
          
          for (const entry of newEntries) {
            const { data: existing } = await supabase.from('public_vocabulary_entries').select('id').eq('canonical_hanzi', entry.canonical_hanzi).maybeSingle();
            
            if (existing) {
               const { error: updateError } = await supabase.from('public_vocabulary_entries').update(entry).eq('id', existing.id);
               if (updateError) throw new Error(`Lỗi Database khi Update: ${updateError.message}`);
            } else {
               const { error: insertError } = await supabase.from('public_vocabulary_entries').insert([entry]);
               // NÉM LỖI RA UI NẾU DB TỪ CHỐI
               if (insertError) throw new Error(`Lỗi Database khi Insert: ${insertError.message}`);
            }
          }
        }
      }

      // BƯỚC 2: CHỈ KHI DỮ LIỆU ĐÃ NẰM GỌN TRONG KHO MỚI ĐƯỢC ĐỔI TRẠNG THÁI
      const { error } = await supabase
        .from('public_vocabulary_contributions')
        .update({
          validation_status: status,
          resolution_note: note || null,
          resolved_at: new Date().toISOString()
        })
        .in('id', ids);
        
      if (error) throw error;
    });
  }
};