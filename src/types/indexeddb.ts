import { DBSchema } from 'idb';
import { VocabularyItem, VocabularyContext } from './models';

export type OperationType = 'CREATE' | 'UPDATE' | 'DELETE';
export type EntityType = 'VOCABULARY' | 'CONTEXT' | 'REVIEW_LOG';

export interface PendingOperation<T = unknown> {
  id: string;
  operationType: OperationType;
  entityType: EntityType;
  payload: T;
  createdAt: number;
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
}