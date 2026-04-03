import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface DashboardTodayFocusProps {
  reviewCount: number;
  newCount: number;
}

export const DashboardTodayFocus: React.FC<DashboardTodayFocusProps> = ({ reviewCount, newCount }) => {
  const navigate = useNavigate();
  const totalActionable = reviewCount + newCount;

  return (
    <Card className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Hôm nay
        </h2>
        {totalActionable > 0 && (
          <span className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full">
            {totalActionable} nhiệm vụ
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4 my-2">
        <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Cần ôn tập</span>
          </div>
          <span className="font-bold text-lg text-orange-600 dark:text-orange-400">{reviewCount}</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Từ mới chưa học</span>
          </div>
          <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{newCount}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button 
          fullWidth 
          onClick={() => navigate('/review')}
          disabled={totalActionable === 0}
          className={totalActionable === 0 ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : ''}
        >
          {totalActionable > 0 ? 'Bắt đầu ngay' : 'Đã hoàn thành'}
        </Button>
      </div>
    </Card>
  );
};