import React from 'react';

interface Props {
  message: string;
}

export const WritingQuestionFallback: React.FC<Props> = ({ message }) => (
  <div className="p-4 mb-6 border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
    <p className="text-sm text-yellow-700 dark:text-yellow-500 font-medium">{message}</p>
  </div>
);