-- Real Legal Data Seeding for Nigeria
-- High-authority cases and detailed syllabus topics

-- Make content nullable so we can seed without full text
ALTER TABLE cases ALTER COLUMN content DROP NOT NULL;

INSERT INTO courses (title, description) VALUES
('Contract Law', 'Fundamentals of contract formation, breach and remedies under Nigerian law.'),
('Constitutional Law', 'Nigerian constitutional framework, fundamental rights and governance.'),
('Tort Law', 'Civil wrongs, negligence, and liability under Nigerian law.'),
('Criminal Law', 'Offences, defences and criminal procedure under Nigerian law.'),
('Family Law', 'Marriage, divorce, custody and succession under Nigerian law.'),
('Land Law', 'Land Use Act, ownership, and property rights in Nigeria.'),
('Commercial Law', 'Company law, banking, and commercial transactions in Nigeria.'),
('Equity and Trusts', 'Equitable principles, trusts and fiduciary duties in Nigerian law.'),
('Administrative Law', 'Government powers, judicial review and public law in Nigeria.'),
('Evidence Law', 'Rules of evidence and proof in Nigerian courts.')
ON CONFLICT DO NOTHING;

-- 2. Insert Topics for each course
WITH contract_id AS (SELECT id FROM courses WHERE title = 'Contract Law' LIMIT 1)
INSERT INTO topics (course_id, title, description, content, order_index) VALUES
((SELECT id FROM contract_id), 'Offer and Acceptance', 'The basis of contract formation in Nigerian law.', 'An offer is a definite promise to be bound on specific terms. Acceptance must be unconditional and communicated. Key Nigerian cases include Majekodunmi v Co-operative Bank.', 1),
((SELECT id FROM contract_id), 'Consideration', 'The price paid for a promise.', 'Consideration must be sufficient but need not be adequate. Analysis includes Curry v Misa and Nigerian commercial cases.', 2),
((SELECT id FROM contract_id), 'Intention to Create Legal Relations', 'Determining if parties meant to be legally bound.', 'Social and domestic agreements presumed not binding. Commercial agreements presumed binding. Key case: Balfour v Balfour.', 3),
((SELECT id FROM contract_id), 'Capacity to Contract', 'Who can legally enter into contracts under Nigerian law.', 'Minors, mental incapacity, and corporations capacity to contract under Nigerian law.', 4),
((SELECT id FROM contract_id), 'Breach and Remedies', 'Consequences of breaking a contract.', 'Types of breach, damages, specific performance and injunctions available under Nigerian law.', 5)
ON CONFLICT DO NOTHING;

WITH constitutional_id AS (SELECT id FROM courses WHERE title = 'Constitutional Law' LIMIT 1)
INSERT INTO topics (course_id, title, description, content, order_index) VALUES
((SELECT id FROM constitutional_id), 'Fundamental Human Rights', 'Chapter IV rights under the 1999 Constitution.', 'Rights to life, dignity, fair hearing, privacy, freedom of expression and movement guaranteed under the Nigerian Constitution.', 1),
((SELECT id FROM constitutional_id), 'Separation of Powers', 'Division of government powers in Nigeria.', 'Executive, legislative and judicial powers under the 1999 Constitution and their limits.', 2),
((SELECT id FROM constitutional_id), 'Federalism in Nigeria', 'The federal structure of the Nigerian state.', 'Distribution of powers between federal and state governments, exclusive and concurrent legislative lists.', 3),
((SELECT id FROM constitutional_id), 'Judicial Review', 'Courts power to review government action.', 'Grounds for judicial review, locus standi and remedies available in Nigerian administrative law.', 4)
ON CONFLICT DO NOTHING;

WITH tort_id AS (SELECT id FROM courses WHERE title = 'Tort Law' LIMIT 1)
INSERT INTO topics (course_id, title, description, content, order_index) VALUES
((SELECT id FROM tort_id), 'Negligence', 'The tort of careless conduct causing harm.', 'Duty of care, breach and causation. Established in Donoghue v Stevenson and applied in Nigerian courts.', 1),
((SELECT id FROM tort_id), 'Occupiers Liability', 'Duties owed by occupiers to visitors.', 'Duties to invitees, licensees and trespassers under Nigerian law.', 2),
((SELECT id FROM tort_id), 'Defamation', 'Protection of reputation under Nigerian law.', 'Libel and slander, defences including justification, fair comment and privilege.', 3),
((SELECT id FROM tort_id), 'Trespass', 'Direct interference with person, land or goods.', 'Trespass to person, land and chattels under Nigerian tort law.', 4)
ON CONFLICT DO NOTHING;

