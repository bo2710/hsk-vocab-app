import { initDB } from './db';
import { VocabularyItem } from '../../types/models';

/**
 * Lưu hoặc cập nhật 1 từ vựng vào cache
 */
export const putVocabulary = async (item: VocabularyItem): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  await db.put('vocabulary', item);
};

/**
 * Lưu nhiều từ vựng vào cache trong một transaction để tối ưu hiệu suất
 */
export const putAllVocabulary = async (items: VocabularyItem[]): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  
  const tx = db.transaction('vocabulary', 'readwrite');
  // Dùng Promise.all để ghi đồng thời trong 1 transaction
  await Promise.all(items.map((item) => tx.store.put(item)));
  await tx.done;
};

/**
 * Lấy 1 từ vựng từ cache theo id
 */
export const getVocabulary = async (id: string): Promise<VocabularyItem | undefined> => {
  const db = await initDB();
  if (!db) return undefined;
  return db.get('vocabulary', id);
};

/**
 * Lấy toàn bộ danh sách từ vựng từ cache
 */
export const getAllVocabulary = async (): Promise<VocabularyItem[]> => {
  const db = await initDB();
  if (!db) return [];
  return db.getAll('vocabulary');
};

/**
 * Xóa 1 từ vựng khỏi cache theo id
 */
export const deleteVocabulary = async (id: string): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  await db.delete('vocabulary', id);
};

/**
 * Xóa trắng danh sách từ vựng trong cache
 */
export const clearVocabulary = async (): Promise<void> => {
  const db = await initDB();
  if (!db) return;
  await db.clear('vocabulary');
};