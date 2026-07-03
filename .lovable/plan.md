## Goal
Add persistent practice history + analytics for Black Book, session review with correct/wrong breakdown, Hindi-flip on double-click (history only), and Prev/Next navigation in the practice quiz.

## 1. Database (new migration)
Create two tables to persist per-attempt data:

- `bb_practice_sessions`
  - `id uuid pk`, `user_id uuid`, `category text` (syn_ant | idiom | ows | mixed)
  - `total int`, `correct int`, `created_at timestamptz default now()`
- `bb_practice_attempts`
  - `id uuid pk`, `session_id uuid fk → bb_practice_sessions`, `user_id uuid`
  - `item_id uuid fk → ssc_black_book_items`
  - `category text`, `question text`, `options jsonb`, `correct_index int`, `picked_index int`
  - `is_correct bool`, `created_at timestamptz`

Both with RLS: user can only read/insert their own rows. Include GRANTs to `authenticated` + `service_role`.

## 2. Save data during practice
`src/pages/BlackBookPractice.tsx`:
- On session start, insert a `bb_practice_sessions` row → keep `sessionId` in state.
- On each `choose()`, insert an `bb_practice_attempts` row (with full question snapshot so history renders without depending on live items).
- On `done`, update the session's `correct`/`total`.
- Works for `mixed` too (removes the current mixed skip).

## 3. Prev / Next navigation in practice
Same file:
- Add "Previous" and "Next" buttons below options.
- Track `picked` per question in an array (`picked: (number|null)[]`) instead of a single value so navigating back preserves answers.
- Prev enabled from Q2; Next always enabled once question exists; final question shows "Finish".
- Answering a question locks it (no re-pick) — matches current behavior.

## 4. Post-session review inside the same page
When `done`:
- Show summary card (already exists) + a scrollable list of all 20 questions with:
  - Question text, user's pick (red if wrong, green if right), correct answer highlighted.
  - Rich `BlackBookExplanation` collapsed per row (expand on click).
- Buttons: "Back", "Play again", "View full history".

## 5. New "Practice History" sidebar tab
`src/pages/SscLayout.tsx`: add nav item "BB History" → `/ssc/blackbook/history`.

New page `src/pages/BlackBookHistory.tsx` with 3 tabs (Synonyms & Antonyms, Idioms & Phrases, One Word Substitutions):

Each tab shows two sections:
- **Word analytics** — aggregate wrong-count per item for that category:
  - Query `bb_practice_attempts` grouped by `item_id` where `is_correct=false`, ordered by wrong count desc.
  - Render as list: prompt, wrong count badge, total attempts, accuracy%.
  - Click row → open a modal with the full `BlackBookExplanation`.
- **Session history** — list of past sessions (date, score) → click to open a session detail view showing every question with user's pick vs correct, plus the Hindi-flip feature (see #6).

## 6. Double-click Hindi flip (history only)
In the session-detail review under History:
- Each option button wrapped in a component that stores `showHindi` state.
- `onDoubleClick` toggles English ↔ Hindi meaning for all four options at once (per question card).
- Hindi comes from `ssc_black_book_items.hindi_meaning`; for options that are other items' words we lookup the item by matching `answer`/`prompt` in the cached items list. If no Hindi found, show "—".
- This flip is **only** in `BlackBookHistory` session-detail, not in live practice.

## 7. Files to touch
- Migration (new).
- `src/pages/BlackBookPractice.tsx` — persistence, prev/next, review list.
- `src/pages/SscLayout.tsx` — new nav link.
- `src/pages/BlackBookHistory.tsx` — new page (tabs, analytics, session detail).
- `src/App.tsx` — route `/ssc/blackbook/history`.
- `src/lib/blackBookQuiz.ts` — small helper to lookup item by text for Hindi flip (optional).

## Notes
- All persistence uses the existing supabase client; no edge functions needed → zero AI quota.
- Mixed-category sessions also saved; analytics query still groups per item so it works.
- No changes to Duel flow.
