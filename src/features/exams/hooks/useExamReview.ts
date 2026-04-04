// filepath: src/features/exams/hooks/useExamReview.ts
// CẦN CHỈNH SỬA
import { useState, useMemo, useCallback } from 'react';
import { useExamResult } from './useExamResult';

export const useExamReview = (paperId: string | undefined, attemptId: string | undefined) => {
  const { data, isLoading, error } = useExamResult(paperId, attemptId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGridOpen, setIsGridOpen] = useState(false); // TASK-033: Navigator state

  // Derive flat list of active questions (similar to session behavior)
  const questions = useMemo(() => {
    if (!data?.bundle) return [];
    return [...data.bundle.questions].sort((a, b) => a.question_order - b.question_order);
  }, [data?.bundle]);

  const currentQuestion = questions[currentQuestionIndex] || null;

  const currentSection = useMemo(() => {
    if (!currentQuestion || !data?.bundle) return null;
    return data.bundle.sections.find(s => s.id === currentQuestion.exam_section_id) || null;
  }, [currentQuestion, data?.bundle]);

  const currentOptions = useMemo(() => {
    if (!currentQuestion || !data?.bundle) return [];
    return data.bundle.options
      .filter(o => o.exam_question_id === currentQuestion.id)
      .sort((a, b) => a.display_order - b.display_order);
  }, [currentQuestion, data?.bundle]);

  const currentResponse = useMemo(() => {
    if (!currentQuestion || !data?.responses) return null;
    return data.responses.find(r => r.exam_question_id === currentQuestion.id) || null;
  }, [currentQuestion, data?.responses]);

  // Navigation handlers
  const goNext = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
  }, [questions.length]);

  const goPrev = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setIsGridOpen(false); // Tự động đóng grid khi nhảy
    }
  }, [questions.length]);

  return {
    data,
    isLoading,
    error,
    questions,
    currentQuestion,
    currentQuestionIndex,
    currentSection,
    currentOptions,
    currentResponse,
    isGridOpen,
    setIsGridOpen,
    goNext,
    goPrev,
    goToQuestion
  };
};