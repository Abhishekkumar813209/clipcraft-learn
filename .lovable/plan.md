

## Plan: Show Each Word in Its Own Row

### Problem
Currently the review table groups all words under a root into a single cell as badges. The user wants each word displayed in its own dedicated row with clear columns.

### Change

**`src/pages/SscVocabUpload.tsx`** — Restructure the review table

Replace the current grouped-by-root table with a flat table where every word gets its own row:

| # | Root | Root Meaning | Word | Actions |
|---|------|-------------|------|---------|
| 1 | AB | Away from | abbreviate | Move / Remove |
| 2 | AB | Away from | abdicate | Move / Remove |
| 3 | ABS | Away | absent | Move / Remove |

- Each word = one row with columns: #, Root, Root Meaning, Word, Actions
- Root rows that share the same root will visually repeat the root (or use a subtle grouping separator)
- Keep the "Move Word" popover and "Remove" button in the Actions column
- Keep the summary badge showing total words/roots count at the top
- Add a root-group header row (optional subtle separator) between different roots for readability

### Files

| File | Change |
|------|--------|
| `src/pages/SscVocabUpload.tsx` | Flatten review table to one-word-per-row layout |

