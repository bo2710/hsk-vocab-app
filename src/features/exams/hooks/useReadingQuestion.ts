// filepath: src/features/exams/hooks/useReadingQuestion.ts
import { ExamQuestion, ExamSection } from '../types';
import { useExamReadingPassage } from './useExamReadingPassage';

export const useReadingQuestion = (
  question: ExamQuestion,
  section?: ExamSection
) => {
  const isReading = section?.skill === 'reading' || question.question_type.toLowerCase().includes('read');

  // Không cần ném section vào nữa vì ta không dùng fallback bừa bãi
  const { passageText, hasPassage } = useExamReadingPassage(question);

  return {
    isReading,
    passageText,
    hasPassage
  };
};