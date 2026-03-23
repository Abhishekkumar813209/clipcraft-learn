

## Plan: Add Phase Filter to PYQ Practice & Analysis

### Current State
- **Phase is NOT stored** as a separate column in the database. It's derived from the topic (e.g., `english`/`quant`/`reasoning`/`ga` = Phase 1, `esi`/`fm`/`english_p2` = Phase 2).
- This derivation is already defined in `RBI_TOPIC_META` (each topic has a `phase` field) and `RBI_PHASE1_TOPICS` / `RBI_PHASE2_TOPICS` constants.
- **No DB change needed** — phase can be filtered client-side using the topic→phase mapping.

### Changes

**1. `src/pages/RbiPyqPractice.tsx`** — Add Phase filter
- Add a `phase` URL param (`all` / `phase1` / `phase2`)
- Filter questions by phase before computing topic counts
- Show phase filter dropdown alongside existing Subject and Year filters
- Topic cards only show topics belonging to selected phase

**2. `src/pages/RbiPyqAnalysis.tsx`** — Add Phase + Year + Subject filters
- Add filter bar at top with: Phase (All/Phase 1/Phase 2), Subject dropdown, Year dropdown
- Filter all chart data through these filters
- Charts update reactively based on selection

### No migration needed
Phase is derivable from topic via `RBI_PHASE1_TOPICS` / `RBI_PHASE2_TOPICS`. No new column required.

### Files

| File | Action |
|------|--------|
| `src/pages/RbiPyqPractice.tsx` | Add phase filter to URL params and filtering logic |
| `src/pages/RbiPyqAnalysis.tsx` | Add phase, subject, year filter bar above charts |

