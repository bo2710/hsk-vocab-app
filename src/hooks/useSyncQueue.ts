import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from '../lib/network/useNetworkStatus';
import { getOperations } from '../lib/indexeddb/operationQueueStore';
import { processQueue } from '../lib/sync/syncManager';

export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';

export const useSyncQueue = () => {
  const { isOnline } = useNetworkStatus();
  const [queueCount, setQueueCount] = useState<number>(0);
  const [syncState, setSyncState] = useState<SyncState>('idle');

  const updateQueueCount = useCallback(async () => {
    try {
      const operations = await getOperations();
      setQueueCount(operations.length);
    } catch (err) {
      console.error('Failed to read queue count', err);
    }
  }, []);

  useEffect(() => {
    // Luôn ưu tiên trạng thái Offline nếu mất mạng
    if (!isOnline) {
      setSyncState('offline');
    } else {
      setSyncState(prev => (prev === 'offline' ? 'idle' : prev));
    }
  }, [isOnline]);

  useEffect(() => {
    // Đọc số lượng queue lần đầu
    updateQueueCount();

    // Lắng nghe các event từ SyncManager
    const handleStart = () => setSyncState('syncing');
    const handleEnd = () => {
      setSyncState('idle');
      updateQueueCount(); // Update lại count sau khi sync xong
    };
    const handleError = () => setSyncState('error');
    const handleQueueUpdate = () => updateQueueCount();

    window.addEventListener('sync:start', handleStart);
    window.addEventListener('sync:end', handleEnd);
    window.addEventListener('sync:error', handleError);
    window.addEventListener('sync:queue-updated', handleQueueUpdate);
    
    // Fallback: Quét lại queue mỗi 5 giây để bắt kịp các thay đổi từ Service 
    // (Vì ta không được phép sửa code addOperation ở Task này)
    const interval = setInterval(updateQueueCount, 5000);

    return () => {
      window.removeEventListener('sync:start', handleStart);
      window.removeEventListener('sync:end', handleEnd);
      window.removeEventListener('sync:error', handleError);
      window.removeEventListener('sync:queue-updated', handleQueueUpdate);
      clearInterval(interval);
    };
  }, [updateQueueCount]);

  const triggerSync = async () => {
    if (!isOnline || queueCount === 0 || syncState === 'syncing') return;
    await processQueue();
  };

  return {
    isOnline,
    queueCount,
    syncState,
    triggerSync
  };
};