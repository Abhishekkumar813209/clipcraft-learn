

## Plan: Add Aptitude & Reasoning Topics for BPSC + Re-categorize 2024 Questions

### Problem
BPSC PYQ practice currently only has 9 General Studies topics. The 2024 uploaded questions include aptitude and reasoning questions that got miscategorized under `general_science` (38 questions). Questions like direction problems, coding-decoding, calendar problems, and mathematical operations are clearly aptitude/reasoning, not general science.

### Solution

**1. Add new BPSC topics to the database enum**
Add two new enum values to `ssc_topic`:
- `aptitude_bpsc` — for quantitative aptitude questions
- `reasoning_bpsc` — for logical reasoning questions

**2. Update `src/types/bpsc.ts`**
- Add `aptitude_bpsc` and `reasoning_bpsc` to `BPSC_ALL_TOPICS`
- Add their metadata labels/icons (e.g., "Aptitude" 🧮, "Reasoning" 🧠)
- Add them to `BPSC_SUBJECT_TOPICS`

**3. Update the edge function `bpsc-pyq-extract/index.ts`**
- Add the two new topics to `BPSC_TOPICS` array so future extractions classify correctly

**4. Re-categorize existing 2024 questions**
- Use AI to scan the 38 `general_science` questions from 2024 and identify which ones are actually aptitude or reasoning
- Update their `topic` field in the database accordingly
- I'll do this by reading the questions and manually updating them via SQL based on question content patterns (direction problems → reasoning, math operator swaps → aptitude, etc.)

### Changes Summary
- **Migration**: Add `aptitude_bpsc`, `reasoning_bpsc` to `ssc_topic` enum
- **`src/types/bpsc.ts`**: Add new topics + metadata
- **`supabase/functions/bpsc-pyq-extract/index.ts`**: Add new topics to classification list
- **Data update**: Re-categorize misclassified 2024 questions

