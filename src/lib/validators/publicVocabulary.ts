// filepath: src/lib/validators/publicVocabulary.ts
import { CreateContributionPayload, ContributionFormData } from '../../features/publicVocabulary/types';
import { ValidationResult } from './vocabulary';

export const validatePublicVocabularyContribution = (data: Partial<CreateContributionPayload>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.normalized_hanzi || data.normalized_hanzi.trim().length === 0) {
    errors.normalized_hanzi = 'Hán tự chuẩn hóa không được để trống.';
  }

  if (!data.payload || Object.keys(data.payload).length === 0) {
    errors.payload = 'Dữ liệu đóng góp (payload) không được rỗng.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate riêng cho UI form (trước khi map sang payload)
export const validateContributionForm = (formData: ContributionFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!formData.hanzi || formData.hanzi.trim().length === 0) {
    errors.hanzi = 'Chữ Hán (Hanzi) là bắt buộc.';
  }

  if (!formData.pinyin || formData.pinyin.trim().length === 0) {
    errors.pinyin = 'Pinyin là bắt buộc để hỗ trợ cộng đồng.';
  }

  if (!formData.meaning_vi || formData.meaning_vi.trim().length === 0) {
    errors.meaning_vi = 'Nghĩa tiếng Việt là bắt buộc.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};