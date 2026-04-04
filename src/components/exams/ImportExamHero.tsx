// filepath: src/components/exams/ImportExamHero.tsx
// CẦN CHỈNH SỬA
import React from 'react';

export const ImportExamHero: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Import Đề Thi Mới
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
        Sử dụng sức mạnh của ChatGPT để trích xuất đề thi từ file PDF với độ chính xác cao nhất. Tránh lỗi nhận diện và giữ an toàn dữ liệu đáp án.
      </p>
    </div>
  );
};