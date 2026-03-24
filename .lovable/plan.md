

## Plan: Fix Root-Word Mixing in Vocabulary Extraction

### Problem
When 5 pages are sent together, the AI sometimes assigns words to the wrong root. Additionally, the deduplication logic strips words from later entries even if they belong to different roots. Looking at image 1 (extracted) vs image 2 (original PDF), words like "abbreviate" and "abdicate" appear under root "abs" when they should be under "ab".

### Root Causes
1. **Batch size too large** — 5 pages of dense vocabulary tables overwhelm the AI's ability to maintain root boundaries
2. **Flat deduplication** — the global `seenWords` set removes a word from its correct root if it appeared earlier under a wrong root
3. **Weak prompt** — no instruction to strictly match words to the root shown in the same table row

### Changes

**1. `supabase/functions/ssc-vocab-extract/index.ts`** — Strengthen the system prompt

Add explicit instructions:
- "Each word MUST only be assigned to the root it appears next to in the original table/list. Do NOT infer roots from word prefixes."
- "If a word appears in a row with root AB, it goes under AB — even if the word also starts with ABS."
- "Preserve the exact grouping from the source material."

Also reduce model to `google/gemini-2.5-pro` for better accuracy on structured table parsing.

**2. `src/pages/SscVocabUpload.tsx`** — Fix merge logic + add root-level editing

- **Reduce BATCH_SIZE from 5 to 2** — smaller batches = less mixing
- **Smart merge by root**: Instead of flat dedup, merge entries with the same root name together, combining their word lists
- **Add "Move Word" capability in review**: clicking a word shows a dropdown of existing roots to reassign it to — lets user fix any remaining mistakes before saving

### Files

| File | Action |
|------|--------|
| `supabase/functions/ssc-vocab-extract/index.ts` | Stronger prompt + better model |
| `src/pages/SscVocabUpload.tsx` | Reduce batch size, smart merge by root, add move-word UI |

