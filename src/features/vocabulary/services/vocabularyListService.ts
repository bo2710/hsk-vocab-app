import { supabase } from '../../../lib/supabase/client';
import { getAllVocabulary, putAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { VocabularyItem } from '../../../types/models';

export const getVocabularyList = async (): Promise<VocabularyItem[]> => {
  const cached = await getAllVocabulary();

  const fetchRemote = async () => {
    // Sử dụng trực tiếp Supabase Client để tránh lỗi sai tên hàm Repository
    const { data, error } = await supabase
      .from('vocabulary')
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