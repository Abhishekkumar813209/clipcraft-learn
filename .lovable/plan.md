## Plan: Black Book Vocabulary (4619 words) as static data source

### 1. Bundle the JSON
- Copy `black_book_vocabulary.json` (~1.2 MB) into `src/data/vocabularyData.json`.
- Create `src/data/vocabulary.ts` that:
  - Imports the JSON (Vite handles JSON imports natively, no extra deps).
  - Exports a typed `VocabularyWord` interface (`id, word, meaning, synonyms, section, subsection, is_top500, ssc_frequency`).
  - Exports `VOCABULARY: VocabularyWord[]` and `SECTIONS` metadata derived from `meta.sections`.
  - Exports helpers: `getBySection(section, subsection?)`, `getTop500()`, `searchWords(query)`, `sortByFrequency(list)`.

### 2. Rewrite `src/pages/SscVocab.tsx` (the listing page)
Replace the Supabase-backed grouped-by-root view with a section-driven browser:
- **Left sidebar (or top tabs on mobile)** listing sections with counts from `meta.sections`:
  - All Words (4619)
  - OWS → Top 500 (511) / All OWS (2746)
  - Hindu Vocab (992)
  - Phobia (182) / Mania (141) / Phile (47)
  - A "⭐ Top 500 only" toggle.
- **Main panel**: search box (existing UI), A–Z letter filter (existing), plus a "Sort by: SSC frequency / Alphabetical" selector. Default sort = SSC frequency ascending (most-asked first), then alphabetical for words without a rank.
- **Word cards** (grid, ~3 cols on desktop):
  - Word title.
  - ⭐ star badge when `is_top500 === true`.
  - `#<ssc_frequency>` chip when present (tooltip: "SSC frequency rank — lower means asked more often").
  - Meaning text (line-clamped to 3 lines).
  - Subsection label as a small muted tag.
  - Click → opens existing Learn flow for that single word.
- Pagination or windowed list (render 60 at a time + "Load more") so 4619 cards stay smooth.
- Remove the "Upload PDF" button and the `ssc_vocabulary` Supabase query from this page.

### 3. Update the Learn flow
- `SscVocabLearn` is currently keyed by `root` (Supabase grouping). Switch its route to `/ssc/vocab/learn/:wordId` and look the word up in the static `VOCABULARY` array by id.
- It then calls the existing `ssc-vocab-learn` edge function with just `{ word, meaning }` to generate the AI module (no schema change to the function).
- Keep MCQ + exercise UX as-is; just drive the input from the static word instead of a Supabase row.

### 4. Quiz system
- Add `src/pages/SscVocabQuiz.tsx` (linked from a "Quiz" button in the section sidebar) that:
  - Lets the user pick a section/subsection and "Top 500 only" toggle.
  - Pulls N (10/20/50) random words from the filtered list.
  - For each question: shows the word, 4 options (correct meaning + 3 random meanings from other words in the same section), tracks score, shows ⭐/`#rank` on the result screen.
  - 100% client-side using the static data — no edge-function calls, so no API quota burn.

### 5. Minor cleanup
- Leave the existing `ssc_vocabulary` Supabase table and `SscVocabUpload` page untouched (still works for user-uploaded PDFs), but the default SSC Vocab landing page becomes the Black Book browser.
- Add a small "Static — 4619 words" indicator in the header so it is obvious this list is bundled.

### Files touched
- new: `src/data/vocabularyData.json`, `src/data/vocabulary.ts`, `src/pages/SscVocabQuiz.tsx`
- edited: `src/pages/SscVocab.tsx`, `src/pages/SscVocabLearn.tsx`, `src/App.tsx` (route for `/ssc/vocab/learn/:wordId` and `/ssc/vocab/quiz`)
- no DB migrations, no edge-function changes, no new dependencies

### Out of scope (ask if you want it)
- Persisting per-user "learned / mastered / starred" state for Black Book words (would need a small Supabase table).
- Spaced-repetition scheduling on top of the static list.
