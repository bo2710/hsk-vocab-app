-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Create vocabulary_items table
CREATE TABLE vocabulary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hanzi TEXT NOT NULL,
    hanzi_normalized TEXT NOT NULL,
    pinyin TEXT,
    pinyin_normalized TEXT,
    han_viet TEXT,
    meaning_vi TEXT NOT NULL,
    meaning_vi_normalized TEXT,
    note TEXT,
    example TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'reviewing', 'mastered')),
    hsk_level INTEGER CHECK (hsk_level >= 1 AND hsk_level <= 9),
    tags TEXT[] DEFAULT '{}',
    encounter_count INTEGER NOT NULL DEFAULT 1 CHECK (encounter_count >= 1),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    first_added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2. Create vocabulary_contexts table
CREATE TABLE vocabulary_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vocabulary_id UUID NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    context_name TEXT NOT NULL,
    context_type TEXT NOT NULL DEFAULT 'other' CHECK (context_type IN ('sentence', 'article', 'book', 'video', 'audio', 'conversation', 'other')),
    learned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    context_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 3. Add triggers for updated_at
CREATE TRIGGER set_vocabulary_items_updated_at
BEFORE UPDATE ON vocabulary_items
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp_updated_at();

CREATE TRIGGER set_vocabulary_contexts_updated_at
BEFORE UPDATE ON vocabulary_contexts
FOR EACH ROW
EXECUTE FUNCTION set_current_timestamp_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_contexts ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for vocabulary_items
CREATE POLICY "Users can select their own vocabulary items"
    ON vocabulary_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary items"
    ON vocabulary_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabulary items"
    ON vocabulary_items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabulary items"
    ON vocabulary_items FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Create RLS Policies for vocabulary_contexts
CREATE POLICY "Users can select their own vocabulary contexts"
    ON vocabulary_contexts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary contexts"
    ON vocabulary_contexts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabulary contexts"
    ON vocabulary_contexts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabulary contexts"
    ON vocabulary_contexts FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Create Indexes for common queries
CREATE INDEX idx_vocab_items_user_hanzi_norm ON vocabulary_items(user_id, hanzi_normalized);
CREATE INDEX idx_vocab_items_user_pinyin_norm ON vocabulary_items(user_id, pinyin_normalized);
CREATE INDEX idx_vocab_items_user_updated_at ON vocabulary_items(user_id, updated_at);
CREATE INDEX idx_vocab_items_user_status ON vocabulary_items(user_id, status);

CREATE INDEX idx_vocab_contexts_user_type ON vocabulary_contexts(user_id, context_type);
CREATE INDEX idx_vocab_contexts_vocab_id ON vocabulary_contexts(vocabulary_id);