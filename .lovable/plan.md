

# PDF Reader with AI Chat & Auto-Play Mode

## What You're Getting

1. **PDF Viewer** - Upload and read any PDF (even 1000+ pages) right inside your app
2. **Page Thumbnails** - Left sidebar showing all page previews (like the SmallPDF screenshot you shared)
3. **AI Chat Sidebar** - Chat with AI about the PDF content (summarize, ask questions, explain)
4. **Auto-Play Mode** - Pages auto-advance like a slideshow, with YOUR manual control over the timing (e.g., every 10 seconds, 30 seconds, etc.)
5. **Smart Storage** - PDFs are NOT stored on cloud permanently. They stay in your browser only (no cloud storage cost!)

---

## Storage Solution (No Extra Cost!)

Since you're worried about storage costs, here's the approach:

- PDFs will be loaded **client-side only** using the browser's memory
- The PDF file stays in your browser session - it is NOT uploaded to any server
- For AI chat, only the **text of the current page (or selected pages)** is sent to AI - not the whole PDF
- When you close/refresh the browser, the PDF is gone (you just re-open it next time)
- This means **zero cloud storage cost**

---

## How It Will Look

```text
+------------------------------------------------------------------+
|  [Back]  Polity Analysis By Clear Vision       [Auto-Play: OFF]  |
+------------------------------------------------------------------+
|  Page      |                                    |  AI Chat        |
|  Thumbnails|     PDF Page Content               |                 |
|            |     (rendered at full size)         |  [Summarize]    |
|  [1] thumb |                                    |  [Explain]      |
|  [2] thumb |                                    |                 |
|  [3] thumb |     Current page displayed          |  User: What is  |
|  [4] thumb |     here with zoom controls         |  this about?    |
|  ...       |                                    |                 |
|            |                                    |  AI: This page  |
|            |                                    |  covers...      |
|            |                                    |                 |
+------------------------------------------------------------------+
|  Page 3 / 14    [<] [>]   Auto-play: [5s v] [Start] [Stop]      |
+------------------------------------------------------------------+
```

---

## Implementation Plan

### 1. PDF Rendering (Client-Side, No Upload)

Use **pdf.js** (Mozilla's open-source PDF renderer) via the `pdfjs-dist` npm package.

- User selects a PDF file from their computer
- PDF is read entirely in the browser (FileReader API)
- Each page is rendered as a canvas image
- Supports PDFs of any size (1000+ pages) - pages render on-demand

### 2. New Component: PdfReaderView

**File:** `src/components/PdfReaderView.tsx`

Three-panel layout:
- **Left panel**: Scrollable page thumbnails (small previews of each page)
- **Center panel**: Current page rendered at full size with zoom
- **Right panel**: AI chat sidebar (collapsible)

Controls:
- Page navigation (prev/next, jump to page)
- Zoom in/out
- Auto-play toggle with configurable interval

### 3. Auto-Play (Slideshow Mode)

**File:** `src/components/PdfAutoPlay.tsx`

- Timer-based page advancement
- User sets interval: 5s, 10s, 15s, 30s, 60s (or custom)
- Play/Pause/Stop controls
- Progress bar showing time until next page
- Keyboard shortcuts: Space to pause/resume, arrow keys to skip

### 4. AI Chat Sidebar

**File:** `src/components/PdfChatSidebar.tsx`

Uses Lovable AI (already configured, no extra API key needed):
- Extracts text from current page using pdf.js
- Sends page text to AI for summarization/Q&A
- Quick action buttons: "Summarize this page", "Explain in simple terms", "Key points"
- Full chat history within the session

**Backend:** `supabase/functions/pdf-chat/index.ts`
- Edge function that calls Lovable AI gateway
- Streaming responses for real-time feel
- System prompt optimized for educational content analysis

### 5. Navigation Updates

- Add "PDF Reader" to sidebar navigation
- New view type: `pdf-reader`
- PDF upload entry point from sidebar or a dedicated section

---

## Technical Details

### PDF.js Setup

New dependency: `pdfjs-dist` (Mozilla's PDF rendering library)

```text
- Load PDF from File input (no server upload)
- getPage(pageNumber) -> render to canvas
- getTextContent() -> extract text for AI chat
- Thumbnails: render each page at small scale
```

### Auto-Play Logic

```text
1. User sets interval (e.g., 10 seconds)
2. Timer starts counting down
3. When timer hits 0 -> advance to next page, reset timer
4. User can pause/resume/stop anytime
5. Stops automatically on last page
```

### AI Chat Flow

```text
1. User clicks "Summarize" or types question
2. Current page text extracted via pdf.js getTextContent()
3. Text + user question sent to edge function
4. Edge function calls Lovable AI gateway (streaming)
5. Response streamed back to chat UI
```

### Storage Strategy

- PDF file: **Browser memory only** (no cloud upload)
- Chat history: **Session only** (lost on refresh)
- No database tables needed
- No storage buckets needed
- **Cost: Zero**

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/PdfReaderView.tsx` | Create | Main PDF viewer with 3-panel layout |
| `src/components/PdfAutoPlay.tsx` | Create | Auto-play controls and timer |
| `src/components/PdfChatSidebar.tsx` | Create | AI chat panel for PDF Q&A |
| `supabase/functions/pdf-chat/index.ts` | Create | Edge function for AI chat |
| `src/pages/Index.tsx` | Modify | Add pdf-reader view |
| `src/components/Sidebar.tsx` | Modify | Add PDF Reader nav item |
| `src/stores/studyStore.ts` | Modify | Add minimal PDF state |

### Dependencies to Add
- `pdfjs-dist` - Mozilla's PDF rendering engine

---

## Summary

- PDF opens **locally in browser** (no cloud storage, no cost)
- Page thumbnails on left, full page in center, AI chat on right
- Auto-play mode with **your control** over timing
- AI can summarize, explain, answer questions about any page
- Works with PDFs of any size (1000+ pages)
- All free - uses Lovable AI which is already configured

