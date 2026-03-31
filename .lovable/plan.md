

## Plan: Fix PDF State Loss on Mobile

### Problem
When you upload a PDF on mobile and the keyboard/search bar appears, the browser resizes the viewport which can cause the page to reload. The PDF is stored as a base64 data URL in `sessionStorage`, which has a ~5MB limit. Large PDFs silently fail to save (the `catch` at line 255 just warns), so on reload the state is empty and you're back at the upload screen. Desktop doesn't hit this because the component stays mounted.

### Solution
Replace `sessionStorage` with IndexedDB (via the `localforage` library) for storing the PDF binary. IndexedDB supports hundreds of MB, works reliably on mobile, and survives page reloads.

### Changes

**1. Install `localforage`** (tiny IndexedDB wrapper)

**2. Create `src/lib/pdfStorage.ts`** — helper module:
- `savePdfFile(dataUrl, fileName, page, zoom)` — stores PDF data + metadata in IndexedDB
- `loadPdfState()` — retrieves stored state
- `updatePdfMeta(page, zoom, showQuiz, quizQuestions)` — updates metadata without re-saving the PDF blob
- `clearPdfState()` — removes stored data

**3. Update `src/components/PdfReaderView.tsx`**:
- Replace all `sessionStorage.getItem/setItem(PDF_SESSION_KEY)` calls with async `localforage` helpers
- On upload (`handleFileUpload`): call `savePdfFile()` instead of `sessionStorage.setItem`
- On mount (restore effect): call `loadPdfState()` instead of `sessionStorage.getItem`
- On page/zoom changes: call `updatePdfMeta()` instead of patching sessionStorage JSON
- On quiz state changes: include quiz data in `updatePdfMeta()`
- Keep `sessionStorage` for quiz answer state (`pdf-quiz-state` in PdfQuizPanel) since that's small

### Files Modified

| File | Change |
|------|--------|
| `package.json` | Add `localforage` dependency |
| `src/lib/pdfStorage.ts` | New helper for IndexedDB PDF storage |
| `src/components/PdfReaderView.tsx` | Replace sessionStorage with localforage calls |

