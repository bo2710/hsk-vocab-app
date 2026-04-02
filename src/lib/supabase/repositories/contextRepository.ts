import { supabase } from '../client';
import { VocabularyContext } from '../../../types';
import { 
  RepositoryResult, 
  CreateContextInput, 
  UpdateContextInput 
} from '../../../types/repositories';
import { getCurrentUserId, formatError } from './helper';

const TABLE = 'vocabulary_contexts';

export const contextRepository = {
  async createContext(input: CreateContextInput): Promise<RepositoryResult<VocabularyContext>> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ ...input, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return { data: data as VocabularyContext, error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async getContextsByVocabularyId(vocabularyId: string): Promise<RepositoryResult<VocabularyContext[]>> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select()
        .eq('vocabulary_id', vocabularyId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data: data as VocabularyContext[], error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async updateContext(id: string, input: UpdateContextInput): Promise<RepositoryResult<VocabularyContext>> {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .update(input)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) throw error;
      return { data: data as VocabularyContext, error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  },

  async softDeleteContext(id: string): Promise<RepositoryResult<boolean>> {
    try {
      const { error } = await supabase
        .from(TABLE)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null);

      if (error) throw error;
      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: formatError(err) };
    }
  }
};