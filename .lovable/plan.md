
## Diagnosis (why 0 questions on a vocab page)

Looking at the screenshot, the source PDF is **Black Book of English Vocabulary** — those pages are word-lists (word → meaning → synonyms), **not MCQs**. The extractor prompt in `admin-question-extract/index.ts` asks Gemini for "4-option MCQs". On a vocab page Gemini correctly returns `questions: []` because there are literally no MCQs on the page → "0 questions extracted".

Secondary issue: there is no diagnostic UI telling you whether OCR text was actually long/usable. Today you only see "8 pages transcribed" but not "transcribed text was 12,431 chars" — so a silent empty OCR looks the same as a non-MCQ page.

## Fix

### A. Let the user paste raw text (skip PDF entirely)
Add a collapsible "Paste text manually" section in `AdminUpload.tsx`:
- Big textarea + "Extract from pasted text" button.
- On click, splits the text into chunks of ~6k chars and calls `admin-question-extract` per chunk (same batching as PDF flow).
- Same Book/Topic/Subtopic gating, same review/save flow.
- Useful when user pre-extracts text via ChatGPT/Adobe and just wants to push it to the question bank.

### B. Add a "Content type" selector
Dropdown in upload card: **MCQ (default) · Vocabulary list · Generic Q&A**.

Backend `admin-question-extract/index.ts` picks the right system prompt per type:
- **MCQ**: current prompt.
- **Vocabulary list**: prompt Gemini to read each word entry and SYNTHESIZE one MCQ per word — "Choose the meaning of *X*" with 1 correct meaning + 3 plausible distractors picked from other words on the page. Returns same `{question_text, options[4], correct_option, explanation}` shape so it fits `admin_questions` schema unchanged.
- **Generic Q&A**: same MCQ schema but prompt allows fill-in-blank → MCQ conversion.

### C. Show real diagnostics per batch
In `AdminUpload.tsx` extract loop, after each batch, append a line to a small log panel:
- `Pages 4–6 · sent 4823 chars · got 3 questions`
- `Pages 7–9 · sent 28 chars · got 0 questions (text too short — OCR likely failed for these pages)`

Also surface OCR result length after `runOcrOnPages`:
- `Page 8 · OCR returned 1247 chars` (or "0 chars — re-render at higher scale and retry").

### D. Auto-retry OCR at higher scale on empty result
In `admin-ocr-pages` edge function: if Gemini returns empty content for an image, retry once at the same scale with a stricter prompt ("Even if the page seems blurry, transcribe every visible character. Do not return an empty response unless the page is truly blank."). Client already renders at scale 1.6 — keep that.

## Files
- `supabase/functions/admin-question-extract/index.ts` — accept `contentType: 'mcq' | 'vocab' | 'qa'`, branch system prompt.
- `supabase/functions/admin-ocr-pages/index.ts` — add empty-result retry with stricter prompt.
- `src/pages/admin/AdminUpload.tsx` — add Content Type select, Paste-text mode, diagnostics log panel; pass `contentType` to extract function.

## Out of scope
- Saving vocab into `ssc_vocabulary` table — Black Book entries already live there via the existing `src/data/vocabularyData.json` import. This change only makes the admin uploader emit MCQs from vocab pages so they land in `admin_questions` for quiz use.
