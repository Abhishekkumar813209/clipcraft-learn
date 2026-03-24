

## Plan: Progressive Word Loading + DB Caching for Learn Module

### What Changes

Three key improvements to the Learn Root feature:

1. **Per-word AI generation** — Instead of generating all words at once, the edge function accepts a single word and returns its module. The frontend loads the first word immediately, then background-fetches the rest one by one.

2. **DB caching** — Create a `ssc_vocab_learn_cache` table to store AI-generated content per word. On revisit, load from cache instantly (no AI call). 

3. **Next/Prev navigation** — Add word navigation buttons at the top so users can flip between words without scrolling through all cards.

### Database

New table: `ssc_vocab_learn_cache`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | |
| user_id | uuid (FK auth.users) | |
| root | text | Root word |
| word | text | The vocabulary word |
| module_data | jsonb | Full AI-generated word module (meaning, synonyms, sentences, mcqs) |
| exercises_data | jsonb | Root-level exercises (stored once per root, on first word) |
| created_at | timestamptz | |

Unique constraint on `(user_id, word)`. RLS: users can only read/write their own rows.

### Edge Function (`ssc-vocab-learn`)

- Change to accept a **single word** instead of all words: `{ root, root_meaning, word, meaning }`
- Generate module for just that one word + root exercises
- Return the single word's module data
- Keeps same AI prompt structure but scoped to one word

### Frontend (`SscVocabLearn.tsx`)

- **State**: Track `wordModules: Record<string, WordModule>`, `currentWordIdx`, `wordList` (from DB), `exercisesData`, loading states per word
- **Flow on mount**:
  1. Fetch word list from `ssc_vocabulary` for this root
  2. Check `ssc_vocab_learn_cache` for any cached modules
  3. If first word is cached → show immediately. If not → call edge function for first word only
  4. After first word loads, start background-fetching remaining uncached words one by one
  5. Save each AI response to `ssc_vocab_learn_cache`
- **Navigation**: Show Prev/Next buttons at the top with word name + loading indicator
- **Single word view**: Show only the current word's card (expanded), not all cards at once
- Root exercises shown below the current word (available once generated)

### Files

| File | Action |
|------|--------|
| Migration SQL | New `ssc_vocab_learn_cache` table with RLS |
| `supabase/functions/ssc-vocab-learn/index.ts` | Refactor to single-word generation |
| `src/pages/SscVocabLearn.tsx` | Progressive loading, navigation, DB cache read/write |

