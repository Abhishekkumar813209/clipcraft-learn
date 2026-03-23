

## Plan: Subject-wise Phase 2 Extraction + Answer Key Mapping

### Problem
1. Phase 2 English questions have long passages (3+ pages) that get lost in mixed extraction
2. No way to extract subject-by-subject within Phase 2
3. Answer keys at the end of PDF are not being used to map correct answers

### Changes

**1. `src/pages/RbiPyqUpload.tsx`** — Replace Phase radio with granular subject selector

Current: `Auto-detect | Phase 1 | Phase 2`

New options:
- `Auto-detect` — sends all topics
- `Phase 1 (All)` — sends english, quant, reasoning, ga
- `Phase 2 - ESI` — sends only `esi`
- `Phase 2 - FM` — sends only `fm`
- `Phase 2 - English` — sends only `english_p2`

This way user extracts ESI pages separately, FM pages separately, and English pages separately — smaller batches = better passage handling.

Also add an **Answer Key Page** input field:
- Optional number input: "Answer Key starts at page"
- When provided, the answer key page text is sent along with the extraction request so AI can cross-reference correct answers
- The answer key text is appended to each batch with a label like `\n--- ANSWER KEY ---\n{answerKeyText}`

**2. `supabase/functions/pyq-extract/index.ts`** — Accept optional `answerKeyText` parameter

- Add to system prompt: "If an ANSWER KEY section is provided at the end, use it to verify/set the correct_option for each question. Match question numbers from the paper to the answer key."
- Pass `answerKeyText` from request body and append to the user message if present

### Files

| File | Action |
|------|--------|
| `src/pages/RbiPyqUpload.tsx` | Replace phase radio with 5 subject-level options + answer key page input |
| `supabase/functions/pyq-extract/index.ts` | Accept `answerKeyText`, add answer key matching instruction to prompt |

