import { useState, useEffect } from 'react';
import { examAttemptService } from '../services/examAttemptService';
import { examPaperService } from '../services/examPaperService';
import { ExamResultData } from '../types';

export const useExamResult = (paperId: string | undefined, attemptId: string | undefined) => {
  const [data, setData] = useState<ExamResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paperId || !attemptId) {
      setError("Thông tin kết quả không hợp lệ.");
      setIsLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        setIsLoading(true);
        // Tải attempt & responses
        const attemptRes = await examAttemptService.getAttemptResultData(attemptId);
        if (attemptRes.status === 'error' || !attemptRes.data) {
          throw new Error(attemptRes.error?.message || "Không thể tải kết quả.");
        }

        // Tải content bundle để map section/question info
        const bundleRes = await examPaperService.getExamPaperContentBundle(paperId);
        if (bundleRes.status === 'error' || !bundleRes.data) {
          throw new Error(bundleRes.error?.message || "Không thể tải nội dung đề.");
        }

        setData({
          attempt: attemptRes.data.attempt,
          responses: attemptRes.data.responses,
          bundle: bundleRes.data
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [paperId, attemptId]);

  return { data, isLoading, error };
};