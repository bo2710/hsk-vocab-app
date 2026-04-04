// filepath: src/components/exams/ExamJsonImportValidationSummary.tsx
// CẦN TẠO MỚI
import React from 'react';

interface ExamJsonImportValidationSummaryProps {
  errors: Record<string, string>;
}

export const ExamJsonImportValidationSummary: React.FC<ExamJsonImportValidationSummaryProps> = ({ errors }) => {
  const errorList = Object.entries(errors);
  if (errorList.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
      <h3 className="text-sm font-bold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Dữ liệu JSON không hợp lệ
      </h3>
      <ul className="list-disc list-inside space-y-1 text-xs text-red-700 dark:text-red-300 ml-2">
        {errorList.map(([key, msg]) => (
          <li key={key} className="break-words"><strong>{key}:</strong> {msg}</li>
        ))}
      </ul>
      <p className="text-xs text-red-600 dark:text-red-400 mt-3 font-medium">
        👉 Vui lòng yêu cầu ChatGPT sửa lại các lỗi trên và dán lại JSON mới.
      </p>
    </div>
  );
};