// filepath: src/components/publicVocabulary/PublicVocabularyContributionStatus.tsx
// CẦN CHỈNH SỬA
import React from 'react';
import { Button } from '../ui/Button';

// Utility component (Badge) được export để tái sử dụng trong các list view
export const ContributionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'approved': 
      return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Đã duyệt</span>;
    case 'rejected': 
      return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Từ chối</span>;
    case 'pending': 
      return <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Chờ duyệt</span>;
    default: 
      return <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">{status}</span>;
  }
};

interface PublicVocabularyContributionStatusProps {
  isSuccess: boolean;
  error: string | null;
  onClose: () => void;
  onContributeMore: () => void;
}

export const PublicVocabularyContributionStatus: React.FC<PublicVocabularyContributionStatusProps> = ({
  isSuccess,
  error,
  onClose,
  onContributeMore
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gửi đóng góp thất bại</h3>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
        <div className="pt-4 flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} fullWidth>Đóng</Button>
          <Button variant="primary" onClick={onContributeMore} fullWidth>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center p-6 space-y-4 animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Đã gửi thành công!</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Cảm ơn bạn đã đóng góp. Từ vựng hiện đang ở trạng thái <strong>Chờ duyệt (Pending)</strong>. 
          Hệ thống sẽ tiến hành kiểm tra trung lặp và đối chiếu từ điển trước khi hiển thị công khai.
        </p>
        <div className="pt-4 flex gap-3 w-full mt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>Quay lại danh sách</Button>
          <Button variant="primary" onClick={onContributeMore} fullWidth>Đóng góp từ khác</Button>
        </div>
      </div>
    );
  }

  return null;
};