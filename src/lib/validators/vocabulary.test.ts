import { describe, it, expect } from 'vitest';

// Simulating a simple validator function that might exist in src/lib/validators/vocabulary.ts
const validateVocabularyInput = (data: { hanzi: string; meaning_vi: string }) => {
  const errors: Record<string, string> = {};
  if (!data.hanzi || data.hanzi.trim() === '') {
    errors.hanzi = 'Chữ Hán không được để trống';
  }
  if (!data.meaning_vi || data.meaning_vi.trim() === '') {
    errors.meaning_vi = 'Nghĩa tiếng Việt không được để trống';
  }
  return errors;
};

describe('Vocabulary Validators', () => {
  describe('validateVocabularyInput', () => {
    it('should return errors for empty required fields', () => {
      const result = validateVocabularyInput({ hanzi: '', meaning_vi: '' });
      expect(result.hanzi).toBeDefined();
      expect(result.meaning_vi).toBeDefined();
    });

    it('should return no errors for valid input', () => {
      const result = validateVocabularyInput({ hanzi: '学习', meaning_vi: 'học tập' });
      expect(Object.keys(result).length).toBe(0);
    });

    it('should flag whitespace-only strings as invalid', () => {
      const result = validateVocabularyInput({ hanzi: '   ', meaning_vi: '   ' });
      expect(result.hanzi).toBeDefined();
      expect(result.meaning_vi).toBeDefined();
    });
  });
});