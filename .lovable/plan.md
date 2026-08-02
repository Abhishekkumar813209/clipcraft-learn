## Goal

Admin panel se purane AI-enrichment buttons hata do. Unki jagah ek single **"UPSC Theory Generator"** button — subject + chapter choose karo, click karo, aur us chapter ke saare questions + solutions + NCERT extra points se ek book-jaisi **Hinglish theory** ban jaye, jo user side pe padhi ja sake.

## 1. Admin panel cleanup

- `src/pages/admin/AdminDashboard.tsx` se poora `EnrichPanel` (Roots / Idiom hints / OWS jobs) hata do.
- Uski jagah naya `UpscTheoryPanel` component.
- Sidebar (`AdminLayout.tsx`) me ek entry: **UPSC Theory**.

## 2. Theory generator UI (admin)

- Subject dropdown (History / Geography / Polity / Economy — `upscSubjects` se).
- Chapter list with: chapter no, chapter name, question count, aur status badge (`Not generated` / `Generated · <date>`).
- Har chapter row pe **Generate** / **Regenerate** button, plus ek **Generate all pending** loop button (ek-ek karke, progress text ke saath, taki API quota safe rahe).
- Generate hone ke baad inline **Preview** (rendered theory).

## 3. Theory kaise banegi (content rules)

Chapter ke saare `upsc_questions` rows lo, **`serial_no` ke serial order me** (chahe DB me MCQ/statement/match mixed ho). Har row se sirf yeh feed karo:
- `question_text`, `statements`, `list_i`/`list_ii`, options + `correct_option`
- `explanation_hinglish`, `why_a..why_d`, `ncert_source`, `ncert_extra`

Model ko instructions:
- Output **Hinglish** me, markdown.
- Structure = actual history/NCERT book jaisa **chronological / logical serial flow** — random question order ko re-sequence karke topic-wise timeline banao (e.g. Prehistory → Indus → Vedic → Mahajanapadas …), na ki "Q1, Q2, Q3" style.
- **Bold subheadings** (`##` / `###`) har section pe, uske andar short paragraphs + bullet points.
- Facts sirf diye gaye questions/solutions/NCERT extra se — koi bahar ka naya content invent nahi.
- **Bahut kam visual charts** (1–3 per chapter max): simple markdown tables (timeline, ruler–dynasty, list-I/list-II match wale data se) — yahi "visual chart" ka role karenge.
- Chapter ke end me ek chhota **"Yaad rakhne wale points"** bullet block.
- Bade chapters ke liye questions ko batches me bhej ke section-wise generate karenge, phir merge — taki output truncate na ho.

## 4. Backend

**Naya table** `public.upsc_chapter_theory`:
- `id`, `subject`, `chapter_no`, `chapter_name`, `theory_md` (text), `question_count`, `generated_at`, `updated_at`
- unique (`subject`, `chapter_no`)
- RLS: sabhi logged-in users ko `SELECT`; insert/update sirf `is_admin()`. GRANTs ke saath (authenticated + service_role).

**Nayi edge function** `upsc-theory-generate`:
- Input: `subject`, `chapter_no`, optional `force`
- Questions serial-wise fetch → batches → existing Gemini key-rotation helper (`_shared/gemini.ts`, 32 keys + HF fallback) se Hinglish theory generate → merge → table me upsert
- Response: `{ ok, chars, question_count }`
- Admin-only check (JWT email / `is_admin`).

## 5. User side (padhne ke liye)

- `UpscSubjectPage` ke chapter cards pe ek **"📖 Theory"** button (sirf tab dikhe jab us chapter ki theory generated ho).
- Nayi route `/upsc/:subject/theory/:chapterNo` → `UpscTheory.tsx`:
  - Book-style reading layout (amber/white theme jaisa abhi UPSC me hai), max-width prose, bold subheadings, tables styled.
  - Top pe sticky bar: chapter name + **"Practice this chapter"** button (seedha us chapter ke serial range wali practice pe le jaye).
  - Mobile responsive.
- Markdown rendering ke liye `react-markdown` + `remark-gfm` (tables ke liye) add karenge.

## Technical notes

- Theory DB me store hoti hai, isliye ek baar generate → uske baad zero AI cost pe padhna.
- Regenerate se purani theory overwrite hogi.
- Long chapters ke liye batch+merge, aur per-request delay taaki daily quota na phate.
