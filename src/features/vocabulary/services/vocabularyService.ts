import { vocabularyRepository } from '../../../lib/supabase/repositories/vocabularyRepository';
import { contextRepository } from '../../../lib/supabase/repositories/contextRepository';
import { VocabularyItem } from '../../../types/models';
import { putVocabulary, getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { addOperation } from '../../../lib/indexeddb/operationQueueStore';
import { isNetworkError, generateUUID } from '../../../lib/network/networkHelper';

export type CreateVocabularyInput = Partial<VocabularyItem> & {
  context_name?: string;
  context_type?: string;
  learned_at?: string;
  context_note?: string;
};

export const addVocabulary = async (input: CreateVocabularyInput): Promise<VocabularyItem> => {
  if (!input.hanzi || input.hanzi.trim() === '') {
    throw new Error('Chữ Hán (Hanzi) không được để trống.');
  }
  if (!input.meaning_vi || input.meaning_vi.trim() === '') {
    throw new Error('Nghĩa tiếng Việt không được để trống.');
  }

  // Tách riêng payload của từ vựng và ngữ cảnh
  const { context_name, context_type, learned_at, context_note, ...vocabInput } = input;

  const normalizedInput = {
    ...vocabInput,
    hanzi: vocabInput.hanzi!.trim(),
    hanzi_normalized: vocabInput.hanzi!.trim().replace(/\s+/g, ''),
    meaning_vi: vocabInput.meaning_vi!.trim(),
    pinyin: vocabInput.pinyin?.trim() || null,
    han_viet: vocabInput.han_viet?.trim() || null,
    note: vocabInput.note?.trim() || null,
    example: vocabInput.example?.trim() || null,
  };

  // KIỂM TRA TRÙNG LẶP (DUPLICATE DETECTION)
  const allLocalVocabs = await getAllVocabulary();
  let existingVocab = allLocalVocabs.find(v => v.hanzi === normalizedInput.hanzi);
  
  if (!existingVocab) {
    const remoteCheck = await vocabularyRepository.findVocabularyByNormalizedHanzi(normalizedInput.hanzi_normalized!);
    if (remoteCheck.data) {
       existingVocab = remoteCheck.data;
       await putVocabulary(existingVocab);
    }
  }

  if (existingVocab) {
    const duplicateData = {
      id: existingVocab.id,
      hanzi: existingVocab.hanzi,
      pinyin: existingVocab.pinyin || '',
      meaning_vi: existingVocab.meaning_vi || '',
      encounter_count: existingVocab.encounter_count || 0 
    };
    throw new Error(`DUPLICATE:${JSON.stringify(duplicateData)}`);
  }

  // LƯU DB: Phải lưu Vocabulary trước, rồi dùng ID đó lưu Context
  try {
    const result = await vocabularyRepository.createVocabulary(normalizedInput as any);
    if (result.error) throw result.error instanceof Error ? result.error : new Error(String(result.error));
    if (!result.data) throw new Error('Lỗi khi thêm từ vựng: Không nhận được dữ liệu.');
    
    await putVocabulary(result.data);

    // BƯỚC KHÔI PHỤC: Lưu Ngữ Cảnh vào Supabase nếu người dùng có nhập
    if (context_name && context_name.trim().length > 0) {
      await contextRepository.createContext({
        vocabulary_id: result.data.id,
        context_name: context_name.trim(),
        context_type: (context_type || 'sentence') as any,
        learned_at: learned_at || new Date().toISOString(),
        context_note: context_note?.trim() || null,
      });
    }

    return result.data;
  } catch (error: any) {
    // XỬ LÝ OFFLINE (Mất mạng)
    if (isNetworkError(error)) {
      const fallbackId = generateUUID();
      const optimisticItem: VocabularyItem = {
        ...(normalizedInput as any),
        id: fallbackId,
        user_id: '', 
        status: 'new',
        encounter_count: 1, // Lần đầu thêm là đã gặp 1 lần
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

      // Đẩy luôn cả ngữ cảnh vào hàng đợi offline
      if (context_name && context_name.trim().length > 0) {
        await addOperation({
          operationType: 'CREATE',
          entityType: 'CONTEXT',
          payload: {
            id: generateUUID(),
            vocabulary_id: fallbackId,
            context_name: context_name.trim(),
            context_type: context_type || 'sentence',
            learned_at: learned_at || new Date().toISOString(),
            context_note: context_note?.trim() || null,
          }
        });
      }

      return optimisticItem;
    }
    throw error;
  }
};