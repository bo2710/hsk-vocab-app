import { useState, useCallback, useEffect } from 'react';
import { VocabularyItem } from '../../../types/models';
import { getVocabularyList } from '../services/vocabularyListService';

export const useVocabularyList = () => {
  const [data, setData] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getVocabularyList();
      // Hàm getVocabularyList giờ trả về mảng trực tiếp
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách từ vựng.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchList
  };
};