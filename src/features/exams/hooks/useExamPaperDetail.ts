import { useState, useEffect, useCallback } from 'react';
import { examPaperService } from '../services/examPaperService';
import { ExamPaperContentBundle } from '../types';

export const useExamPaperDetail = (paperId: string | undefined) => {
  const [bundle, setBundle] = useState<ExamPaperContentBundle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);

  const fetchDetail = useCallback(async () => {
    if (!paperId) {
      setError('Mã đề thi không hợp lệ.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await examPaperService.getExamPaperContentBundle(paperId);
      
      if (result.status === 'success' && result.data) {
        setBundle(result.data);
        // Tự động chọn tất cả các section khi load thành công
        setSelectedSectionIds(result.data.sections.map(sec => sec.id));
      } else {
        setError(result.error?.message || 'Không thể tải chi tiết đề thi.');
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không xác định khi tải dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  }, [paperId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const toggleSection = useCallback((sectionId: string) => {
    setSelectedSectionIds(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const selectAllSections = useCallback(() => {
    if (bundle) {
      setSelectedSectionIds(bundle.sections.map(sec => sec.id));
    }
  }, [bundle]);

  return {
    bundle,
    isLoading,
    error,
    selectedSectionIds,
    toggleSection,
    selectAllSections,
    refetch: fetchDetail
  };
};