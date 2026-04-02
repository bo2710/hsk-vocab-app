import { useMemo } from 'react';
import { VocabularyItem } from '../../../types/models';
import { searchVocabulary } from '../../../lib/search/searchEngine';

/**
 * Hook quản lý logic tìm kiếm cục bộ cho danh sách từ vựng.
 * Sử dụng useMemo để tránh việc tính toán lại (filter) không cần thiết mỗi lần re-render.
 */
export const useVocabularySearch = (items: VocabularyItem[], query: string) => {
  const filteredItems = useMemo(() => {
    return searchVocabulary(items, query);
  }, [items, query]);

  return { filteredItems };
};