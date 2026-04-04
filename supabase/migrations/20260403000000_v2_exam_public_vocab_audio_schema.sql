-- filepath: supabase/migrations/20260403000000_v2_exam_public_vocab_audio_schema.sql
-- ==============================================================================
-- 1. CREATE NEW V2 TABLES (PUBLIC VOCABULARY DOMAIN)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public_vocabulary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_hanzi TEXT NOT NULL,
    canonical_pinyin TEXT,
    canonical_han_viet TEXT,
    canonical_meaning_vi TEXT NOT NULL,
    canonical_note TEXT,
    canonical_example TEXT,
    canonical_example_translation_vi TEXT,
    hsk20_level INTEGER CHECK (hsk20_level >= 1 AND hsk20_level <= 6),
    hsk30_band INTEGER CHECK (hsk30_band >= 1 AND hsk30_band <= 3),
    hsk30_level INTEGER CHECK (hsk30_level >= 1 AND hsk30_level <= 9),
    tags TEXT[] DEFAULT '{}',
    created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    contributor_count INTEGER NOT NULL DEFAULT 1 CHECK (contributor_count >= 0),
    usage_count INTEGER NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public_vocabulary_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    normalized_hanzi TEXT NOT NULL,
    payload JSONB NOT NULL,
    validation_status TEXT NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'duplicate')),
    duplicate_target_id UUID REFERENCES public_vocabulary_entries(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolution_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- 2. ALTER V1 TABLES (ADDITIVE CHANGES ONLY)
-- ==============================================================================

-- Bổ sung vào vocabulary_items
ALTER TABLE vocabulary_items
    ADD COLUMN IF NOT EXISTS source_scope TEXT DEFAULT 'private' CHECK (source_scope IN ('private', 'public')),
    ADD COLUMN IF NOT EXISTS public_word_id UUID REFERENCES public_vocabulary_entries(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS contribution_status TEXT DEFAULT 'none' CHECK (contribution_status IN ('none', 'pending', 'accepted', 'rejected')),
    ADD COLUMN IF NOT EXISTS hsk20_level INTEGER CHECK (hsk20_level >= 1 AND hsk20_level <= 6),
    ADD COLUMN IF NOT EXISTS hsk30_band INTEGER CHECK (hsk30_band >= 1 AND hsk30_band <= 3),
    ADD COLUMN IF NOT EXISTS hsk30_level INTEGER CHECK (hsk30_level >= 1 AND hsk30_level <= 9),
    ADD COLUMN IF NOT EXISTS preferred_audio_provider TEXT,
    ADD COLUMN IF NOT EXISTS has_context_audio BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS exam_encounter_count INTEGER DEFAULT 0 CHECK (exam_encounter_count >= 0),
    ADD COLUMN IF NOT EXISTS wrong_answer_related_count INTEGER DEFAULT 0 CHECK (wrong_answer_related_count >= 0),
    ADD COLUMN IF NOT EXISTS last_encountered_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS source_reference_type TEXT,
    ADD COLUMN IF NOT EXISTS source_reference_id UUID;

-- Bổ sung vào vocabulary_contexts
ALTER TABLE vocabulary_contexts
    ADD COLUMN IF NOT EXISTS context_text TEXT,
    ADD COLUMN IF NOT EXISTS context_translation_vi TEXT,
    ADD COLUMN IF NOT EXISTS audio_text_override TEXT,
    ADD COLUMN IF NOT EXISTS source_scope TEXT DEFAULT 'private' CHECK (source_scope IN ('private', 'public')),
    ADD COLUMN IF NOT EXISTS source_reference_id UUID;


-- ==============================================================================
-- 3. CREATE NEW V2 TABLES (EXAMS DOMAIN)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS exam_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_scope TEXT NOT NULL DEFAULT 'user_private' CHECK (owner_scope IN ('system', 'user_private')),
    imported_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    exam_type TEXT NOT NULL,
    exam_level INTEGER,
    standard_version TEXT,
    source_type TEXT NOT NULL DEFAULT 'manual' CHECK (source_type IN ('pdf_import', 'system_seed', 'manual')),
    source_file_name TEXT,
    source_file_url TEXT,
    source_checksum TEXT,
    paper_year INTEGER,
    paper_term TEXT,
    total_sections INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    total_duration_seconds INTEGER,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    instructions TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_paper_id UUID NOT NULL REFERENCES exam_papers(id) ON DELETE CASCADE,
    section_code TEXT NOT NULL,
    section_name TEXT NOT NULL,
    skill TEXT NOT NULL CHECK (skill IN ('listening', 'reading', 'writing', 'comprehensive')),
    display_order INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER,
    question_count INTEGER NOT NULL DEFAULT 0,
    instructions TEXT,
    audio_asset_url TEXT,
    transcript_text TEXT,
    explanation_text TEXT
);

CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_paper_id UUID NOT NULL REFERENCES exam_papers(id) ON DELETE CASCADE,
    exam_section_id UUID NOT NULL REFERENCES exam_sections(id) ON DELETE CASCADE,
    question_order INTEGER NOT NULL DEFAULT 0,
    question_type TEXT NOT NULL,
    prompt_text TEXT,
    prompt_rich_text TEXT,
    transcript_text TEXT,
    explanation_text TEXT,
    stem_audio_url TEXT,
    reference_answer_text TEXT,
    correct_option_id UUID, -- Sẽ được link bằng logic application để tránh circular dependency gắt gao trên DB
    score_value NUMERIC NOT NULL DEFAULT 1.0,
    difficulty_tag TEXT,
    source_page_index INTEGER,
    raw_import_block_id TEXT,
    render_config_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
    option_key TEXT NOT NULL,
    option_text TEXT,
    option_rich_text TEXT,
    option_image_url TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS exam_import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT,
    parse_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (parse_status IN ('uploaded', 'processing', 'review_needed', 'completed', 'failed')),
    parser_version TEXT,
    raw_text_payload JSONB,
    normalized_draft_payload JSONB,
    error_log JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exam_paper_id UUID NOT NULL REFERENCES exam_papers(id) ON DELETE CASCADE,
    mode TEXT NOT NULL DEFAULT 'practice' CHECK (mode IN ('practice', 'real_exam')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'paused', 'submitted', 'abandoned')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    total_score NUMERIC DEFAULT 0,
    section_scores_json JSONB,
    correct_count INTEGER DEFAULT 0,
    wrong_count INTEGER DEFAULT 0,
    unanswered_count INTEGER DEFAULT 0,
    accuracy_rate NUMERIC DEFAULT 0,
    mistake_summary_json JSONB,
    review_recommendation_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_attempt_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    exam_question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES exam_question_options(id) ON DELETE SET NULL,
    selected_text TEXT,
    subjective_answer_text TEXT,
    is_correct BOOLEAN,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_spent_seconds INTEGER DEFAULT 0,
    confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
    error_category TEXT,
    error_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_review_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_attempt_id UUID NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    exam_question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
    primary_error_type TEXT,
    confusion_source_words TEXT[],
    recommended_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_vocabulary_encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_paper_id UUID NOT NULL REFERENCES exam_papers(id) ON DELETE CASCADE,
    exam_question_id UUID NOT NULL REFERENCES exam_questions(id) ON DELETE CASCADE,
    normalized_token TEXT NOT NULL,
    matched_private_vocabulary_id UUID REFERENCES vocabulary_items(id) ON DELETE SET NULL,
    matched_public_vocabulary_id UUID REFERENCES public_vocabulary_entries(id) ON DELETE SET NULL,
    encounter_role TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==============================================================================
-- 4. TRIGGERS FOR UPDATED_AT
-- ==============================================================================
-- Tận dụng function set_current_timestamp_updated_at() đã có ở V1
DROP TRIGGER IF EXISTS set_public_vocabulary_entries_updated_at ON public_vocabulary_entries;
CREATE TRIGGER set_public_vocabulary_entries_updated_at BEFORE UPDATE ON public_vocabulary_entries FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_public_vocabulary_contributions_updated_at ON public_vocabulary_contributions;
CREATE TRIGGER set_public_vocabulary_contributions_updated_at BEFORE UPDATE ON public_vocabulary_contributions FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_exam_papers_updated_at ON exam_papers;
CREATE TRIGGER set_exam_papers_updated_at BEFORE UPDATE ON exam_papers FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_exam_questions_updated_at ON exam_questions;
CREATE TRIGGER set_exam_questions_updated_at BEFORE UPDATE ON exam_questions FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_exam_import_jobs_updated_at ON exam_import_jobs;
CREATE TRIGGER set_exam_import_jobs_updated_at BEFORE UPDATE ON exam_import_jobs FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_exam_attempts_updated_at ON exam_attempts;
CREATE TRIGGER set_exam_attempts_updated_at BEFORE UPDATE ON exam_attempts FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_exam_attempt_responses_updated_at ON exam_attempt_responses;
CREATE TRIGGER set_exam_attempt_responses_updated_at BEFORE UPDATE ON exam_attempt_responses FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_exam_review_insights_updated_at ON exam_review_insights;
CREATE TRIGGER set_exam_review_insights_updated_at BEFORE UPDATE ON exam_review_insights FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS set_exam_vocabulary_encounters_updated_at ON exam_vocabulary_encounters;
CREATE TRIGGER set_exam_vocabulary_encounters_updated_at BEFORE UPDATE ON exam_vocabulary_encounters FOR EACH ROW EXECUTE FUNCTION set_current_timestamp_updated_at();


-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public_vocabulary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_vocabulary_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempt_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_review_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_vocabulary_encounters ENABLE ROW LEVEL SECURITY;

-- Public Vocabulary: Ai đăng nhập cũng được đọc (SELECT). Insert/Update/Delete quản lý ở System Level hoặc Backend.
CREATE POLICY "Anyone authenticated can read public vocabulary entries"
    ON public_vocabulary_entries FOR SELECT USING (auth.role() = 'authenticated');

-- Public Vocabulary Contributions: User chỉ quản lý đơn contribute của chính mình.
CREATE POLICY "Users manage their own vocabulary contributions"
    ON public_vocabulary_contributions FOR ALL USING (auth.uid() = user_id);

-- Exam Papers: Đọc được nếu là đề public (system) hoặc đề do mình tự import. Insert/Update/Delete nếu tự tạo.
CREATE POLICY "Users can read system papers or their own imported papers"
    ON exam_papers FOR SELECT USING (owner_scope = 'system' OR imported_by_user_id = auth.uid());

CREATE POLICY "Users can insert their own papers"
    ON exam_papers FOR INSERT WITH CHECK (imported_by_user_id = auth.uid());

CREATE POLICY "Users can update their own papers"
    ON exam_papers FOR UPDATE USING (imported_by_user_id = auth.uid());

CREATE POLICY "Users can delete their own papers"
    ON exam_papers FOR DELETE USING (imported_by_user_id = auth.uid());

-- Exam Entities Phụ (Sections, Questions, Options, Encounters): Kế thừa quyền SELECT từ bảng exam_papers cha.
CREATE POLICY "Users can read sections of accessible papers"
    ON exam_sections FOR SELECT USING (EXISTS (
        SELECT 1 FROM exam_papers WHERE id = exam_sections.exam_paper_id AND (owner_scope = 'system' OR imported_by_user_id = auth.uid())
    ));

CREATE POLICY "Users can read questions of accessible papers"
    ON exam_questions FOR SELECT USING (EXISTS (
        SELECT 1 FROM exam_papers WHERE id = exam_questions.exam_paper_id AND (owner_scope = 'system' OR imported_by_user_id = auth.uid())
    ));

CREATE POLICY "Users can read options of accessible questions"
    ON exam_question_options FOR SELECT USING (EXISTS (
        SELECT 1 FROM exam_questions
        JOIN exam_papers ON exam_questions.exam_paper_id = exam_papers.id
        WHERE exam_questions.id = exam_question_options.exam_question_id AND (owner_scope = 'system' OR imported_by_user_id = auth.uid())
    ));

CREATE POLICY "Users can read encounters of accessible papers"
    ON exam_vocabulary_encounters FOR SELECT USING (EXISTS (
        SELECT 1 FROM exam_papers WHERE id = exam_vocabulary_encounters.exam_paper_id AND (owner_scope = 'system' OR imported_by_user_id = auth.uid())
    ));

-- User Owned Private Entities (Attempts, Responses, Insights, Import Jobs): auth.uid() = user_id
CREATE POLICY "Users manage their own exam import jobs"
    ON exam_import_jobs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own exam attempts"
    ON exam_attempts FOR ALL USING (auth.uid() = user_id);

-- Responses & Insights link với attempt_id, ta join để check user_id
CREATE POLICY "Users manage responses of their own attempts"
    ON exam_attempt_responses FOR ALL USING (EXISTS (
        SELECT 1 FROM exam_attempts WHERE id = exam_attempt_responses.exam_attempt_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users manage insights of their own attempts"
    ON exam_review_insights FOR ALL USING (EXISTS (
        SELECT 1 FROM exam_attempts WHERE id = exam_review_insights.exam_attempt_id AND user_id = auth.uid()
    ));


-- ==============================================================================
-- 6. INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_vocab_items_scope ON vocabulary_items(source_scope);
CREATE INDEX IF NOT EXISTS idx_vocab_items_hsk20 ON vocabulary_items(hsk20_level);
CREATE INDEX IF NOT EXISTS idx_vocab_items_hsk30 ON vocabulary_items(hsk30_level);
CREATE INDEX IF NOT EXISTS idx_vocab_items_public_id ON vocabulary_items(public_word_id);

CREATE INDEX IF NOT EXISTS idx_pub_vocab_hanzi ON public_vocabulary_entries(canonical_hanzi);
CREATE INDEX IF NOT EXISTS idx_pub_vocab_hsk20 ON public_vocabulary_entries(hsk20_level);

CREATE INDEX IF NOT EXISTS idx_exam_papers_level ON exam_papers(exam_level);
CREATE INDEX IF NOT EXISTS idx_exam_papers_owner ON exam_papers(owner_scope, imported_by_user_id);

CREATE INDEX IF NOT EXISTS idx_exam_sections_paper ON exam_sections(exam_paper_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_paper ON exam_questions(exam_paper_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_section ON exam_questions(exam_section_id);
CREATE INDEX IF NOT EXISTS idx_exam_options_question ON exam_question_options(exam_question_id);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_paper ON exam_attempts(exam_paper_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempt_resp_attempt ON exam_attempt_responses(exam_attempt_id);
CREATE INDEX IF NOT EXISTS idx_exam_insights_attempt ON exam_review_insights(exam_attempt_id);

CREATE INDEX IF NOT EXISTS idx_exam_encounters_paper ON exam_vocabulary_encounters(exam_paper_id);
CREATE INDEX IF NOT EXISTS idx_exam_encounters_token ON exam_vocabulary_encounters(normalized_token);