import { VocabularyItem, VocabularyContext } from '../../types';
import { 
  VOCABULARY_STATUSES, 
  CONTEXT_TYPES, 
  MIN_HSK_LEVEL, 
  MAX_HSK_LEVEL 
} from '../constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Kiểm tra dữ liệu đầu vào của một từ vựng trước khi lưu
 */
export const validateVocabularyItem = (data: Partial<VocabularyItem>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.hanzi || data.hanzi.trim().length === 0) {
    errors.hanzi = 'Chữ Hán (Hanzi) không được để trống.';
  }

  if (!data.meaning_vi || data.meaning_vi.trim().length === 0) {
    errors.meaning_vi = 'Nghĩa tiếng Việt không được để trống.';
  }

  if (data.status && !(VOCABULARY_STATUSES as readonly string[]).includes(data.status)) {
    errors.status = 'Trạng thái học tập không hợp lệ.';
  }

  if (data.hsk_level !== undefined && data.hsk_level !== null) {
    if (typeof data.hsk_level !== 'number' || data.hsk_level < MIN_HSK_LEVEL || data.hsk_level > MAX_HSK_LEVEL) {
      errors.hsk_level = `Cấp độ HSK phải nằm trong khoảng ${MIN_HSK_LEVEL} đến ${MAX_HSK_LEVEL}.`;
    }
  }

  if (data.encounter_count !== undefined && data.encounter_count !== null) {
    if (typeof data.encounter_count !== 'number' || data.encounter_count < 1) {
      errors.encounter_count = 'Số lần gặp từ vựng phải lớn hơn hoặc bằng 1.';
    }
  }

  if (data.review_count !== undefined && data.review_count !== null) {
    if (typeof data.review_count !== 'number' || data.review_count < 0) {
      errors.review_count = 'Số lần ôn tập không được là số âm.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Kiểm tra dữ liệu đầu vào của một ngữ cảnh học
 */
export const validateVocabularyContext = (data: Partial<VocabularyContext>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.context_name || data.context_name.trim().length === 0) {
    errors.context_name = 'Tên/Nội dung ngữ cảnh không được để trống.';
  }

  if (data.context_type && !(CONTEXT_TYPES as readonly string[]).includes(data.context_type)) {
    errors.context_type = 'Loại ngữ cảnh không hợp lệ.';
  }

  if (!data.vocabulary_id || data.vocabulary_id.trim().length === 0) {
    errors.vocabulary_id = 'Ngữ cảnh phải được gắn liền với một từ vựng cụ thể (Thiếu ID).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};