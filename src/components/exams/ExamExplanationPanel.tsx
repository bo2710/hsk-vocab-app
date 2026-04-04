import React, { useState } from 'react';

interface Props {
  explanation: string | null;
}

export const ExamExplanationPanel: React.FC<Props> = ({ explanation }) => {
  const [isOpen, setIsOpen] = useState(true); // Default open for explanation

  if (!explanation) return null;

  return (
    <div className="mt-6 border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl overflow-hidden transition-all shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-purple-100/50 dark:hover:bg-purple-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-bold text-purple-800 dark:text-purple-300">Giải thích chi tiết</span>
        </div>
        <svg className={`w-5 h-5 text-purple-600 dark:text-purple-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      
      {isOpen && (
        <div className="p-4 md:p-6 border-t border-purple-200/50 dark:border-purple-800/30 bg-white dark:bg-gray-800">
          <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {explanation}
          </div>
          {/* Vùng chèn Vocabulary Insights (TASK-022, 023) sẽ được nhúng vào đây */}
          <div className="mt-4 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
             <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">[Vocabulary Insights Area - TASK 22,23]</span>
          </div>
        </div>
      )}
    </div>
  );
};