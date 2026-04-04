// filepath: src/features/publicVocabulary/hooks/usePublicVocabularyList.ts
// CẦN CHỈNH SỬA
import { useState, useEffect, useCallback } from 'react';
import { publicVocabularyService } from '../services/publicVocabularyService';
import { PublicVocabularyEntry, PublicVocabularyFilterParams } from '../types';

export const usePublicVocabularyList = (initialFilters: Partial<PublicVocabularyFilterParams> = {}) => {
  // 1. Phục hồi state quản lý bộ lọc
  const [filters, setFilters] = useState<Partial<PublicVocabularyFilterParams>>(initialFilters);
  const [data, setData] = useState<PublicVocabularyEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 2. Chống Infinite Loop: Serialize object filters thành chuỗi string.
  const filterString = JSON.stringify(filters);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const parsedFilters = JSON.parse(filterString);
      
      const result = await publicVocabularyService.browsePublicEntries(parsedFilters);
      
      if (result.status === 'success' && result.data) {
        setData(result.data);
      } else {
        setError(result.error || new Error('Không thể tải dữ liệu cộng đồng'));
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [filterString]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 3. Hàm hỗ trợ đổi filter từng field
  const setFilter = useCallback((key: keyof PublicVocabularyFilterParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    data,
    isLoading,
    error,
    filters,      // <-- TRẢ VỀ Ở ĐÂY ĐỂ TRÁNH LỖI UNDEFINED
    setFilters,   // <-- TRẢ VỀ Ở ĐÂY 
    setFilter,    // <-- TRẢ VỀ Ở ĐÂY
    refetch: fetchList
  };
};