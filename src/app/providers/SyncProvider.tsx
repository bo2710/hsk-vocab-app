import React, { useEffect } from 'react';
import { useNetworkStatus } from '../../lib/network/useNetworkStatus';
import { processQueue } from '../../lib/sync/syncManager';

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnline } = useNetworkStatus();

  // Kích hoạt đồng bộ khi có mạng trở lại
  useEffect(() => {
    if (isOnline) {
      processQueue().catch(err => console.error('[SyncProvider] Lỗi:', err));
    }
  }, [isOnline]);

  // Chạy background sync chu kỳ để dự phòng
  useEffect(() => {
    processQueue().catch(() => {});
    const interval = setInterval(() => {
      processQueue().catch(() => {});
    }, 60000); // Mỗi phút 1 lần

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
};