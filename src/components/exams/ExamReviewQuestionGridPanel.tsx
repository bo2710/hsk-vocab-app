// filepath: src/components/exams/ExamReviewQuestionGridPanel.tsx
// CẦN TẠO MỚI
import React from 'react';
import { ExamQuestion, ExamSection, ExamAttemptResponse } from '../../features/exams/types';
import { useExamQuestionNavigator } from '../../features/exams/hooks/useExamQuestionNavigator';
import { ExamQuestionNavigatorGrid } from './ExamQuestionNavigatorGrid';
import { ExamQuestionNavigatorLegend } from './ExamQuestionNavigatorLegend';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questions: ExamQuestion[];
  sections: ExamSection[];
  responses: ExamAttemptResponse[];
  currentIndex: number;
  onJump: (index: number) => void;
}

export const ExamReviewQuestionGridPanel: React.FC<Props> = ({
  isOpen, onClose, questions, sections, responses, currentIndex, onJump
}) => {
  const { gridData, stats } = useExamQuestionNavigator('review', questions, sections, responses, currentIndex);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden" onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-200 dark:border-gray-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">Phân Tích Bài Thi</h3>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex justify-between text-sm">
          <div className="text-center">
            <div className="font-bold text-green-600 dark:text-green-400">{stats.correct}</div>
            <div className="text-xs text-gray-500">Đúng</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600 dark:text-red-400">{stats.wrong}</div>
            <div className="text-xs text-gray-500">Sai</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-500">{stats.unanswered}</div>
            <div className="text-xs text-gray-500">Bỏ trống</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ExamQuestionNavigatorGrid sections={gridData} onJump={onJump} mode="review" />
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
          <ExamQuestionNavigatorLegend mode="review" />
        </div>
      </div>
    </>
  );
};