// filepath: src/components/exams/ExamPaperHero.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { ExamPaper } from '../../features/exams/types';
import { ExamVisibilityBadge } from './ExamVisibilityBadge';
import { Button } from '../ui/Button';

interface ExamPaperHeroProps {
  paper: ExamPaper;
  isOwner?: boolean;
  onOpenSettings?: () => void;
}

export const ExamPaperHero: React.FC<ExamPaperHeroProps> = ({ paper, isOwner, onOpenSettings }) => {
  const getStatusBadge = () => {
    switch (paper.status) {
      case 'published':
        return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Sẵn sàng</span>;
      case 'draft':
        return <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Bản nháp</span>;
      case 'archived':
        return <span className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Lưu trữ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {getStatusBadge()}
        {paper.exam_level && (
          <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            HSK {paper.exam_level}
          </span>
        )}
        <ExamVisibilityBadge ownerScope={paper.owner_scope} />
        {paper.source_type === 'pdf_import' && (
          <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Imported PDF
          </span>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight flex-1">
          {paper.title || 'Đề thi không có tiêu đề'}
        </h1>
        
        {isOwner && onOpenSettings && (
          <div className="shrink-0 mb-4 md:mb-0">
            <Button variant="outline" size="sm" onClick={onOpenSettings} className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Cài đặt đề thi
            </Button>
          </div>
        )}
      </div>

      {paper.instructions && (
        <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-sm mt-2">
          <strong className="block text-gray-900 dark:text-gray-200 mb-1">Hướng dẫn:</strong>
          {paper.instructions}
        </div>
      )}
    </div>
  );
};