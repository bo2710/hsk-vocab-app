// filepath: src/components/exams/ExamQuestionNavigatorGrid.tsx
// CẦN TẠO MỚI
import React from 'react';
import { QuestionGridSection, QuestionGridCellState } from '../../features/exams/hooks/useExamQuestionNavigator';

interface Props {
  sections: QuestionGridSection[];
  onJump: (index: number) => void;
  mode: 'session' | 'review';
}

export const ExamQuestionNavigatorGrid: React.FC<Props> = ({ sections, onJump, mode }) => {

  const getCellStyles = (state: QuestionGridCellState) => {
    switch (state) {
      case 'current':
        return 'bg-primary-500 text-white ring-2 ring-primary-300 dark:ring-primary-700 shadow-md font-bold scale-110 z-10';
      case 'answered':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 hover:bg-blue-200';
      case 'unanswered':
        return 'bg-white text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';
      case 'marked':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-700 hover:bg-yellow-200 border-dashed';
      case 'correct':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 hover:bg-green-200';
      case 'wrong':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50 hover:bg-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.id}>
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            {section.name}
          </h4>
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
            {section.cells.map(cell => (
              <button
                key={cell.id}
                onClick={() => onJump(cell.index)}
                className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center text-sm font-semibold transition-all duration-200 focus:outline-none ${getCellStyles(cell.state)}`}
                title={`Câu ${cell.order}`}
              >
                {cell.order}
                {/* Dấu chấm nhỏ cho current review mode (để user biết đúng/sai bên dưới lớp highlight current) */}
                {mode === 'review' && cell.state === 'current' && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};