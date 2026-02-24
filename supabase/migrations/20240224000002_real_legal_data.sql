-- Real Legal Data Seeding for Nigeria
-- High-authority cases and detailed syllabus topics

-- 1. Insert Detailed Topics for Contract Law
WITH contract_id AS (SELECT id FROM courses WHERE title = 'Contract Law' LIMIT 1)
INSERT INTO topics (course_id, title, description, content, order_index) VALUES
((SELECT id FROM contract_id), 'Offer and Acceptance', 'The basis of contract formation in Nigerian law.', 'Detailed content about offer and acceptance including leading Nigerian cases...', 1),
((SELECT id FROM contract_id), 'Consideration', 'The "price" paid for a promise.', 'Analysis of consideration with reference to Currry v Misa...', 2),
((SELECT id FROM contract_id), 'Intention to Create Legal Relations', 'Determining if parties meant to be legally bound.', 'Case analysis: Balfour v Balfour...', 3)
ON CONFLICT DO NOTHING;

-- 2. Insert Real Nigerian Cases
INSERT INTO cases (title, citation, court, year, summary, topic, difficulty) VALUES
('Carlill v Carbolic Smoke Ball Co', '[1893] 1 QB 256', 'Court of Appeal (UK - Persuasive in Nigeria)', 1893, 'A landmark case in English contract law that established that an advertisement containing certain terms to get a reward constituted a binding unilateral offer that could be accepted by anyone who performed its terms.', 'Contract Law', 'Medium'),
('Donoghue v Stevenson', '[1932] AC 562', 'House of Lords (UK - Persuasive in Nigeria)', 1932, 'Established the modern concept of negligence and the "neighbor principle".', 'Tort Law', 'Medium'),
('Uwaifo v Uwaifo', '(2013) LPELR-20385(SC)', 'Supreme Court of Nigeria', 2013, 'Dealt with the standard of proof required in proving custom and the effect of judicial notice of custom.', 'Family Law', 'High'),
('Attorney-General of Bendel State v Attorney-General of the Federation', '(1981) 10 SC 1', 'Supreme Court of Nigeria', 1981, 'Landmark case on the supremacy of the constitution and the procedure for passing legislation.', 'Constitutional Law', 'High'),
('Garba v University of Maiduguri', '(1986) 1 NWLR (Pt. 18) 550', 'Supreme Court of Nigeria', 1986, 'Key case on fair hearing and administrative law in Nigeria.', 'Constitutional Law', 'Medium')
ON CONFLICT DO NOTHING;
