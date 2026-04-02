import { VocabularyItem, VocabularyContext } from './models';
import { CreateReviewLogInput, ReviewLog } from './models';

export interface IReviewLogRepository {
  insertLog(input: CreateReviewLogInput): Promise<RepositoryResult<ReviewLog>>;
}

export interface RepositoryResult<T> {
  data: T | null;
  error: Error | null;
}

// Vocabulary Inputs
export type CreateVocabularyInput = Partial<Omit<VocabularyItem, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>> & 
  Pick<VocabularyItem, 'hanzi' | 'hanzi_normalized' | 'meaning_vi'>;

export type UpdateVocabularyInput = Partial<Omit<VocabularyItem, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>>;

export interface ListVocabularyParams {
  includeArchived?: boolean;
  limit?: number;
  offset?: number;
}

// Context Inputs
export type CreateContextInput = Partial<Omit<VocabularyContext, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>> & 
  Pick<VocabularyContext, 'vocabulary_id' | 'context_name'>;

export type UpdateContextInput = Partial<Omit<VocabularyContext, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'vocabulary_id'>>;