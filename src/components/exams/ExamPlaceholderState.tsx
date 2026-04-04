// filepath: src/components/exams/ExamPlaceholderState.tsx
import React from 'react';

interface ExamPlaceholderStateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const ExamPlaceholderState: React.FC<ExamPlaceholderStateProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[60vh] text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mt-4">
      <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
};