-- 3. Insert Cases
INSERT INTO cases (title, citation, court, year, summary, topic, difficulty) VALUES

-- Contract Law
('Carlill v Carbolic Smoke Ball Co', '[1893] 1 QB 256', 'Court of Appeal (UK - Persuasive in Nigeria)', 1893, 'Established that an advertisement with specific terms constitutes a binding unilateral offer that can be accepted by anyone who performs its terms.', 'Contract Law', 'Medium'),
('Balfour v Balfour', '[1919] 2 KB 571', 'Court of Appeal (UK - Persuasive in Nigeria)', 1919, 'Established that agreements between spouses living together are not legally binding as there is no intention to create legal relations.', 'Contract Law', 'Easy'),
('Hadley v Baxendale', '[1854] EWHC J70', 'Court of Exchequer (UK - Persuasive in Nigeria)', 1854, 'Established the rule for remoteness of damage in contract - losses must arise naturally or be in contemplation of both parties at time of contracting.', 'Contract Law', 'High'),
('Majekodunmi v Co-operative Bank Ltd', '(1990) 6 NWLR (Pt. 155) 91', 'Supreme Court of Nigeria', 1990, 'Established key principles governing offer and acceptance in Nigerian commercial transactions.', 'Contract Law', 'Medium'),
('African Continental Bank v Awogboro', '(1993) 5 NWLR (Pt. 296) 728', 'Supreme Court of Nigeria', 1993, 'Key case on consideration and enforceability of contracts under Nigerian law.', 'Contract Law', 'High'),
('Yarokun v Barclays Bank', '(1967) NMLR 195', 'Supreme Court of Nigeria', 1967, 'Important case on contractual capacity and banking relationships in Nigeria.', 'Contract Law', 'Medium'),

-- Constitutional Law
('Attorney-General of Bendel State v Attorney-General of the Federation', '(1981) 10 SC 1', 'Supreme Court of Nigeria', 1981, 'Landmark case on the supremacy of the constitution and procedure for passing legislation in Nigeria.', 'Constitutional Law', 'High'),
('Garba v University of Maiduguri', '(1986) 1 NWLR (Pt. 18) 550', 'Supreme Court of Nigeria', 1986, 'Key case on fair hearing and administrative law in Nigeria establishing that disciplinary panels cannot perform judicial functions.', 'Constitutional Law', 'Medium'),
('Abacha v Fawehinmi', '(2000) 6 NWLR (Pt. 660) 228', 'Supreme Court of Nigeria', 2000, 'Landmark case on fundamental human rights and enforceability of international human rights treaties in Nigeria.', 'Constitutional Law', 'High'),
('Marwa v Nyako', '(2012) 6 NWLR (Pt. 1296) 199', 'Supreme Court of Nigeria', 2012, 'Significant constitutional case interpreting tenure provisions for elected officials in Nigeria.', 'Constitutional Law', 'High'),
('Nafiu Rabiu v The State', '(1980) 8-11 SC 130', 'Supreme Court of Nigeria', 1980, 'Landmark case on constitutional interpretation establishing that courts should give life to the constitution rather than whittle down rights.', 'Constitutional Law', 'High'),

-- Tort Law
('Donoghue v Stevenson', '[1932] AC 562', 'House of Lords (UK - Persuasive in Nigeria)', 1932, 'Established the modern concept of negligence and the neighbour principle - you must take reasonable care to avoid acts that could harm your neighbour.', 'Tort Law', 'Medium'),
('Wagon Mound No 1', '[1961] AC 388', 'Privy Council (Persuasive in Nigeria)', 1961, 'Established the test of reasonable foreseeability for remoteness of damage in negligence replacing the direct consequence test.', 'Tort Law', 'High'),
('Overseas Constructors Ltd v Siplast Nigeria Ltd', '(1993) 3 NWLR (Pt. 284) 690', 'Supreme Court of Nigeria', 1993, 'Important Nigerian case on negligence, duty of care and professional liability.', 'Tort Law', 'Medium'),
('Benson v Ashiru', '(1967) 1 All NLR 184', 'Supreme Court of Nigeria', 1967, 'Key Nigerian case on occupiers liability and the duty owed to visitors on premises.', 'Tort Law', 'Medium'),

