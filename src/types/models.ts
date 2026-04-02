import { VOCABULARY_STATUSES, CONTEXT_TYPES } from '../lib/constants';

// Derived literal types from constants
export type VocabularyStatus = typeof VOCABULARY_STATUSES[number];
export type ContextType = typeof CONTEXT_TYPES[number];
export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Tương đương bảng `vocabulary_items`
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
}

/**
 * Tương đương bảng `vocabulary_contexts`
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