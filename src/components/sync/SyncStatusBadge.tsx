import React from 'react';
import { useSyncQueue } from '../../hooks/useSyncQueue';

export const SyncStatusBadge: React.FC = () => {
  const { isOnline, syncState, queueCount, triggerSync } = useSyncQueue();

  if (!isOnline) {
    return (
      <div 
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium border border-red-200 dark:border-red-800"
        title="Mất kết nối mạng. Dữ liệu sẽ được lưu tạm ở máy."
      >
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        Offline {queueCount > 0 && `(${queueCount})`}
      </div>
    );
  }

  if (syncState === 'syncing') {
    return (
      <div 
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-800"
      >
        <svg className="animate-spin h-3 w-3 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang đồng bộ...
      </div>
    );
  }

  if (queueCount > 0) {
    return (
      <button 
        onClick={triggerSync}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
        title="Nhấn để đồng bộ dữ liệu"
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Đang chờ ({queueCount})
      </button>
    );
  }

  // State Idle (Đã đồng bộ xong / Mặc định)
  return (
    <div 
      className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-500 text-xs font-medium"
      title="Dữ liệu đã được đồng bộ"
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Đã đồng bộ
    </div>
  );
};