import { useState, useEffect } from 'react';
import { VocabularyItem, VocabularyContext } from '../../../types/models';
import { getVocabularyDetail } from '../services/vocabularyDetailService';

export const useVocabularyDetail = (id: string | undefined) => {
  const [data, setData] = useState<VocabularyItem | null>(null);
  const [contexts, setContexts] = useState<VocabularyContext[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Reset sạch sành sanh state cũ ngay khi ID đổi
    setData(null);
    setContexts([]);
    
    if (!id) {
      setError(new Error('ID từ vựng không hợp lệ.'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getVocabularyDetail(id)
      .then((result) => {
        if (isMounted) {
          setData(result.word);
          setContexts(result.contexts);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, contexts, isLoading, error };
};