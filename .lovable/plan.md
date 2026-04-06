

## Plan: Open Quiz in New Tab

### Change
In `src/components/PdfReaderView.tsx` (line 458), replace `navigate(`/quizzes/${savedQuiz.id}`)` with `window.open(`/quizzes/${savedQuiz.id}`, '_blank')` so the generated quiz opens in a new browser tab instead of navigating away from the PDF reader.

### Files Modified
- `src/components/PdfReaderView.tsx` — One-line change

