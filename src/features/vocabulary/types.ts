// filepath: src/features/vocabulary/types.ts
import { ContextType, VocabularyItem, VocabularyContext } from '../../types';

export interface AddVocabularyFormData {
  hanzi: string;
  pinyin: string;
  han_viet: string;
  meaning_vi: string;
  note: string;
  example: string;
  context_name: string;
  context_type: ContextType;
  learned_at: string; // YYYY-MM-DD format from input type="date"
  
  hsk_level?: VocabularyItem['hsk_level'];
  tags?: VocabularyItem['tags'];
  status?: VocabularyItem['status'];

  // V2 Fields
  hsk20_level?: VocabularyItem['hsk20_level'];
  hsk30_band?: VocabularyItem['hsk30_band'];
  hsk30_level?: VocabularyItem['hsk30_level'];
  source_scope?: VocabularyItem['source_scope'];
}

export type AddVocabularyResult =
  | { status: 'created'; data: { vocabulary: VocabularyItem; context: VocabularyContext } }
  | { status: 'duplicate'; existingVocabulary: VocabularyItem }
  | { status: 'validation_error'; validationErrors: Record<string, string> }
  | { status: 'error'; error: Error };

export type AddContextResult =
  | { status: 'created'; data: { context: VocabularyContext } }
  | { status: 'validation_error'; validationErrors: Record<string, string> }
  | { status: 'error'; error: Error };