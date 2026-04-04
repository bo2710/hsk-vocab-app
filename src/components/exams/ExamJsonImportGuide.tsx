// filepath: src/components/exams/ExamJsonImportGuide.tsx
// CẦN TẠO MỚI
import React from 'react';
import { Button } from '../ui/Button';

interface ExamJsonImportGuideProps {
  onOpenPromptModal: () => void;
}

export const ExamJsonImportGuide: React.FC<ExamJsonImportGuideProps> = ({ onOpenPromptModal }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quy trình Import bằng AI
      </h2>
      <ol className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center">1</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Sao chép Prompt yêu cầu</p>
            <p>Sử dụng mẫu prompt có sẵn của hệ thống để yêu cầu ChatGPT bóc tách file PDF chuẩn xác nhất.</p>
            <Button variant="outline" className="mt-2" onClick={onOpenPromptModal}>
              Xem & Copy Prompt
            </Button>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center">2</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Gửi PDF cho ChatGPT</p>
            <p>Mở ChatGPT, dán prompt vừa copy và đính kèm file PDF đề thi của bạn.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center">3</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Dán kết quả JSON vào đây</p>
            <p>Copy toàn bộ mã JSON mà ChatGPT trả về, dán vào ô bên dưới để hoàn tất việc tạo đề.</p>
          </div>
        </li>
      </ol>
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-lg text-xs">
        <strong>Lưu ý:</strong> ChatGPT có thể bỏ sót câu hỏi đối với các đề thi quá dài. Hãy nhắc nhở AI tuân thủ nguyên tắc <i>"không được bỏ sót câu"</i> nếu thấy thiếu.
      </div>
    </div>
  );
};