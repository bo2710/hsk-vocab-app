import React from 'react';

interface Props {
  hasSubjective: boolean;
}

export const ExamResultStatusCard: React.FC<Props> = ({ hasSubjective }) => {
  if (!hasSubjective) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-5 rounded-2xl mb-8 flex gap-4 items-start">
      <div className="text-blue-500 mt-1">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <div>
        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Đang chờ chấm phần tự luận</h4>
        <p className="text-sm text-blue-600 dark:text-blue-400/80 leading-relaxed">
          Bài thi của bạn có chứa các câu hỏi viết tự luận. Điểm số hiện tại chỉ phản ánh phần trắc nghiệm được chấm tự động.
        </p>
      </div>
    </div>
  );
};