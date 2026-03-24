

## Plan: Add Word Definition Column

### Problem
The review table shows Root, Root Meaning, and Word — but no **definition/meaning** for each word. The `ssc_vocabulary` table already has a `meaning` column, but the AI extraction doesn't produce word definitions.

### Changes

**1. `supabase/functions/ssc-vocab-extract/index.ts`** — Extract word definitions

- Update the function schema to return words as objects `{ word, meaning }` instead of plain strings
- Add prompt instruction: "For each word, provide a brief 3-8 word English definition/meaning"
- Update the `words` array schema from `items: { type: "string" }` to objects with `word` and `meaning` properties

**2. `src/pages/SscVocabUpload.tsx`** — Show definition column + update data model

- Update `VocabEntry` interface: change `words: string[]` to `words: { word: string; meaning: string }[]`
- Add a **Definition** column between Word and Actions in the review table
- Update merge logic, move-word logic, and save logic to handle the new structure
- Make definitions editable (inline text input) so users can correct AI-generated meanings before saving

### Files

| File | Change |
|------|--------|
| `supabase/functions/ssc-vocab-extract/index.ts` | Return `{word, meaning}` objects + prompt update |
| `src/pages/SscVocabUpload.tsx` | Add Definition column, update data model, editable definitions |

