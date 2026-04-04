import { ExamAttemptResponse, ExamPaperContentBundle, AggregateMistakeInsight, ExamWeakWord } from '../types';
import { getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { deriveWeakWordsFromAttempt } from '../../../lib/analytics/examWeakWordDeriver';

export const getExamWeakWords = async (
  responses: ExamAttemptResponse[],
  bundle: ExamPaperContentBundle,
  insights: AggregateMistakeInsight[]
): Promise<ExamWeakWord[]> => {
  try {
    // 1. Fetch user's local vocabulary
    const vocabList = await getAllVocabulary();
    if (!vocabList || vocabList.length === 0) {
      return [];
    }

    // 2. Run the analytics deriver
    const weakWords = deriveWeakWordsFromAttempt(responses, bundle, vocabList, insights);
    
    return weakWords;
  } catch (error) {
    console.error('Failed to derive weak words:', error);
    return [];
  }
};