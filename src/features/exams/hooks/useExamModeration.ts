// filepath: src/features/exams/hooks/useExamModeration.ts
// CẦN TẠO MỚI
import { useState, useCallback, useEffect } from 'react';
import { examPaperService } from '../services/examPaperService';
import { ExamEditRequest } from '../types';

export const useExamModeration = () => {
  const [pendingRequests, setPendingRequests] = useState<ExamEditRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    const result = await examPaperService.getPendingEditRequests();
    if (result.status === 'success') {
      setPendingRequests(result.data || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const resolveRequest = async (id: string, status: 'approved' | 'rejected') => {
    const res = await examPaperService.resolveEditRequest(id, status);
    if (res.status === 'success') {
      fetchRequests();
    } else {
      alert('Lỗi: ' + res.error?.message);
    }
  };

  return { pendingRequests, isLoading, resolveRequest, refetch: fetchRequests };
};