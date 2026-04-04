// filepath: src/features/publicVocabulary/types.ts
// CẦN CHỈNH SỬA
export const PUBLIC_CONTRIBUTION_VALIDATION_STATUSES = ['pending', 'approved', 'rejected', 'duplicate'] as const;
export type PublicContributionValidationStatus = typeof PUBLIC_CONTRIBUTION_VALIDATION_STATUSES[number];

export interface PublicVocabularyEntry {
  id: string;
  canonical_hanzi: string;
  canonical_pinyin: string | null;
  canonical_han_viet: string | null;
  canonical_meaning_vi: string;
  canonical_note: string | null;
  canonical_example: string | null;
  canonical_example_translation_vi: string | null;
  hsk20_level: number | null;
  hsk30_band: number | null;
  hsk30_level: number | null;
  tags: string[];
  created_by_user_id: string | null;
  contributor_count: number;
  usage_count: number;
  accepted_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface PublicVocabularyContribution {
  id: string;
  user_id: string;
  normalized_hanzi: string;
  payload: Record<string, unknown>;
  validation_status: PublicContributionValidationStatus;
  duplicate_target_id: string | null;
  submitted_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
  created_at: string;
  updated_at: string;
}

// Payload chuẩn cho Service / Repository
export type CreateContributionPayload = Pick<PublicVocabularyContribution, 'normalized_hanzi' | 'payload'>;

// Kết quả trả về của service khi submit contribution
export type SubmitContributionResult = 
  | { status: 'success'; data: PublicVocabularyContribution }
  | { status: 'validation_error'; validationErrors: Record<string, string> }
  | { status: 'duplicate_warning'; duplicateCandidates: PublicVocabularyEntry[] }
  | { status: 'error'; error: any };

// Payload từ Form UI gửi lên Hook
export interface ContributionFormData {
  hanzi: string;
  pinyin: string;
  meaning_vi: string;
  han_viet?: string;
  note?: string;
  example?: string;
  example_translation_vi?: string;
  hsk20_level?: number | string;
  hsk30_band?: number | string;
  hsk30_level?: number | string;
  tags?: string;
}

// V2 Service Types
export interface PublicVocabularyFilterParams {
  searchQuery?: string;
  hsk20Level?: number;
  hsk30Level?: number;
  hsk30Band?: number;
  limit?: number;
}