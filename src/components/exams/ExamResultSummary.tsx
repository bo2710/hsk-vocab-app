import React from 'react';

interface Props {
  score: number;
  accuracy: number;
  correct: number;
  wrong: number;
  unanswered: number;
  durationSeconds: number;
}

export const ExamResultSummary: React.FC<Props> = ({ score, accuracy, correct, wrong, unanswered, durationSeconds }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}p ${s}s`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Tổng điểm</p>
        <p className="text-3xl font-black text-primary-600 dark:text-primary-400">{score}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Tỉ lệ đúng</p>
        <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{accuracy}%</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Đúng / Sai / Bỏ qua</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-2">
          <span className="text-green-500">{correct}</span>
          <span className="mx-1 text-gray-300">/</span>
          <span className="text-red-500">{wrong}</span>
          <span className="mx-1 text-gray-300">/</span>
          <span className="text-gray-500">{unanswered}</span>
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Thời gian</p>
        <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-2">{formatTime(durationSeconds)}</p>
      </div>
    </div>
  );
};