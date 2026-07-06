# English Root Words Module (SSC)

Add the uploaded root-words dataset to the backend and build a browse + practice experience inside the SSC segment, mirroring the OWS / Synonyms style already in use.

## 1. Data & Backend

- Create table `ssc_root_words` with fields: `root`, `root_meaning`, `word`, `root_plus_word`, `definition`, `hinglish_meaning`, `example`, `synonym`, `antonym`, `sno` (group id from CSV).
- Grants + RLS: publicly readable (SELECT to `anon`, `authenticated`); writes to `service_role` only.
- Seed all ~4,341 rows from `English_Root_Words_350-469_Improved.csv` via an insert step after the migration.

## 2. Sidebar entry

- Add "English Vocabulary" item in `src/pages/SscLayout.tsx` (icon: `Sprout` or `Languages`) → route `/ssc/roots`.

## 3. Browse view (`/ssc/roots`)

- Groups words by `root`. Search bar (root / word / meaning), letter filter.
- Each root shown as a card header ("Ab — Off, Away From, Apart") expanding into child word cards styled like the existing One-Word-Substitution cards: word, definition, Hinglish meaning, example, synonyms/antonyms chips.

## 4. Practice mode (`/ssc/roots/practice`)

- Session = **30 root words** picked at random (each with all its child words available for question generation).
- 20-question quiz set drawn from those roots' words, same UX as Black Book practice:
  - Prev/Next navigation, running score, review screen at end.
  - Question types (mixed):
    1. "Meaning of *word*?" — 4 definition options.
    2. "Which word belongs to root *X (meaning …)*?" — 4 word options.
    3. "Synonym of *word*?" — when a synonym exists in the row.
- Distractors pulled from other words in the dataset (prefer same root group when possible).
- Persist attempts to a new `root_practice_sessions` / `root_practice_attempts` pair (same shape as `bb_practice_*`) so history/weak-word tracking can be added later.

## 5. Routing

- Register `/ssc/roots` and `/ssc/roots/practice` in `src/App.tsx` under the existing SSC layout.

## Technical notes

- CSV parsed server-side in the seed step (chunked inserts of ~500 rows) to stay under statement limits.
- Reuse `BlackBookPractice` UI patterns (`Card`, colour classes, review screen) for consistency — new files: `src/pages/SscRoots.tsx`, `src/pages/SscRootsPractice.tsx`, `src/lib/rootWordsQuiz.ts`.
- No changes to existing Black Book flow.
