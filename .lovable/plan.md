

## Plan: Redesign Saved Quizzes UI + Add Reattempt/Results Buttons

### Changes

**1. Remove gray/muted styling, use premium card design**
- Quiz cards: replace `bg-muted/50` with white/dark cards with subtle blue-tinted left border and slight shadow
- Folder headers: replace `bg-muted/30` with cleaner styling using blue accent
- Overall background: clean white, no gray tones

**2. Two action buttons per quiz card (when results exist)**
- **Reattempt** button (blue outline) — navigates to `/quizzes/:id` to retake the quiz fresh
- **View Results** button (green filled) — navigates to `/quizzes/:id/analysis`
- For quizzes without results: single "Start Quiz" button
- Remove the current single-click-on-card navigation behavior; clicks on the card body still work but buttons are explicit

**3. Better visual hierarchy**
- Quiz name larger/bolder
- Metadata (PDF name, page range, question count, date) as a secondary line
- "Results" badge stays but more integrated
- Delete button stays on hover

### Quiz Card Layout
```text
┌─ blue border ──────────────────────────────────────────┐
│ 🧠  OOPS theory.pdf - Page 6-8        [Results badge]  │
│     OOPS theory.pdf · Page 6-8 · 20 Q · 3/31/2026     │
│                          [Reattempt]  [View Results] 🗑 │
└────────────────────────────────────────────────────────┘
```

### File Modified

| File | Change |
|------|--------|
| `src/components/SavedQuizzesView.tsx` | Restyle quiz cards (remove gray, add border-l-4 border-blue-500, white bg, shadow-sm). Add two buttons for quizzes with results. Update folder header styling. |

Single file, no logic or data changes.

