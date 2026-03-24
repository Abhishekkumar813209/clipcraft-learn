

## Plan: Add "Learn Root" Feature — AI-Enriched Vocabulary Learning Module

### What It Does
When a user clicks on a root card on the `/ssc/vocab` page, they navigate to a dedicated learning page (`/ssc/vocab/learn/:root`) that calls an AI edge function to generate a full learning module: Hinglish meanings, synonyms, antonyms, one-word substitutions, example sentences with Hindi translations, MCQs, and root-level exercises.

### Changes

**1. New Edge Function: `supabase/functions/ssc-vocab-learn/index.ts`**

- Accepts `{ root, root_meaning, words: [{ word, meaning }] }` from the client
- Uses the user's prompt (the one shared in the message) as the system prompt
- Calls Lovable AI (`google/gemini-2.5-pro`) with tool-calling to return structured JSON matching the schema provided
- Returns the enriched learning module JSON

**2. New Page: `src/pages/SscVocabLearn.tsx`**

- Route: `/ssc/vocab/learn/:root`
- On mount, fetches the words for that root from the database, then calls the edge function
- Renders the AI response in organized, scrollable sections:
  - **Word cards** — each word expandable with: Hinglish meaning, synonyms, antonyms, one-word substitution, 3 sentences (with Hindi + grammar insight)
  - **MCQ section** — interactive quiz per word (synonym, antonym, fill-blank, error detection) with answer reveal
  - **Root exercises** — fill blanks, Hindi→English translation, error correction, one-word substitution questions
- Shows a loading skeleton while AI generates
- Caches the generated module in component state (no DB persistence for now — regenerate on revisit)

**3. Update `src/pages/SscVocab.tsx`**

- Make each root card clickable → navigates to `/ssc/vocab/learn/${root}`
- Add a small "Learn" button/icon on each card

**4. Update `src/App.tsx`**

- Add route: `/ssc/vocab/learn/:root` → `SscVocabLearn`

### Files

| File | Action |
|------|--------|
| `supabase/functions/ssc-vocab-learn/index.ts` | New — AI enrichment edge function |
| `src/pages/SscVocabLearn.tsx` | New — learning module page |
| `src/pages/SscVocab.tsx` | Update — make root cards clickable |
| `src/App.tsx` | Update — add route |

