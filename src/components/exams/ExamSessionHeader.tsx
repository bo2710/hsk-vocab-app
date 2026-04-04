// filepath: src/components/exams/ExamSessionHeader.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { Button } from '../ui/Button';
import { ExamSessionTimer } from './ExamSessionTimer';
import { AutosaveStatus } from '../../features/exams/hooks/useExamSession';

interface ExamSessionHeaderProps {
  title: string;
  elapsedSeconds: number;
  autosaveStatus: AutosaveStatus;
  onSubmit: () => void;
  onExit: () => void;
  onToggleGrid?: () => void;
}

export const ExamSessionHeader: React.FC<ExamSessionHeaderProps> = ({
  title, elapsedSeconds, autosaveStatus, onSubmit, onExit, onToggleGrid
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm px-4 py-3 flex items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onExit}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          title="Thoát"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        {/* Autosave Indicator */}
        <div className="hidden md:flex items-center text-xs font-medium">
          {autosaveStatus === 'saving' && <span className="text-yellow-600 dark:text-yellow-400 flex items-center"><svg className="animate-spin w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>Đang lưu...</span>}
          {autosaveStatus === 'saved' && <span className="text-green-600 dark:text-green-400 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Đã lưu nháp</span>}
          {autosaveStatus === 'error' && <span className="text-red-600 dark:text-red-400">Lỗi lưu nháp</span>}
        </div>

        <ExamSessionTimer elapsedSeconds={elapsedSeconds} />

        <Button variant="primary" size="sm" onClick={onSubmit} className="hidden sm:flex shadow-sm">
          Nộp Bài
        </Button>

        {onToggleGrid && (
          <button 
            onClick={onToggleGrid}
            className="p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors flex items-center gap-1"
            title="Bảng câu hỏi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span className="hidden lg:inline text-sm font-semibold">Mục lục</span>
          </button>
        )}
      </div>
    </header>
  );
};