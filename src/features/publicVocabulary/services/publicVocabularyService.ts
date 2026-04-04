// filepath: src/features/publicVocabulary/services/publicVocabularyService.ts
// CẦN CHỈNH SỬA
import { publicVocabularyRepository } from '../../../lib/supabase/repositories/publicVocabularyRepository';
import { PublicVocabularyFilterParams, PublicVocabularyEntry } from '../types';
import { ServiceResult } from '../../exams/types';

export const publicVocabularyService = {
  async browsePublicEntries(params: PublicVocabularyFilterParams): Promise<ServiceResult<PublicVocabularyEntry[]>> {
    try {
      const result = await publicVocabularyRepository.browseEntries(params);
      if (result.error) return { status: 'error', error: result.error };
      return { status: 'success', data: result.data || [] };
    } catch (error: any) {
      return { status: 'error', error };
    }
  }
};