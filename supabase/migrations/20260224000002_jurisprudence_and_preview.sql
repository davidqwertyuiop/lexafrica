-- Jurisprudence cases and preview content for non-authenticated users
-- This migration adds: Jurisprudence cases, and marks some cases as "preview" (visible without login)

ALTER TABLE cases ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false;

-- Insert Jurisprudence cases
INSERT INTO cases (title, citation, court, year, topic, law_category, jurisdiction, difficulty, is_preview, excerpt, content, tags) VALUES
(
    'R v R (Marital Rape)',
    '[1991] 4 All ER 481',
    'House of Lords',
    1991,
    'Law and Morality',
    'Jurisprudence',
    'UK (Applied in Nigeria)',
    'advanced',
    true,
    'Historic case where the House of Lords abolished the marital rape immunity — a judge-made rule that stated a husband could not rape his wife. Demonstrates how law evolves with changing moral standards.',
    'Lord Keith held that the common law of England was capable of evolving in the light of changing social, economic and cultural developments. The historic fiction that a wife had given irrevocable consent to intercourse on marriage was outmoded. This case is central to jurisprudential debates about: (1) Whether judges make law or merely declare it; (2) The relationship between law and morality; (3) Natural law vs Legal positivism — positivists like Austin and Hart would see this as judges creating new law, while natural lawyers would say the court was recognizing pre-existing moral truth. R v R is frequently cited in discussions of HLA Hart vs Lon Fuller debate on law and morality.',
    ARRAY['Jurisprudence', 'Law and Morality', 'Judicial Law-Making', 'Natural Law', 'Legal Positivism']
),
(
    'Riggs v Palmer',
    '115 NY 506 (1889)',
    'Court of Appeals of New York',
    1889,
    'Principles and Rules',
    'Jurisprudence',
    'USA (Academic)',
    'advanced',
    true,
    'The grandson who murdered his grandfather to inherit his estate — can he still inherit? Dworkin used this case in his famous critique of Hart''s legal positivism to argue that law includes moral principles, not just rules.',
    'Elmer Palmer murdered his grandfather to prevent him from changing his will. The Court held he could not inherit, relying on the principle "no man should profit from his own wrong". Ronald Dworkin used Riggs v Palmer in "Taking Rights Seriously" (1977) to argue against H.L.A. Hart''s positivist thesis. Dworkin argued that when a hard case arises, judges do not exercise discretion — they look to legal PRINCIPLES (moral standards embedded in law) as well as rules. Hart argues the law consists of primary and secondary rules. Dworkin counters that law also includes principles with a "dimension of weight" not found in rules. This debate is central to Nigerian jurisprudence courses.',
    ARRAY['Jurisprudence', 'Dworkin', 'Hart', 'Principles vs Rules', 'Legal Positivism']
),
(
    'Donoghue v Stevenson (Jurisprudential Reading)',
    '[1932] AC 562 (Jurisprudence)',
    'House of Lords',
    1932,
    'Judicial Reasoning',
    'Jurisprudence',
    'UK (Applied in Nigeria)',
    'intermediate',
    true,
    'Studied not just for negligence but as a jurisprudential landmark — Lord Atkin''s neighbour principle illustrates natural law reasoning and has been analysed by Dworkin as an example of principled judicial decision-making.',
    'From a jurisprudential lens, Donoghue v Stevenson illustrates: (1) NATURAL LAW — Lord Atkin''s neighbour principle ("love thy neighbour") draws on Christian ethics and natural moral reasoning; (2) JUDICIAL LAW-MAKING — the House of Lords effectively created a new tort of negligence through judicial decision; (3) DWORKIN''S RIGHTS THESIS — Mrs Donoghue had a pre-existing right that the court enforced, not a new right created by judicial discretion; (4) LEGAL REALISM — American Realists would see this as a judge choosing an outcome and constructing reasoning to support it. The case is a touchstone for jurisprudence students to apply competing theories of law.',
    ARRAY['Jurisprudence', 'Natural Law', 'Legal Positivism', 'Judicial Reasoning', 'Dworkin']
),
(
    'Fisher v Bell',
    '[1961] 1 QB 394',
    'Queen''s Bench Division',
    1961,
    'Statutory Interpretation',
    'Jurisprudence',
    'UK (Applied in Nigeria)',
    'intermediate',
    true,
    'A flick-knife displayed in a shop window with a price tag — is this an "offer" to sell an offensive weapon? A classic case on the literal rule of statutory interpretation and its sometimes absurd results.',
    'The Restriction of Offensive Weapons Act 1959 made it an offence to "offer for sale" a flick-knife. The defendant displayed one in his shop window with a price tag. The court applied the LITERAL RULE of statutory interpretation and held this was not an "offer" in the contractual sense — a shop display is an invitation to treat. Result: the defendant was acquitted despite the obvious legislative intent. This case perfectly illustrates: (1) The conflict between the LITERAL RULE and the MISCHIEF RULE of statutory interpretation; (2) How Hart''s rule of recognition operates — judges must apply the law as enacted, even if the result is absurd; (3) The case for parliamentary supremacy vs judicial activism in Nigerian constitutional law.',
    ARRAY['Jurisprudence', 'Statutory Interpretation', 'Literal Rule', 'Mischief Rule', 'Hart']
),
(
    'R v Dudley and Stephens',
    '(1884) 14 QBD 273',
    'Queen''s Bench Division',
    1884,
    'Law and Morality',
    'Jurisprudence',
    'UK (Academic)',
    'advanced',
    true,
    'Survivors of a shipwreck killed and ate a cabin boy to survive. Were they guilty of murder? The case explores the limits of necessity as a defence and the relationship between law, morality, and survival.',
    'Three shipwrecked sailors killed and ate a cabin boy after 20 days adrift. They were charged with murder. The Queen''s Bench Division held that necessity could not be a defence to murder. This case is fundamental to Nigerian jurisprudence for: (1) LAW vs MORALITY — Most people morally understand the survivors'' dilemma, yet the law condemned them; (2) NATURAL LAW — Would Aquinas or Fuller say a positive law that condemns a starving man for survival is not really law? (3) UTILITARIAN ANALYSIS — Bentham would calculate: 3 lives saved vs 1 lost = utility maximised; (4) HART-FULLER DEBATE — Fuller argued that an unjust law is not law at all (Radbruch formula); Hart said the law is what it is, even if unjust.',
    ARRAY['Jurisprudence', 'Law and Morality', 'Necessity', 'Natural Law', 'Hart-Fuller Debate', 'Utilitarianism']
)
ON CONFLICT (citation) DO NOTHING;

-- Mark some foundational cases as preview (visible without login)
UPDATE cases SET is_preview = true WHERE citation IN (
    'CFRN 1999 (as amended)',
    '[1932] AC 562',
    '[1893] 1 QB 256',
    '[1962] 1 WNLR 177'
);