import { initDB } from './db';
import { PendingOperation } from '../../types/indexeddb';

/**
 * Hàm hỗ trợ tạo ID tự động an toàn (fallback khi trình duyệt không hỗ trợ crypto.randomUUID)
 */
const generateSafeId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Thêm một thao tác vào hàng đợi (Queue).
 * Hàm sẽ tự động gán ID và timestamp (createdAt) nếu chưa có.
 */
export const addOperation = async <T = unknown>(
  operation: Omit<PendingOperation<T>, 'id' | 'createdAt'> & { id?: string }
): Promise<string | undefined> => {
  const db = await initDB();
  if (!db) return undefined;

  const id = operation.id || generateSafeId();
  const createdAt = Date.now();

  const newOperation: PendingOperation<T> = {
    ...operation,
    id,
    createdAt,
  };

  // Do 'payload' có thể là các dạng dữ liệu khác nhau, ta ép kiểu ở đây để khớp schema chung
  await db.put('pending_operations', newOperation as PendingOperation<unknown>);
  return id;
};

/**
 * Lấy toàn bộ các thao tác trong hàng đợi, sắp xếp theo thời gian tạo tăng dần (cũ nhất lấy ra trước).
 */
export const getOperations = async (): Promise<PendingOperation[]> => {
  const db = await initDB();
  if (!db) return [];

  return db.getAllFromIndex('pending_operations', 'by-created-at');
};

/**
 * Xóa một thao tác khỏi hàng đợi (sử dụng sau khi thao tác đó đã đồng bộ lên server thành công).
 */
export const removeOperation = async (id: string): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  
  await db.delete('pending_operations', id);
};

/**
 * Xóa toàn bộ hàng đợi.
 */
export const clearOperations = async (): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  
  await db.clear('pending_operations');
};