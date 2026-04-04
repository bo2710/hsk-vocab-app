// filepath: src/components/exams/ExamVisibilityFilterBar.tsx
// CẦN TẠO MỚI
import React from 'react';
import { ExamOwnerScope } from '../../features/exams/types';

interface ExamVisibilityFilterBarProps {
  selectedVisibility: 'all' | ExamOwnerScope;
  onSelect: (val: 'all' | ExamOwnerScope) => void;
}

export const ExamVisibilityFilterBar: React.FC<ExamVisibilityFilterBarProps> = ({ selectedVisibility, onSelect }) => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 rounded-lg">
      <button
        onClick={() => onSelect('all')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          selectedVisibility === 'all' 
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        Tất cả
      </button>
      <button
        onClick={() => onSelect('user_private')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          selectedVisibility === 'user_private' 
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        Cá nhân
      </button>
      <button
        onClick={() => onSelect('system')}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
          selectedVisibility === 'system' 
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
      >
        Hệ thống
      </button>
    </div>
  );
};