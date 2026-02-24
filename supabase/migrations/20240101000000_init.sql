-- Create the pgvector extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS vector;

-- Cases table with a vector column for semantic search
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    citation VARCHAR(255) NOT NULL,
    court VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    -- Using 768 dimensions which is common for smaller models or standard embeddings
    -- (e.g. text-embedding-004 from Google returns 768 dims by default)
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimization: HNSW index for fast vector similarity search
-- Adjust the 'm' and 'ef_construction' parameters based on dataset size and accuracy needs
CREATE INDEX IF NOT EXISTS cases_embedding_idx ON cases USING hnsw (embedding vector_cosine_ops);
