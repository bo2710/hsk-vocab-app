import { useState } from 'react';
import { contextService } from '../services/contextService';
import { EditContextFormData } from '../types';
import { VocabularyContext } from '../../../types';

export const useEditContext = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const submitEdit = async (id: string, vocabularyId: string, formData: EditContextFormData): Promise<VocabularyContext | null> => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);

    try {
      const result = await contextService.editContext(id, vocabularyId, formData);

      if (result.status === 'validation_error') {
        setValidationErrors(result.validationErrors);
        setIsLoading(false);
        return null;
      }

      if (result.status === 'error') {
        setError(result.error.message);
        setIsLoading(false);
        return null;
      }

      if (result.status === 'success') {
        setIsSuccess(true);
        setIsLoading(false);
        return result.data;
      }

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi hệ thống không xác định.');
      setIsLoading(false);
      return null;
    }
  };

  const resetState = () => {
    setError(null);
    setValidationErrors({});
    setIsSuccess(false);
  };

  return {
    submitEdit,
    isLoading,
    error,
    validationErrors,
    isSuccess,
    resetState
  };
};