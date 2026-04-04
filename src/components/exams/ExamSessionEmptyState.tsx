import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface ExamSessionEmptyStateProps {
  message: string;
}

export const ExamSessionEmptyState: React.FC<ExamSessionEmptyStateProps> = ({ message }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mt-8 max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không thể tải phiên làm bài</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{message}</p>
      <Button variant="primary" onClick={() => navigate('/exams')}>
        Quay lại thư viện đề thi
      </Button>
    </div>
  );
};