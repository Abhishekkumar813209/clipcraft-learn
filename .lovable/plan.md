

## Plan: Bluish Accent Colors for Saved Quizzes

Keep the current layout as-is. Replace all gray/muted backgrounds with blue-tinted accents to match the app's design system.

### Color Changes in `src/components/SavedQuizzesView.tsx`

| Element | Current | New |
|---------|---------|-----|
| Quiz card row (line 85) | `bg-muted/50 hover:bg-muted` | `bg-blue-500/10 hover:bg-blue-500/20` |
| Folder header (line 135) | `bg-muted/30 hover:bg-muted/50` | `bg-blue-600/10 hover:bg-blue-600/20` |
| Unfiled header (line 158) | `bg-muted/30 hover:bg-muted/50` | `bg-blue-600/10 hover:bg-blue-600/20` |
| Folder border (lines 134, 157) | `border-border` | `border-blue-500/20` |
| Brain icon (line 86) | `text-primary` | `text-blue-400` |
| Results badge (line 90) | `bg-green-500/20 text-green-700` | Keep as-is (green for results makes sense) |

Also add the two action buttons (Reattempt + View Results) per the approved plan:
- For quizzes **with results**: two buttons — "Reattempt" (blue outline) and "View Results" (green)
- For quizzes **without results**: single "Start Quiz" button

### Single file change
`src/components/SavedQuizzesView.tsx` — color class updates + add action buttons in `renderQuizCard`

