import { useState } from 'react';
import { contextService } from '../services/contextService';

export const useDeleteContext = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const remove = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await contextService.removeContext(id);

      if (result.status === 'error') {
        setError(result.error.message);
        setIsLoading(false);
        return false;
      }

      if (result.status === 'success') {
        setIsSuccess(true);
        setIsLoading(false);
        return true;
      }

      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi hệ thống không xác định.');
      setIsLoading(false);
      return false;
    }
  };

  const resetState = () => {
    setError(null);
    setIsSuccess(false);
  };

  return {
    remove,
    isLoading,
    error,
    isSuccess,
    resetState
  };
};