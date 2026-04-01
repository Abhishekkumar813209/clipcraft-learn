

## Plan: Group Quizzes by Date Instead of Topics

### What Changes

**File:** `src/components/SavedQuizzesView.tsx`

Replace the current flat list layout with a **date-grouped accordion**. Quizzes are grouped by their `created_at` date (e.g., "March 31, 2026", "March 30, 2026"). Each date row is collapsible — clicking it expands to show the quizzes from that day with their topic/PDF names.

### How It Works

1. **Group quizzes by date**: After fetching, group all quizzes (both filed and unfiled) by `new Date(created_at).toLocaleDateString()` into a `Map<string, SavedQuiz[]>`
2. **Render date headers**: Each date becomes a collapsible row with a `Calendar` icon, the formatted date string, and quiz count
3. **Expand to see quizzes**: Clicking a date toggles open to show the quiz cards underneath (same `renderQuizCard` with topic name, Reattempt/View Results buttons)
4. **Keep folder grouping optional**: If folders exist, show folders first, then date-grouped unfiled quizzes. If no folders, just show date groups for everything.

### Date Header Layout
```text
▶ 📅  March 31, 2026                              4 quizzes
▼ 📅  March 30, 2026                              2 quizzes
   🧠 OOPS theory.pdf - Page 6-8  [Results]  [Reattempt] [View Results]
   🧠 OOPS theory.pdf - Page 4-8             [Start Quiz]
```

### Implementation Details

- Replace the current folder-based grouping with date-based grouping
- Add `Calendar` icon import from lucide-react
- Group logic: `quizzes.reduce()` by date string, sorted newest first
- `expandedFolders` state reused for date keys (first date auto-expanded)
- All existing quiz card rendering (buttons, delete, badges) stays the same
- Subtitle updated: "Revise your saved PDF quizzes organized by date"

### Single file change
`src/components/SavedQuizzesView.tsx`

