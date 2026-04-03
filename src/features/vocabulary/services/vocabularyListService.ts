import { supabase } from '../../../lib/supabase/client';
import { getAllVocabulary, putAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { VocabularyItem } from '../../../types/models';

export const getVocabularyList = async (): Promise<VocabularyItem[]> => {
  const cached = await getAllVocabulary();

  const fetchRemote = async () => {
    // Nâng cấp: Lọc bỏ những từ đã từng bị xóa mềm (nếu có tồn đọng) để diệt trừ zombie
    const { data, error } = await supabase
      .from('vocabulary_items')
      .select('*')
      .is('deleted_at', null) 
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

  if (cached && cached.length > 0) {
    fetchRemote().catch(err => console.warn('[Sync] Background fetch failed:', err.message));
    return cached; 
  }

  return await fetchRemote();
};