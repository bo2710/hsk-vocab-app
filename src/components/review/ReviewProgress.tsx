import React from 'react';

interface ReviewProgressProps {
  current: number;
  total: number;
}

export const ReviewProgress: React.FC<ReviewProgressProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
        <span>Tiến độ học</span>
        <span>{current} / {total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};