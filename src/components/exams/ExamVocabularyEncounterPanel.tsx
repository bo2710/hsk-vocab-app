import React, { useState } from 'react';
import { EncounterResult } from '../../lib/tokenize';
import { ExamVocabularyEncounterCard } from './ExamVocabularyEncounterCard';
import { ExamVocabularyEncounterEmptyState } from './ExamVocabularyEncounterEmptyState';

interface Props {
  encounters: EncounterResult[];
  isLoading: boolean;
  error: string | null;
}

export const ExamVocabularyEncounterPanel: React.FC<Props> = ({ encounters, isLoading, error }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mt-6 border border-teal-200 dark:border-teal-900/50 bg-teal-50/30 dark:bg-teal-900/5 rounded-2xl overflow-hidden transition-all shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-teal-100/50 dark:hover:bg-teal-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span className="font-bold text-teal-800 dark:text-teal-300">Từ vựng đã gặp trong câu này</span>
          {!isLoading && encounters.length > 0 && (
            <span className="ml-2 bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {encounters.length}
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-teal-600 dark:text-teal-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 md:p-6 border-t border-teal-200/50 dark:border-teal-800/30 bg-white/50 dark:bg-gray-800/50">
          {isLoading || error || encounters.length === 0 ? (
            <ExamVocabularyEncounterEmptyState isLoading={isLoading} error={error} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {encounters.map(encounter => (
                <ExamVocabularyEncounterCard key={encounter.vocabulary.id} encounter={encounter} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};