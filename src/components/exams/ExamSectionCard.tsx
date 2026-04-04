import React from 'react';
import { ExamSection } from '../../features/exams/types';

interface ExamSectionCardProps {
  section: ExamSection;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const SKILL_LABELS: Record<string, string> = {
  listening: 'Nghe hiểu',
  reading: 'Đọc hiểu',
  writing: 'Viết',
  comprehensive: 'Tổng hợp'
};

export const ExamSectionCard: React.FC<ExamSectionCardProps> = ({ section, isSelected, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(section.id)}
      className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-0.5">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => onToggle(section.id)}
            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer pointer-events-none"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
            {section.section_name || `Phần ${section.display_order}`}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              {SKILL_LABELS[section.skill] || section.skill}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {section.question_count || 0} câu
            </span>
            {section.duration_seconds && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {Math.round(section.duration_seconds / 60)} phút
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};