import { supabase } from '../../../lib/supabase/client';
import { getAllVocabulary, putAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { VocabularyItem } from '../../../types/models';

export const getVocabularyList = async (): Promise<VocabularyItem[]> => {
  const cached = await getAllVocabulary();

  const fetchRemote = async () => {
    // SỬA LỖI DB: Sử dụng đúng tên bảng 'vocabulary_items' thay vì 'vocabulary'
    const { data, error } = await supabase
      .from('vocabulary_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      const items = data as VocabularyItem[];
      await putAllVocabulary(items);
      return items;
    }
    return [];
  };

  // Stale-while-revalidate: Trả về cache ngay, cập nhật ngầm phía sau
  if (cached && cached.length > 0) {
    fetchRemote().catch(err => console.warn('[Sync] Background fetch failed:', err.message));
    return cached; 
  }

  // Fallback nếu không có cache
  return await fetchRemote();
};