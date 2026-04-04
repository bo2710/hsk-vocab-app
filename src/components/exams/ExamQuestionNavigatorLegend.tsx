// filepath: src/components/exams/ExamQuestionNavigatorLegend.tsx
// CẦN TẠO MỚI
import React from 'react';

interface Props {
  mode: 'session' | 'review';
}

export const ExamQuestionNavigatorLegend: React.FC<Props> = ({ mode }) => {
  if (mode === 'session') {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary-500 ring-1 ring-primary-300"></div> Đang làm
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50"></div> Đã làm
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"></div> Chưa làm
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300 border-dashed dark:bg-yellow-900/40 dark:border-yellow-700"></div> Đánh dấu
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-primary-500 ring-1 ring-primary-300"></div> Đang xem
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800/50"></div> Đúng
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800/50"></div> Sai
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"></div> Trống
      </div>
    </div>
  );
};