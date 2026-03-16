

## Plan: BPSC PYQ Upload & Smart Extraction from PDFs

### How It Works
1. User uploads a PYQ PDF on the `/bpsc/pyq` page
2. PDF is read client-side (existing pdfjs-dist pattern — zero cloud storage)
3. Extracted text is sent to a new edge function `bpsc-pyq-extract` which uses AI to parse individual MCQ questions, classify them by BPSC topic, and return structured data
4. User reviews extracted questions, edits if needed, then saves to database
5. A separate PYQ Practice view lets users filter by **topic** and **year**

### Database Changes

**Extend `ssc_exam` enum** to include `'BPSC'` so PYQ questions can be tagged with `exam = 'BPSC'`.

No new tables needed — reuses `ssc_questions` with `is_pyq = true`, `exam = 'BPSC'`, and `year` set.

### New Edge Function: `supabase/functions/bpsc-pyq-extract/index.ts`

- Receives: `{ pageText: string, year: number }`
- Uses Lovable AI (gemini-3-flash-preview) with tool calling to extract structured output:
  - `question_text`, `options[]`, `correct_option`, `explanation`, `topic` (auto-classified into BPSC topics), `difficulty`
- Returns array of extracted questions
- Handles 429/402 errors

### New Files

| File | Purpose |
|------|---------|
| `supabase/functions/bpsc-pyq-extract/index.ts` | AI extraction edge function |
| `src/pages/BpscPyqUpload.tsx` | Upload PDF → extract → review → save flow |
| `src/pages/BpscPyqPractice.tsx` | Filter by topic + year, then practice PYQs |

### Files to Edit

| File | Change |
|------|--------|
| `src/App.tsx` | Add `/bpsc/pyq` and `/bpsc/pyq/upload` routes |
| `src/pages/BpscLayout.tsx` | Enable PYQ nav item, add Upload sub-link |
| `supabase/config.toml` | Add `bpsc-pyq-extract` function config |

### UI Flow

**PYQ Upload Page (`/bpsc/pyq/upload`)**:
- File picker for PDF
- Year input (e.g. 2023, 2022)
- "Extract Questions" button → shows loading while AI processes
- Review table showing extracted questions with topic tags
- User can edit/delete individual questions before saving
- "Save All to Database" button → inserts into `ssc_questions` with `is_pyq=true, exam='BPSC', year=<selected>`

**PYQ Practice Page (`/bpsc/pyq`)**:
- Filter bar: Topic dropdown + Year dropdown (populated from DB)
- Question cards in practice session format (reuses BpscPracticeSession pattern)
- Shows year badge on each question

### AI Extraction Prompt Strategy
The edge function prompt instructs AI to:
- Parse each MCQ from the text (question + 4 options + answer)
- Auto-classify into one of the 9 BPSC topics
- Generate brief explanation if not present
- Return via tool calling for structured JSON output

