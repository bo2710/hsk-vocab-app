import React from 'react';

interface ExamSessionProgressProps {
  currentIndex: number;
  total: number;
}

export const ExamSessionProgress: React.FC<ExamSessionProgressProps> = ({ currentIndex, total }) => {
  if (total === 0) return null;
  const percentage = ((currentIndex + 1) / total) * 100;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 overflow-hidden">
      <div 
        className="bg-primary-500 h-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};