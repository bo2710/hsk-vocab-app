import { ExamAttempt, ExamAttemptResponse, ExamPaperContentBundle, AggregateMistakeInsight, ReviewRecommendation } from '../types';
import { analyzeMistakes } from '../../../lib/analytics/examMistakeAnalyzer';
import { generateRecommendations } from '../../../lib/analytics/examReviewRecommendationEngine';

export interface InsightServiceResult {
  insights: AggregateMistakeInsight[];
  recommendations: ReviewRecommendation[];
}

export const getMistakeInsightsAndRecommendations = async (
  attempt: ExamAttempt,
  responses: ExamAttemptResponse[],
  bundle: ExamPaperContentBundle
): Promise<InsightServiceResult> => {
  try {
    // In a real robust system, this might push heavy computation to a Web Worker
    // For V2 MVP, running this synchronously locally is fast enough for <100 questions.
    const insights = analyzeMistakes(attempt, responses, bundle);
    const recommendations = generateRecommendations(insights, bundle);

    return { insights, recommendations };
  } catch (error) {
    console.error('Failed to generate mistake insights:', error);
    return { insights: [], recommendations: [] };
  }
};