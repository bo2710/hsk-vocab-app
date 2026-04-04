-- filepath: supabase/migrations/20260405000000_fix_exam_responses_unique_constraint.sql
-- CẦN TẠO MỚI

-- 1. Xóa các bản ghi trùng lặp (nếu có) để có thể tạo Unique Constraint thành công
-- Lưu ý: Trong môi trường dev, chúng ta giữ lại bản ghi có ID lớn nhất (mới nhất) cho mỗi cặp
DELETE FROM exam_attempt_responses a
USING exam_attempt_responses b
WHERE a.id < b.id 
  AND a.exam_attempt_id = b.exam_attempt_id 
  AND a.exam_question_id = b.exam_question_id;

-- 2. Thêm Unique Constraint cho cặp (exam_attempt_id, exam_question_id)
-- Điều này cho phép lệnh upsert hoạt động chính xác
ALTER TABLE exam_attempt_responses 
ADD CONSTRAINT exam_attempt_responses_attempt_question_key 
UNIQUE (exam_attempt_id, exam_question_id);

-- 3. Thông báo cho PostgREST cập nhật lại schema cache
NOTIFY pgrst, 'reload schema';