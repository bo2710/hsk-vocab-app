// filepath: src/features/exams/hooks/useExamSession.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { examPaperService } from '../services/examPaperService';
import { examAttemptService } from '../services/examAttemptService';
import { ExamPaperContentBundle, ExamAttempt, ExamAttemptResponse } from '../types';
import { getExamDraft, saveExamDraft, deleteExamDraft } from '../../../lib/indexeddb/examDraftStore';

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type SessionStatus = 'loading' | 'active' | 'error' | 'submitting';

export const useExamSession = (paperId: string | undefined, selectedSectionIds: string[]) => {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [bundle, setBundle] = useState<ExamPaperContentBundle | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  
  // Navigation State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGridOpen, setIsGridOpen] = useState(false);
  
  // Runtime State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
  const [responses, setResponses] = useState<Record<string, Partial<ExamAttemptResponse>>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 1. Fetch Bundle & Start Attempt
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      if (!paperId || selectedSectionIds.length === 0) {
        if (isMounted) {
          setError('Không tìm thấy thông tin đề thi hoặc chưa chọn phần thi.');
          setStatus('error');
        }
        return;
      }

      try {
        setStatus('loading');
        
        // Cố gắng khôi phục Draft offline trước
        const draft = await getExamDraft(paperId);
        let bundleData = draft?.bundle;
        
        if (!bundleData) {
          const bundleRes = await examPaperService.getExamPaperContentBundle(paperId);
          if (bundleRes.status === 'error' || !bundleRes.data) {
            throw new Error(bundleRes.error?.message || 'Lỗi khi tải dữ liệu đề thi.');
          }
          bundleData = bundleRes.data;
        }

        if (draft) {
          if (isMounted) {
            setBundle(bundleData);
            setAttempt(draft.attempt);
            setResponses(draft.responses);
            setElapsedSeconds(draft.elapsedSeconds || 0);
            setStatus('active');
          }
          return;
        }

        const attemptRes = await examAttemptService.startAttempt(paperId, 'practice');
        if (attemptRes.status === 'error' || !attemptRes.data) {
          throw new Error(attemptRes.error?.message || 'Lỗi khi khởi tạo phiên làm bài.');
        }

        if (isMounted) {
          setBundle(bundleData);
          setAttempt(attemptRes.data);
          setStatus('active');
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Lỗi khởi tạo phiên làm bài.');
          setStatus('error');
        }
      }
    };

    initSession();

    return () => {
      isMounted = false;
    };
  }, [paperId, selectedSectionIds]);

  // 2. Derive active questions based on selected sections
  const activeQuestions = useMemo(() => {
    if (!bundle) return [];
    return bundle.questions
      .filter(q => selectedSectionIds.includes(q.exam_section_id))
      .sort((a, b) => a.question_order - b.question_order);
  }, [bundle, selectedSectionIds]);

  const currentQuestion = activeQuestions[currentQuestionIndex] || null;

  // 3. Timer
  useEffect(() => {
    if (status !== 'active') return;
    
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status]);

  // 4. Autosave Mechanism (Hardened for Offline)
  useEffect(() => {
    if (!hasUnsavedChanges || !attempt || !bundle || status !== 'active') return;

    const timer = setTimeout(async () => {
      setAutosaveStatus('saving');
      
      try {
        // Luôn luôn lưu local cache cho nháp để phòng sập app/reload
        await saveExamDraft({
          exam_paper_id: paperId!,
          bundle,
          attempt,
          responses,
          elapsedSeconds,
          lastSavedAt: Date.now()
        });

        // Chỉ call API remote nếu đang có mạng
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          const responsesArray = Object.values(responses).map(r => ({
            ...r,
            exam_attempt_id: attempt.id
          }));
          await examAttemptService.saveResponses(responsesArray);
        }
        
        setAutosaveStatus('saved');
        setHasUnsavedChanges(false);
        setTimeout(() => setAutosaveStatus('idle'), 2000);
      } catch (e) {
        console.error('Autosave lỗi', e);
        setAutosaveStatus('error');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, responses, attempt, bundle, status, paperId, elapsedSeconds]);

  // Navigation Handlers
  const goNext = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.min(prev + 1, activeQuestions.length - 1));
  }, [activeQuestions.length]);

  const goPrev = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentQuestionIndex(index);
      setIsGridOpen(false); // Tự động đóng grid khi nhảy trên mobile
    }
  }, [activeQuestions.length]);

  // Response & Mark Handler Shell
  const handleResponseChange = useCallback((questionId: string, value: string, optionId?: string, isSubjective?: boolean) => {
    setResponses(prev => {
      const updatedResponse: Partial<ExamAttemptResponse> = {
        ...prev[questionId],
        exam_question_id: questionId,
        answered_at: new Date().toISOString()
      };

      if (isSubjective) {
        updatedResponse.subjective_answer_text = value;
      } else {
        updatedResponse.selected_text = value;
        updatedResponse.selected_option_id = optionId || null;
      }

      return {
        ...prev,
        [questionId]: updatedResponse
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const toggleMarkForLater = useCallback((questionId: string) => {
    setResponses(prev => {
      const currentIsMarked = prev[questionId]?.is_marked_for_later || false;
      return {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          exam_question_id: questionId,
          is_marked_for_later: !currentIsMarked
        }
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  // 5. Submit Attempt
  const submitAttempt = useCallback(async (): Promise<{ success: boolean, attemptId?: string, error?: string }> => {
    if (!attempt || !bundle || status !== 'active') return { success: false, error: 'Session không hợp lệ.' };
    
    setStatus('submitting');
    try {
      const responsesArray = Object.values(responses).map(r => ({
        ...r,
        exam_attempt_id: attempt.id
      }));

      const result = await examAttemptService.submitAttemptAndScore({
        attemptId: attempt.id,
        durationSeconds: elapsedSeconds,
        bundle,
        responses: responsesArray
      });

      if (result.status === 'success') {
        // Nộp xong (hoặc đã vào Queue) thì xóa nháp đi
        await deleteExamDraft(paperId!);
        return { success: true, attemptId: attempt.id };
      } else {
        setStatus('active');
        return { success: false, error: result.error?.message || 'Lỗi khi nộp bài.' };
      }
    } catch (e: any) {
      setStatus('active');
      return { success: false, error: e.message || 'Lỗi hệ thống khi nộp bài.' };
    }
  }, [attempt, bundle, status, responses, elapsedSeconds, paperId]);

  return {
    status,
    error,
    bundle,
    attempt,
    activeQuestions,
    currentQuestion,
    currentQuestionIndex,
    elapsedSeconds,
    autosaveStatus,
    responses,
    isGridOpen,
    setIsGridOpen,
    goNext,
    goPrev,
    goToQuestion,
    handleResponseChange,
    toggleMarkForLater,
    submitAttempt
  };
};