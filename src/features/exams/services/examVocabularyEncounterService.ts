import { getAllVocabulary } from '../../../lib/indexeddb/vocabularyStore';
import { extractTextSegments } from '../../../lib/tokenize/examContentTokenizer';
import { matchVocabularyInText, EncounterResult } from '../../../lib/tokenize/examVocabularyEncounterMatcher';
import { ExamQuestion, ExamSection, ExamQuestionOption } from '../types';

export const detectVocabularyEncounters = async (
  question: ExamQuestion,
  section: ExamSection | null,
  options: ExamQuestionOption[],
  readingPassage: string | null
): Promise<EncounterResult[]> => {
  try {
    // Fetch user's existing vocabulary dictionary from local cache for rapid matching
    const vocabList = await getAllVocabulary();
    if (!vocabList || vocabList.length === 0) {
      return [];
    }

    // Extract searchable text from the current exam question context
    const segments = extractTextSegments(question, section, options, readingPassage);
    
    // Perform deterministic matching
    const matches = matchVocabularyInText(segments, vocabList);
    
    return matches;
  } catch (error) {
    console.error('Failed to detect vocabulary encounters:', error);
    return [];
  }
};