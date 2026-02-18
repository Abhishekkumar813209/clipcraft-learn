
# Two New Features: Side-by-Side Bilingual View + Summary in Top Bar

## What You're Getting

### 1. Side-by-Side Bilingual Reading Mode
When you pick Hindi or Hinglish from the language dropdown, instead of replacing the PDF canvas, the page splits into two columns:
- **Left:** Original PDF canvas (English)
- **Right:** Hindi / Hinglish translation

This lets you read both simultaneously to improve vocabulary and comprehension. All combinations are supported — you see the original PDF alongside whatever language you choose.

### 2. Summary Button in Top Bar
A "Summarize" button directly in the PDF top bar (next to Quiz Me and AI Chat), so you don't need to open the AI Chat sidebar just to summarize. Clicking it opens a compact page-range popover inline — pick From/To pages and hit Go.

---

## How It Will Look

```text
Top bar:
[ Back ] [ filename ] [ zoom - 120% + ↺ ] [ 🌐 English ▾ ] [ ✨ Summarize ] [ 🧠 Quiz Me ] [ 💬 AI Chat ] [ New PDF ]

When Hindi/Hinglish selected → top bar shows bilingual toggle:
[ 📖 Side-by-Side ] (active) or [ 🌐 Overlay ] (single column)

Main view (side-by-side mode):
+-------------------------+-------------------------+
|  Original PDF (English) |  हिंदी / Hinglish       |
|  [canvas renders here]  |  [translated text here] |
+-------------------------+-------------------------+

Main view (overlay/single mode - existing behavior):
+-----------------------------------------------+
|  Translated text fills the full width         |
+-----------------------------------------------+
```

---

## Implementation Details

### Files to Modify

#### `src/components/PdfReaderView.tsx`

**New state:**
- `viewMode: 'overlay' | 'split'` — default `'split'` when a language is selected (English stays as canvas-only)

**Language dropdown change:**
- When user picks Hindi/Hinglish → auto-switch to `split` view mode
- Add a small secondary toggle (two icon buttons: "Split" / "Full") that appears only when a non-English language is active

**Summary button in top bar:**
- Add a `Summarize` button between zoom controls and language dropdown
- Clicking opens an inline popover (using Radix Popover) with:
  - "From page" number input (default: current page)
  - "To page" number input (default: current page + 4, capped at totalPages)
  - "Go" button that extracts text from the range and streams a summary into a result panel (either opens AI Chat sidebar automatically, or shows a mini result modal)
- Uses the existing `extractTextFromPages` logic (same as chat sidebar) — move the function to a shared utility or duplicate it here

**Split view layout:**
- Replace the single `<ScrollArea className="flex-1">` with a flex row of two panels when `viewMode === 'split'` and a non-English language is active:
  - Left: scrollable canvas panel (50% width)
  - Right: scrollable markdown panel (50% width) with translated text
- When language = English OR viewMode = 'overlay': show existing single-panel behavior

#### `src/components/PdfChatSidebar.tsx`
- No structural changes needed — Summarize is being moved to top bar
- Keep the existing Summarize button in the sidebar too (users can still use it from there)
- The `onTranslate` quick action button label can be updated to reflect current language state

---

## Summary Flow in Top Bar

```text
User clicks "Summarize"
  → Popover opens with page range inputs
  → User sets range (e.g. 5 to 12) and clicks Go
  → AI Chat sidebar auto-opens (if not already open)
  → Summary streamed into chat as an assistant message
  → Popover closes
```

This reuses the exact same streaming chat infrastructure already in `PdfChatSidebar`. The summary result goes into the chat history naturally.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/PdfReaderView.tsx` | Add `viewMode` state, split-view layout, Summary button with popover in top bar |
| `src/components/PdfChatSidebar.tsx` | Expose a method / accept a prop to trigger a summary from outside (for the top bar summary button) |

No edge function changes. No new components needed. No database changes.
