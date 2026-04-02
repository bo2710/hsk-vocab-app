import { useState, useEffect, useCallback } from 'react';
import { VocabularyContext } from '../../../types';
import { contextService } from '../services/contextService';

export const useFetchContexts = (vocabularyId: string) => {
  const [data, setData] = useState<VocabularyContext[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContexts = useCallback(async () => {
    if (!vocabularyId) return;
    
    setIsLoading(true);
    setError(null);
    
    const result = await contextService.fetchContextsByVocabularyId(vocabularyId);
    
    if (result.status === 'success') {
      setData(result.data);
    } else if (result.status === 'error') {
      setError(result.error.message);
    }
    
    setIsLoading(false);
  }, [vocabularyId]);

  useEffect(() => {
    fetchContexts();
  }, [fetchContexts]);

  const updateLocalContext = useCallback((updatedContext: VocabularyContext) => {
    setData(prev => prev.map(c => c.id === updatedContext.id ? updatedContext : c));
  }, []);

  const removeLocalContext = useCallback((id: string) => {
    setData(prev => prev.filter(c => c.id !== id));
  }, []);

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchContexts, 
    updateLocalContext, 
    removeLocalContext 
  };
};