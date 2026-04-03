import React from 'react';
import { Card } from '../ui/Card';
import { WeeklyActivity } from '../../features/dashboard/types';

interface DashboardWeeklyChartProps {
  data: WeeklyActivity[];
}

export const DashboardWeeklyChart: React.FC<DashboardWeeklyChartProps> = ({ data }) => {
  // Find max value to scale the bars
  const maxVal = Math.max(...data.map(d => Math.max(d.added, d.reviewed)), 10); // Ensure at least 10 for scaling
  
  return (
    <Card className="h-full">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
        Hoạt động 7 ngày qua
      </h2>
      
      <div className="flex h-48 items-end gap-2 sm:gap-4 justify-between pt-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {data.map((day, idx) => {
          const addedHeight = `${Math.max((day.added / maxVal) * 100, 0)}%`;
          const reviewedHeight = `${Math.max((day.reviewed / maxVal) * 100, 0)}%`;
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                Thêm: {day.added} | Ôn: {day.reviewed}
              </div>
              
              <div className="w-full max-w-[24px] flex items-end gap-0.5">
                <div 
                  className="w-1/2 bg-blue-400 dark:bg-blue-500 rounded-t-sm transition-all duration-500 ease-out" 
                  style={{ height: addedHeight, minHeight: day.added > 0 ? '4px' : '0' }}
                ></div>
                <div 
                  className="w-1/2 bg-green-400 dark:bg-green-500 rounded-t-sm transition-all duration-500 ease-out" 
                  style={{ height: reviewedHeight, minHeight: day.reviewed > 0 ? '4px' : '0' }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* X Axis Labels */}
      <div className="flex gap-2 sm:gap-4 justify-between mt-2">
        {data.map((day, idx) => (
          <div key={`label-${idx}`} className="flex-1 text-center text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
            {day.date}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-sm mr-2"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Từ mới</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-sm mr-2"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Ôn tập</span>
        </div>
      </div>
    </Card>
  );
};