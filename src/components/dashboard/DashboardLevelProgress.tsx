import React from 'react';
import { Card } from '../ui/Card';
import { LevelProgress } from '../../features/dashboard/types';

interface DashboardLevelProgressProps {
  levels: LevelProgress[];
}

export const DashboardLevelProgress: React.FC<DashboardLevelProgressProps> = ({ levels }) => {
  if (levels.length === 0) {
    return (
      <Card className="h-full">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tiến độ HSK</h2>
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-500">
          <p>Chưa có dữ liệu cấp độ.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tiến độ HSK</h2>
      <div className="space-y-5">
        {levels.map((item) => {
          const percentage = Math.min(Math.round((item.count / item.totalEstimated) * 100), 100);
          return (
            <div key={item.level}>
              <div className="flex justify-between text-sm font-medium mb-1.5">
                <span className="text-gray-700 dark:text-gray-300">HSK {item.level}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {item.count} / {item.totalEstimated} <span className="text-xs ml-1 text-primary-500">({percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};