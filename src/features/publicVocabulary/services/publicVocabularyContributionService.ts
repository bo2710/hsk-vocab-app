import { publicVocabularyRepository } from '../../../lib/supabase';
import { validatePublicVocabularyContribution } from '../../../lib/validators/publicVocabulary';
import { normalizePublicVocabularyContribution } from '../../../lib/normalizers/publicVocabulary';
import { CreateContributionPayload, PublicVocabularyContribution, SubmitContributionResult } from '../types';
import { publicVocabularyService } from './publicVocabularyService';
import { ServiceResult } from '../../exams/types';
import { isNetworkError, generateUUID } from '../../../lib/network/networkHelper';
import { queuePublicContribution } from '../../../lib/indexeddb/publicContributionStore';

export const publicVocabularyContributionService = {
  async submitContribution(
    input: CreateContributionPayload, 
    ignoreDuplicateCheck: boolean = false
  ): Promise<SubmitContributionResult> {
    // 1. Normalize
    const normalizedData = normalizePublicVocabularyContribution(input);

    // 2. Validate
    const validation = validatePublicVocabularyContribution(normalizedData);
    if (!validation.isValid) {
      return { status: 'validation_error', validationErrors: validation.errors };
    }

    // 3. Duplicate Detection (Rule-based precheck)
    // Nếu mất mạng, ta bỏ qua duplicate check và đưa thẳng vào queue offline
    if (!ignoreDuplicateCheck && typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const searchResult = await publicVocabularyService.browsePublicEntries({ 
          searchQuery: normalizedData.normalized_hanzi 
        });

        if (searchResult.status === 'success' && searchResult.data && searchResult.data.length > 0) {
          const exactMatches = searchResult.data.filter(
            item => item.canonical_hanzi === normalizedData.payload.canonical_hanzi || 
                    item.canonical_hanzi === normalizedData.normalized_hanzi
          );

          if (exactMatches.length > 0) {
            return { status: 'duplicate_warning', duplicateCandidates: exactMatches };
          }
        }
      } catch (e) {
        // Bỏ qua lỗi search và tiếp tục quy trình submit (fallback to queue nếu cần)
      }
    }

    // 4. Data Access (Offline queue strategy)
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Offline');
      }
      
      const result = await publicVocabularyRepository.createContribution({
        normalized_hanzi: normalizedData.normalized_hanzi,
        payload: normalizedData.payload,
        validation_status: 'pending'
      });

      if (result.error) throw result.error;
      return { status: 'success', data: result.data! };

    } catch (error: any) {
      if (isNetworkError(error) || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        const fallbackId = generateUUID();
        const pendingData: PublicVocabularyContribution = {
          id: fallbackId,
          user_id: '',
          normalized_hanzi: normalizedData.normalized_hanzi,
          payload: normalizedData.payload as Record<string, unknown>,
          validation_status: 'pending',
          duplicate_target_id: null,
          submitted_at: new Date().toISOString(),
          resolved_at: null,
          resolution_note: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await queuePublicContribution(pendingData);
        return { status: 'success', data: pendingData };
      }
      
      return { status: 'error', error: error instanceof Error ? error : new Error(String(error)) };
    }
  },

  async getUserContributions(): Promise<ServiceResult<PublicVocabularyContribution[]>> {
    try {
      const result = await publicVocabularyRepository.listUserContributions();
      if (result.error) throw result.error;
      return { status: 'success', data: result.data || [] };
    } catch (err: any) {
      // Đối với view, nếu rớt mạng, tạm thời fail gracefully
      return { status: 'error', error: err instanceof Error ? err : new Error(String(err)) };
    }
  }
};