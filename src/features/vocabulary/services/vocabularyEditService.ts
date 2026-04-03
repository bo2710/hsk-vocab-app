import { vocabularyRepository } from '../../../lib/supabase/repositories/vocabularyRepository';
import { VocabularyItem, VocabularyContext } from '../../../types/models';
import { putVocabulary, getVocabulary, deleteVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { addOperation } from '../../../lib/indexeddb/operationQueueStore';
import { supabase } from '../../../lib/supabase/client';

export const updateVocabularyWord = async (
  id: string,
  input: Partial<VocabularyItem> & { contexts?: Partial<VocabularyContext>[] }
): Promise<VocabularyItem> => {
  
  const { contexts, ...wordInput } = input;

  if (wordInput.hanzi !== undefined && wordInput.hanzi !== null && typeof wordInput.hanzi === 'string' && wordInput.hanzi.trim() === '') {
    throw new Error('Chữ Hán (Hanzi) không được để trống.');
  }
  if (wordInput.meaning_vi !== undefined && wordInput.meaning_vi !== null && typeof wordInput.meaning_vi === 'string' && wordInput.meaning_vi.trim() === '') {
    throw new Error('Nghĩa tiếng Việt không được để trống.');
  }

  const normalizedInput: Record<string, any> = { ...wordInput };
  if (normalizedInput.hanzi) {
    normalizedInput.hanzi_normalized = normalizedInput.hanzi.trim().replace(/\s+/g, '');
  }

  // 1. LẤY THÔNG TIN USER (Bắt buộc để lưu context chuẩn xác)
  const { data: { user } } = await supabase.auth.getUser();

  // 2. XỬ LÝ CONTEXTS CHUẨN XÁC
  if (contexts && Array.isArray(contexts) && user) {
    const mappedContexts = contexts.map(c => ({
      // Phải trải dữ liệu c ra trước để lấy đúng field
      ...c,
      id: c.id || crypto.randomUUID(),
      vocabulary_id: id,
      user_id: user.id, // Bắt buộc phải có user_id nếu DB yêu cầu
      context_name: c.context_name || '',
      context_type: c.context_type || 'sentence',
      context_note: c.context_note || null,
      learned_at: c.learned_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    try {
      // Dùng lệnh upsert trực tiếp.
      // Lưu ý: Không dùng onConflict nếu DB của bạn không set up UNIQUE constraint,
      // Mặc định Supabase sẽ upsert dựa trên Primary Key (id) nếu đã có.
      const { error: ctxError } = await supabase
        .from('vocabulary_contexts')
        .upsert(mappedContexts);
        
      if (ctxError) {
        console.error("Lỗi lưu ngữ cảnh vào Supabase:", ctxError);
        throw ctxError;
      }
    } catch (err: any) {
      await addOperation({
        operationType: 'UPDATE',
        entityType: 'CONTEXT', 
        payload: { vocabulary_id: id, contexts: mappedContexts }
      });
    }
  }

  // 3. LOCAL-FIRST
  const cached = await getVocabulary(id);
  if (!cached) {
    throw new Error('Từ vựng này không còn tồn tại trên thiết bị. Vui lòng tải lại trang.');
  }

  const updatedItem: VocabularyItem = { 
    ...cached, 
    ...normalizedInput, 
    updated_at: new Date().toISOString() 
  } as VocabularyItem;

  await putVocabulary(updatedItem);

  // 4. REMOTE-SYNC CHO TỪ VỰNG
  try {
    const result = await vocabularyRepository.updateVocabulary(id, normalizedInput);
    
    if (result.error) {
      throw result.error; 
    }
    
    if (result.data) {
      await putVocabulary(result.data);
      return result.data;
    }
    
    return updatedItem;
  } catch (error: any) {
    await addOperation({
      operationType: 'UPDATE',
      entityType: 'VOCABULARY',
      payload: { id, updates: normalizedInput }
    });
    
    return updatedItem;
  }
};

export const deleteVocabularyWord = async (id: string): Promise<boolean> => {
  await deleteVocabulary(id);

  try {
    const result = await vocabularyRepository.softDeleteVocabulary(id);
    if (result.error) throw result.error;
    return true;
  } catch (error: any) {
    await addOperation({
      operationType: 'DELETE',
      entityType: 'VOCABULARY',
      payload: { id }
    });
    return true; 
  }
};