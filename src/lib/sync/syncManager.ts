import { getOperations, removeOperation } from '../indexeddb/operationQueueStore';
import { vocabularyRepository } from '../supabase/repositories/vocabularyRepository';
import { reviewLogRepository } from '../supabase/repositories/reviewLogRepository';
import { isNetworkError } from '../network/networkHelper';

let isSyncing = false;

// Helpers phát Event cho UI
const dispatchSyncEvent = (eventName: string, detail?: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
};

export const emitQueueUpdate = () => {
  dispatchSyncEvent('sync:queue-updated');
};

/**
 * Quét hàng đợi và đẩy dữ liệu lên backend.
 */
export const processQueue = async () => {
  if (isSyncing || typeof navigator !== 'undefined' && !navigator.onLine) {
    return;
  }

  isSyncing = true;
  dispatchSyncEvent('sync:start');

  try {
    const operations = await getOperations();
    
    // Nếu không có thao tác nào thì kết thúc sớm
    if (operations.length === 0) {
      isSyncing = false;
      dispatchSyncEvent('sync:end');
      return;
    }

    for (const op of operations) {
      let success = false;
      try {
        if (op.entityType === 'VOCABULARY') {
          if (op.operationType === 'CREATE') {
            const result = await vocabularyRepository.createVocabulary(op.payload as any);
            if (!result.error) success = true;
            else if (!isNetworkError(new Error(String(result.error)))) success = true; 
            
          } else if (op.operationType === 'UPDATE') {
            const { id, updates } = op.payload as any;
            const result = await vocabularyRepository.updateVocabulary(id, updates);
            if (!result.error) success = true;
            else if (!isNetworkError(new Error(String(result.error)))) success = true;
          }
        } else if (op.entityType === 'REVIEW_LOG') {
          if (op.operationType === 'CREATE') {
            const result = await reviewLogRepository.insertLog(op.payload as any);
            if (!result.error) success = true;
            else if (!isNetworkError(new Error(String(result.error)))) success = true;
          }
        }

        if (success) {
          await removeOperation(op.id);
          emitQueueUpdate(); // Báo UI update số lượng Queue
        } else {
          break; // Bị lỗi liên quan tới kết nối
        }
      } catch (err: any) {
        if (isNetworkError(err)) {
          break;
        }
        await removeOperation(op.id);
        emitQueueUpdate();
      }
    }
    
    dispatchSyncEvent('sync:end');
  } catch (err) {
    console.error('[SyncManager] Lỗi truy cập hàng đợi:', err);
    dispatchSyncEvent('sync:error', { error: err });
  } finally {
    isSyncing = false;
  }
};