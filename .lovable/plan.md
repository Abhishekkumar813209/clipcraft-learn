

## Plan: Iterative Extraction — Keep State Across Multiple Runs

### Problem
Currently, clicking "Extract" **clears all previously found questions** (line 112: `setQuestions([])`). So if you extract pages 1-50, then want to do 51-100, you lose everything from the first run.

### Fix
Simple but important changes to `RbiPyqUpload.tsx`:

1. **Don't clear questions on new extraction** — append new questions to existing ones instead of resetting
2. **Load all pages from PDF** (up to 200) into memory for text extraction, but keep the page range selector so you extract in chunks of your choice (e.g. 1-50, then 51-100)
3. **Show cumulative count** — "42 questions total (18 new from this batch)"
4. **Add "Clear All" button** — explicit action to reset, not automatic
5. **Review screen shows all accumulated questions** — from all extraction runs combined

### What Changes

**`src/pages/RbiPyqUpload.tsx`**
- Remove `maxPages = Math.min(totalPages, 50)` — load all pages (up to 200) for text reading
- In `handleExtract`: instead of `setQuestions([])`, append to existing: `setQuestions(prev => [...prev, ...newQuestions])`
- Don't reset `questionsFoundSoFar` to 0 — track cumulative total
- Add a "Clear Questions" button that explicitly resets
- After extraction, auto-update startPage/endPage to suggest the next range (e.g. after 1-50, suggest 51-100)
- Keep the 50-page-per-extraction range limit as a soft guide (warn if range > 50)

### Flow
```text
Upload 100-page PDF → All 100 pages loaded in memory
  → Set range 1-50 → Extract → 25 questions found
  → Set range 51-100 → Extract → 20 questions appended → 45 total
  → Review all 45 questions → Save
```

### Also Make Edge Function Generalized
Create `supabase/functions/pyq-extract/index.ts` that accepts `exam` and `topics` params, so both RBI and BPSC (and future exams) use one function. Update `RbiPyqUpload` and `BpscPyqUpload` to call it.

### Files

| File | Action |
|------|--------|
| `src/pages/RbiPyqUpload.tsx` | Edit — append mode, remove 50-page load cap, next-range suggestion |
| `src/pages/BpscPyqUpload.tsx` | Edit — same append mode + use generalized function |
| `supabase/functions/pyq-extract/index.ts` | Create — generalized extractor accepting exam + topics |
| `supabase/config.toml` | Edit — add pyq-extract config |

