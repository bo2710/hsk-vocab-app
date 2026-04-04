// filepath: src/components/exams/ExamListeningMediaSourceCard.tsx
// CẦN TẠO MỚI
import React from 'react';

interface Props {
  mediaUrl: string;
  isExternal: boolean;
}

export const ExamListeningMediaSourceCard: React.FC<Props> = ({ mediaUrl, isExternal }) => {
  if (isExternal) {
    return (
      <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 p-3 rounded-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Nguồn YouTube (External)</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Audio sẽ không được phát trong app.</p>
          </div>
        </div>
        <a 
          href={mediaUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-bold bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:bg-gray-800 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          Mở Link
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 p-3 rounded-xl mb-4">
      <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-2 rounded-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Audio In-App</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] md:max-w-xs">{mediaUrl}</p>
      </div>
    </div>
  );
};