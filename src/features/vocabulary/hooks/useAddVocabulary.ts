import { useState } from 'react';
import { addVocabulary, CreateVocabularyInput } from '../services/vocabularyService';
import { contextService } from '../../contexts/services/contextService';
import { vocabularyRepository } from '../../../lib/supabase/repositories/vocabularyRepository'; // Thêm để update
import { putVocabulary } from '../../../lib/indexeddb/vocabularyStore'; // Thêm để update
import { VocabularyItem } from '../../../types/models';
import { AddVocabularyFormData } from '../types';

export interface UseAddVocabularyReturn {
  submit: (formData: AddVocabularyFormData) => Promise<boolean>;
  submitContextToExisting: (formData: AddVocabularyFormData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string>;
  isSuccess: boolean;
  resetState: () => void;
  duplicateData: VocabularyItem | null; 
  isDuplicateMode: boolean;
  clearDuplicateState: () => void;
}

export const useAddVocabulary = (): UseAddVocabularyReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const [duplicateData, setDuplicateData] = useState<VocabularyItem | null>(null);
  const isDuplicateMode = duplicateData !== null;

  const submit = async (formData: AddVocabularyFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);
    setDuplicateData(null);

    try {
      const vocabInput = {
        hanzi: formData.hanzi,
        hanzi_normalized: formData.hanzi.trim().replace(/\s+/g, ''), 
        pinyin: formData.pinyin,
        han_viet: formData.han_viet,
        meaning_vi: formData.meaning_vi,
        note: formData.note,
        example: formData.example,
        hsk_level: formData.hsk_level,
        tags: formData.tags,
        status: formData.status,
      } as CreateVocabularyInput; 

      await addVocabulary(vocabInput);
      setIsSuccess(true);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      
      if (errorMessage.startsWith('DUPLICATE:')) {
        setError('Từ vựng này đã tồn tại trong hệ thống.');
        const jsonStr = errorMessage.substring('DUPLICATE:'.length);
        try {
          const parsedData = JSON.parse(jsonStr);
          setDuplicateData(parsedData as VocabularyItem);
        } catch (e) {
          setDuplicateData({ id: jsonStr, hanzi: formData.hanzi } as VocabularyItem);
        }
      } else {
        setError(errorMessage);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setIsSuccess(false);
    setValidationErrors({});
  };

  const clearDuplicateState = () => {
    setDuplicateData(null);
    setError(null);
  };

  const submitContextToExisting = async (formData: AddVocabularyFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!duplicateData?.id) throw new Error('Không tìm thấy ID từ vựng gốc.');

      const result = await contextService.addContext(duplicateData.id, {
        context_name: formData.context_name,
        context_type: formData.context_type,
        learned_at: formData.learned_at,
        context_note: formData.note 
      });

      if (result.status === 'validation_error') {
        setValidationErrors(result.validationErrors || {});
        return false;
      }

      if (result.status === 'error') {
        throw result.error;
      }

      // FIX LỖI SỐ LẦN GẶP: Tăng encounter_count lên 1 và gán trạng thái 'new' để nó hiện Badge cập nhật
      const currentEncounter = duplicateData.encounter_count || 0;
      const updateResult = await vocabularyRepository.updateVocabulary(duplicateData.id, {
         encounter_count: currentEncounter + 1,
         status: 'new' // Set thành new để bật cờ "Mới" ngoài danh sách
      });
      
      if(updateResult.data) {
          await putVocabulary(updateResult.data);
      }

      setIsSuccess(true);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi khi thêm context.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, submitContextToExisting, isLoading, error, validationErrors, isSuccess, resetState, duplicateData, isDuplicateMode, clearDuplicateState };
};