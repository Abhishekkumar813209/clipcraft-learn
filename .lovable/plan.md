## Add CSV upload → AI extract to Admin Upload

Right now uploader sirf PDF aur paste-text accept karta hai. Add a third path: upload `.csv` file, parse client-side, send as text to the same `admin-question-extract` edge function (Raw CSV → AI extract).

### UI changes — `src/pages/admin/AdminUpload.tsx`
- Next to "Choose PDF" / "Paste text instead", add **"Choose CSV"** button (`accept=".csv,text/csv"`).
- On select:
  - Read file as text (FileReader).
  - Show summary: filename, row count, first 3 rows preview.
  - Store raw CSV text in a new `csvText` state.
- New **"Extract from CSV"** button → calls a new `extractFromCsv()` that:
  - Chunks rows (keep header row in every chunk) up to ~6000 chars.
  - For each chunk, invokes `admin-question-extract` with `pageText = csvChunk`, current `contentType`, book/topic/subtopic, answerKey.
  - Logs to `diagLog` same as paste mode: `Chunk i · sent X chars · got Y questions`.
  - Pushes results into `questions` for review/save (existing flow).

### Edge function — `supabase/functions/admin-question-extract/index.ts`
- No schema change needed; it already accepts `pageText` + `contentType`.
- Minor: append a hint line when input looks like CSV ("Input is CSV; treat first row as headers; each subsequent row is one question/entry") to improve extraction quality. Detect by presence of commas + newline pattern, or pass an explicit `format: 'csv'` flag from frontend.

### No backend / schema / RLS changes
Save flow re-uses existing `admin_questions` insert.

### Out of scope (can add later if needed)
- Direct CSV → DB insert (no-AI mode) for ready MCQs.
- XLSX support.

### Files touched
- `src/pages/admin/AdminUpload.tsx` (UI + chunker + handler)
- `supabase/functions/admin-question-extract/index.ts` (CSV hint in prompt)
