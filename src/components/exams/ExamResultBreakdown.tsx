import React from 'react';
import { ExamSection } from '../../features/exams/types';

interface Props {
  sections: ExamSection[];
  scores: Record<string, number>;
}

export const ExamResultBreakdown: React.FC<Props> = ({ sections, scores }) => {
  if (!sections.length || !scores) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm mb-8">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Điểm thành phần</h3>
      <div className="space-y-4">
        {sections.map(sec => {
          const score = scores[sec.id] || 0;
          return (
            <div key={sec.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{sec.section_name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{sec.skill}</p>
              </div>
              <div className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                {score} <span className="text-sm font-normal text-gray-400">điểm</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};