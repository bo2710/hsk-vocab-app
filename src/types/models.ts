// filepath: src/types/models.ts
import { VOCABULARY_STATUSES, CONTEXT_TYPES, SOURCE_SCOPES, CONTRIBUTION_STATUSES } from '../lib/constants/vocabulary';

// Derived literal types from constants
export type VocabularyStatus = typeof VOCABULARY_STATUSES[number];
export type ContextType = typeof CONTEXT_TYPES[number];
export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// V2 Types
export type SourceScope = typeof SOURCE_SCOPES[number];
export type ContributionStatus = typeof CONTRIBUTION_STATUSES[number];

/**
 * Tương đương bảng `vocabulary_items` (V1 + V2 metadata)
 */
export interface VocabularyItem {
  id: string; // UUID
  user_id: string; // UUID liên kết bảng auth.users
  hanzi: string;
  hanzi_normalized: string;
  pinyin: string | null;
  pinyin_normalized: string | null;
  han_viet: string | null;
  meaning_vi: string;
  meaning_vi_normalized: string | null;
  note: string | null;
  example: string | null;
  status: VocabularyStatus;
  hsk_level: HskLevel | null;
  tags: string[];
  encounter_count: number;
  review_count: number;
  first_added_at: string; // ISO 8601 DateTime string
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_archived: boolean;
  
  // V2 Metadata
  source_scope: SourceScope;
  public_word_id: string | null;
  contribution_status: ContributionStatus;
  hsk20_level: number | null;
  hsk30_band: number | null;
  hsk30_level: number | null;
  preferred_audio_provider: string | null;
  has_context_audio: boolean;
  exam_encounter_count: number;
  wrong_answer_related_count: number;
  last_encountered_at: string | null;
  source_reference_type: string | null;
  source_reference_id: string | null;
}

/**
 * Tương đương bảng `vocabulary_contexts` (V1 + V2 metadata)
 */
export interface VocabularyContext {
  id: string; // UUID
  vocabulary_id: string; // UUID
  user_id: string; // UUID
  context_name: string;
  context_type: ContextType;
  learned_at: string; // ISO 8601 DateTime string
  context_note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  
  // V2 Metadata
  context_text: string | null;
  context_translation_vi: string | null;
  audio_text_override: string | null;
  source_scope: SourceScope;
  source_reference_id: string | null;
}

export type ReviewRating = 'forgot' | 'vague' | 'remembered';

export interface ReviewLog {
  id: string;
  user_id: string;
  vocabulary_id: string;
  rating: ReviewRating;
  created_at: string;
}

export interface CreateReviewLogInput {
  vocabulary_id: string;
  rating: ReviewRating;
}