// filepath: src/types/repositories.ts
import { VocabularyItem, VocabularyContext } from './models';
import { CreateReviewLogInput, ReviewLog } from './models';

export interface IReviewLogRepository {
  insertLog(input: CreateReviewLogInput): Promise<RepositoryResult<ReviewLog>>;
}

export interface RepositoryResult<T> {
  data: T | null;
  error: Error | null;
}

type AutoManagedVocabFields = 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'exam_encounter_count' | 'wrong_answer_related_count' | 'last_encountered_at';

// Vocabulary Inputs
export type CreateVocabularyInput = Partial<Omit<VocabularyItem, AutoManagedVocabFields>> & 
  Pick<VocabularyItem, 'hanzi' | 'hanzi_normalized' | 'meaning_vi'>;

export type UpdateVocabularyInput = Partial<Omit<VocabularyItem, AutoManagedVocabFields>>;

export interface ListVocabularyParams {
  includeArchived?: boolean;
  limit?: number;
  offset?: number;
}

// Context Inputs
export type CreateContextInput = Partial<Omit<VocabularyContext, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>> & 
  Pick<VocabularyContext, 'vocabulary_id' | 'context_name'>;

export type UpdateContextInput = Partial<Omit<VocabularyContext, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at' | 'vocabulary_id'>>;

// V2 Shared Interfaces
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}