import { DBSchema } from 'idb';
import { VocabularyItem, VocabularyContext } from './models';
import { ExamAttemptResponse, ExamAttempt, ExamPaperContentBundle } from '../features/exams/types';

export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE' | 'SUBMIT';
export type EntityType = 'VOCABULARY' | 'CONTEXT' | 'REVIEW_LOG' | 'EXAM_ATTEMPT' | 'PUBLIC_CONTRIBUTION';

export interface PendingOperation<T = unknown> {
  id: string;
  operationType: OperationType;
  entityType: EntityType;
  payload: T;
  createdAt: number;
}

export interface ExamDraft {
  exam_paper_id: string;
  bundle: ExamPaperContentBundle;
  attempt: ExamAttempt;
  responses: Record<string, Partial<ExamAttemptResponse>>;
  elapsedSeconds: number;
  lastSavedAt: number;
}

export interface HSKVocabDB extends DBSchema {
  vocabulary: {
    key: string;
    value: VocabularyItem;
  };
  vocabulary_contexts: {
    key: string;
    value: VocabularyContext;
    indexes: { 'by-vocabulary': string };
  };
  pending_operations: {
    key: string;
    value: PendingOperation;
    indexes: { 'by-created-at': number };
  };
  exam_drafts: {
    key: string;
    value: ExamDraft;
  };
}