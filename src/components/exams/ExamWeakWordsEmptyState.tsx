import React from 'react';

export const ExamWeakWordsEmptyState: React.FC = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
      <svg className="w-10 h-10 text-emerald-400 dark:text-emerald-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Không tìm thấy từ vựng yếu</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 max-w-xs">Bạn đã trả lời đúng các câu hỏi có chứa từ vựng trong kho của mình.</p>
    </div>
  );
};