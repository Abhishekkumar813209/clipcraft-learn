
## Goal
Currently `AdminUpload` uses `pdf.js` `getTextContent()`, which returns ~empty strings for scanned/image-only PDFs. Result: thumbnails render fine (preview already works), but extraction sends blank text to Gemini and returns 0 questions. Add automatic OCR so scanned PDFs also produce extracted text + questions.

## Approach
Use **Gemini vision OCR via a new edge function** (no extra dependency, reuses existing key rotation pool). Tesseract.js is rejected because Hindi/multilingual SSC PDFs OCR poorly with it and it bloats the bundle.

### Flow
1. After existing text extraction in `handleFile`, compute `text.trim().length` per page.
2. Mark a page as `needsOcr` if its text length < 40 chars (typical for image-only pages). If >70% of pages need OCR, show a banner: *"Scanned PDF detected — OCR will run when you click Extract."*
3. On **Extract**, before each batch:
   - For pages in the batch where `needsOcr` is true (and no cached OCR yet), render that page to a JPEG dataURL via `pdfDoc.getPage(n).render()` at scale 1.6.
   - POST `{ pageNum, imageBase64 }[]` to a new edge function `admin-ocr-pages` which calls Gemini `google/gemini-3-flash-preview` (or existing `callGemini` helper) with the image parts + prompt: *"Transcribe all visible text verbatim. Preserve question numbering and options. Return plain text only."*
   - Replace the page's text in the local `pages` state with the OCR result (also cache so re-extract doesn't re-OCR).
4. Existing batched call to `admin-question-extract` then runs unchanged on the OCR'd text.

### Files

**New** `supabase/functions/admin-ocr-pages/index.ts`
- CORS + JWT verify (admin check via `is_admin()` RPC, mirroring existing admin functions).
- Body: `{ pages: { pageNum: number; imageBase64: string }[] }` (validate with zod, cap at 5 pages/call).
- Uses shared `_shared/gemini.ts` `callGemini` with multimodal `parts` (inlineData image/jpeg) — extend helper if needed to accept image parts.
- Returns `{ results: { pageNum, text }[] }`.

**Edit** `src/pages/admin/AdminUpload.tsx`
- Extend page state: `{ pageNum, text, needsOcr, ocrDone }`.
- Add `scannedCount` banner + "Run OCR now" optional button (so user can OCR before extracting if they want to preview text).
- In `extract()`, run OCR pass per batch before invoking `admin-question-extract`.
- Update progress messages: `OCR page 4/12...` then `Extracting pages 4–6...`.

**Edit** `src/components/admin/PdfPagePicker.tsx`
- Add small "scanned" badge on thumbs whose page text length is low (pass `scannedPages: Set<number>` prop, optional). Visual cue only.

**Edit** `supabase/functions/_shared/gemini.ts`
- Allow passing `contents` with `inlineData` image parts (current helper likely accepts only text). Minor signature tweak: accept a `parts` array directly when provided.

### Edge cases
- Mixed PDFs (some text, some scanned) — OCR only the blank ones, normal extraction for the rest.
- Large scanned PDFs — keep batch of 3 pages (current) but OCR call also limited to 3 images to stay within Gemini request size.
- OCR failure on a page → keep original empty text, log warning, continue (don't abort batch).
- Quota: each OCR page = 1 Gemini call; warn in the existing "heavy quota" banner when scanned page count > 30.

### Out of scope
- Server-side PDF rasterization (we render on client via pdf.js — no need for Poppler in the edge function).
- Editing/correcting OCR text manually (user can already edit extracted questions afterwards).
