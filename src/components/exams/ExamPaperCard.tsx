// filepath: src/components/exams/ExamPaperCard.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { Link } from 'react-router-dom';
import { ExamPaper } from '../../features/exams/types';
import { ExamVisibilityBadge } from './ExamVisibilityBadge';

interface ExamPaperCardProps {
  paper: ExamPaper;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const ExamPaperCard: React.FC<ExamPaperCardProps> = ({ 
  paper, 
  isSelected = false, 
  isSelectionMode = false,
  onToggleSelect 
}) => {
  
  // Chỉ cho phép user chọn/xóa những đề cá nhân (hoặc tự import), không cho phép xóa đề system
  const canSelect = paper.owner_scope !== 'system';

  const handleCardClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.preventDefault();
      if (canSelect && onToggleSelect) {
        onToggleSelect(paper.id);
      }
    }
  };

  const cardClassName = `group relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl p-5 border shadow-sm hover:shadow-md transition-all ${
    isSelected 
      ? 'border-primary-500 ring-1 ring-primary-500 dark:border-primary-400 dark:ring-primary-400' 
      : 'border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800/50'
  } ${isSelectionMode ? (canSelect ? 'cursor-pointer' : 'cursor-not-allowed opacity-75') : ''}`;

  const cardContent = (
    <>
      {isSelectionMode && (
        <div className="absolute top-4 left-4 z-10">
          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
            isSelected 
              ? 'bg-primary-500 border-primary-500' 
              : canSelect 
                ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800' 
                : 'border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700'
          }`}>
            {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
            {!canSelect && !isSelected && <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>}
          </div>
        </div>
      )}

      <div className={`flex justify-between items-start mb-3 gap-3 ${isSelectionMode ? 'pl-8' : ''}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {paper.title || 'Đề thi chưa có tên'}
        </h3>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {paper.exam_level && (
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold rounded-lg uppercase tracking-wider">
              HSK {paper.exam_level}
            </span>
          )}
          <ExamVisibilityBadge ownerScope={paper.owner_scope} />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-5">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {paper.paper_year || 'N/A'}
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {paper.total_questions || 0} câu
        </div>
        {paper.total_duration_seconds ? (
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {Math.round(paper.total_duration_seconds / 60)} phút
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-700/50">
        <span className={`text-xs font-medium px-2.5 py-1 rounded ${
          paper.status === 'published' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
          paper.status === 'draft' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
          'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          {paper.status === 'published' ? 'Sẵn sàng' : paper.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
        </span>
        
        {!isSelectionMode && (
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline flex items-center">
            Chi tiết 
            <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </span>
        )}
      </div>
    </>
  );

  if (isSelectionMode) {
    return (
      <div onClick={handleCardClick} className={cardClassName}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link to={`/exams/${paper.id}`} onClick={handleCardClick} className={cardClassName}>
      {cardContent}
    </Link>
  );
};