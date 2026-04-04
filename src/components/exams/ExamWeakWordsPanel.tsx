import React, { useState } from 'react';
import { ExamWeakWord } from '../../features/exams/types';
import { ExamWeakWordCard } from './ExamWeakWordCard';
import { ExamWeakWordsEmptyState } from './ExamWeakWordsEmptyState';

interface Props {
  weakWords: ExamWeakWord[];
  isLoading: boolean;
  error: string | null;
}

export const ExamWeakWordsPanel: React.FC<Props> = ({ weakWords, isLoading, error }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="mb-6 p-6 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <svg className="animate-spin h-5 w-5 text-rose-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm text-gray-500 dark:text-gray-400">Đang tổng hợp từ vựng yếu...</span>
      </div>
    );
  }

  if (error) return null;

  return (
    <div className="mb-6 border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10 rounded-2xl overflow-hidden transition-all shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-rose-100/50 dark:hover:bg-rose-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span className="font-bold text-rose-800 dark:text-rose-300">Từ vựng cần ôn lại (Weak Words)</span>
          {!isLoading && weakWords.length > 0 && (
            <span className="ml-2 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {weakWords.length}
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-rose-600 dark:text-rose-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 md:p-6 border-t border-rose-200/50 dark:border-rose-800/30 bg-white/70 dark:bg-gray-900/50">
          {!weakWords.length ? (
            <ExamWeakWordsEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {weakWords.map(word => (
                <ExamWeakWordCard key={word.vocabulary_id} weakWord={word} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};