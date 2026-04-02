import { VocabularyItem } from '../../types/models';

export interface FilterState {
  status?: string;
  hskLevel?: number;
  tag?: string;
}

export type SortField = 'date' | 'review_count' | 'hsk_level';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  order: SortOrder;
}

/**
 * Lọc mảng từ vựng dựa trên trạng thái, HSK Level, và Tag
 */
export const applyFilters = (items: VocabularyItem[], filters: FilterState): VocabularyItem[] => {
  return items.filter((item) => {
    // Lọc theo Status (khớp chính xác)
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    // Lọc theo HSK Level (khớp chính xác)
    if (filters.hskLevel !== undefined && item.hsk_level !== filters.hskLevel) {
      return false;
    }
    // Lọc theo Tag (chứa chuỗi)
    if (filters.tag && filters.tag.trim() !== '') {
      const searchTag = filters.tag.toLowerCase().trim();
      if (!item.tags || !item.tags.some((t) => t.toLowerCase().includes(searchTag))) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Sắp xếp mảng từ vựng dựa trên trường (field) và hướng (order)
 */
export const applySort = (items: VocabularyItem[], sort: SortState): VocabularyItem[] => {
  return [...items].sort((a, b) => {
    let valA: number;
    let valB: number;

    if (sort.field === 'date') {
      valA = a.first_added_at ? new Date(a.first_added_at).getTime() : 0;
      valB = b.first_added_at ? new Date(b.first_added_at).getTime() : 0;
    } else if (sort.field === 'review_count') {
      valA = a.review_count || 0;
      valB = b.review_count || 0;
    } else if (sort.field === 'hsk_level') {
      // Đẩy null xuống dưới cùng một cách hợp lý
      valA = a.hsk_level ?? (sort.order === 'asc' ? 999 : -1);
      valB = b.hsk_level ?? (sort.order === 'asc' ? 999 : -1);
    } else {
      valA = 0;
      valB = 0;
    }

    if (valA < valB) return sort.order === 'asc' ? -1 : 1;
    if (valA > valB) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });
};