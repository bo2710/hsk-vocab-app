// filepath: src/components/exams/ExamPaperHero.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { ExamPaper } from '../../features/exams/types';
import { ExamVisibilityBadge } from './ExamVisibilityBadge';

interface ExamPaperHeroProps {
  paper: ExamPaper;
}

export const ExamPaperHero: React.FC<ExamPaperHeroProps> = ({ paper }) => {
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
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
        {paper.title || 'Đề thi không có tiêu đề'}
      </h1>
      {paper.instructions && (
        <div className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 text-sm">
          <strong className="block text-gray-900 dark:text-gray-200 mb-1">Hướng dẫn:</strong>
          {paper.instructions}
        </div>
      )}
    </div>
  );
};