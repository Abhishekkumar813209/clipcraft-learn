

## Plan: Partial Submit + Weak Area Quiz Generator

### What Changes

**1. Allow partial submission (`PdfQuizPanel.tsx`)**
- Remove the `isAllAnswered` gate — submit button always enabled
- Unanswered questions are sent with `userAnswer: ""` (or `"(skipped)"`)
- Update the prompt to the AI checker to explicitly identify skipped/unanswered questions as **weak areas** in the feedback

**2. Show "Practice Weak Areas" button after results (`PdfQuizPanel.tsx`)**
- After feedback is shown, parse which questions were skipped or wrong
- Display a "Practice Weak Areas" button below feedback
- On click, open a config dialog (reusing existing quiz popover pattern) with:
  - Number of questions (3 / 5 / 10 / custom)
  - Question types (MCQ, T/F, Fill, Multi, Short — checkboxes)
- On generate, call the **same** `pdf-chat` edge function with `action: 'quiz'` but pass the weak question texts as extra context so the AI generates new questions on those specific topics

**3. Wire up the weak-area quiz generation**
- New prop `onGenerateQuiz` passed from `PdfReaderView` → `PdfQuizPanel`
- This callback accepts `{ pageText, language, numQuestions, questionTypes, weakTopics }` and calls the existing `handleQuiz`-style fetch
- The generated questions replace the current quiz (same `setQuizQuestions` + `setShowQuiz` flow)
- Reset answers/feedback state when new quiz loads

**4. Minor edge function tweak (`pdf-chat/index.ts`)**
- For `action: 'quiz'`, accept an optional `focusTopics` string array
- If provided, add to the prompt: "Focus questions on these weak areas: ..."
- No new function needed — reuses existing endpoint

### Files Modified

| File | Change |
|------|--------|
| `src/components/PdfQuizPanel.tsx` | Remove all-answered gate, mark skipped as weak, add "Practice Weak Areas" button with config dialog, call parent to generate new quiz |
| `src/components/PdfReaderView.tsx` | Pass `onGenerateQuiz` callback to PdfQuizPanel that calls `pdf-chat` with optional `focusTopics` |
| `supabase/functions/pdf-chat/index.ts` | Accept optional `focusTopics` in quiz action prompt |

