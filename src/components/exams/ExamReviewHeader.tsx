// filepath: src/components/exams/ExamReviewHeader.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { Button } from '../ui/Button';

interface Props {
  title: string;
  score: number | null;
  onExit: () => void;
  onToggleGrid?: () => void;
}

export const ExamReviewHeader: React.FC<Props> = ({ title, score, onExit, onToggleGrid }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm px-4 py-3 flex items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onExit}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          title="Thoát Review"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">Review Mode</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="hidden sm:block text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
          Điểm: <span className="text-primary-600 dark:text-primary-400">{score ?? '--'}</span>
        </div>
        
        {onToggleGrid && (
          <button 
            onClick={onToggleGrid}
            className="p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors flex items-center gap-1"
            title="Bảng phân tích đúng/sai"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span className="hidden lg:inline text-sm font-semibold">Lưới câu hỏi</span>
          </button>
        )}

        <Button variant="outline" size="sm" onClick={onExit} className="hidden sm:flex">
          Đóng
        </Button>
      </div>
    </header>
  );
};