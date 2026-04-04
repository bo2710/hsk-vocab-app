import { openDB, IDBPDatabase } from 'idb';
import { HSKVocabDB } from '../../types/indexeddb';

const DB_NAME = 'hsk_vocab_db';
// Nâng version lên 3 để thêm bảng exam_drafts
const DB_VERSION = 3; 

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

        // Version 3 migrations
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains('exam_drafts')) {
            db.createObjectStore('exam_drafts', { keyPath: 'exam_paper_id' });
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