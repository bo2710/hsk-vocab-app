// filepath: src/lib/normalizers/vocabulary.ts
import { VocabularyItem } from '../../types';

/**
 * Chuẩn hóa chữ Hán: Loại bỏ toàn bộ khoảng trắng thừa.
 */
export const normalizeHanzi = (hanzi?: string | null): string => {
  if (!hanzi) return '';
  return hanzi.replace(/\s+/g, '');
};

/**
 * Chuẩn hóa Pinyin: Xóa khoảng trắng 2 đầu và đưa về chữ thường.
 */
export const normalizePinyin = (pinyin?: string | null): string => {
  if (!pinyin) return '';
  return pinyin.trim().toLowerCase();
};

/**
 * Chuẩn hóa Nghĩa Tiếng Việt: Xóa khoảng trắng 2 đầu và đưa về chữ thường.
 */
export const normalizeMeaning = (meaning?: string | null): string => {
  if (!meaning) return '';
  return meaning.trim().toLowerCase();
};

/**
 * Chuẩn hóa V2 Metadata (Trim các trường string, xử lý mảng tag)
 */
export const normalizeVocabularyV2Metadata = (data: Partial<VocabularyItem>): Partial<VocabularyItem> => {
  const normalized = { ...data };
  
  if (normalized.preferred_audio_provider) {
    normalized.preferred_audio_provider = normalized.preferred_audio_provider.trim().toLowerCase();
  }

  if (normalized.source_reference_type) {
    normalized.source_reference_type = normalized.source_reference_type.trim().toLowerCase();
  }

  if (normalized.tags && Array.isArray(normalized.tags)) {
    normalized.tags = normalized.tags
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0);
  }

  return normalized;
};