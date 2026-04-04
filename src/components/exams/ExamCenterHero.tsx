import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const ExamCenterHero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Trung tâm luyện thi</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Khám phá thư viện đề thi HSK đa dạng cấp độ, ôn luyện kiến thức và phân tích kết quả chi tiết.
        </p>
      </div>
      <Button variant="primary" onClick={() => navigate('/exams/import')} className="shrink-0">
        + Import Đề Thi
      </Button>
    </div>
  );
};