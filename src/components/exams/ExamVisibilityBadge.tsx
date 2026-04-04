// filepath: src/components/exams/ExamVisibilityBadge.tsx
// CẦN TẠO MỚI
import React from 'react';
import { ExamOwnerScope } from '../../features/exams/types';

interface ExamVisibilityBadgeProps {
  ownerScope: ExamOwnerScope;
}

export const ExamVisibilityBadge: React.FC<ExamVisibilityBadgeProps> = ({ ownerScope }) => {
  if (ownerScope === 'system') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-green-200/50 dark:border-green-800/50">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Public
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border border-gray-200/50 dark:border-gray-700/50">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      Private
    </span>
  );
};