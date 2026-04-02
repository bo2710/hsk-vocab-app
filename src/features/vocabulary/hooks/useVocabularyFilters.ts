import { useState, useMemo } from 'react';
import { VocabularyItem } from '../../../types/models';
import { FilterState, SortState, applyFilters, applySort } from '../../../lib/filters/vocabularyFilters';

/**
 * Hook kết hợp dữ liệu gốc, filter state và sort state để trả về danh sách cuối cùng.
 */
export const useVocabularyFilters = (items: VocabularyItem[]) => {
  const [filters, setFilters] = useState<FilterState>({});
  const [sort, setSort] = useState<SortState>({ field: 'date', order: 'desc' });

  // Dùng useMemo để tránh filter/sort lại khi không có thay đổi
  const processedItems = useMemo(() => {
    const filtered = applyFilters(items, filters);
    return applySort(filtered, sort);
  }, [items, filters, sort]);

  // Đặt lại tất cả các điều kiện về mặc định
  const clearFilters = () => {
    setFilters({});
    setSort({ field: 'date', order: 'desc' });
  };

  // Xác định xem bộ lọc/sắp xếp có đang khác với giá trị mặc định không
  const isFilterActive = 
    Object.values(filters).some((val) => val !== undefined && val !== '') || 
    sort.field !== 'date' || 
    sort.order !== 'desc';

  return {
    filters,
    setFilters,
    sort,
    setSort,
    processedItems,
    clearFilters,
    isFilterActive
  };
};