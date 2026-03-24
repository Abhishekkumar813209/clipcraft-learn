

## Plan: Increase PDF Page Limit

### Problem
The `MAX_PAGES` constant in `SscVocabUpload.tsx` is set to 200, but the user's PDF has 469 pages.

### Fix
Change `MAX_PAGES` from 200 to 500 in `src/pages/SscVocabUpload.tsx` (line 34).

| File | Change |
|------|--------|
| `src/pages/SscVocabUpload.tsx` | `MAX_PAGES = 200` → `MAX_PAGES = 500` |

Single line change — no other files affected.

