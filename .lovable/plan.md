

## Plan: Simplify RBI Topic Classification to 5 Broad Subjects

### Problem
The AI extractor is classifying questions into 30+ granular sub-topics (e.g., `idioms_phrases`, `profit_loss`, `syllogism`). This makes categorization unreliable — the AI often misclassifies at that granularity. You want just **5 broad subjects**:

1. **English** — All English language questions
2. **Quant** — Maths / Quantitative Aptitude
3. **Reasoning** — Logical Reasoning
4. **GA** — General Awareness
5. **ESI & FM** — Economic & Social Issues, Finance & Management

### Changes

**1. `src/types/rbi.ts`** — Simplify `RBI_ALL_TOPICS` to just 5 values: `english`, `quant`, `reasoning`, `ga`, `esi_finance`. Update `RBI_TOPIC_META` to have 5 entries. Remove the old granular topic list and `RBI_SUBJECT_TOPICS` mapping (subjects = topics now).

**2. `src/pages/RbiPyqUpload.tsx`** — Pass the 5 simplified topics to `pyq-extract`. The AI will now classify each question into one of 5 buckets — much more accurate. Topic reassignment dropdown shows 5 options.

**3. `src/pages/RbiPractice.tsx`** — Remove the subject→topic two-level navigation. Show 5 topic cards directly (each is now a broad subject).

**4. `src/pages/RbiPyqPractice.tsx`** — Update topic filter to use 5 simplified topics.

**5. `src/pages/RbiPyqAnalysis.tsx`** — Update charts to use 5 topics. Remove subject-level grouping (redundant now).

**6. `src/pages/RbiPyqSession.tsx`** — Update topic references.

**7. `src/hooks/useRbiQuestions.ts` & `src/hooks/useRbiProgress.ts`** — Update topic list references.

### No DB Changes
The `ssc_questions.topic` column stores text — old granular values will still exist in DB but new extractions will use the 5 broad topics. Existing questions with old topics won't break (they just won't match the new 5-topic filter — negligible since you're re-extracting anyway).

### Files

| File | Action |
|------|--------|
| `src/types/rbi.ts` | Rewrite — 5 broad topics only |
| `src/pages/RbiPyqUpload.tsx` | Edit — pass 5 topics to extractor |
| `src/pages/RbiPractice.tsx` | Edit — flat 5-card layout |
| `src/pages/RbiPyqPractice.tsx` | Edit — simplified filters |
| `src/pages/RbiPyqAnalysis.tsx` | Edit — 5-topic charts |
| `src/pages/RbiPyqSession.tsx` | Edit — topic references |
| `src/hooks/useRbiQuestions.ts` | Edit — topic list |
| `src/hooks/useRbiProgress.ts` | Edit — topic list |

