import { supabase } from '../../../lib/supabase/client';
import { VocabularyItem, VocabularyContext } from '../../../types/models';
import { getVocabulary } from '../../../lib/indexeddb/vocabularyStore';

export interface VocabularyDetailResult {
  word: VocabularyItem;
  contexts: VocabularyContext[];
}

/**
 * Fetch chi tiết từ vựng và các ngữ cảnh liên quan (Hỗ trợ Offline-first)
 */
export const getVocabularyDetail = async (id: string): Promise<VocabularyDetailResult> => {
  let word: VocabularyItem | null = null;

  // 1. LOCAL-FIRST: Cứu tinh của Offline!
  // Moi từ vựng từ bộ nhớ tạm IndexedDB ra trước. 
  // Rất quan trọng nếu bạn vừa tạo/sửa từ vựng mà nó chưa kịp đồng bộ lên mây.
  try {
    const localWord = await getVocabulary(id);
    if (localWord) {
      word = localWord;
    }
  } catch (err) {
    console.warn('Lỗi đọc IndexedDB:', err);
  }

  // 2. SUPABASE FALLBACK: Nếu local không có thì mới chọc lên mây
  if (!word) {
    const { data, error: wordError } = await supabase
      .from('vocabulary_items')
      .select('*')
      .eq('id', id)
      // ĐÃ XÓA bộ lọc is('deleted_at', null) ở đây để triệt tiêu lỗi sập trang
      .single();

    if (wordError) {
      if (wordError.code === 'PGRST116') {
        throw new Error('Không tìm thấy từ vựng này (Not Found).');
      }
      throw new Error(wordError.message);
    }
    word = data as VocabularyItem;
  }

  // 3. LẤY DANH SÁCH NGỮ CẢNH
  const { data: contextsData, error: contextsError } = await supabase
    .from('vocabulary_contexts')
    .select('*')
    .eq('vocabulary_id', id)
    .order('learned_at', { ascending: false });

  if (contextsError) {
    throw new Error(contextsError.message);
  }

  // 4. LỌC MỀM BẰNG JAVASCRIPT: Loại bỏ bóng ma ngữ cảnh đã xóa
  // Dùng filter JS an toàn 100%, không sợ Supabase bắt bẻ lỗi sai tên cột
  const activeContexts = (contextsData || []).filter(
    (ctx: any) => !ctx.deleted_at && ctx.is_archived !== true
  );

  return {
    word,
    contexts: activeContexts as VocabularyContext[],
  };
};