## Goal
Chapter 1 (Sources of Ancient History, 38 questions) database me daalna aur UPSC practice module banana — SSC English jaisa hi feel, par per-option "kyu sahi / kyu galat" reveal ke saath.

## Verified facts
- Uploaded sheet `questions`: 38 rows, exactly 22 columns of the v2 template (chapter_no … hint_hinglish). Ch-1 me sirf `mcq` + `statement` type rows hain, `list_i/list_ii` khaali.
- Abhi database me koi `upsc_*` table nahi hai (schema list me sirf ssc/rbi/bpsc/admin tables).
- `/upsc` route abhi `UpscMotivation` page pe jaata hai (App.tsx line 120) — wo untouched rahega, naya module alag prefix pe.

## Database (new)
`public.upsc_questions` — ek hi flat table, sheet ke 22 columns + do extras:
- `global_serial` (int, unique) — poori history book ka continuous number, chapter_no → serial_no order se assign. Isi se "1–1000 ek saath practice" chalega, chahe multiple chapters aa jayein.
- `subject` ('ancient_history') — future me medieval/modern add karne ke liye.
- RLS: sabhi logged-in users read kar sakte hain; sirf admin (existing `is_admin()`) insert/update/delete.
- Grants: `authenticated` ko read, `service_role` ko full.

Chapter 1 ki 38 rows insert ho jaayengi (global_serial 1–38).

## Practice UX
Routes:
- `/upsc/history` — chapter cards (Ch 1 · 38 Qs) + ek "All chapters" card.
- `/upsc/history/practice` — setup screen, SSC wale pattern jaisa:
  - Serial range: From / To plain text boxes (spinner nahi, khaali chhodne pe full range)
  - Chapter filter: All / specific chapter
  - Order: Serial ya Random
  - Count: text box, default = range size

Question screen:
- Question text; `statement` type ke liye statements block bullet-wise render.
- **Hint** button → `hint_hinglish` (Hinglish), answer se pehle available.
- Answer mark karne ke baad:
  - **Kisi bhi option pe click** → sirf us option ka reason khulta hai (`why_a`/`why_b`/`why_c`/`why_d`).
  - **Double-click (question card pe)** → charon options ke reasons ek saath expand, plus `explanation_hinglish`, `ncert_source` aur `ncert_extra` ka detail card.
- Top-right QuestionNavigator (existing component) — correct/wrong/bookmarked/unattempted colors + jump.
- Bookmarking existing `ssc_bookmarks` table me `subject='gk'`-style ki jagah naye chapter key `upsc_ancient_history` ke saath (bookmarks tab me alag section dikhega).

## Sidebar
Sidebar me UPSC exam entry ke andar: Ancient History (active), Medieval / Modern / Polity placeholders.

## Technical notes
- Import ek migration ke baad `insert` tool se hoga (38 rows), text as-is; koi AI call nahi.
- Naye files: `src/pages/upsc/UpscLayout.tsx`, `UpscHistory.tsx`, `UpscHistorySetup.tsx`, `UpscHistoryPractice.tsx`, `src/lib/upscQuiz.ts`.
- Aage ke chapters: wahi 22-column sheet upload karo, `global_serial` automatically aage se continue karke append kar dunga.

## Verification
Insert ke baad row count + global_serial continuity query se check karunga, aur practice page ko browser me chala kar range/hint/option-reveal confirm karunga.
