

## Plan: Fix Build Errors + Add Counter-Argument Suggestions

### Problem
The `gdTopics.ts` file has unescaped apostrophes inside single-quoted strings (e.g., `who's`, `India's`), causing 100+ TypeScript parse errors. This breaks the entire build, which is why `/gd` shows 404 and the sidebar link doesn't work (the app can't compile at all).

### Fix

**1. Rewrite `src/data/gdTopics.ts`**
- Keep all 50 topics intact
- Switch all string literals to double quotes to avoid apostrophe escaping issues
- This fixes all build errors at once

**2. Update `supabase/functions/gd-feedback/index.ts` — add counter-arguments to AI prompt**
- Expand the JSON response schema to include a new `counterArguments` array
- Each item has: `argument` (what opponent might say), `response` (how to counter it)
- Increase `maxOutputTokens` from 1500 to 2000 to accommodate extra content

**3. Update `src/pages/GdPrep.tsx` — display counter-arguments**
- Add a new card in `FeedbackDisplay` after "Areas to Improve" showing counter-arguments
- Each counter-argument shows the opponent's likely point and a suggested rebuttal
- Styled with a distinct color (purple/violet) to differentiate from other feedback sections

### Files Modified
- `src/data/gdTopics.ts` — rewrite with double quotes (fixes build)
- `supabase/functions/gd-feedback/index.ts` — add `counterArguments` to prompt schema
- `src/pages/GdPrep.tsx` — render counter-arguments in feedback display

