// filepath: src/components/publicVocabulary/PublicVocabularyEmptyState.tsx
import React from 'react';

interface PublicVocabularyEmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export const PublicVocabularyEmptyState: React.FC<PublicVocabularyEmptyStateProps> = ({ 
  hasFilters,
  onClearFilters 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed animate-fade-in min-h-[400px]">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {hasFilters ? 'Không tìm thấy kết quả phù hợp' : 'Kho từ vựng công cộng đang trống'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {hasFilters 
          ? 'Thử thay đổi từ khóa tìm kiếm hoặc xóa bớt các bộ lọc HSK.'
          : 'Dữ liệu từ vựng công cộng chưa được cập nhật. Bạn có thể đóng góp từ vựng của mình ở các bản cập nhật sau.'}
      </p>
      
      {hasFilters && onClearFilters && (
        <button 
          onClick={onClearFilters}
          className="px-5 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
};