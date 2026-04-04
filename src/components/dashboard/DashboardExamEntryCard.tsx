import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DashboardExamEntryCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col text-white">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-black opacity-10 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex items-center mb-3">
        <div className="p-2 bg-white/20 rounded-lg mr-3 backdrop-blur-sm">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold">Luyện đề HSK</h2>
      </div>

      <p className="text-indigo-100 text-sm mb-6 relative z-10">
        Đánh giá năng lực, phân tích lỗi sai và tìm ra các từ vựng yếu thông qua hệ thống bài thi mô phỏng.
      </p>

      <button
        onClick={() => navigate('/exams')}
        className="relative z-10 w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-sm hover:bg-indigo-50 transition-colors focus:ring-2 focus:ring-white/50 focus:outline-none flex justify-center items-center gap-2"
      >
        Vào trung tâm luyện đề
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </button>
    </div>
  );
};