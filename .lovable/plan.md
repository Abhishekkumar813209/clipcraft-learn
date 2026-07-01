## Goal
Teen Black Book CSVs (Synonyms/Antonyms 100, Idioms 200, OWS 200) ko DB me daal ke SSC English ka **daily target + realtime 1v1 duel** mode banana — existing infra (Supabase, admin flows, `ssc_vocabulary` pattern, Realtime, `useSscProgress`) reuse karke.

## Step 1 — Data model (single unified table)

Naya table `ssc_black_book_items` — teeno CSV isi me fit ho jaayenge, taki quiz engine ek hi jagah se pick kare:

```
ssc_black_book_items
- id (uuid)
- category: 'syn_ant' | 'idiom' | 'ows'
- serial_no (int)
- prompt (text)         -- Word / Idiom / Phrase-definition
- answer (text)          -- One-word / Idiom-meaning / correct Word
- pos (text nullable)
- hindi_meaning, english_meaning, hinglish_meaning (nullable per category)
- synonyms (text[]), antonyms (text[])   -- only for syn_ant
- example (text nullable)
- created_at
```

Public read (anon+authenticated SELECT), admin-only write. Grants + RLS ke saath.

## Step 2 — CSV import (one-shot, no AI quota)

Since ye ready structured data hai — koi AI extraction nahi chahiye. Do options, main #1 recommend karta hoon:

1. **Direct psql COPY** via exec tool — main hi teeno CSVs ko parse karke `ssc_black_book_items` me insert kar dunga (arrays ke liye synonyms/antonyms comma-split). Instant, zero quota.
2. Ya `AdminUpload.tsx` me ek naya "Black Book CSV → direct insert" mode (bypass AI) — future uploads ke liye useful, abhi optional.

Main #1 karunga taki 500 rows turant DB me aa jaayen.

## Step 3 — MCQ generation (client-side, quota-free)

`src/data/vocabulary.ts` jaisa hi ek `src/lib/blackBookQuiz.ts` — ek row leke MCQ banata hai, distractors same-category ke random rows se:

- **syn_ant**: "Synonym of X?" → correct = ek random synonym; distractors = doosre words ke synonyms. Ya "Antonym of X?" variant.
- **idiom**: "Meaning of '<idiom>'?" → correct = english_meaning; distractors = 3 random idioms ke meanings.
- **ows**: "One word for: '<phrase>'?" → correct = One Word; distractors = 3 random one-words.

Pura client-side, koi Gemini call nahi.

## Step 4 — Daily target

Naya table `black_book_daily_progress (user_id, date, category, target, attempted, correct)` with per-user RLS. Default daily target: **20 syn_ant + 20 idioms + 20 ows = 60 items/day** (user slider se badal sake).

Dashboard card SSC layout me: "Aaj ka target: 42/60 ✓" + streak counter (existing `useSscProgress` pattern follow).

## Step 5 — Realtime 1v1 duel (using Supabase Realtime — already in stack)

Do tables:

```
duel_matches
- id, host_id, guest_id, category, status ('waiting'|'live'|'done')
- question_ids (uuid[]) -- 10 pre-picked
- started_at, ended_at, winner_id

duel_answers
- match_id, user_id, q_index, selected, is_correct, ms_taken
```

Flow:
1. Host `/ssc/duel/new` → category choose → match row insert → shareable link `/ssc/duel/:id`.
2. Guest link kholta hai → `guest_id` update → dono ready → status='live', 10 questions same seed dono ko.
3. Dono ek saath khelte hain, har answer `duel_answers` me insert; Realtime subscription se opponent ka score + progress live dikhta hai.
4. 60s per question timer (client). Match end → winner = higher score, tie-break faster ms.

Realtime subscribe rules memory ke hisaab se (`useEffect` + cleanup) follow karunga taaki cost na bade.

## Step 6 — UI additions (SSC layout me)

- `/ssc/blackbook` → 3 cards (Syn/Ant, Idioms, OWS) + "Practice" & "Daily Target" buttons.
- `/ssc/blackbook/practice/:category` → single-player MCQ session (10/20 Qs).
- `/ssc/duel/new` + `/ssc/duel/:id` → duel lobby + live match screen (split-view: mera progress vs opponent's).
- Sidebar link "Black Book Duel" add.

## Technical bits

- Realtime channel per `match_id`: `postgres_changes` on `duel_answers` filtered by `match_id`.
- Question fairness: host picks `question_ids` at match creation, both clients render from same array — no drift.
- No AI, no quota drain — sab static + Realtime.
- Types file regenerate hoga after migration; queries `as never` cast pattern use karunga (existing admin pages ki tarah).

## Out of scope (for now)
- ELO/leaderboard, tournaments, spectators, chat during duel — baad me add ho sakte hain.
- CSV re-import UI (main first import khud kar dunga; agar user chahe to Step 2 option 2 add karenge).

## Confirm karo:
- Daily target default **20+20+20 = 60**, sahi hai ya kam/zyada?
- Duel length **10 Qs, 60s each**, ya alag chahiye?
