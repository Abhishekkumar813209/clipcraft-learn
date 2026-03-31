

## Plan: Darker Sidebar Colors + AI-Powered Weak Areas Practice

### Change 1: Darker Sidebar Question Palette Colors

**File:** `src/pages/QuizTest.tsx` (lines 137-143)

Current colors are too light (e.g. `bg-yellow-50`, `bg-green-100`). Make them more saturated/darker:

| Status | Current | New |
|--------|---------|-----|
| Not Visited | `bg-yellow-50` | `bg-yellow-200` with darker text/border |
| Not Answered | `bg-red-100` | `bg-red-200` with darker text/border |
| Answered | `bg-green-100` | `bg-green-200` with darker text/border |
| Marked | `bg-orange-100` | `bg-orange-200` with darker text/border |
| Answered & Marked | `bg-teal-100` | `bg-teal-200` with darker text/border |

### Change 2: AI-Enhanced "Practice Weak Areas"

**File:** `src/pages/QuizAnalysis.tsx` — `handlePracticeWeakAreas` function

Current behavior: only copies the exact wrong/unattempted questions into a new quiz.

New behavior:
1. Collect wrong + unattempted questions
2. Identify the weak topics from those questions (extract from question text patterns)
3. Call an edge function that uses AI to generate **additional practice questions** on those same topics
4. Combine: original wrong/unattempted questions + AI-generated new questions on same topics
5. Save combined set as the practice quiz

**New Edge Function:** `supabase/functions/generate-weak-area-questions/index.ts`
- Input: list of weak questions (question text + correct answer + type)
- Uses AI to generate 3-5 additional questions per weak topic area
- Returns new questions in the same format as the quiz system
- Model: `google/gemini-2.5-flash` via Lovable AI gateway

**Flow:**
```text
User clicks "Practice Weak Areas"
  → Collect wrong/unattempted questions
  → Send to edge function with question texts as context
  → AI generates additional similar questions on same topics
  → Merge original weak Qs + new AI Qs
  → Save as new quiz → Navigate to it
```

### Files Modified

| File | Change |
|------|--------|
| `src/pages/QuizTest.tsx` | Darken `statusColors` values (lines 137-143) |
| `src/pages/QuizAnalysis.tsx` | Update `handlePracticeWeakAreas` to call edge function for AI-generated additional questions |
| `supabase/functions/generate-weak-area-questions/index.ts` | New edge function: takes weak questions, generates additional practice questions on same topics using AI |

