import { vocabularyRepository } from '../../../lib/supabase/repositories/vocabularyRepository';
import { VocabularyItem } from '../../../types/models';
import { putVocabulary, getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { addOperation } from '../../../lib/indexeddb/operationQueueStore';
import { isNetworkError, generateUUID } from '../../../lib/network/networkHelper';

export type CreateVocabularyInput = Partial<VocabularyItem>;

export const addVocabulary = async (input: CreateVocabularyInput): Promise<VocabularyItem> => {
  if (!input.hanzi || input.hanzi.trim() === '') {
    throw new Error('Chữ Hán (Hanzi) không được để trống.');
  }
  if (!input.meaning_vi || input.meaning_vi.trim() === '') {
    throw new Error('Nghĩa tiếng Việt không được để trống.');
  }

  const normalizedInput = {
    ...input,
    hanzi: input.hanzi.trim(),
    hanzi_normalized: input.hanzi.trim().replace(/\s+/g, ''),
    meaning_vi: input.meaning_vi.trim(),
    pinyin: input.pinyin?.trim() || null,
    han_viet: input.han_viet?.trim() || null,
    note: input.note?.trim() || null,
    example: input.example?.trim() || null,
  };

  // KIỂM TRA TRÙNG LẶP (DUPLICATE DETECTION) - NÂNG CẤP BẢO MẬT 2 LỚP
  // Lớp 1: Check Local Cache
  const allLocalVocabs = await getAllVocabulary();
  let existingVocab = allLocalVocabs.find(v => v.hanzi === normalizedInput.hanzi);
  
  // Lớp 2: Check Remote DB (để tránh tạo trùng khi xóa cache)
  if (!existingVocab) {
    const remoteCheck = await vocabularyRepository.findVocabularyByNormalizedHanzi(normalizedInput.hanzi_normalized!);
    if (remoteCheck.data) {
       existingVocab = remoteCheck.data;
       // Tranh thủ lưu vào local luôn
       await putVocabulary(existingVocab);
    }
  }

  if (existingVocab) {
    const duplicateData = {
      id: existingVocab.id,
      hanzi: existingVocab.hanzi,
      pinyin: existingVocab.pinyin || '',
      meaning_vi: existingVocab.meaning_vi || '',
      encounter_count: existingVocab.encounter_count || 0 // Truyền thêm để dùng ở bước sau
    };
    throw new Error(`DUPLICATE:${JSON.stringify(duplicateData)}`);
  }

  try {
    const result = await vocabularyRepository.createVocabulary(normalizedInput as any);
    if (result.error) throw result.error instanceof Error ? result.error : new Error(String(result.error));
    if (!result.data) throw new Error('Lỗi khi thêm từ vựng: Không nhận được dữ liệu.');
    
    await putVocabulary(result.data);
    return result.data;
  } catch (error: any) {
    if (isNetworkError(error)) {
      const optimisticItem: VocabularyItem = {
        ...(normalizedInput as any),
        id: generateUUID(),
        user_id: '', 
        status: 'new',
        encounter_count: 0,
        review_count: 0,
        first_added_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_archived: false,
      };

      await putVocabulary(optimisticItem);
      await addOperation({
        operationType: 'CREATE',
        entityType: 'VOCABULARY',
        payload: optimisticItem
      });

      return optimisticItem;
    }
    throw error;
  }
};