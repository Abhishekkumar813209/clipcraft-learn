## Goals

1. **English Vocabulary (roots)** — rewrite `hinglish_meaning` as proper descriptive Hindi and regenerate `example` for all 4,341 rows (currently generic "committee/manager" templates).
2. **Roots practice** — after answer is locked: single-tap on any option → show that option's Hindi meaning; double-tap on the card → flip all options to Hindi.
3. **Black Book practice + history** — double-tap flip already exists but shows nothing because Hindi meanings for individual option words (Wise, Cautious, Elegy…) and idiom answers are missing. Backfill Hindi data so the flip actually works.

---

## 1. Regenerate Root Words Hindi + Examples

- Add a column `hindi_meaning` (text) to `ssc_root_words`. Keep the old `hinglish_meaning` untouched for safety; UI switches to the new field.
- New edge function `ssc-roots-enrich` (admin-only, service-role writes):
  - Fetches rows in batches of 25 where `hindi_meaning IS NULL` (or force-regenerate flag).
  - Prompts Gemini (round-robin the 10 keys) to return JSON: `{ id, hindi_meaning, example }` where:
    - `hindi_meaning`: one clean descriptive Hindi line (Devanagari), no English filler like "matlab hai / yani".
    - `example`: a fresh natural English sentence *actually using the word* — never mention "committee/manager/professor/novel" templates.
  - Persists via service-role update.
- Admin trigger button on `/admin` (or a hidden `/admin/roots-enrich` page) with a progress counter. Run to completion in the background.
- Update `SscRoots.tsx` and `rootWordsQuiz.ts` interface to read `hindi_meaning` (fallback to `hinglish_meaning` while migration runs).

## 2. Roots Practice — Tap-to-Hindi

In `SscRootsPractice.tsx`, once `picked !== null` for the current question:

- Build an `optionHindi[]` array by matching each option string back to a `ssc_root_words` row:
  - `root_match` qtype: option is a word → direct lookup on `word`.
  - `definition` qtype: option is a definition → lookup by `definition` match.
  - `synonym` qtype: option is a synonym token → lookup by `word` first, else fall back to the shared `ssc_word_hindi` table (see §3).
- State: `revealed: Set<number>` for per-option Hindi, plus `flipAll: boolean`.
- Interactions on each option button (only enabled after answer locked):
  - Single click → toggle that option in `revealed`.
  - Double click on the **card** → toggle `flipAll` (shows Hindi for every option).
- Rendering: when `flipAll || revealed.has(i)`, replace the option label with its Hindi text; if Hindi missing show a subtle "—".
- Small hint line under options: "Tap an option for Hindi · double-click card for all".

## 3. Black Book — Backfill Hindi for Options

Root cause: syn_ant options are individual words (Wise, Cautious…), OWS options are one-word answers, idiom options are meaning sentences — none currently have Hindi in the DB, so the existing history flip renders blanks.

**Schema**

- New table `public.ssc_word_hindi`:
  - `word_key text primary key` (lowercased)
  - `display text` (original casing)
  - `hindi text not null`
  - `kind text` ('word' | 'phrase')
  - standard `created_at` / `updated_at`
  - GRANT `SELECT` to `anon, authenticated`, ALL to `service_role`; RLS public-read.
- Populate `ssc_black_book_items.hindi_meaning` for all 200 idiom rows and 200 OWS rows (currently empty).

**Backfill edge function** `bb-hindi-enrich` (admin-only):

- Collects unique tokens across all BB items: every syn_ant `prompt` + each element of `synonyms[]` / `antonyms[]`, every OWS `answer`, plus OWS/idiom `prompt`s so option flips work for prompts too.
- Batches (30–40 at a time) to Gemini → returns `{ word, hindi }` list → upserts into `ssc_word_hindi`.
- Separate pass: for idiom + OWS rows without `hindi_meaning`, translate the `answer` and update the row.

**UI wiring**

- `BlackBookHistory.tsx` (and `BlackBookPractice.tsx` if we add the same flip there — see §4): extend the hindi map builder to also fetch and merge `ssc_word_hindi` so option text like "Wise" resolves to "बुद्धिमान".

## 4. Black Book Practice — Same Flip Behavior

Currently only history has the double-click flip. Mirror the roots-practice interaction inside `BlackBookPractice.tsx` after answer locked:

- Single tap on option → reveal its Hindi.
- Double tap on card → flip all options to Hindi.
- Uses the same combined map (item's own Hindi fields + `ssc_word_hindi`).

## Deliverables

**Migrations**
- `ssc_root_words.hindi_meaning` column.
- `ssc_word_hindi` table + grants + RLS.

**Edge functions**
- `supabase/functions/ssc-roots-enrich/index.ts`
- `supabase/functions/bb-hindi-enrich/index.ts`

**Frontend**
- `SscRootsPractice.tsx` — tap/double-tap Hindi reveal + option→Hindi lookup helper.
- `SscRoots.tsx`, `rootWordsQuiz.ts` — read new `hindi_meaning`.
- `BlackBookPractice.tsx` — mirror flip UX from history.
- `BlackBookHistory.tsx` — extend map with `ssc_word_hindi`.
- Small admin trigger UI for both enrich functions with progress.

## Non-Goals

- No changes to BB/roots question generation logic, scoring, or persistence.
- No changes to unrelated SSC modules.
