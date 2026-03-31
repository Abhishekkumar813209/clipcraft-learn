

## Plan: Redesign Quiz Analysis Page

### Changes

**1. Three Filter Tabs (Correct / In-Correct / Unattempt)**
- Replace the score summary cards with 3 pill-shaped tab buttons like the reference images
- Green filled for "Correct (N)", red filled for "In-Correct (N)", yellow/orange filled for "Unattempt (N)"
- Active tab is colored, inactive tabs are gray/muted
- Clicking a tab filters the question list to show only that category
- Default: show all (or "Correct" tab active)

**2. Fix Multiple Correct Answer Comparison**
- Current `getAnswerStatus` does `normalize(ua) === normalize(q.correctAnswer)` which fails for multi-correct
- User answers for multi-correct are stored as comma-separated: `"opt1, opt2, opt3"`
- Fix: split both `ua` and `correctAnswer` by comma, normalize each, compare as sets (order-independent)

**3. Inline Answer Per Question Card**
- Remove the separate AI Feedback section at the bottom
- Instead, show the correct answer / explanation directly inside each question card below the options
- For MCQ: options already show green/red highlights (keep this)
- For all types: add a small "Correct Answer: X" line and if AI feedback exists for that question, show it inline
- Parse AI feedback markdown to extract per-question explanations where possible, or show the full feedback inside the last question card

**4. Color Theme Matching Reference Images**
- Question card header ribbon/badge: green "Q.1 Correct", red "Q.2 Incorrect", yellow "Q.3 Unattempt"
- Card left border or top ribbon colored accordingly
- Time spent per question shown on the right side (if available, else "0 sec")
- Light backgrounds: correct cards get subtle green-left-border, wrong get red, unattempt get yellow
- Tab buttons: rounded-full, green bg for correct, red for incorrect, golden-yellow for unattempt

**5. "Practice Weak Areas" Button**
- Rename from "Back to PDF to Practice Weak Areas" to "Practice Weak Areas"
- On click: collect all wrong + unattempted questions, save as a new quiz in `pdf_saved_quizzes`, navigate to `/quizzes/:newId` to retake only those

### Files Modified

| File | Change |
|------|--------|
| `src/pages/QuizAnalysis.tsx` | Complete redesign: add filter tabs, fix multi-correct comparison, inline answers per card, new color scheme, Practice Weak Areas button logic |

### UI Layout (Analysis Page)

```text
┌─────────────────────────────────────────────┐
│ [← My Quizzes]  Quiz Name — Analysis  [Retake] │
├─────────────────────────────────────────────┤
│                                             │
│  [■ Correct (5)]  [■ In-Correct (3)]  [■ Unattempt (2)]  │
│                                             │
│  ┌─ Q.1 Correct ────────────── 24 sec ──┐  │
│  │ Question text...                      │  │
│  │ A) Option 1          ✓ (green bg)     │  │
│  │ B) Option 2                           │  │
│  │ C) Option 3                           │  │
│  │ D) Option 4                           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─ Q.2 Unattempt ─────────── 0 sec ───┐  │
│  │ Question text...                      │  │
│  │ Correct Answer: Option B (green)      │  │
│  └───────────────────────────────────────┘  │
│                                             │
│         [Practice Weak Areas]               │
└─────────────────────────────────────────────┘
```

### Multi-Correct Fix Logic
```typescript
// Before (broken):
normalize(ua) === normalize(q.correctAnswer)

// After (correct):
const userSet = new Set(ua.split(',').map(s => normalize(s)));
const correctSet = new Set(q.correctAnswer.split(',').map(s => normalize(s)));
// Compare sets: same size + every element matches
```

