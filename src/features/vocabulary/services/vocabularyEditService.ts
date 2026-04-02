import { vocabularyRepository } from '../../../lib/supabase/repositories/vocabularyRepository';
import { VocabularyItem } from '../../../types/models';
import { putVocabulary, getVocabulary, deleteVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { addOperation } from '../../../lib/indexeddb/operationQueueStore';

export const updateVocabularyWord = async (
  id: string,
  input: Partial<VocabularyItem>
): Promise<VocabularyItem> => {
  
  // Validate rỗng an toàn
  if (input.hanzi !== undefined && input.hanzi !== null && typeof input.hanzi === 'string' && input.hanzi.trim() === '') {
    throw new Error('Chữ Hán (Hanzi) không được để trống.');
  }
  if (input.meaning_vi !== undefined && input.meaning_vi !== null && typeof input.meaning_vi === 'string' && input.meaning_vi.trim() === '') {
    throw new Error('Nghĩa tiếng Việt không được để trống.');
  }

  // Chuẩn hóa input
  const normalizedInput: Record<string, any> = { ...input };
  if (normalizedInput.hanzi) {
    normalizedInput.hanzi_normalized = normalizedInput.hanzi.trim().replace(/\s+/g, '');
  }

  // ========================================================
  // 1. LOCAL-FIRST: LUÔN LƯU VÀO MÁY TRƯỚC TIÊN
  // ========================================================
  const cached = await getVocabulary(id);
  if (!cached) {
    throw new Error('Từ vựng này không còn tồn tại trên thiết bị. Vui lòng tải lại trang.');
  }

  // Tạo bản nháp cập nhật mới nhất
  const updatedItem: VocabularyItem = { 
    ...cached, 
    ...normalizedInput, 
    updated_at: new Date().toISOString() 
  } as VocabularyItem;

  // Ép lưu thẳng xuống IndexedDB để đảm bảo UI không bao giờ bị mất dữ liệu
  await putVocabulary(updatedItem);

  // ========================================================
  // 2. REMOTE-SYNC: ĐỒNG BỘ LÊN MÂY (Hoặc ném vào Queue)
  // ========================================================
  try {
    const result = await vocabularyRepository.updateVocabulary(id, normalizedInput);
    
    if (result.error) {
      throw result.error; // Cố tình ném lỗi để nhảy vào catch bên dưới
    }
    
    // Nếu mây nhận thành công, lưu đè lại bản mây trả về cho chắc cú
    if (result.data) {
      await putVocabulary(result.data);
      return result.data;
    }
    
    return updatedItem;
  } catch (error: any) {
    // BẤT KỂ LÀ LỖI GÌ (mất mạng, server sập, hay Supabase không tìm thấy dòng), 
    // ta cũng vứt vào hàng đợi Sync ngầm, KHÔNG chặn giao diện của người dùng.
    await addOperation({
      operationType: 'UPDATE',
      entityType: 'VOCABULARY',
      payload: { id, updates: normalizedInput }
    });
    
    // Vẫn trả về kết quả thành công cho màn hình EditWordPage
    return updatedItem;
  }
};

export const deleteVocabularyWord = async (id: string): Promise<boolean> => {
  // LOCAL-FIRST: Xóa rễ ở máy tính/điện thoại ngay lập tức
  await deleteVocabulary(id);

  try {
    const result = await vocabularyRepository.softDeleteVocabulary(id);
    if (result.error) throw result.error;
    return true;
  } catch (error: any) {
    // Bất kể mây có lỗi gì, ném vào Queue và vẫn báo thành công cho người dùng
    await addOperation({
      operationType: 'DELETE',
      entityType: 'VOCABULARY',
      payload: { id }
    });
    return true; 
  }
};