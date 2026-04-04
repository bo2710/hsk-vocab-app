// filepath: src/components/exams/ExamJsonImportReviewOnlyNotice.tsx
// CẦN TẠO MỚI
import React from 'react';

export const ExamJsonImportReviewOnlyNotice: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div>
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">Cơ chế Bảo mật Đáp án (Review-Only)</h4>
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          Quá trình import sẽ tự động tách toàn bộ đáp án và transcript theo cấu trúc JSON. Các dữ liệu này được bảo mật trong vùng <strong>Review-Only</strong>. Khi người dùng làm bài (Live Session), hệ thống tuyệt đối không tải dữ liệu đáp án để chống lộ đề.
        </p>
      </div>
    </div>
  );
};