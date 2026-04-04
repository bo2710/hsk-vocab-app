import React from 'react';
import { Button } from '../ui/Button';

export const ExamResultEmptyState: React.FC<{ message?: string, onBack: () => void }> = ({ message, onBack }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    </div>
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy kết quả</h2>
    <p className="text-gray-500 dark:text-gray-400 mb-6">{message || "Có lỗi xảy ra khi tải dữ liệu bài làm."}</p>
    <Button onClick={onBack} variant="primary">Quay lại Exam Center</Button>
  </div>
);