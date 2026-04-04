// filepath: src/components/exams/ExamVisibilityField.tsx
// CẦN TẠO MỚI
import React from 'react';

interface ExamVisibilityFieldProps {
  value: 'public' | 'private';
  onChange: (val: 'public' | 'private') => void;
  disabled?: boolean;
}

export const ExamVisibilityField: React.FC<ExamVisibilityFieldProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900 dark:text-white">Quyền hiển thị đề thi</label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('private')}
          className={`flex items-start p-4 border rounded-xl transition-all ${
            value === 'private' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-3 ${
            value === 'private' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'
          }`}>
            {value === 'private' && <div className="w-2 h-2 rounded-full bg-primary-500" />}
          </div>
          <div className="text-left">
            <div className={`font-bold text-sm ${value === 'private' ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
              Cá nhân
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Chỉ mình bạn thấy và luyện tập đề này.</p>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('public')}
          className={`flex items-start p-4 border rounded-xl transition-all ${
            value === 'public' 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mr-3 ${
            value === 'public' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'
          }`}>
            {value === 'public' && <div className="w-2 h-2 rounded-full bg-primary-500" />}
          </div>
          <div className="text-left">
            <div className={`font-bold text-sm ${value === 'public' ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
              Công khai
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Đề thi sẽ khả dụng trong thư viện chung cho mọi người.</p>
          </div>
        </button>
      </div>
    </div>
  );
};