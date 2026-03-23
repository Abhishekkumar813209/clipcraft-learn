

## Plan: Include Question Directions in Extraction

### Problem
In competitive exam papers, many questions have a shared "Direction" or passage (e.g., "Read the following passage and answer Q1-5" or "Direction: Select the correctly spelt word"). The AI extractor currently ignores these and only captures the bare question, losing important context.

### Fix
Update the `pyq-extract` edge function's system prompt to instruct the AI to **prepend the relevant direction/passage to each question's `question_text`**. This way, when practicing, the student sees the full context.

### Changes

**`supabase/functions/pyq-extract/index.ts`** — Add rules to the system prompt:
- "If a question has a Direction, instruction, or passage that applies to it, prepend it to the question_text separated by a newline. E.g.: `Direction: Choose the synonym of the underlined word.\n\nThe word 'benevolent' means...`"
- "For reading comprehension, include the passage text before the question"
- "Multiple questions sharing the same direction should each have it prepended individually"

### Files

| File | Action |
|------|--------|
| `supabase/functions/pyq-extract/index.ts` | Edit — update system prompt to capture directions |

No frontend changes needed — the `question_text` field already renders with `whitespace-pre-wrap` in the practice session, so newlines will display correctly.

