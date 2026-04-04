// filepath: src/components/exams/ExamModerationPanel.tsx
// CẦN TẠO MỚI
import React from 'react';
import { useExamModeration } from '../../features/exams/hooks/useExamModeration';
import { Button } from '../ui/Button';

export const ExamModerationPanel: React.FC = () => {
  const { pendingRequests, isLoading, resolveRequest } = useExamModeration();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải hàng đợi kiểm duyệt...</div>;
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p>Hàng đợi trống. Không có đề xuất chỉnh sửa đề thi nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in pb-24">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Đề xuất chỉnh sửa đề thi ({pendingRequests.length})
      </h3>
      <div className="grid gap-4">
        {pendingRequests.map(req => (
          <div key={req.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
            <div className="mb-3 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Tên đề thi:</span>
                <div className="text-base font-bold text-primary-600 dark:text-primary-400">
                  {req.exam_papers?.title || req.exam_paper_id}
                </div>
              </div>
              <span className="text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="mb-5">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Nội dung đề xuất thay đổi:</span>
              <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto text-gray-800 dark:text-gray-300">
                {JSON.stringify(req.payload, null, 2)}
              </pre>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" size="sm" onClick={() => resolveRequest(req.id, 'approved')}>
                Phê duyệt & Áp dụng
              </Button>
              <Button variant="danger" size="sm" onClick={() => resolveRequest(req.id, 'rejected')}>
                Từ chối
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};