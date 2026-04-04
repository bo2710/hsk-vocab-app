-- filepath: supabase/migrations/20260406000000_exam_moderation.sql
-- CẦN TẠO MỚI
CREATE TYPE exam_edit_request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS exam_edit_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_paper_id UUID NOT NULL REFERENCES exam_papers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    status exam_edit_request_status NOT NULL DEFAULT 'pending',
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE exam_edit_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own edit requests"
    ON exam_edit_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view edit requests"
    ON exam_edit_requests FOR SELECT
    USING (true);

CREATE POLICY "Admins can update edit requests"
    ON exam_edit_requests FOR UPDATE
    USING (true);