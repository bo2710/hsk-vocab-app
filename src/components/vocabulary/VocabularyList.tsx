import React from 'react';
import { VocabularyItem } from '../../types/models';
import { VocabularyCard } from './VocabularyCard';

interface VocabularyListProps {
  items: VocabularyItem[];
  isLoading: boolean;
  error: Error | null;
  hasActiveFilters?: boolean;
  // Các props cho chế độ chọn nhiều
  isSelectMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({
  items,
  isLoading,
  error,
  hasActiveFilters = false,
  isSelectMode = false,
  selectedIds = [],
  onToggleSelect
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 flex justify-center items-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading vocabulary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
        <p className="font-medium">Error loading vocabulary</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed">
        <p className="text-gray-500 dark:text-gray-400">
          {hasActiveFilters
            ? 'Không tìm thấy từ vựng nào phù hợp với tìm kiếm hoặc bộ lọc của bạn.'
            : 'Danh sách từ vựng đang trống. Hãy thêm từ mới để bắt đầu học!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <VocabularyCard 
          key={item.id} 
          item={item} 
          isSelectMode={isSelectMode}
          isSelected={selectedIds.includes(item.id)}
          onToggleSelect={() => onToggleSelect?.(item.id)}
        />
      ))}
    </div>
  );
};