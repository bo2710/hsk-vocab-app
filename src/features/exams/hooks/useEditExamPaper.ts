// filepath: src/features/exams/hooks/useEditExamPaper.ts
// CẦN TẠO MỚI
import { useState } from 'react';
import { examPaperService } from '../services/examPaperService';
import { UpdateExamPaperInput } from '../types';

export const useEditExamPaper = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updatePaper = async (id: string, payload: UpdateExamPaperInput) => {
    setIsSaving(true);
    setError(null);
    setValidationErrors({});
    try {
      const result = await examPaperService.updateExamPaper(id, payload);
      if (result.status === 'validation_error') {
        setValidationErrors(result.validationErrors || {});
        return false;
      }
      if (result.status === 'error') {
        setError(result.error?.message || 'Có lỗi xảy ra khi cập nhật đề thi.');
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deletePaper = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      const result = await examPaperService.deleteExamPapers([id]);
      if (result.status === 'error') {
        setError(result.error?.message || 'Có lỗi xảy ra khi xoá đề thi.');
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { 
    updatePaper, 
    deletePaper, 
    isSaving, 
    isDeleting, 
    error, 
    validationErrors 
  };
};