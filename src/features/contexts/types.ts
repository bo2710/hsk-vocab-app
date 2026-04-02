import { ContextType, VocabularyContext } from '../../types';

export interface EditContextFormData {
  context_name: string;
  context_type: ContextType;
  learned_at: string;
  context_note?: string | null;
}

export type ContextModuleResult<T> =
  | { status: 'success'; data: T }
  | { status: 'validation_error'; validationErrors: Record<string, string> }
  | { status: 'error'; error: Error };