# Parts of Speech → Verb Basic (Spot the Error)

## New Card on `/ssc/english`
- Add a **"Parts of Speech"** card to `SscSubject.tsx` (english view).
- Route: `/ssc/english/parts-of-speech` → hub page listing sub-topics: **Verb**, Noun, Pronoun, Adjective, Adverb, Preposition, Conjunction, Interjection (only Verb active for now).
- Verb card → `/ssc/english/parts-of-speech/verb` with two cards: **Basic** (active) and **Advanced** (coming soon).
- Basic → `/ssc/english/parts-of-speech/verb/basic` shows one card "Spot the Error" (47 questions).

## Database
New table `ssc_pos_spot_error` seeded from `Verb_Basic_SpotError_v2.xlsx` (47 rows):
- `pos` ('verb'), `level` ('basic'), `q_no`
- `full_sentence`, `part_a/b/c/d`, `error_in` (A/B/C/D), `correct_form`, `rule_tag`, `hint`, `solution`
- `practice` jsonb array (3 items: `{ full_sentence, hint, error_in, correct_form, solution }`)
- Public read; admin insert.

## Practice Flow (`/ssc/english/parts-of-speech/verb/basic/practice`)
- Fetch all 47 questions; user answers by tapping Part A/B/C/D.
- After submit → highlight correct/wrong, reveal **Correct Form**, **Rule/Tag**, and **Solution** card.
- Hint button (💡) available before answering — shows `hint` text.
- Solution card includes a **"Practice More (3 similar)"** button.

### Practice-More sub-flow
- Clicking opens the same question UI but iterates through the 3 `practice` variants of *that* Q.
- Header shows `Practice 1/3 · from Q#4`.
- After all 3 done (or user hits "Back to Q4"), returns to the main list at question index 4 exactly where left off.
- State kept in component (no route change) so the return is instant; alternatively a nested route `/practice/:qNo/more` with return-to-parent state — chosen: **in-page overlay/stack** to preserve original index and picks.

## Files
- `supabase/migrations/*` — create table + seed all 47 rows.
- `src/pages/SscPartsOfSpeech.tsx` — hub (8 POS cards, only Verb active).
- `src/pages/SscPosVerb.tsx` — Basic / Advanced cards.
- `src/pages/SscPosVerbBasic.tsx` — Spot the Error card + count input (default 20, max 47).
- `src/pages/SscPosVerbBasicPractice.tsx` — main practice + practice-more overlay.
- `src/pages/SscSubject.tsx` — add Parts of Speech card (english only).
- `src/App.tsx` — register 4 new routes.

## Design
- Emerald/mint theme, matches existing BB practice pages.
- Options rendered as 4 tappable pills labeled A / B / C / D with the underlying phrase.
- Progress bar and Prev/Next buttons like existing practice pages.
- Practice-More overlay has a distinct amber accent to signal "drill mode", with a clear **"← Back to Q{n}"** button always visible.

## Notes
- No progress logging to `bb_practice_sessions` for this module in v1 (kept scoped to UI + data). Can be added later if you want it in BB History.
