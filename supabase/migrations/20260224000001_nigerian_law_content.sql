-- Migration: Nigerian Law Categories, Seed Data & Exam Prep
-- Adds law_category, jurisdiction, tags, excerpt columns
-- Populates foundational Nigerian law cases including the Constitution

-- Expand cases table with new fields
ALTER TABLE cases ADD COLUMN IF NOT EXISTS law_category TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS jurisdiction TEXT DEFAULT 'Nigeria';
ALTER TABLE cases ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE cases ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add unique constraint on citation if it doesn't exist
ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_citation_key;
ALTER TABLE cases ADD CONSTRAINT cases_citation_key UNIQUE (citation);

-- Nigerian law categories reference table
CREATE TABLE IF NOT EXISTS law_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO law_categories (name, description) VALUES
('Constitutional Law', 'Nigerian Constitution, fundamental rights and governance'),
('Civil Law', 'Private rights and obligations between individuals'),
('Common Law', 'Case law developed through judicial decisions'),
('Criminal Law', 'Offences against the state and society'),
('Law of Contract', 'Formation, performance and breach of contracts'),
('Law of Tort', 'Civil wrongs and remedies outside contract'),
('Land Law', 'Property rights and land tenure in Nigeria'),
('International Law', 'Public and private international law and treaties'),
('Islamic/Sharia Law', 'Islamic jurisprudence and Sharia principles in Nigeria'),
('Company Law', 'Corporate law, companies and business organisations'),
('Administrative Law', 'Control of government power and public administration'),
('Family Law', 'Marriage, divorce, custody and inheritance in Nigeria'),
('Law of Evidence', 'Rules governing admissibility of evidence in Nigerian courts'),
('Legal Methods', 'Introduction to law, legal reasoning and research'),
('Jurisprudence', 'Philosophy and theory of law'),
('Equity and Trusts', 'Equitable jurisdiction and trust law'),
('Commercial Law', 'Business, trade and commercial transactions')
ON CONFLICT (name) DO NOTHING;

-- Exam questions table
CREATE TABLE IF NOT EXISTS exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    law_category TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Medium',
    source TEXT,
    year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed: Nigerian Constitution
