## Problem

DB me har row ke paas rich fields hain — `hindi_meaning`, `english_meaning`, `hinglish_meaning`, `example`, `synonyms[]`, `antonyms[]`, `pos` — but abhi frontend sirf `prompt` + `answer` use kar raha hai (Practice + Duel me ek chhota `explanation` line). Baaki sab data DB me pada rehta hai, kahin dikhta hi nahi.

## Fix — 2 jagah surface karo

### 1. Naya "Browse / Study" page (bulk view of all rows)

Route: `/ssc/blackbook/browse/:category` (syn_ant | idiom | ows | mixed)  
File: `src/pages/BlackBookBrowse.tsx` (new)

Har category ka layout thoda alag, kyunki fields alag-alag populated hain:

- **syn_ant** — card grid: `prompt` (word) + `pos` badge · Hindi meaning (Devanagari) · English meaning · Synonyms chips (green) · Antonyms chips (red).
- **idiom** — card list: idiom `prompt` · English meaning · **Hinglish meaning** · Example (italic quote).
- **ows** — card grid: phrase `prompt` → one-word `answer` · Hinglish meaning · Hindi (if present).

Top bar: search box (matches `prompt`/`answer`/meanings), category tabs, and a "Practice these" button that jumps to `/ssc/blackbook/practice/:category`. Data fetch = one `supabase.from('ssc_black_book_items').select('*').eq('category', ...)` call, filter client-side.

Hub (`BlackBookHub.tsx`) me har category card pe 2 buttons: **Browse** + **Practice** (abhi sirf Practice hai).

### 2. Richer explanation card in Practice + Duel (after each answer)

Files: `src/pages/BlackBookPractice.tsx`, `src/pages/BlackBookDuel.tsx`

`buildQuestion()` sirf ek `explanation` string set karta hai. Instead, `BBQuestion` me pura `item: BBItem` reference rakho (already have `itemId` — bas full item pass karo) taaki reveal ke waqt dikha saken:

- syn_ant → Hindi meaning · English meaning · Full synonyms list · Full antonyms list
- idiom → English + Hinglish + Example
- ows → One-word answer + Hinglish + Hindi

Small reusable component `src/components/BlackBookExplanation.tsx` — same card dono jagah use hoga.

### 3. Sidebar / hub link

`BlackBookHub.tsx` me ek "Browse dictionary" section add karo jo teeno categories ke browse links dikhaye.

## Files touched

- **New**: `src/pages/BlackBookBrowse.tsx`, `src/components/BlackBookExplanation.tsx`
- **Edit**: `src/lib/blackBookQuiz.ts` (attach full `item` to `BBQuestion`), `src/pages/BlackBookPractice.tsx`, `src/pages/BlackBookDuel.tsx`, `src/pages/BlackBookHub.tsx`, `src/App.tsx` (new route)

Koi DB change nahi, koi AI call nahi — sab already-imported 507 rows se render.

## Confirm

- Browse page chahiye ya sirf explanation card badhana hai? (Main dono kar raha hoon default me.)
- Practice/Duel me answer reveal ke baad ye rich card auto-dikhe ya "Show details" button pe?
