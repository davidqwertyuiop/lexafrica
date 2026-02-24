-- Courses / Subjects (e.g. Criminal Law, Tort Law)
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- Lucide icon name
    color VARCHAR(20), -- Tailwind color name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Topics under each course
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Markdown content for the topic
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial data for courses
INSERT INTO courses (title, description, icon, color) VALUES
('Criminal Law', 'Principles of criminal liability, offences against persons and property.', 'Shield', 'red'),
('Tort Law', 'Civil wrongs, negligence, nuisance, and defamation.', 'Scales', 'blue'),
('Contract Law', 'Formation, performance, and discharge of contracts.', 'FileText', 'amber'),
('Constitutional Law', 'Study of the Nigerian Constitution and fundamental rights.', 'Gavel', 'purple')
ON CONFLICT (title) DO NOTHING;
