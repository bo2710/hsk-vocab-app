// filepath: src/components/ui/FilterBar.tsx
import React from 'react';
import { FilterState, SortState } from '../../lib/filters/vocabularyFilters';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sort: SortState;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
  onClear: () => void;
  isActive: boolean;
  showAdvanced?: boolean;
  setShowAdvanced?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  sort,
  setSort,
  onClear,
  isActive,
  showAdvanced = false,
  setShowAdvanced
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
      
      {/* Hàng 1: Basic Filters & Sort */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
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
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Cấp độ HSK (Cũ)</label>
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

        <div className="flex items-end gap-3 w-full lg:w-auto">
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
              <option value="hsk_level-asc">HSK Cũ (Thấp đến Cao)</option>
              <option value="hsk_level-desc">HSK Cũ (Cao đến Thấp)</option>
              <option value="hsk20_level-asc">HSK 2.0 (Thấp đến Cao)</option>
              <option value="hsk20_level-desc">HSK 2.0 (Cao đến Thấp)</option>
              <option value="hsk30_level-asc">HSK 3.0 (Thấp đến Cao)</option>
              <option value="hsk30_level-desc">HSK 3.0 (Cao đến Thấp)</option>
              <option value="review_count-desc">Ôn tập nhiều nhất</option>
              <option value="review_count-asc">Ôn tập ít nhất</option>
            </select>
          </div>

          <button
            onClick={() => setShowAdvanced && setShowAdvanced(!showAdvanced)}
            className="text-sm px-3 py-1.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md font-medium transition-colors whitespace-nowrap h-[34px]"
          >
            {showAdvanced ? 'Thu gọn' : 'Nâng cao (V2)'}
          </button>

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

      {/* Hàng 2: Advanced Filters (V2) */}
      {showAdvanced && (
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700 animate-slide-up">
          <div className="flex flex-col flex-1 min-w-[120px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">HSK 2.0</label>
            <select
              value={filters.hsk20Level || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, hsk20Level: e.target.value ? parseInt(e.target.value, 10) : undefined }))}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500 w-full"
            >
              <option value="">Tất cả</option>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col flex-1 min-w-[120px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">HSK 3.0 Level</label>
            <select
              value={filters.hsk30Level || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, hsk30Level: e.target.value ? parseInt(e.target.value, 10) : undefined }))}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500 w-full"
            >
              <option value="">Tất cả</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col flex-1 min-w-[120px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">HSK 3.0 Band</label>
            <select
              value={filters.hsk30Band || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, hsk30Band: e.target.value ? parseInt(e.target.value, 10) : undefined }))}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500 w-full"
            >
              <option value="">Tất cả</option>
              <option value="1">Sơ cấp (1-3)</option>
              <option value="2">Trung cấp (4-6)</option>
              <option value="3">Cao cấp (7-9)</option>
            </select>
          </div>

          <div className="flex flex-col flex-1 min-w-[120px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Chế độ chia sẻ</label>
            <select
              value={filters.sourceScope || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, sourceScope: e.target.value || undefined }))}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm py-1.5 pl-2 pr-8 focus:ring-primary-500 focus:border-primary-500 w-full"
            >
              <option value="">Tất cả</option>
              <option value="private">Riêng tư</option>
              <option value="public">Công khai</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};