import { openDB, IDBPDatabase } from 'idb';
import { HSKVocabDB } from '../../types/indexeddb';

const DB_NAME = 'hsk_vocab_db';
// Nâng version lên 2 để cập nhật schema (thêm pending_operations)
const DB_VERSION = 2; 

let dbPromise: Promise<IDBPDatabase<HSKVocabDB> | null> | null = null;

/**
 * Khởi tạo kết nối IndexedDB một cách an toàn.
 * Trả về null nếu môi trường không hỗ trợ.
 */
export const initDB = (): Promise<IDBPDatabase<HSKVocabDB> | null> => {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    console.warn('[IndexedDB] Không được hỗ trợ trong môi trường này.');
    return Promise.resolve(null);
  }

  if (!dbPromise) {
    dbPromise = openDB<HSKVocabDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // Version 1 migrations
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains('vocabulary')) {
            db.createObjectStore('vocabulary', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('vocabulary_contexts')) {
            const contextStore = db.createObjectStore('vocabulary_contexts', { keyPath: 'id' });
            contextStore.createIndex('by-vocabulary', 'vocabulary_id');
          }
        }
        
        // Version 2 migrations
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('pending_operations')) {
            const queueStore = db.createObjectStore('pending_operations', { keyPath: 'id' });
            // Index giúp truy vấn thứ tự các thao tác (cũ nhất thực hiện trước)
            queueStore.createIndex('by-created-at', 'createdAt'); 
          }
        }
      },
    }).catch((err) => {
      console.error('[IndexedDB] Lỗi khởi tạo cơ sở dữ liệu:', err);
      return null;
    });
  }

  return dbPromise;
};