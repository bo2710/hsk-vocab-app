// filepath: src/components/exams/ExamListeningExternalSourceNotice.tsx
// CẦN TẠO MỚI
import React from 'react';

interface Props {
  mediaUrl: string;
}

export const ExamListeningExternalSourceNotice: React.FC<Props> = ({ mediaUrl }) => {
  return (
    <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800/30 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <svg className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <div>
          <h4 className="text-sm font-bold text-orange-800 dark:text-orange-400">Nguồn nghe nằm ngoài ứng dụng</h4>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1 mb-3">
            Đề thi này sử dụng YouTube làm nguồn phát âm thanh. Vui lòng mở link dưới đây sang một tab/cửa sổ khác để nghe trong lúc làm bài.
          </p>
          <a 
            href={mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 dark:bg-gray-800 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-colors"
          >
            Mở Tab Audio
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
    </div>
  );
};