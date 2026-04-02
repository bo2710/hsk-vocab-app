import React from 'react';
import { VocabularyItem } from '../../types/models';

interface WordDetailMetaProps {
  word: VocabularyItem;
}

export const WordDetailMeta: React.FC<WordDetailMetaProps> = ({ word }) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Thông tin học tập</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Trạng thái</p>
          <span className="inline-block px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-md text-sm font-medium">
            {word.status || 'N/A'}
          </span>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Cấp độ HSK</p>
          <span className="inline-block px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-md text-sm font-medium">
            {word.hsk_level ? `HSK ${word.hsk_level}` : 'N/A'}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Số lần ôn tập</p>
          <p className="font-semibold text-gray-900 dark:text-white">{word.review_count || 0}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Số lần bắt gặp</p>
          <p className="font-semibold text-gray-900 dark:text-white">{word.encounter_count || 0}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ngày thêm</p>
          <p className="font-medium text-gray-800 dark:text-gray-200">{formatDate(word.first_added_at || word.created_at)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ôn lần cuối</p>
          <p className="font-medium text-gray-800 dark:text-gray-200">{formatDate(word.last_reviewed_at)}</p>
        </div>
      </div>

      {word.tags && word.tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Nhãn (Tags)</p>
          <div className="flex flex-wrap gap-2">
            {word.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};