

## Plan: Page-by-Page AI Extraction with Page Range Selector

### Problem
The current approach concatenates all PDF text into one big string, then splits by character count into chunks. This means:
- AI gets fragments of questions split mid-sentence
- Only 1 API call covers the whole PDF, extracting very few questions
- User has no control over which pages to process
- Your PDF appears to be image-based (scanned), so pdfjs extracts no text — the AI hallucinated 9 questions from empty input

### Solution

**1. Page-by-page processing** — Send each page's text to the AI individually (or in small batches of 3-5 pages). This ensures complete questions per chunk and lets us show real-time progress.

**2. Page range selector** — After PDF is loaded, show a "From page / To page" input so users can choose which pages to extract from (e.g., pages 5–40, skipping cover/instructions).

**3. Per-page text preview** — After loading, show a quick preview of how much text each page has. If pages have no text (scanned PDF), warn the user that the PDF is image-based and extraction may not work well.

**4. Delay between API calls** — Add a 1-second delay between page batches to avoid rate limiting.

### Changes

**`src/pages/BpscPyqUpload.tsx`**:
- Store text per-page in an array (`string[]`) instead of one big string
- Add `startPage` and `endPage` number inputs (default: 1 to pageCount)
- Show text character count per page after loading (warn if pages are empty)
- Change `handleExtract` to process pages in batches of 3-5, sending each batch as a separate API call with a 1s delay between calls
- Show progress like "Processing pages 5-9 of 40... (found 12 questions so far)"

**`supabase/functions/bpsc-pyq-extract/index.ts`**:
- No changes needed — it already accepts `pageText` and returns questions

### UI Addition
After PDF is loaded, below the file picker:
```
Page Range:  [From: 1] — [To: 46]    (46 pages total)
⚠️ Pages 1-3 have very little text — consider starting from page 4

[Extract Questions with AI]
```

### Processing Flow
```
For pages startPage to endPage, in batches of 3:
  1. Concatenate 3 pages of text
  2. Call bpsc-pyq-extract with that text
  3. Append returned questions to results
  4. Update progress: "Batch 4/14 — 28 questions found"
  5. Wait 1 second
  6. Next batch
```

