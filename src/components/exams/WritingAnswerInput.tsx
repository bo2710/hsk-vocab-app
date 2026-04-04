import React, { useState, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const WritingAnswerInput: React.FC<Props> = ({ value, onChange, placeholder = "Nhập bài viết của bạn tại đây..." }) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local state khi prop thay đổi (trường hợp navigate qua lại giữa các câu)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setLocalValue(text);
    onChange(text);
  };

  const wordCount = localValue.trim() ? localValue.trim().split(/\s+/).length : 0;
  const charCount = localValue.length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Bài làm của bạn:
        </label>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {wordCount} từ / {charCount} ký tự
        </span>
      </div>
      <textarea
        className="w-full flex-1 min-h-[300px] p-5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 text-base leading-relaxed resize-y shadow-sm transition-shadow"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        spellCheck="false"
      />
    </div>
  );
};