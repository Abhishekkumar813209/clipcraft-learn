

## Plan: Persist PDF State Across Tab Changes

### Problem
When navigating away from the PDF reader (`/pdf`) to another tab and back, React Router unmounts `PdfReaderView`, destroying all state — the loaded PDF, current page, zoom, translations, etc. The user has to re-upload the PDF every time.

### Solution
Store the PDF file as a base64 data URL in `sessionStorage` along with key state (page number, zoom, filename). On remount, restore the PDF from sessionStorage automatically — no re-upload needed.

### Changes

**`src/components/PdfReaderView.tsx`**

1. **On file upload** — after reading the file, also convert it to a base64 data URL and save to `sessionStorage` along with `fileName`, `currentPage`, and `zoom`
2. **On mount** — check `sessionStorage` for a saved PDF. If found, reload the PDF document from the stored data URL and restore page/zoom state. This skips the upload screen entirely.
3. **On page/zoom change** — update the stored values in `sessionStorage`
4. **On explicit close/clear** — remove the sessionStorage entry

This approach:
- Keeps the zero-storage-cost policy (no server uploads)
- Survives tab switches within the same session
- Has a ~50MB practical limit per sessionStorage entry which covers most PDFs
- Doesn't require changes to routing or parent components

### Files

| File | Change |
|------|--------|
| `src/components/PdfReaderView.tsx` | Add sessionStorage persistence for PDF data URL + restore on mount |

