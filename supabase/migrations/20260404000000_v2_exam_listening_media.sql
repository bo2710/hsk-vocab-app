-- filepath: supabase/migrations/20260404000000_v2_exam_listening_media.sql
-- CẦN TẠO MỚI
-- Thêm các cột metadata lưu trữ nguồn media cho phần Listening ở cấp độ Paper
ALTER TABLE exam_papers
    ADD COLUMN IF NOT EXISTS listening_media_type TEXT CHECK (listening_media_type IN ('none', 'audio_file', 'youtube_link')) DEFAULT 'none',
    ADD COLUMN IF NOT EXISTS listening_media_url TEXT;

-- Dọn dẹp cache cho các function nếu cần
NOTIFY pgrst, 'reload schema';