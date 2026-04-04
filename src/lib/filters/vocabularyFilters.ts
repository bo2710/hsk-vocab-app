// filepath: src/lib/filters/vocabularyFilters.ts
import { VocabularyItem } from '../../types/models';

export interface FilterState {
  status?: string;
  hskLevel?: number;
  tag?: string;
  // V2 Fields
  hsk20Level?: number;
  hsk30Level?: number;
  hsk30Band?: number;
  sourceScope?: string;
}

export type SortField = 'date' | 'review_count' | 'hsk_level' | 'hsk20_level' | 'hsk30_level';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  order: SortOrder;
}

/**
 * Lọc mảng từ vựng dựa trên trạng thái, HSK Level (cũ và mới), Scope và Tag
 */
export const applyFilters = (items: VocabularyItem[], filters: FilterState): VocabularyItem[] => {
  return items.filter((item) => {
    // V1 Filters
    if (filters.status && item.status !== filters.status) return false;
    if (filters.hskLevel !== undefined && item.hsk_level !== filters.hskLevel) return false;
    
    // V2 Filters
    if (filters.hsk20Level !== undefined && item.hsk20_level !== filters.hsk20Level) return false;
    if (filters.hsk30Level !== undefined && item.hsk30_level !== filters.hsk30Level) return false;
    if (filters.hsk30Band !== undefined && item.hsk30_band !== filters.hsk30Band) return false;
    if (filters.sourceScope && item.source_scope !== filters.sourceScope) return false;

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
      valA = a.hsk_level ?? (sort.order === 'asc' ? 999 : -1);
      valB = b.hsk_level ?? (sort.order === 'asc' ? 999 : -1);
    } else if (sort.field === 'hsk20_level') {
      valA = a.hsk20_level ?? (sort.order === 'asc' ? 999 : -1);
      valB = b.hsk20_level ?? (sort.order === 'asc' ? 999 : -1);
    } else if (sort.field === 'hsk30_level') {
      valA = a.hsk30_level ?? (sort.order === 'asc' ? 999 : -1);
      valB = b.hsk30_level ?? (sort.order === 'asc' ? 999 : -1);
    } else {
      valA = 0;
      valB = 0;
    }

    if (valA < valB) return sort.order === 'asc' ? -1 : 1;
    if (valA > valB) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });
};