import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface Props {
  answeredCount: number;
  totalCount: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ExamSubmitBar: React.FC<Props> = ({ answeredCount, totalCount, onSubmit, isSubmitting }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const isAllAnswered = answeredCount === totalCount;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">
            Đã làm: <span className={isAllAnswered ? "text-green-600" : "text-yellow-600"}>{answeredCount} / {totalCount}</span> câu
          </div>
          <Button 
            onClick={() => setShowConfirm(true)} 
            disabled={isSubmitting}
            variant="primary" 
            className="w-full sm:w-auto font-bold"
          >
            {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài & Chấm điểm'}
          </Button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Xác nhận nộp bài</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bạn đã hoàn thành <strong className={isAllAnswered ? "text-green-600" : "text-yellow-600"}>{answeredCount}</strong> trên tổng số <strong>{totalCount}</strong> câu hỏi. 
              Bạn có chắc chắn muốn nộp bài ngay bây giờ? Sau khi nộp sẽ không thể thay đổi đáp án.
            </p>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setShowConfirm(false)} variant="ghost" disabled={isSubmitting}>Quay lại làm tiếp</Button>
              <Button 
                onClick={() => {
                  setShowConfirm(false);
                  onSubmit();
                }} 
                variant="primary"
                disabled={isSubmitting}
              >
                Đồng ý nộp bài
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};