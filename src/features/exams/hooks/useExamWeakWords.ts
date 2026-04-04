import { useState, useEffect } from 'react';
import { ExamAttemptResponse, ExamPaperContentBundle, AggregateMistakeInsight, ExamWeakWord } from '../types';
import { getExamWeakWords } from '../services/examWeakWordService';

export const useExamWeakWords = (
  responses: ExamAttemptResponse[] | undefined,
  bundle: ExamPaperContentBundle | undefined,
  insights: AggregateMistakeInsight[]
) => {
  const [weakWords, setWeakWords] = useState<ExamWeakWord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!responses || !bundle || !insights) {
      setWeakWords([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getExamWeakWords(responses, bundle, insights)
      .then(result => {
        if (isMounted) {
          setWeakWords(result);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load weak words');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [responses, bundle, insights]);

  return { weakWords, isLoading, error };
};