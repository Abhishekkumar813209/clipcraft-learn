

## Plan: Split Phase 2 into 3 Separate Subjects

### Problem
Phase 2 currently has only one combined topic `esi_finance`. But RBI Grade B Phase 2 actually has **3 subjects**: ESI, Finance & Management, and English. These need separate categorization.

### New Topic Structure

**Phase 1 (4 subjects):** English, Quant, Reasoning, GA
**Phase 2 (3 subjects):** ESI, Finance & Management, English

Note: English appears in both phases — they're different papers. We'll use `english_p2` for Phase 2 English to distinguish.

**Updated `RBI_ALL_TOPICS`:**
```
english, quant, reasoning, ga, esi, fm, english_p2
```

### Changes

**1. `src/types/rbi.ts`**
- Replace `esi_finance` with `esi`, `fm`, `english_p2`
- Update `RBI_ALL_TOPICS` to 7 topics
- `RBI_PHASE1_TOPICS = ['english', 'quant', 'reasoning', 'ga']`
- `RBI_PHASE2_TOPICS = ['esi', 'fm', 'english_p2']`
- Update `RBI_TOPIC_META` with proper labels:
  - `esi` → "Economic & Social Issues" (Phase 2)
  - `fm` → "Finance & Management" (Phase 2)
  - `english_p2` → "English (Phase 2)" (Phase 2)

**2. `src/pages/RbiPyqUpload.tsx`**
- Phase 2 radio label updated to show "ESI, FM, English"
- Topic reassignment dropdown now shows all 7 topics

**3. `src/pages/RbiPractice.tsx`** — Show 7 topic cards grouped by phase

**4. `src/pages/RbiPyqPractice.tsx`** — Update filters for 7 topics

**5. `src/pages/RbiPyqAnalysis.tsx`** — Update charts for 7 topics

**6. `src/hooks/useRbiQuestions.ts` & `src/hooks/useRbiProgress.ts`** — Updated topic references

### Files

| File | Action |
|------|--------|
| `src/types/rbi.ts` | Rewrite — 7 topics, phase groupings |
| `src/pages/RbiPyqUpload.tsx` | Edit — phase 2 label, topic dropdown |
| `src/pages/RbiPractice.tsx` | Edit — 7 topic cards with phase sections |
| `src/pages/RbiPyqPractice.tsx` | Edit — updated filters |
| `src/pages/RbiPyqAnalysis.tsx` | Edit — updated charts |
| `src/hooks/useRbiQuestions.ts` | Edit — topic list |
| `src/hooks/useRbiProgress.ts` | Edit — topic list |
| `src/pages/RbiDashboard.tsx` | Edit — updated topic references |

