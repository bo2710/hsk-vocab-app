// filepath: src/features/exams/types.ts
// CẦN CHỈNH SỬA
// Constants (Enums)
export const EXAM_OWNER_SCOPES = ['system', 'user_private'] as const;
export const EXAM_SOURCE_TYPES = ['pdf_import', 'system_seed', 'manual'] as const;
export const EXAM_PAPER_STATUSES = ['draft', 'published', 'archived'] as const;
export const EXAM_SECTION_SKILLS = ['listening', 'reading', 'writing', 'comprehensive'] as const;
export const EXAM_IMPORT_PARSE_STATUSES = ['uploaded', 'processing', 'review_needed', 'completed', 'failed'] as const;
export const EXAM_ATTEMPT_MODES = ['practice', 'real_exam'] as const;
export const EXAM_ATTEMPT_STATUSES = ['in_progress', 'paused', 'submitted', 'abandoned'] as const;
export const EXAM_CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;
export const EXAM_ENCOUNTER_ROLES = ['prompt', 'option', 'transcript', 'explanation'] as const;
export const EXAM_LISTENING_MEDIA_TYPES = ['none', 'audio_file', 'youtube_link'] as const;

// Derived Types
export type ExamOwnerScope = typeof EXAM_OWNER_SCOPES[number];
export type ExamSourceType = typeof EXAM_SOURCE_TYPES[number];
export type ExamPaperStatus = typeof EXAM_PAPER_STATUSES[number];
export type ExamSectionSkill = typeof EXAM_SECTION_SKILLS[number];
export type ExamImportParseStatus = typeof EXAM_IMPORT_PARSE_STATUSES[number];
export type ExamAttemptMode = typeof EXAM_ATTEMPT_MODES[number];
export type ExamAttemptStatus = typeof EXAM_ATTEMPT_STATUSES[number];
export type ExamConfidenceLevel = typeof EXAM_CONFIDENCE_LEVELS[number];
export type ExamEncounterRole = typeof EXAM_ENCOUNTER_ROLES[number];
export type ExamListeningMediaType = typeof EXAM_LISTENING_MEDIA_TYPES[number];

// Models
export interface ExamPaper {
  id: string;
  owner_scope: ExamOwnerScope;
  imported_by_user_id: string | null;
  title: string;
  slug: string | null;
  exam_type: string;
  exam_level: number | null;
  standard_version: string | null;
  source_type: ExamSourceType;
  source_file_name: string | null;
  source_file_url: string | null;
  source_checksum: string | null;
  paper_year: number | null;
  paper_term: string | null;
  total_sections: number;
  total_questions: number;
  total_duration_seconds: number | null;
  status: ExamPaperStatus;
  instructions: string | null;
  tags: string[];
  
  // Media Source metadata (TASK-032)
  listening_media_type: ExamListeningMediaType;
  listening_media_url: string | null;

  created_at: string;
  updated_at: string;
}

export interface ExamSection {
  id: string;
  exam_paper_id: string;
  section_code: string;
  section_name: string;
  skill: ExamSectionSkill;
  display_order: number;
  duration_seconds: number | null;
  question_count: number;
  instructions: string | null;
  audio_asset_url: string | null;
  transcript_text: string | null;
  explanation_text: string | null;
}

