

## Plan: Add 200 PYQs — One Word Substitution + Synonyms & Antonyms

### What
Seed 100 One Word Substitution and 100 Synonyms & Antonyms actual SSC PYQs into the database using the existing `seed-ssc-questions` edge function.

### How
Two sequential calls to the already-deployed edge function:

1. **Call 1**: `topic: "one_word_substitution"`, 100 questions — SSC CGL/CHSL/MTS PYQs (2016-2024) with `is_pyq: true`, exam tags, year tags, difficulty spread, explanations.

2. **Call 2**: `topic: "synonyms_antonyms"`, 100 questions — same metadata structure.

No code changes needed. The edge function already handles delete-then-insert for each topic. Both topic values already exist in the `ssc_topic` enum.

### Content Coverage

**One Word Substitution** — e.g., Ambidextrous, Autobiography, Bibliophile, Cacophony, Epitaph, Genocide, Misogynist, Omnivore, Philanthropist, etc.

**Synonyms & Antonyms** — e.g., Abandon/Forsake, Benevolent/Malevolent, Candid/Secretive, Diligent/Lazy, Ephemeral/Permanent, etc.

Each question: 4 options, correct index, explanation, difficulty (easy/medium/hard), exam (CGL/CHSL/MTS), year (2016-2024).

### Files Changed
None — only edge function invocations to seed data.

