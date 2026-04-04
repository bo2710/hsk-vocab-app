// filepath: src/lib/constants/vocabulary.ts
/**
 * Trạng thái học tập của từ vựng (Khớp với CHECK constraint trong database)
 */
export const VOCABULARY_STATUSES = ['new', 'learning', 'reviewing', 'mastered'] as const;

/**
 * Loại ngữ cảnh (Khớp với CHECK constraint trong database)
 */
export const CONTEXT_TYPES = ['sentence', 'article', 'book', 'video', 'audio', 'conversation', 'other'] as const;

/**
 * Các giới hạn cấp độ HSK
 */
export const MIN_HSK_LEVEL = 1;
export const MAX_HSK_LEVEL = 9;

/**
 * Phạm vi nguồn gốc dữ liệu (V2)
 */
export const SOURCE_SCOPES = ['private', 'public'] as const;

/**
 * Trạng thái đóng góp từ vựng (V2)
 */
export const CONTRIBUTION_STATUSES = ['none', 'pending', 'accepted', 'rejected'] as const;