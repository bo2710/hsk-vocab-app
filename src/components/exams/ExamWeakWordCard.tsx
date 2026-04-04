import React from 'react';
import { ExamWeakWord } from '../../features/exams/types';

interface Props {
  weakWord: ExamWeakWord;
}

export const ExamWeakWordCard: React.FC<Props> = ({ weakWord }) => {
  const isHighPriority = weakWord.priority === 'high';

  return (
    <div className={`p-3 rounded-xl border ${isHighPriority ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-900/10' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'} shadow-sm relative overflow-hidden flex flex-col`}>
      {isHighPriority && (
        <div className="absolute top-0 right-0 w-2 h-full bg-rose-400 dark:bg-rose-600"></div>
      )}
      <div className="flex justify-between items-start mb-2 pr-2">
        <div>
          <span className="text-xl font-bold text-gray-900 dark:text-white mr-2">
            {weakWord.hanzi}
          </span>
          {weakWord.pinyin && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {weakWord.pinyin}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold shrink-0">
          x{weakWord.encounter_count}
        </div>
      </div>
      
      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 mb-2">
        {weakWord.meaning_vi}
      </div>

      <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 italic line-clamp-2">
          {weakWord.reason}
        </p>
      </div>
    </div>
  );
};