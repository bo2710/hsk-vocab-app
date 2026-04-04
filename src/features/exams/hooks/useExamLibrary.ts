// filepath: src/features/exams/hooks/useExamLibrary.ts
// CẦN CHỈNH SỬA
import { useState, useEffect, useMemo, useCallback } from 'react';
import { examPaperService } from '../services/examPaperService';
import { ExamPaper, ExamOwnerScope } from '../types';

export const useExamLibrary = () => {
  const [exams, setExams] = useState<ExamPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | ExamOwnerScope>('all');

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await examPaperService.getExamPapers({});
      if (result.status === 'success' && result.data) {
        setExams(result.data);
      } else {
        setError(result.error?.message || 'Lỗi tải danh sách đề thi.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách đề thi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const availableLevels = useMemo(() => {
    const levels = new Set<number>();
    exams.forEach(ex => {
      if (ex.exam_level) levels.add(ex.exam_level);
    });
    return Array.from(levels).sort((a, b) => a - b);
  }, [exams]);

  const filteredExams = useMemo(() => {
    let result = exams;
    if (selectedLevel !== 'all') {
      result = result.filter(ex => ex.exam_level === selectedLevel);
    }
    if (selectedVisibility !== 'all') {
      result = result.filter(ex => ex.owner_scope === selectedVisibility);
    }
    return result;
  }, [exams, selectedLevel, selectedVisibility]);

  const deleteExams = useCallback(async (ids: string[]) => {
    setIsDeleting(true);
    setError(null);
    try {
      const result = await examPaperService.deleteExamPapers(ids);
      if (result.status === 'success') {
        // Optimistic UI update
        setExams(prev => prev.filter(ex => !ids.includes(ex.id)));
        return true;
      } else {
        setError(result.error?.message || 'Không thể xóa đề thi.');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa đề thi.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    exams: filteredExams,
    allExams: exams,
    availableLevels,
    selectedLevel,
    setSelectedLevel,
    selectedVisibility,
    setSelectedVisibility,
    isLoading,
    isDeleting,
    error,
    refetch: fetchExams,
    deleteExams
  };
};