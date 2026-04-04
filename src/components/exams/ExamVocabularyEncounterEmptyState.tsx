import React from 'react';

interface Props {
  isLoading?: boolean;
  error?: string | null;
}

export const ExamVocabularyEncounterEmptyState: React.FC<Props> = ({ isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
        <svg className="animate-spin h-6 w-6 text-teal-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">Đang quét từ vựng trong nội dung...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-dashed border-red-200 dark:border-red-900/30">
        <svg className="w-8 h-8 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
      <svg className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
      </svg>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Không phát hiện từ vựng quen thuộc</p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 max-w-xs">Chưa tìm thấy từ nào trong kho từ vựng của bạn xuất hiện trong câu hỏi này.</p>
    </div>
  );
};