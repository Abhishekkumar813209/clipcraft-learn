

## Plan: Add Phase Selection for RBI PYQ Extraction

### Problem
Your RBI PYQ PDFs have Phase 1 and Phase 2 questions mixed together. The AI classifier needs a hint about which phase the current page range belongs to, so it can categorize accurately into the right subset of topics.

### Solution
Add a **Phase selector** (Phase 1 / Phase 2 / Auto-detect) on the upload page. When you select a phase, only that phase's topics are sent to the AI extractor — making classification much more accurate.

- **Phase 1** → sends topics: `english`, `quant`, `reasoning`, `ga`
- **Phase 2** → sends topics: `esi_finance`
- **Auto-detect** → sends all 5 topics (current behavior)

This way you extract pages 1-50 with Phase 1 selected, then pages 51-100 with Phase 2, and questions accumulate correctly with proper topic labels.

### Changes

**1. `src/types/rbi.ts`** — Add helper constants:
```typescript
export const RBI_PHASE1_TOPICS: RbiTopic[] = ['english', 'quant', 'reasoning', 'ga'];
export const RBI_PHASE2_TOPICS: RbiTopic[] = ['esi_finance'];
```

**2. `src/pages/RbiPyqUpload.tsx`**:
- Add `phase` state: `'all' | 'phase1' | 'phase2'` (default `'all'`)
- Add a Phase selector (radio buttons or Select) next to the page range picker
- In `handleExtract`, pick topics based on phase selection and pass to edge function
- Show phase badge on each question in review table
- The review table groups/shows which phase each question belongs to (derived from topic)

### Files

| File | Action |
|------|--------|
| `src/types/rbi.ts` | Add phase topic constants |
| `src/pages/RbiPyqUpload.tsx` | Add phase selector, filter topics sent to AI |

### No edge function changes needed
The `pyq-extract` function already accepts dynamic topics — we just send fewer topics based on phase selection.

