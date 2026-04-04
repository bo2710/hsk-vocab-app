-- Tạo bảng review_logs
CREATE TABLE IF NOT EXISTS public.review_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES public.vocabulary_items(id) ON DELETE CASCADE,
    rating TEXT NOT NULL CHECK (rating IN ('forgot', 'vague', 'remembered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Kích hoạt Row Level Security
ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ có thể xem log của chính mình
CREATE POLICY "Users can view their own review logs" 
ON public.review_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: User chỉ có thể tạo log cho chính mình
CREATE POLICY "Users can insert their own review logs" 
ON public.review_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Tạo index để tăng tốc độ truy vấn lịch sử ôn tập của một từ
CREATE INDEX idx_review_logs_vocabulary_id ON public.review_logs(vocabulary_id);
CREATE INDEX idx_review_logs_user_id ON public.review_logs(user_id);