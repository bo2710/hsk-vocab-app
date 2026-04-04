import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ExamPaperEmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12 text-center shadow-sm">
      <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Đề thi chưa có cấu trúc phần thi</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Đề thi này hiện tại không có dữ liệu section/câu hỏi hợp lệ hoặc dữ liệu đang được chuẩn bị. Vui lòng quay lại sau.
      </p>
      <Button variant="primary" onClick={() => navigate('/exams')}>
        Quay lại thư viện
      </Button>
    </div>
  );
};