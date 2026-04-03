import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { VocabularyItem } from '../../types/models';

interface DashboardRecentActivityProps {
  recentWords: VocabularyItem[];
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({ recentWords }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Mới thêm gần đây
        </h2>
        <button 
          onClick={() => navigate('/vocabulary')}
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          Xem tất cả
        </button>
      </div>

      {recentWords.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
          Chưa có từ vựng nào được thêm.
        </div>
      ) : (
        <div className="space-y-3">
          {recentWords.map((word) => (
            <div 
              key={word.id} 
              onClick={() => navigate(`/vocabulary/${word.id}`)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white border border-primary-100 dark:border-gray-700 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                  {word.hanzi[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{word.hanzi}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-[200px]">{word.meaning_vi}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  word.status === 'new' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  word.status === 'learning' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  word.status === 'reviewing' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {word.status}
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  {new Date(word.first_added_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};