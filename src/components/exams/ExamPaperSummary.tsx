import React from 'react';
import { ExamPaper } from '../../features/exams/types';

interface ExamPaperSummaryProps {
  paper: ExamPaper;
}

export const ExamPaperSummary: React.FC<ExamPaperSummaryProps> = ({ paper }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Số câu hỏi</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {paper.total_questions || 0}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Thời gian</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {paper.total_duration_seconds ? `${Math.round(paper.total_duration_seconds / 60)} phút` : 'N/A'}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Năm ra đề</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {paper.paper_year || 'N/A'}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Loại đề</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
          {paper.exam_type || 'N/A'}
        </p>
      </div>
    </div>
  );
};