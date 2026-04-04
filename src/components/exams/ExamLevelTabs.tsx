import React from 'react';

interface ExamLevelTabsProps {
  availableLevels: number[];
  selectedLevel: number | 'all';
  onSelectLevel: (level: number | 'all') => void;
}

export const ExamLevelTabs: React.FC<ExamLevelTabsProps> = ({ availableLevels, selectedLevel, onSelectLevel }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelectLevel('all')}
        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
          selectedLevel === 'all'
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
      >
        Tất cả
      </button>
      {availableLevels.map(level => (
        <button
          key={level}
          onClick={() => onSelectLevel(level)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
            selectedLevel === level
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          HSK {level}
        </button>
      ))}
    </div>
  );
};