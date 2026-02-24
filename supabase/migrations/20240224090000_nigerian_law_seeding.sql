-- Migration: Seed Nigerian Constitution and Core Precedents
-- This ensures the platform has "Law" out of the box.

-- 1. Create a specific table for the Constitution or use Cases?
-- We'll use the 'cases' table but with a specific 'type' column added in a future migration, 
-- or just use the summary/content field for now. 
-- Actually, let's create a lean 'statutes' table for legislation.

CREATE TABLE IF NOT EXISTS statutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    year INTEGER,
    content TEXT NOT NULL,
    category VARCHAR(100), -- e.g. 'Constitution', 'Act', 'Decree'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO statutes (title, year, content, category) VALUES
('Constitution of the Federal Republic of Nigeria', 1999, 'WE THE PEOPLE of the Federal Republic of Nigeria... Chapter 1: General Provisions. Supremacy of the Constitution: This Constitution is supreme and its provisions shall have binding force on all authorities and persons throughout the Federal Republic of Nigeria...', 'Constitution')
ON CONFLICT DO NOTHING;

-- Also add a "Searchable" entry in cases table for the Constitution page integration
INSERT INTO cases (title, citation, court, year, summary, content, topic) VALUES
('Constitution of the Federal Republic of Nigeria', '1999 Constitution', 'Federal Republic of Nigeria', 1999, 'The supreme law of Nigeria.', 'WE THE PEOPLE... [Full Constitution Content]', 'Constitutional Law')
ON CONFLICT DO NOTHING;

-- 2. Seed High-Impact Nigerian Cases for Students & Lawyers
INSERT INTO cases (title, citation, court, year, summary, content, topic) VALUES
('Fawehinmi v. Abacha', '(1996) 9 NWLR (Pt.475) 710', 'Supreme Court of Nigeria', 1996, 'A critical case determining the status of the African Charter on Human and Peoples Rights in Nigerian domestic law.', 'Full content of the decision regarding the enforcement of fundamental rights during military rule...', 'Constitutional Law'),
('Amaechi v. INEC', '(2008) 5 NWLR (Pt.1080) 227', 'Supreme Court of Nigeria', 2008, 'The landmark "substitution" case where the Supreme Court held that the party wins the election, not the individual, leading to Amaechi being declared Governor.', 'Comprehensive details on candidate substitution and party supremacy...', 'Election Law'),
('Mojekwu v. Mojekwu', '(1997) 7 NWLR (Pt.512) 283', 'Court of Appeal of Nigeria', 1997, 'A revolutionary case on the repugnancy doctrine, striking down a discriminatory "Oli-ekpe" custom as being against equity and good conscience.', 'Detailed analysis of customary law vs fundamental rights...', 'Family Law'),
('Savannah Bank v. Ajilo', '(1989) 1 NWLR (Pt.97) 305', 'Supreme Court of Nigeria', 1989, 'Key case on the Land Use Act, clarifying the requirement of Governor''s consent for alienation of land.', 'Analysis of Section 22 of the Land Use Act 1978...', 'Land Law')
ON CONFLICT DO NOTHING;