export interface ExamQuestion {
  id: string;
  exam_paper_id: string;
  exam_section_id: string;
  question_order: number;
  question_type: string;
  prompt_text: string | null;
  prompt_rich_text: string | null;
  transcript_text: string | null;
  explanation_text: string | null;
  stem_audio_url: string | null;
  reference_answer_text: string | null;
  correct_option_id: string | null;
  score_value: number;
  difficulty_tag: string | null;
  source_page_index: number | null;
  raw_import_block_id: string | null;
  render_config_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ExamQuestionOption {
  id: string;
  exam_question_id: string;
  option_key: string;
  option_text: string | null;
  option_rich_text: string | null;
  option_image_url: string | null;
  is_correct: boolean;
  display_order: number;
}

export interface ExamImportJob {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string | null;
  parse_status: ExamImportParseStatus;
  parser_version: string | null;
  raw_text_payload: Record<string, unknown> | null;
  normalized_draft_payload: Record<string, unknown> | null;
  error_log: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ExamAttempt {
  id: string;
  user_id: string;
  exam_paper_id: string;
  mode: ExamAttemptMode;
  status: ExamAttemptStatus;
  started_at: string;
  submitted_at: string | null;
  duration_seconds: number;
  total_score: number | null;
  section_scores_json: Record<string, unknown> | null;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  accuracy_rate: number | null;
  mistake_summary_json: Record<string, unknown> | null;
  review_recommendation_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ExamAttemptResponse {
  id: string;
  exam_attempt_id: string;
  exam_question_id: string;
  selected_option_id: string | null;
  selected_text: string | null;
  subjective_answer_text: string | null;
  is_correct: boolean | null;
  answered_at: string;
  time_spent_seconds: number;
  confidence_level: ExamConfidenceLevel | null;
  error_category: string | null;
  error_note: string | null;
  
  // TASK-033: Local property (won't map exactly to DB unless migrated, but safe for JSONB draft)
  is_marked_for_later?: boolean;

  created_at: string;
  updated_at: string;
}

export interface ExamReviewInsight {
  id: string;
  exam_attempt_id: string;
  exam_question_id: string;
  primary_error_type: string | null;
  confusion_source_words: string[] | null;
  recommended_action: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExamVocabularyEncounter {
  id: string;
  exam_paper_id: string;
  exam_question_id: string;
  normalized_token: string;
  matched_private_vocabulary_id: string | null;
  matched_public_vocabulary_id: string | null;
  encounter_role: ExamEncounterRole | null;
  created_at: string;
  updated_at: string;
}

// V2 Service Types
export interface ExamPaperListParams {
  level?: number;
  status?: ExamPaperStatus;
  owner_scope?: ExamOwnerScope;
}

export interface ExamPaperContentBundle {
  paper: ExamPaper;
  sections: ExamSection[];
  questions: ExamQuestion[];
  options: ExamQuestionOption[];
}

export interface ServiceResult<T> {
  status: 'success' | 'error' | 'validation_error';
  data?: T;
  error?: Error;
  validationErrors?: Record<string, string>;
}

export interface ExamSubmissionPayload {
  attemptId: string;
  durationSeconds: number;
  bundle: ExamPaperContentBundle;
  responses: Partial<ExamAttemptResponse>[];
}

export interface ExamResultData {
  attempt: ExamAttempt;
  responses: ExamAttemptResponse[];
  bundle: ExamPaperContentBundle;
}

// Extended types for TASK-023
export interface AggregateMistakeInsight {
  id: string;
  insight_type: 'section_weakness' | 'time_management' | 'accuracy_drop' | 'unanswered';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  related_section_ids?: string[];
}

export interface ReviewRecommendation {
  id: string;
  action_text: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

// Extended types for TASK-024
export interface ExamWeakWord {
  vocabulary_id: string;
  hanzi: string;
  pinyin?: string;
  meaning_vi: string;
  reason: string;
  encounter_count: number;
  priority: 'high' | 'medium' | 'low';
}

// --- TASK-028 JSON Handoff Contracts ---

export interface ExamJsonHandoffOption {
  option_key: string;
  option_text: string;
}

export interface ExamJsonHandoffQuestion {
  question_order: number;
  question_type: string;
  prompt_text: string | null;
  options: ExamJsonHandoffOption[];
}

export interface ExamJsonHandoffSection {
  section_code: string;
  section_name: string;
  skill: ExamSectionSkill;
  instructions: string | null;
  questions: ExamJsonHandoffQuestion[];
}

export interface ExamJsonHandoffAnswerKey {
  question_order: number;
  correct_option_key: string | null;
  subjective_answer: string | null;
}

export interface ExamJsonHandoffTranscript {
  section_code: string | null;
  question_order: number | null;
  text: string;
}

export interface ExamJsonHandoffExplanation {
  question_order: number;
  text: string;
}

export interface ExamJsonHandoffReviewOnly {
  answer_keys: ExamJsonHandoffAnswerKey[];
  transcripts: ExamJsonHandoffTranscript[];
  explanations?: ExamJsonHandoffExplanation[];
}

export interface ExamJsonHandoffEnvelope {
  title: string;
  exam_type: string;
  exam_level: number | null;
  total_sections: number;
  total_questions: number;
  sections: ExamJsonHandoffSection[];
  review_only: ExamJsonHandoffReviewOnly;
  visibility?: 'public' | 'private';
  media?: {
    type: ExamListeningMediaType;
    url: string | null;
  };
}