INSERT INTO cases (title, citation, court, year, topic, law_category, jurisdiction, difficulty, excerpt, content, tags) VALUES
(
    'Constitution of the Federal Republic of Nigeria 1999',
    'CFRN 1999 (as amended)',
    'Federal Republic of Nigeria',
    1999,
    'Supreme Law',
    'Constitutional Law',
    'Nigeria',
    'beginner',
    'The supreme law of Nigeria. Establishes the federal structure, guarantees fundamental human rights to all citizens, and creates the three arms of government: Executive, Legislature and Judiciary.',
    'The Constitution of the Federal Republic of Nigeria 1999 is the supreme law of Nigeria. Section 1(1): This Constitution is supreme and its provisions shall have binding force on all authorities and persons throughout the Federal Republic of Nigeria. CHAPTER IV — FUNDAMENTAL RIGHTS: S33 Right to life; S34 Right to dignity of human person; S35 Right to personal liberty; S36 Right to fair hearing; S37 Right to private and family life; S38 Freedom of thought, conscience and religion; S39 Freedom of expression; S40 Freedom of peaceful assembly and association; S41 Freedom of movement; S42 Freedom from discrimination. FEDERAL STRUCTURE: Nigeria is a Federal Republic comprising 36 States and the FCT. The three tiers of government are the Federal, State and Local Governments.',
    ARRAY['Constitutional Law', 'Fundamental Rights', 'Federal Republic', 'Human Rights']
),
(
    'Donoghue v Stevenson',
    '[1932] AC 562',
    'House of Lords',
    1932,
    'Negligence',
    'Law of Tort',
    'UK (Applied in Nigeria)',
    'intermediate',
    'The foundation of modern negligence law. Lord Atkin established the "neighbour principle" — you must take reasonable care to avoid acts that would likely injure persons closely affected by your actions.',
    'Lord Atkin: "You must take reasonable care to avoid acts or omissions which you can reasonably foresee would be likely to injure your neighbour. Who then in law is my neighbour? The answer seems to be — persons who are so closely and directly affected by my act that I ought reasonably to have them in contemplation." Mrs Donoghue found a decomposed snail in a ginger beer bottle. She sued the manufacturer in negligence and the House of Lords held the manufacturer owed a duty of care. This established three elements of negligence: (1) Duty of care owed to claimant; (2) Breach of that duty; (3) Damage caused by the breach.',
    ARRAY['Tort', 'Negligence', 'Duty of Care', 'Neighbour Principle']
),
(
    'Carlill v Carbolic Smoke Ball Co',
    '[1893] 1 QB 256',
    'Court of Appeal',
    1893,
    'Offer and Acceptance',
    'Law of Contract',
    'UK (Applied in Nigeria)',
    'beginner',
    'A landmark contract case establishing that advertisements can constitute binding offers. The company advertised £100 reward for anyone who got flu after using their product. Mrs Carlill qualified and won.',
    'The Carbolic Smoke Ball Company placed an advertisement offering £100 to anyone who contracted influenza after using their smoke ball product three times daily for two weeks. Mrs Carlill used the product and still caught influenza. The Court of Appeal held: (1) The advertisement was a unilateral offer, not mere puffery — evidenced by the company depositing £1,000 in a bank to show sincerity; (2) Performance of the condition (using the ball) constituted acceptance; (3) There was consideration (the inconvenience of using the product); (4) Communication of acceptance is not required in unilateral contracts. Key principles: Unilateral contracts, Offer, Acceptance by conduct, Consideration.',
    ARRAY['Contract', 'Offer', 'Acceptance', 'Unilateral Contract', 'Consideration']
),
(
    'Awolowo v Federal Minister of Internal Affairs',
    '[1962] 1 WNLR 177',
    'Federal Supreme Court of Nigeria',
    1962,
    'Right to Legal Representation',
    'Constitutional Law',
    'Nigeria',
    'advanced',
    'Landmark Nigerian case establishing the constitutional right to legal representation. Chief Awolowo challenged his unlawful detention and denial of his constitutionally guaranteed rights.',
    'Chief Obafemi Awolowo challenged his detention and denial of access to legal representation. The Federal Supreme Court held that every person charged with a criminal offence in Nigeria has the constitutional right to be represented by a legal practitioner of their own choice and this right cannot be denied by the State. The case remains a cornerstone of Nigerian constitutional jurisprudence on fundamental rights enforcement and the right to fair hearing under what is now S36 of the 1999 Constitution.',
    ARRAY['Constitutional Law', 'Fundamental Rights', 'Legal Representation', 'Fair Hearing', 'Criminal Procedure']
),
(
    'Ransome-Kuti v Attorney-General of the Federation',
    '[1985] 2 NWLR (Pt 6) 211',
    'Supreme Court of Nigeria',
    1985,
    'Locus Standi',
    'Constitutional Law',
    'Nigeria',
    'advanced',
    'Supreme Court considered locus standi for enforcement of fundamental rights. Only a person whose rights are directly infringed may bring the action.',
    'The Supreme Court considered who has the standing (locus standi) to bring an action for the enforcement of fundamental rights under the Nigerian Constitution. The court adopted a restrictive approach, holding that only a person whose own rights have been directly infringed can maintain such an action. This approach has been the subject of significant academic and judicial debate in Nigeria, with subsequent cases and legislative changes moderating its strictness in certain contexts.',
    ARRAY['Constitutional Law', 'Locus Standi', 'Fundamental Rights', 'Supreme Court', 'Standing']
),
(
    'Land Use Act 1978',
    'Cap L5 LFN 2004',
    'Federal Government of Nigeria',
    1978,
    'Land Administration',
    'Land Law',
    'Nigeria',
    'beginner',
    'The primary statute governing land ownership in Nigeria. Vests all land in the Governor of each State, who holds it in trust for all Nigerians. Introduces the Certificate of Occupancy system.',
    'The Land Use Act 1978 fundamentally reformed land tenure in Nigeria. Key provisions: S1: All land comprised in the territory of each State is vested in the Governor of that State and shall be held in trust and administered for the use and common benefit of all Nigerians. S5: Governor may grant statutory rights of occupancy in urban areas. S6: Local Government Council may grant customary rights of occupancy in rural areas. S9: Certificate of Occupancy (C of O) as documentary evidence of the right of occupancy. S22: No alienation of statutory right of occupancy without consent of the Governor. S26: No person shall hold more land than is sufficient for his personal use. The Act effectively nationalised all land in Nigeria and remains the primary statute governing land rights.',
    ARRAY['Land Law', 'Land Use Act', 'Certificate of Occupancy', 'Property Rights', 'Nigerian Legislation']
),
(
    'Lawal v Younan',
    '[1961] ALL NLR 245',
    'Federal Supreme Court of Nigeria',
    1961,
    'Customary Land Tenure',
    'Land Law',
    'Nigeria',
    'intermediate',
    'Key case on customary land tenure and occupancy rights in Nigeria before the Land Use Act. Examined the nature of customary freehold.',
    'This pre-Land Use Act case examined the nature of customary land tenure in Nigeria. The Federal Supreme Court considered the rights of persons holding land under customary law, including the concept of "customary freehold" as distinct from English freehold. The case is important for understanding the historical development of land law in Nigeria, the dual system of land tenure that existed before 1978, and the transition to the current system under the Land Use Act.',
    ARRAY['Land Law', 'Customary Law', 'Land Tenure', 'Property Rights']
),
(
    'Rylands v Fletcher',
    '[1868] LR 3 HL 330',
    'House of Lords',
    1868,
    'Strict Liability',
    'Law of Tort',
    'UK (Applied in Nigeria)',
    'intermediate',
    'Established the rule of strict liability for escape of dangerous things from land. If you bring onto your land something likely to do mischief if it escapes, you are prima facie strictly liable.',
    'The defendant employed independent contractors to build a reservoir on his land. The contractors negligently failed to block disused mine shafts, and water flooded the plaintiff''s mine. The House of Lords (per Lord Cairns) established: A person who for his own purposes brings on his lands and collects and keeps there anything likely to do mischief if it escapes, must keep it at his peril, and, if he does not do so, is prima facie answerable for all the damage which is the natural consequence of its escape. Requirements: (1) Defendant brought something onto their land; (2) It was likely to do mischief if it escaped; (3) There was a non-natural use of land; (4) The thing escaped; (5) Damage resulted.',
    ARRAY['Tort', 'Strict Liability', 'Rylands v Fletcher', 'Property']
)
ON CONFLICT (citation) DO NOTHING;

