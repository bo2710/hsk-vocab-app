// filepath: src/features/publicVocabulary/services/publicVocabularyService.ts
import { publicVocabularyRepository } from '../../../lib/supabase';
import { PublicVocabularyEntry, PublicVocabularyFilterParams } from '../types';
import { ServiceResult } from '../../exams/types'; // Tái sử dụng Type kết quả tiêu chuẩn

export const publicVocabularyService = {
  async browsePublicEntries(params: PublicVocabularyFilterParams): Promise<ServiceResult<PublicVocabularyEntry[]>> {
    // Để cho search linh hoạt, ta có thể delegate filter xuống repo nếu repo support, 
    // hoặc xử lý tại đây nếu repo chỉ support query đơn giản.
    // Hiện tại repo support searchQuery và hsk20Level cơ bản.
    const result = await publicVocabularyRepository.listPublicEntries(params);
    if (result.error) return { status: 'error', error: result.error };
    
    let data = result.data || [];

    // Filter bổ sung tại service (vì repo V1 foundation có thể chưa full filter)
    if (params.hsk30Level !== undefined) {
       data = data.filter(item => item.hsk30_level === params.hsk30Level);
    }
    if (params.hsk30Band !== undefined) {
       data = data.filter(item => item.hsk30_band === params.hsk30Band);
    }

    return { status: 'success', data: data };
  },

  async getEntryDetail(id: string): Promise<ServiceResult<PublicVocabularyEntry>> {
    const result = await publicVocabularyRepository.getPublicEntryById(id);
    if (result.error) return { status: 'error', error: result.error };
    if (!result.data) return { status: 'error', error: new Error('Public entry not found') };
    return { status: 'success', data: result.data };
  }
};