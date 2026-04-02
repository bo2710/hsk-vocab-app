import { supabase } from '../client';
import { VocabularyItem } from '../../../types';
import { 
  RepositoryResult, 
  CreateVocabularyInput, 
  UpdateVocabularyInput, 
  ListVocabularyParams 
} from '../../../types/repositories';
import { getCurrentUserId, formatError } from './helper';

// Sửa tên bảng để match 100% với file migration của bạn
const TABLE = 'vocabulary_items';

export const vocabularyRepository = {
  async createVocabulary(input: CreateVocabularyInput): Promise<RepositoryResult<VocabularyItem>> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ ...input, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return { data: data as VocabularyItem, error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async getVocabularyById(id: string): Promise<RepositoryResult<VocabularyItem>> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select()
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) throw error;
      return { data: data as VocabularyItem, error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async listVocabulary(params?: ListVocabularyParams): Promise<RepositoryResult<VocabularyItem[]>> {
    try {
      let query = supabase
        .from(TABLE)
        .select()
        .is('deleted_at', null);

      if (!params?.includeArchived) {
        query = query.eq('is_archived', false);
      }

      query = query.order('updated_at', { ascending: false });

      if (params?.limit) {
        query = query.limit(params.limit);
      }
      
      if (params?.offset !== undefined && params?.limit !== undefined) {
        const start = params.offset;
        const end = start + params.limit - 1;
        query = query.range(start, end);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data: data as VocabularyItem[], error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async updateVocabulary(id: string, input: UpdateVocabularyInput): Promise<RepositoryResult<VocabularyItem>> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .update(input)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) throw error;
      return { data: data as VocabularyItem, error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async softDeleteVocabulary(id: string): Promise<RepositoryResult<boolean>> {
    try {
      const { error } = await supabase
        .from(TABLE)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null);

      if (error) throw error;
      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async findVocabularyByNormalizedHanzi(hanziNormalized: string): Promise<RepositoryResult<VocabularyItem>> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select()
        .eq('hanzi_normalized', hanziNormalized)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      return { data: (data ? data as VocabularyItem : null), error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async findVocabularyByNormalizedPinyin(pinyinNormalized: string): Promise<RepositoryResult<VocabularyItem>> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select()
        .eq('pinyin_normalized', pinyinNormalized)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) throw error;
      return { data: (data ? data as VocabularyItem : null), error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  }
};