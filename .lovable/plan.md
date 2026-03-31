

## Plan: Route All Quiz Results to Dedicated Analysis Page

### Problem
When submitting a quiz from `PdfQuizPanel` (the modal), results show as raw markdown in the same modal. The dedicated analysis page (`QuizAnalysis.tsx`) with proper UI (score cards, color-coded options, per-question breakdown) is only reachable from saved quizzes.

### Fix

**1. Auto-save quiz on submit in `PdfQuizPanel.tsx`**
- When user clicks "Submit", after getting AI feedback:
  - Auto-save the quiz to `pdf_saved_quizzes` (with a default name like "PDF - Page X" if not manually saved)
  - Store `user_answers` and `ai_feedback` in the same row
  - Navigate to `/quizzes/:quizId/analysis` instead of showing inline feedback
- Remove the inline feedback rendering entirely from PdfQuizPanel — it becomes a test-taking + save component only

**2. Update `PdfQuizPanel.tsx` submit flow**
- After `pdf-chat` returns feedback:
  - Insert/upsert quiz into `pdf_saved_quizzes` with questions, user_answers, ai_feedback
  - Get the new quiz ID
  - Call `navigate(/quizzes/${newId}/analysis)`
  - Close the modal

**3. Keep PdfQuizPanel for test-taking only**
- Remove the feedback/results section (lines ~380-398)
- Remove weak areas display from the modal
- The modal's job: show questions, collect answers, submit, redirect

### Files Modified

| File | Change |
|------|--------|
| `src/components/PdfQuizPanel.tsx` | On submit: auto-save to DB with answers + feedback, navigate to analysis page, remove inline feedback UI |
| `src/components/PdfReaderView.tsx` | Minor — ensure `useNavigate` is available to PdfQuizPanel (pass as prop or use directly) |

