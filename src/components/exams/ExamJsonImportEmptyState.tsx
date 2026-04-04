// filepath: src/components/exams/ExamJsonImportEmptyState.tsx
// CẦN TẠO MỚI
import React from 'react';

export const ExamJsonImportEmptyState: React.FC = () => {
  return (
    <div className="text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
      <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
      </svg>
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
        Chưa có dữ liệu JSON
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Hãy làm theo hướng dẫn bên trên để lấy JSON từ AI và dán vào đây.
      </p>
    </div>
  );
};