// filepath: src/components/exams/ExamSessionNavigation.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { Button } from '../ui/Button';

interface ExamSessionNavigationProps {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  isMarked?: boolean;
  onToggleMark?: () => void;
}

export const ExamSessionNavigation: React.FC<ExamSessionNavigationProps> = ({
  currentIndex, total, onNext, onPrev, isMarked, onToggleMark
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
        <Button 
          variant="secondary" 
          onClick={onPrev} 
          disabled={currentIndex === 0}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Câu trước
        </Button>

        {onToggleMark && (
          <button
            onClick={onToggleMark}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors border border-dashed ${
              isMarked 
                ? 'bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-600' 
                : 'bg-transparent text-gray-500 border-gray-300 hover:bg-gray-100 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
            title="Đánh dấu để dễ dàng tìm lại trên mục lục"
          >
            <svg className="w-4 h-4" fill={isMarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            <span className="hidden sm:inline">{isMarked ? 'Đã đánh dấu' : 'Đánh dấu xem sau'}</span>
          </button>
        )}
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {currentIndex + 1} / {total}
        </span>

        <Button 
          variant="primary" 
          onClick={onNext} 
          disabled={currentIndex === total - 1}
        >
          Câu tiếp
          <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </Button>
      </div>
    </div>
  );
};