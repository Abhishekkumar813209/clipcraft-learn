

## Plan: Keep PDF in Memory Across Quiz Navigation

### Problem
When navigating to `/quizzes/:id`, the `PdfReaderView` component unmounts, destroying the parsed `PDFDocumentProxy`, canvas renders, and thumbnails. On return, it reads the data URL from IndexedDB, re-parses the entire PDF, re-renders the page, and regenerates all thumbnails — causing the slow "Restoring your PDF…" loading screen.

### Solution
Create a module-level in-memory cache that survives component unmount/remount (but not full page reload). Store the parsed `PDFDocumentProxy`, thumbnail map, and current data URL. On remount, check this cache first — if it matches, skip the IndexedDB read and PDF parsing entirely, restoring the viewer instantly.

### Files Modified

| File | Change |
|------|--------|
| `src/lib/pdfStorage.ts` | Add an in-memory cache object (`pdfMemoryCache`) that holds `PDFDocumentProxy`, `dataUrl`, `thumbnails` Map, and `fileName`. Export get/set/clear helpers. |
| `src/components/PdfReaderView.tsx` | On mount: check `pdfMemoryCache` first — if populated, use cached `doc` + thumbnails directly (skip IndexedDB + re-parse). On PDF load: populate the cache. On "Close": clear the cache too. |

### How It Works

```text
First load (upload or IndexedDB restore):
  → Parse PDF → render → generate thumbnails
  → Store doc + thumbnails in pdfMemoryCache

Navigate to quiz → PdfReaderView unmounts (cache survives)

Navigate back → PdfReaderView mounts:
  → Check pdfMemoryCache → found!
  → Set pdfDoc, thumbnails, page from cache
  → Render current page canvas (instant, no re-parse)
  → Skip "Restoring your PDF…" entirely

Full page reload → cache is empty → fall back to IndexedDB restore (existing behavior)
```

### Memory Cache Shape
```typescript
// src/lib/pdfStorage.ts
let memoryCache: {
  doc: PDFDocumentProxy;
  dataUrl: string;
  fileName: string;
  thumbnails: Map<number, string>;
} | null = null;
```

Single-file cache at module scope — no new dependencies, no Zustand needed. The existing IndexedDB persistence remains as the fallback for hard reloads.

