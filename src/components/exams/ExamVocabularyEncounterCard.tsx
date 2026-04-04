import React from 'react';
import { EncounterResult } from '../../lib/tokenize';
import { EncounterRole } from '../../lib/tokenize/examContentTokenizer';

interface Props {
  encounter: EncounterResult;
}

const roleMap: Record<EncounterRole, { label: string; color: string }> = {
  prompt: { label: 'Câu hỏi', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  passage: { label: 'Đoạn văn', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  option: { label: 'Đáp án', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  transcript: { label: 'Transcript', color: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300' },
  explanation: { label: 'Giải thích', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }
};

export const ExamVocabularyEncounterCard: React.FC<Props> = ({ encounter }) => {
  const { vocabulary, count, roles } = encounter;

  return (
    <div className="flex flex-col p-3 bg-white dark:bg-gray-800 border border-teal-100 dark:border-teal-900/50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xl font-bold text-gray-900 dark:text-white mr-2">
            {vocabulary.hanzi}
          </span>
          {vocabulary.pinyin && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {vocabulary.pinyin}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-xs font-bold">
          x{count}
        </div>
      </div>
      
      <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
        {vocabulary.meaning_vi}
      </div>

      <div className="mt-auto flex flex-wrap gap-1">
        {roles.map(role => (
          <span 
            key={role} 
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${roleMap[role]?.color || 'bg-gray-100 text-gray-600'}`}
          >
            {roleMap[role]?.label || role}
          </span>
        ))}
      </div>
    </div>
  );
};