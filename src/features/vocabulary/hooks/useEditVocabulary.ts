import { useState } from 'react';
import { updateVocabularyWord, deleteVocabularyWord } from '../services/vocabularyEditService';
import { VocabularyItem } from '../../../types/models';

export const useEditVocabulary = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const editVocabulary = async (id: string, input: Partial<VocabularyItem>) => {
    setIsUpdating(true);
    setUpdateError(null);
    setIsSuccess(false);

    try {
      await updateVocabularyWord(id, input);
      setIsSuccess(true);
      return true;
    } catch (err) {
      setUpdateError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const removeVocabulary = async (id: string) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      // Dùng service để xóa hoàn toàn thay vì chỉ gửi lệnh mây
      await deleteVocabularyWord(id);
      
      setIsSuccess(true);
      return true;
    } catch (err) {
      setUpdateError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const resetState = () => {
    setUpdateError(null);
    setIsSuccess(false);
  };

  return { editVocabulary, removeVocabulary, isUpdating, updateError, isSuccess, resetState };
};