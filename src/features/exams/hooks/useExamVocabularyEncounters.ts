import { useState, useEffect } from 'react';
import { ExamQuestion, ExamSection, ExamQuestionOption } from '../types';
import { detectVocabularyEncounters } from '../services/examVocabularyEncounterService';
import { EncounterResult } from '../../../lib/tokenize/examVocabularyEncounterMatcher';

export const useExamVocabularyEncounters = (
  question: ExamQuestion | null,
  section: ExamSection | null,
  options: ExamQuestionOption[],
  readingPassage: string | null
) => {
  const [encounters, setEncounters] = useState<EncounterResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!question) {
      setEncounters([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    detectVocabularyEncounters(question, section, options, readingPassage)
      .then(results => {
        if (isMounted) {
          setEncounters(results);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Lỗi khi quét từ vựng trong đề');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [question, section, options, readingPassage]);

  return { encounters, isLoading, error };
};