-- Criminal Law
('Oguntolu v The State', '(1996) 2 NWLR (Pt. 432) 503', 'Supreme Court of Nigeria', 1996, 'Key case on mens rea and criminal intention establishing the mental element required for criminal liability in Nigeria.', 'Criminal Law', 'High'),
('Kalu v The State', '(1998) 13 NWLR (Pt. 583) 531', 'Supreme Court of Nigeria', 1998, 'Landmark case on murder establishing the standard of proof required in criminal proceedings in Nigeria.', 'Criminal Law', 'High'),
('Nwosu v The State', '(1998) 8 NWLR (Pt. 562) 433', 'Supreme Court of Nigeria', 1998, 'Important case on self defence as a complete defence to criminal liability in Nigeria.', 'Criminal Law', 'Medium'),
('R v Woollin', '[1998] 4 All ER 103', 'House of Lords (UK - Persuasive in Nigeria)', 1998, 'Established the definition of intention in criminal law particularly in murder cases where result is virtually certain.', 'Criminal Law', 'Medium'),

-- Family Law
('Uwaifo v Uwaifo', '(2013) LPELR-20385(SC)', 'Supreme Court of Nigeria', 2013, 'Dealt with the standard of proof required in proving custom and the effect of judicial notice of custom in family proceedings.', 'Family Law', 'High'),
('Okonkwo v Okonkwo', '(1998) 10 NWLR (Pt. 571) 554', 'Supreme Court of Nigeria', 1998, 'Key case on customary law marriage requirements and validity under Nigerian family law.', 'Family Law', 'Medium'),
('Cole v Cole', '(1898) 1 NLR 15', 'Supreme Court of Nigeria', 1898, 'One of the earliest Nigerian cases on the conflict between customary law and received English law in family matters.', 'Family Law', 'High'),

-- Land Law
('Abioye v Yakubu', '(1991) 5 NWLR (Pt. 190) 130', 'Supreme Court of Nigeria', 1991, 'Landmark case interpreting the Land Use Act and the nature of rights of occupancy granted to Nigerian citizens.', 'Land Law', 'High'),
('Coker v Coker', '(1963) 1 All NLR 233', 'Supreme Court of Nigeria', 1963, 'Established key principles on family property and land ownership under Nigerian customary law.', 'Land Law', 'High'),
('Savannah Bank v Ajilo', '(1989) 1 NWLR (Pt. 97) 305', 'Supreme Court of Nigeria', 1989, 'Important case on mortgages and the Land Use Act establishing that consent of Governor is required for valid mortgage.', 'Land Law', 'High'),

-- Commercial Law
('Odutola v Papersack Nigeria Ltd', '(2006) 18 NWLR (Pt. 1012) 470', 'Supreme Court of Nigeria', 2006, 'Key case on company law and shareholders rights establishing duties of directors in Nigeria.', 'Commercial Law', 'High'),
('Niger Progress Ltd v North East Line Corporation', '(1989) 3 NWLR (Pt. 107) 99', 'Supreme Court of Nigeria', 1989, 'Important commercial law case on agency, shipping and commercial transactions in Nigeria.', 'Commercial Law', 'High'),

-- Evidence Law
('Buhari v INEC', '(2008) 19 NWLR (Pt. 1120) 246', 'Supreme Court of Nigeria', 2008, 'Landmark election petition case establishing the burden and standard of proof in electoral matters in Nigeria.', 'Evidence Law', 'High'),
('Alade v Alic Nigeria Ltd', '(2010) 19 NWLR (Pt. 1226) 111', 'Supreme Court of Nigeria', 2010, 'Key case on documentary evidence and the best evidence rule under Nigerian Evidence Act.', 'Evidence Law', 'Medium')

ON CONFLICT DO NOTHING;