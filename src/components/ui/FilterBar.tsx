import React from 'react';
import { FilterState, SortState } from '../../lib/filters/vocabularyFilters';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sort: SortState;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
  onClear: () => void;
  isActive: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  sort,
  setSort,
  onClear,
  isActive
}) => {
  return (
    // FIX DARK MODE: Vùng nền thanh công cụ
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 lg:items-center">
      
      {/* Cụm Filters */}
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="flex flex-col flex-1 min-w-[140px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Trạng thái</label>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500 w-full"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="new">Từ mới (New)</option>
            <option value="learning">Đang học (Learning)</option>
            <option value="reviewing">Cần ôn (Reviewing)</option>
            <option value="mastered">Đã thuộc (Mastered)</option>
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Cấp độ HSK</label>
          <select
            value={filters.hskLevel || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, hskLevel: e.target.value ? parseInt(e.target.value, 10) : undefined }))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500 w-full"
          >
            <option value="">Mọi cấp độ</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
              <option key={level} value={level}>HSK {level}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[120px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Tìm Tag</label>
          <input
            type="text"
            placeholder="VD: noun, verb..."
            value={filters.tag || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value || undefined }))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 px-3 focus:ring-primary-500 focus:border-primary-500 w-full placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Cụm Sort & Clear */}
      <div className="flex items-end gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100 dark:border-gray-700">
        <div className="flex flex-col flex-1 lg:min-w-[160px]">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Sắp xếp theo</label>
          <select
            value={`${sort.field}-${sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSort({ field: field as any, order: order as any });
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500 w-full"
          >
            <option value="date-desc">Mới nhất trước</option>
            <option value="date-asc">Cũ nhất trước</option>
            <option value="hsk_level-asc">HSK (Thấp đến Cao)</option>
            <option value="hsk_level-desc">HSK (Cao đến Thấp)</option>
            <option value="review_count-desc">Ôn tập nhiều nhất</option>
            <option value="review_count-asc">Ôn tập ít nhất</option>
          </select>
        </div>

        {isActive && (
          <button
            onClick={onClear}
            className="text-sm px-3 py-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md font-medium transition-colors whitespace-nowrap h-[34px] border border-transparent dark:border-red-800"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};