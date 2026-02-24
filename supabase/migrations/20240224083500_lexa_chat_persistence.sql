-- Migration to support LEXA chat history and expanded law topics
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id), -- Optional for guests initially
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster chat history retrieval
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Optional: Add extra categories to cases if not already there
ALTER TABLE cases ADD COLUMN IF NOT EXISTS jurisdiction TEXT DEFAULT 'Nigeria';
ALTER TABLE cases ADD COLUMN IF NOT EXISTS citation TEXT;
