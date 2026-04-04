// filepath: src/components/exams/ExamLibraryEmptyState.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface ExamLibraryEmptyStateProps {
  isFilterEmpty?: boolean;
  resetFilter?: () => void;
}

export const ExamLibraryEmptyState: React.FC<ExamLibraryEmptyStateProps> = ({ isFilterEmpty, resetFilter }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[400px]">
      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {isFilterEmpty ? 'Không tìm thấy đề thi phù hợp' : 'Thư viện đề thi trống'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
        {isFilterEmpty 
          ? 'Hệ thống chưa có đề thi nào thỏa mãn bộ lọc hiện tại. Vui lòng thay đổi cấp độ hoặc quyền hiển thị để xem thêm.' 
          : 'Hiện chưa có đề thi nào trong hệ thống. Hãy bắt đầu bằng cách import đề thi định dạng PDF.'}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {isFilterEmpty && resetFilter && (
          <Button variant="secondary" onClick={resetFilter}>Bỏ qua bộ lọc</Button>
        )}
        <Button variant="primary" onClick={() => navigate('/exams/import')}>
          Import Đề Thi Mới
        </Button>
      </div>
    </div>
  );
};