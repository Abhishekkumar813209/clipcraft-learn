

## Plan: Remove Quiz Modal, Use Dedicated Test Page Only

### What Changes

When a quiz is generated from the PDF reader, instead of opening the inline `PdfQuizPanel` modal, the app will:
1. Auto-save the generated quiz to `pdf_saved_quizzes` in the database
2. Navigate to `/quizzes/:quizId` (the dedicated exam-style test page with question palette, timer, mark-for-review — the UI you already approved)

### Files Modified

| File | Change |
|------|--------|
| `src/components/PdfReaderView.tsx` | In `handleQuiz()` and the weak-area regeneration callback: after generating questions, insert them into `pdf_saved_quizzes`, then `navigate(/quizzes/${id})` instead of setting `showQuiz=true`. Remove the `PdfQuizPanel` rendering block (lines 734-771), remove the `showQuiz`/`quizQuestions` state, remove the `PdfQuizPanel` import. |
| `src/components/PdfQuizPanel.tsx` | Delete this file entirely — no longer needed. |

### Flow After Change

```text
PDF Reader → Click "Generate Quiz" → API returns questions
  → Auto-save to pdf_saved_quizzes (name: "Filename - Page X")
  → navigate("/quizzes/{newId}")
  → Dedicated exam page (QuizTest.tsx) with full UI
  → Submit → navigate("/quizzes/{id}/analysis")
  → "Back to PDF" → returns to same page
```

No new components or routes needed — just wiring the PDF reader directly to the existing dedicated pages.

