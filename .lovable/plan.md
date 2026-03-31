

## Plan: Fix Option Selection + Blue Sidebar Theme

### Problem 1: MCQ options don't respond to clicks
The MCQ `<label>` elements (lines 280-288) contain no `<input type="radio">` and no `onClick` handler. Clicking does nothing because there's no event wired to `setAnswer()`.

**Fix:** Add `onClick={() => setAnswer(q.id, opt)}` to each MCQ label element.

### Problem 2: Sidebar question numbers still gray
`statusColors['not-visited']` uses `bg-muted text-muted-foreground` (gray). The current question ring also uses generic `ring-primary`.

**Fix:** Update `statusColors` to use blue tones for all states, and use `ring-blue-500` for the active question.

### File Modified

| File | Change |
|------|--------|
| `src/pages/QuizTest.tsx` | Add `onClick` to MCQ labels; update `statusColors` to blue-based palette; update active question ring to `ring-blue-500` |

### Updated Status Colors
- **Not visited:** `bg-gray-200 text-gray-500 border-gray-300` (neutral but distinct)
- **Not answered:** `bg-red-100 text-red-600 border-red-300`
- **Answered:** `bg-green-100 text-green-700 border-green-300`
- **Marked:** `bg-blue-100 text-blue-600 border-blue-300`
- **Answered & Marked:** `bg-teal-100 text-teal-700 border-teal-300`
- **Active ring:** `ring-blue-500`

