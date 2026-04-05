// filepath: src/lib/supabase/repositories/vocabularyRepository.ts
// CẦN CHỈNH SỬA
import { supabase } from '../client';
import { VocabularyItem } from '../../../types';
import { 
  RepositoryResult, 
  CreateVocabularyInput, 
  UpdateVocabularyInput, 
  ListVocabularyParams 
} from '../../../types/repositories';
import { getCurrentUserId, formatError } from './helper';

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
      // 1. Lấy từ vựng cá nhân
      let query = supabase.from(TABLE).select().is('deleted_at', null);
      if (!params?.includeArchived) {
        query = query.eq('is_archived', false);
      }
      query = query.order('updated_at', { ascending: false });
      if (params?.limit) query = query.limit(params.limit);
      
      const { data: privateData, error: privateError } = await query;
      if (privateError) throw privateError;

      // 2. Lấy thêm từ vựng từ CỘNG ĐỒNG (đã duyệt)
      const { data: publicData, error: publicError } = await supabase
        .from('public_vocabulary_entries')
        .select('*')
        .eq('is_active', true);
      
      if (publicError) throw publicError;

      // 3. Gộp (Merge) vào chung một danh sách Kho Từ Vựng
      const privateHanziSet = new Set(privateData?.map(item => item.hanzi_normalized));
      
      const publicMapped = (publicData || [])
        .filter(pub => !privateHanziSet.has(pub.canonical_hanzi)) // Bỏ qua nếu user đã có từ này
        .map(pub => ({
            id: pub.id,
            user_id: 'system_public', // Đánh dấu đây là từ hệ thống
            hanzi: pub.canonical_hanzi,
            hanzi_normalized: pub.canonical_hanzi,
            pinyin: pub.canonical_pinyin,
            meaning_vi: pub.canonical_meaning_vi,
            han_viet: pub.canonical_han_viet,
            source_scope: 'system',
            hsk20_level: pub.hsk20_level,
            hsk30_band: pub.hsk30_band,
            hsk30_level: pub.hsk30_level,
            tags: pub.tags || [],
            status: 'new',
            encounter_count: pub.usage_count || 0,
            review_count: 0,
            created_at: pub.accepted_at,
            updated_at: pub.accepted_at,
            is_archived: false,
        } as unknown as VocabularyItem));

      const combinedData = [...(privateData as VocabularyItem[]), ...publicMapped];

      return { data: combinedData, error: null };
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