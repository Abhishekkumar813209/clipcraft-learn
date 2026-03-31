

## Plan: Make PDF Reader Mobile-Responsive

### Problem
The PDF reader layout is desktop-only. On mobile:
- The thumbnail sidebar (fixed `w-24`) eats valuable screen space
- The top toolbar buttons overflow and get clipped (`flex-wrap` helps but not enough)
- The page navigation bar (`absolute bottom-4 left-1/2`) may overlap or get hidden
- The chat sidebar and quiz panel take full width, blocking the PDF
- Canvas renders at desktop zoom (1.2x) which is too wide for small screens

### Changes

**File: `src/components/PdfReaderView.tsx`**

1. **Hide thumbnail sidebar on mobile** — Add `hidden md:block` to the thumbnail `ScrollArea` (line 607). Thumbnails are not usable on small screens.

2. **Responsive top toolbar** — Shrink/hide labels on mobile. Hide text labels like "Summarize", "Quiz", "Chat" on small screens (keep icons only). Reduce gaps. Make the toolbar horizontally scrollable if needed (`overflow-x-auto`).

3. **Responsive canvas zoom** — Set initial zoom based on screen width. On mobile, default to a zoom that fits the screen width (e.g., `window.innerWidth / 612` where 612 is standard PDF point width). Add a `useEffect` or initial calculation.

4. **Responsive page navigation** — Ensure the bottom nav bar stays visible and doesn't clip on mobile. Add responsive padding/positioning.

5. **Chat sidebar as drawer on mobile** — On mobile, render `PdfChatSidebar` as a full-screen overlay or bottom sheet instead of a side panel that squishes the PDF.

6. **Quiz panel responsive** — Ensure `PdfQuizPanel` is scrollable and usable on mobile (full-width overlay).

7. **Upload screen** — Already uses `flex-col items-center justify-center` so should work, but verify padding.

### Technical Details

| Area | Desktop (md+) | Mobile (<md) |
|------|--------------|-------------|
| Thumbnails | 96px sidebar | Hidden |
| Toolbar | Full labels + icons | Icons only, scrollable |
| PDF zoom | 1.2x default | Auto-fit to screen width |
| Chat | Side panel | Full overlay / drawer |
| Quiz | Side panel | Full-width overlay |
| Page nav | Centered floating bar | Same, smaller padding |

### Files Modified

| File | Change |
|------|--------|
| `src/components/PdfReaderView.tsx` | Hide thumbnails on mobile, responsive zoom, toolbar icons-only on mobile, chat/quiz overlay on mobile |