-- Seed: Sample exam questions
INSERT INTO exam_questions (question, options, correct_answer, explanation, law_category, difficulty, year) VALUES
(
    'Which section of the 1999 Nigerian Constitution guarantees the right to fair hearing?',
    '["Section 33", "Section 35", "Section 36", "Section 38"]',
    'Section 36',
    'Section 36 CFRN 1999 guarantees the right to fair hearing, including the right to be informed of charges, to defend oneself, and to be presumed innocent until proven guilty.',
    'Constitutional Law',
    'Easy',
    2023
),
(
    'In Donoghue v Stevenson, what three elements did Lord Atkin identify for a successful negligence claim?',
    '["Intent, causation, damage", "Duty of care, breach, damage", "Foreseeability, proximity, policy", "Offer, acceptance, consideration"]',
    'Duty of care, breach, damage',
    'Lord Atkin established that to succeed in negligence: (1) the defendant must owe a duty of care to the claimant; (2) the defendant must have breached that duty; and (3) the breach must have caused damage to the claimant.',
    'Law of Tort',
    'Medium',
    2022
),
(
    'Under the Land Use Act 1978, who has the power to grant statutory rights of occupancy in urban areas?',
    '["Local Government Chairman", "President of Nigeria", "Governor of the State", "Minister of Works and Housing"]',
    'Governor of the State',
    'Section 5 of the Land Use Act 1978 vests the power to grant statutory rights of occupancy over land in urban areas in the Governor of each State.',
    'Land Law',
    'Easy',
    2023
);
