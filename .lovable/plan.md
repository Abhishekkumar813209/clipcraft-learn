

## Plan: Enhanced UI + Richer Content for Learn Module

### What Changes

Two areas of improvement:

**A. AI Content Enhancements** — Update the edge function prompt and schema to include:
1. **MCQ options with Hindi meanings** — Each option becomes `{ english, hindi }` so users see Hindi alongside English
2. **Error correction with grammar explanation** — Add `explanation` and `explanation_hindi` fields explaining WHY it's wrong and the correct grammar rule
3. **Translation with grammar explanation** — Add `explanation` field explaining the grammar structure used
4. **Fill in the blanks with Hindi meaning** — Add `hindi` field for each fill-blank question

**B. UI Overhaul** — Make the page visually premium:
1. Gradient header with glassmorphism nav bar
2. Colored section headers with icons for each section (Meaning, Synonyms, Sentences, MCQs)
3. MCQ options show Hindi meaning in smaller text below the English option
4. Error correction shows grammar explanation (bilingual) when answer is revealed
5. Translation exercises show grammar explanation when revealed
6. Fill in the blanks show Hindi meaning of the sentence
7. Better card styling with subtle borders, shadows, and section separators

### Files

| File | Change |
|------|--------|
| `supabase/functions/ssc-vocab-learn/index.ts` | Update prompt + schema: add `hindi` to MCQ options, `explanation`/`explanation_hindi` to error_correction, `explanation` to translation, `hindi` to fill_blanks |
| `src/pages/SscVocabLearn.tsx` | Update interfaces, redesign UI with premium styling, render new fields |

### Schema Changes (Edge Function)

```
// MCQ options: string[] → { english: string, hindi: string }[]
// error_correction: add explanation, explanation_hindi
// translation: add explanation
// fill_blanks: add hindi
```

### UI Details

- MCQ option buttons: show English on top, Hindi below in muted smaller text
- Error correction reveal: show corrected sentence + explanation block (English + Hindi) with grammar rule highlighted
- Translation reveal: show English answer + grammar explanation
- Fill in the blanks: show Hindi meaning of the sentence below the English question
- Section headers with colored left borders and icons
- Nav bar with glassmorphism effect
- Word title with gradient underline

Note: Since the schema changes add new fields, cached data won't have them. The UI will gracefully handle missing fields with optional chaining.

