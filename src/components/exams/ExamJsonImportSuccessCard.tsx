// filepath: src/components/exams/ExamJsonImportSuccessCard.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { Button } from '../ui/Button';

interface ExamJsonImportSuccessCardProps {
  paperId: string;
  paperTitle: string;
  onReset: () => void;
  onNavigateDetail: () => void;
  onNavigateLibrary: () => void;
}

export const ExamJsonImportSuccessCard: React.FC<ExamJsonImportSuccessCardProps> = ({ 
  paperId, paperTitle, onReset, onNavigateDetail, onNavigateLibrary 
}) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 md:p-8 text-center shadow-sm">
      <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Import Đề Thi Thành Công</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
        Đề thi <strong>{paperTitle}</strong> đã được trích xuất và lưu trữ an toàn.
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-4">ID: {paperId}</p>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto bg-white/60 dark:bg-black/20 p-2 rounded border border-gray-100 dark:border-gray-800">
        ✅ Đáp án và transcript đã được tách biệt hoàn toàn vào vùng Review-Only để đảm bảo tính công bằng khi làm bài.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button variant="outline" onClick={onReset}>Import đề khác</Button>
        <Button variant="secondary" onClick={onNavigateLibrary}>Về thư viện</Button>
        <Button variant="primary" onClick={onNavigateDetail}>Xem chi tiết đề thi</Button>
      </div>
    </div>
  );
};