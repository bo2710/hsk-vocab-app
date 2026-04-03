import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface DashboardHeroProps {
  userName?: string;
  wordsToReview: number;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({ userName = 'Học giả', wordsToReview }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-gray-900 p-8 md:p-10 text-white shadow-lg">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-primary-400 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Chào mừng trở lại, {userName}! 👋
        </h1>
        <p className="text-primary-100 text-lg max-w-xl mb-8">
          {wordsToReview > 0 
            ? `Bạn có ${wordsToReview} từ vựng cần ôn tập hôm nay. Hãy duy trì nhịp độ học tập nhé!` 
            : 'Tuyệt vời! Bạn đã hoàn thành tất cả các mục tiêu ôn tập hôm nay.'}
        </p>
        
        <div className="flex flex-wrap gap-4">
          {/* ĐÃ FIX: Thêm ! (important) để ghi đè text-white mặc định của Button component */}
          <Button 
            size="lg" 
            className="!bg-white !text-primary-700 hover:!bg-gray-100 border-transparent shadow-md"
            onClick={() => navigate('/review')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Ôn tập ngay
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 text-white hover:bg-white/10 dark:border-gray-600 dark:hover:bg-gray-800/50"
            onClick={() => navigate('/add')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Thêm từ mới
          </Button>
        </div>
      </div>
    </div>
  );
};