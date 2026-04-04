import { useState, useEffect } from 'react';
import { ExamAttempt, ExamAttemptResponse, ExamPaperContentBundle, AggregateMistakeInsight, ReviewRecommendation } from '../types';
import { getMistakeInsightsAndRecommendations } from '../services/examMistakeInsightService';

export const useExamMistakeInsights = (
  attempt: ExamAttempt | undefined,
  responses: ExamAttemptResponse[] | undefined,
  bundle: ExamPaperContentBundle | undefined
) => {
  const [insights, setInsights] = useState<AggregateMistakeInsight[]>([]);
  const [recommendations, setRecommendations] = useState<ReviewRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attempt || !responses || !bundle) {
      setIsLoading(true);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getMistakeInsightsAndRecommendations(attempt, responses, bundle)
      .then(result => {
        if (isMounted) {
          setInsights(result.insights);
          setRecommendations(result.recommendations);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to analyze exam mistakes.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [attempt, responses, bundle]);

  return { insights, recommendations, isLoading, error };
};