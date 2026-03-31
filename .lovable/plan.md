

## Plan: Persist Quiz/Test State Across Tab Switches

### Problem
When you navigate away from `/pdf` (e.g., to dashboard) and come back, the component unmounts and all quiz state is lost — generated questions, your answers, checking results, everything resets.

### Solution
Persist quiz-related state in `sessionStorage` alongside the existing PDF state, and restore it on remount.

### Changes

**File: `src/components/PdfReaderView.tsx`**
- Extend the existing `sessionStorage` persistence (key `pdf-reader-state`) to also save:
  - `showQuiz` (boolean)
  - `quizQuestions` (the generated questions array)
- On mount, restore these values from sessionStorage so the quiz panel reopens with the same questions

**File: `src/components/PdfQuizPanel.tsx`**
- Persist answer state (`answers`, `multiAnswers`, `results`, `showResults`) to `sessionStorage` under a separate key (e.g., `pdf-quiz-state`)
- On mount, restore saved answers and results
- On close (`onClose`), clear the quiz sessionStorage entry
- Save state on every answer change and when results are checked

This way, switching tabs and coming back will restore both the quiz questions AND your in-progress answers exactly where you left off.

### Files Modified

| File | Change |
|------|--------|
| `src/components/PdfReaderView.tsx` | Save/restore `showQuiz` + `quizQuestions` in sessionStorage |
| `src/components/PdfQuizPanel.tsx` | Save/restore answers, multiAnswers, results in sessionStorage |

