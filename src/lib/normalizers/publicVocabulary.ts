// filepath: src/lib/normalizers/publicVocabulary.ts
import { CreateContributionPayload, ContributionFormData } from '../../features/publicVocabulary/types';
import { normalizeHanzi } from './vocabulary';

export const normalizePublicVocabularyContribution = (data: CreateContributionPayload): CreateContributionPayload => {
  return {
    ...data,
    normalized_hanzi: normalizeHanzi(data.normalized_hanzi),
  };
};

export const buildContributionPayloadFromForm = (formData: ContributionFormData): CreateContributionPayload => {
  const normalizedHanzi = normalizeHanzi(formData.hanzi);
  
  // Tách tags
  let tagsArray: string[] = [];
  if (formData.tags && formData.tags.trim().length > 0) {
    tagsArray = formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
  }

  // Ép kiểu an toàn cho HSK
  const parseNum = (val: any) => (val && !isNaN(Number(val))) ? Number(val) : null;

  return {
    normalized_hanzi: normalizedHanzi,
    payload: {
      canonical_hanzi: formData.hanzi.trim(),
      canonical_pinyin: formData.pinyin.trim() || null,
      canonical_meaning_vi: formData.meaning_vi.trim(),
      canonical_han_viet: formData.han_viet?.trim() || null,
      canonical_note: formData.note?.trim() || null,
      canonical_example: formData.example?.trim() || null,
      canonical_example_translation_vi: formData.example_translation_vi?.trim() || null,
      hsk20_level: parseNum(formData.hsk20_level),
      hsk30_band: parseNum(formData.hsk30_band),
      hsk30_level: parseNum(formData.hsk30_level),
      tags: tagsArray
    }
  };
};