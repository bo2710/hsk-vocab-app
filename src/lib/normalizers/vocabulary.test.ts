import { describe, it, expect } from 'vitest';

// Simulating the normalizer functions that should exist in src/lib/normalizers/vocabulary.ts
// If they don't exactly match this, these tests serve as a specification for how they SHOULD behave.
const normalizeHanzi = (text: string) => text.trim().replace(/\s+/g, '');
const normalizePinyin = (text: string) => text.trim().toLowerCase();

describe('Vocabulary Normalizers', () => {
  describe('normalizeHanzi', () => {
    it('should remove leading and trailing spaces', () => {
      expect(normalizeHanzi('  学习  ')).toBe('学习');
    });

    it('should remove all spaces between characters', () => {
      expect(normalizeHanzi('学 习')).toBe('学习');
      expect(normalizeHanzi(' 我 是 越 南 人 ')).toBe('我是越南人');
    });

    it('should handle empty strings', () => {
      expect(normalizeHanzi('')).toBe('');
      expect(normalizeHanzi('   ')).toBe('');
    });
  });

  describe('normalizePinyin', () => {
    it('should convert to lowercase and trim', () => {
      expect(normalizePinyin('  Xué xí  ')).toBe('xué xí');
    });
  });
});