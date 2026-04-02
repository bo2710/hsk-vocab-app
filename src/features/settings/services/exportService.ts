import { supabase } from '../../../lib/supabase/client';
import { getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';

export const exportData = async (): Promise<string> => {
  try {
    // 1. LẤY TỪ LOCAL CACHE (INDEXEDDB) ĐỂ KHÔNG BỎ SÓT TỪ OFFLINE
    const localWords = await getAllVocabulary();
    // Chỉ xuất các từ chưa bị xóa và chưa lưu trữ
    const validWords = localWords.filter(w => !w.deleted_at && !w.is_archived);

    // 2. Lấy thêm contexts (nếu có) để backup trọn vẹn
    // (Vì contexts chưa được thiết lập IndexedDB hoàn chỉnh nên tạm lấy từ mây)
    const { data: contexts, error: contextsError } = await supabase
      .from('vocabulary_contexts')
      .select('*')
      .is('deleted_at', null);

    if (contextsError) throw contextsError;

    const exportObject = {
      version: 1,
      exportDate: new Date().toISOString(),
      vocabulary: validWords || [],
      contexts: contexts || [],
    };

    return JSON.stringify(exportObject, null, 2);
  } catch (error: any) {
    throw new Error(`Lỗi tải từ vựng: ${error.message}`);
  }
};