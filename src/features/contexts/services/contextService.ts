import { contextRepository } from '../../../lib/supabase';
import { validateVocabularyContext } from '../../../lib/validators';
import { EditContextFormData, ContextModuleResult } from '../types';
import { VocabularyContext } from '../../../types';
import { addOperation } from '../../../lib/indexeddb/operationQueueStore';
import { isNetworkError, generateUUID } from '../../../lib/network/networkHelper';

export const contextService = {
  async fetchContextsByVocabularyId(vocabularyId: string): Promise<ContextModuleResult<VocabularyContext[]>> {
    const result = await contextRepository.getContextsByVocabularyId(vocabularyId);
    if (result.error) {
      return { status: 'error', error: result.error };
    }
    return { status: 'success', data: result.data || [] };
  },

  async addContext(vocabularyId: string, input: any): Promise<ContextModuleResult<VocabularyContext>> {
    const validationInput = {
      context_name: input.context_name,
      context_type: input.context_type || 'sentence',
      vocabulary_id: vocabularyId
    };
    
    const validation = validateVocabularyContext(validationInput);
    if (!validation.isValid) {
      return { status: 'validation_error', validationErrors: validation.errors };
    }

    const insertData = {
      vocabulary_id: vocabularyId,
      context_name: input.context_name,
      context_type: input.context_type || 'sentence',
      learned_at: input.learned_at ? new Date(input.learned_at).toISOString() : new Date().toISOString(),
      context_note: input.context_note || null
    };

    try {
      const result = await (contextRepository as any).createContext(insertData);
      if (result?.error) throw result.error;
      return { status: 'success', data: result?.data };
    } catch (error: any) {
      if (isNetworkError(error)) {
        // NẾU LỖI MẠNG: Đưa vào hàng đợi và báo thành công ảo để UI cập nhật liền
        const optimisticData: VocabularyContext = {
          id: generateUUID(),
          ...insertData,
          user_id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null // FIX TYPESCRIPT: Thêm trường deleted_at để thỏa mãn type VocabularyContext
        };
        
        await addOperation({
          operationType: 'CREATE',
          entityType: 'CONTEXT',
          payload: optimisticData
        });
        
        return { status: 'success', data: optimisticData };
      }
      return { status: 'error', error: error instanceof Error ? error : new Error(String(error)) };
    }
  },

  async editContext(id: string, vocabularyId: string, input: EditContextFormData): Promise<ContextModuleResult<VocabularyContext>> {
    const validationInput = {
      context_name: input.context_name,
      context_type: input.context_type,
      vocabulary_id: vocabularyId
    };
    
    const validation = validateVocabularyContext(validationInput);
    if (!validation.isValid) {
      return { status: 'validation_error', validationErrors: validation.errors };
    }

    const updateData = {
      context_name: input.context_name,
      context_type: input.context_type,
      learned_at: input.learned_at ? new Date(input.learned_at).toISOString() : new Date().toISOString(),
      context_note: input.context_note || null
    };

    try {
      const result = await contextRepository.updateContext(id, updateData);
      if (result.error) throw result.error;
      return { status: 'success', data: result.data! };
    } catch (error: any) {
      if (isNetworkError(error)) {
        // NẾU LỖI MẠNG: Đưa vào hàng đợi và báo UI cứ update đi
        await addOperation({
          operationType: 'UPDATE',
          entityType: 'CONTEXT',
          payload: { id, updates: updateData }
        });
        
        return { 
          status: 'success', 
          data: { id, vocabulary_id: vocabularyId, ...updateData, deleted_at: null } as VocabularyContext 
        };
      }
      return { status: 'error', error: error instanceof Error ? error : new Error(String(error)) };
    }
  },

  async removeContext(id: string): Promise<ContextModuleResult<boolean>> {
    try {
      const result = await contextRepository.softDeleteContext(id);
      if (result.error) throw result.error;
      return { status: 'success', data: true };
    } catch (error: any) {
      if (isNetworkError(error)) {
        // NẾU LỖI MẠNG: Ghi nhớ thao tác xóa vào hàng đợi
        await addOperation({
          operationType: 'DELETE',
          entityType: 'CONTEXT',
          payload: { id }
        });
        return { status: 'success', data: true };
      }
      return { status: 'error', error: error instanceof Error ? error : new Error(String(error)) };
    }
  }
};