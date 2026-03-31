

## Plan: Add "Close PDF" Button to Upload a New One

### Problem
Once a PDF is loaded, there's no way to close it and return to the upload screen. The `clearPdfState()` function exists but is never called. Since IndexedDB now persists the PDF, even navigating away and back restores the old PDF — you're stuck with it.

### Fix

**File: `src/components/PdfReaderView.tsx`**

1. Add a "Close" / "Remove PDF" button in the top toolbar (next to the Back button) that:
   - Calls `clearPdfState()` to wipe IndexedDB
   - Resets component state (`pdfDoc`, `fileName`, `totalPages`, etc.) back to initial values so the upload screen shows again
2. This lets users close the current PDF and upload a new one without leaving the page.

### Files Modified

| File | Change |
|------|--------|
| `src/components/PdfReaderView.tsx` | Add a close/remove button that calls `clearPdfState()` and resets all PDF state to show the upload screen |

