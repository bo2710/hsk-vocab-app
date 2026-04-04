// filepath: src/components/exams/ExamLibraryBulkActionBar.tsx
// CẦN TẠO MỚI
import React from 'react';
import { Button } from '../ui/Button';

interface ExamLibraryBulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const ExamLibraryBulkActionBar: React.FC<ExamLibraryBulkActionBarProps> = ({
  selectedCount,
  onClear,
  onDelete,
  isDeleting
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-8 z-40 animate-fade-in-up">
      <div className="bg-gray-900 dark:bg-gray-800 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-6 border border-gray-700">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 bg-primary-500 rounded-full text-xs font-bold">
            {selectedCount}
          </span>
          <span className="text-sm font-medium whitespace-nowrap">đề thi đã chọn</span>
        </div>
        
        <div className="w-px h-6 bg-gray-700"></div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onClear}
            disabled={isDeleting}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={onDelete}
            disabled={isDeleting}
            className="whitespace-nowrap"
          >
            {isDeleting ? 'Đang xóa...' : 'Xóa tất cả'}
          </Button>
        </div>
      </div>
    </div>
  );
};