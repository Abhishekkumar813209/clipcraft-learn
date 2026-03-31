

## Plan: Dedicated Test & Analysis Pages with PDF Return Navigation

### What It Does
Replaces the current inline quiz modal with two full-page routes inspired by the reference UI (exam-style interface with timer, question palette, mark-for-review). Users can navigate back to the PDF at the exact page they left.

### Database Change
Add columns to `pdf_saved_quizzes`:
- `user_answers jsonb` — stores submitted answers
- `ai_feedback text` — stores AI evaluation result

### New Pages

**1. `src/pages/QuizTest.tsx`** — Route: `/quizzes/:quizId`
- Exam-style full-screen layout matching reference UI:
  - Top bar: quiz name, countdown timer (optional), submit button
  - Left panel: one question at a time with Previous/Next, "Mark for Review", "Clear" buttons
  - Right sidebar: question palette with color-coded status (Answered = green, Not Answered = red, Not Visited = grey, Review Later = blue, Answered & Review = teal), legend card
- Loads quiz from `pdf_saved_quizzes` by ID
- Supports all question types (MCQ radio, T/F, fill, multi-checkbox, short)
- Partial submission allowed (at least 1 answered)
- On submit: calls `pdf-chat` edge function for evaluation, saves `user_answers` + `ai_feedback` to DB, redirects to analysis page
- **"Back to PDF" button**: navigates to `/pdf` — PDF state is already persisted in IndexedDB, so the same page restores automatically

**2. `src/pages/QuizAnalysis.tsx`** — Route: `/quizzes/:quizId/analysis`
- Header: quiz name, PDF name, page range, score summary
- Each question as a card showing:
  - Question text + type badge
  - User's answer (green if correct, red if wrong, grey if skipped)
  - Correct answer highlighted
  - Per-question explanation from AI feedback
- Overall AI feedback section
- Action buttons: "Retake Quiz" → `/quizzes/:quizId`, "Back to PDF" → `/pdf`, "Practice Weak Areas" (reuses existing weak-area flow)

### Updated Components

**`SavedQuizzesView.tsx`**
- Quiz card click → `navigate(/quizzes/${id})` instead of opening inline modal
- Show "View Results" badge if quiz has `ai_feedback` saved → links to analysis page
- Remove inline `PdfQuizPanel` rendering

**`PdfQuizPanel.tsx`**
- After saving a quiz, offer a "Take Test" button that navigates to `/quizzes/:quizId`
- Keep the inline quiz mode working for quick practice (no save needed)

**`App.tsx`**
- Add routes: `/quizzes/:quizId` and `/quizzes/:quizId/analysis`

### PDF Return Flow
Since PDF state (file + current page) is already persisted in IndexedDB via `localforage`, navigating to `/pdf` from any page automatically restores the exact page the user was on. Both test and analysis pages will have a "Back to PDF" button that simply navigates to `/pdf`.

### Files Modified

| File | Change |
|------|--------|
| Migration SQL | Add `user_answers jsonb`, `ai_feedback text` to `pdf_saved_quizzes` |
| `src/pages/QuizTest.tsx` | New — exam-style test page with timer, question palette, mark-for-review |
| `src/pages/QuizAnalysis.tsx` | New — results analysis with color-coded answers and AI feedback cards |
| `src/components/SavedQuizzesView.tsx` | Navigate to URL routes instead of inline modal |
| `src/components/PdfQuizPanel.tsx` | Add "Take Test" navigation after save |
| `src/App.tsx` | Add two new routes |

