import React from 'react';
import { Button } from '../ui/Button';

interface Props {
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export const ExamReviewNavigator: React.FC<Props> = ({ currentIndex, total, onNext, onPrev }) => {
  return (
    <div className="flex items-center justify-between mt-8 mb-4">
      <Button 
        onClick={onPrev} 
        disabled={currentIndex === 0} 
        variant="outline"
        className="flex items-center gap-2 font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        Câu trước
      </Button>

      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
        Câu {currentIndex + 1} / {total}
      </span>

      <Button 
        onClick={onNext} 
        disabled={currentIndex === total - 1} 
        variant="primary"
        className="flex items-center gap-2 font-medium shadow-sm"
      >
        Câu tiếp
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </Button>
    </div>
  );
};