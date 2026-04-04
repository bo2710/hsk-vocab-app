import React from 'react';
import { VocabularyItem } from '../../types/models';
import { useNavigate } from 'react-router-dom';

interface Props {
  weakWords: VocabularyItem[];
}

export const DashboardWeakWordsCard: React.FC<Props> = ({ weakWords }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30 shadow-sm relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-rose-400 to-orange-400 opacity-80"></div>
      
      <div className="flex items-center justify-between mb-4 pr-3">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          Từ vựng yếu (Từ đề thi)
        </h3>
      </div>

      {weakWords.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Chưa có dữ liệu từ vựng yếu.</p>
          <p className="text-xs text-gray-400">Hãy tiếp tục làm đề thi để hệ thống có thể phân tích.</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {weakWords.map((word) => (
            <div 
              key={word.id} 
              onClick={() => navigate(`/vocabulary/${word.id}`)}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-800/50"
            >
              <div>
                <div className="font-bold text-gray-900 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
                  {word.hanzi}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {word.meaning_vi}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          ))}
        </div>
      )}

      {weakWords.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => navigate('/review')}
            className="w-full text-center text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
          >
            Vào phòng ôn tập ngay &rarr;
          </button>
        </div>
      )}
    </div>
  );
};