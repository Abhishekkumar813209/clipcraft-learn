

# Three Fixes: Simpler Hindi, Summary Page Range, Sidebar Visibility

## 1. Simpler Hindi Translation

**Problem:** The current translation prompt asks for detailed explanations, headings, and breakdowns -- way more than what's on the page. 

**Fix:** Rewrite the system prompt in `supabase/functions/pdf-chat/index.ts` to:
- Only translate the page content into simple Hindi
- Add a one-line contextual explanation if needed
- No extra headings, no elaborate breakdowns
- Strictly stick to what's on the page

**File:** `supabase/functions/pdf-chat/index.ts` (lines 22-32)

New prompt will be something like:
> "Translate the following text into simple, easy-to-understand Hindi. Stay strictly within the content of the text -- do not add extra information. If a sentence is complex, rephrase it simply. No headings, just the translated text with brief clarification where needed."

---

## 2. Summary with Page Range Selection

**Problem:** The "Summarize" quick action in the chat sidebar only summarizes the current page. User wants to select a page range (e.g., pages 5-12) and get a combined summary.

**Fix:** Add page range inputs to `PdfChatSidebar.tsx`:
- Two small number inputs (From page / To page) that appear when clicking "Summarize"
- When submitted, extract text from all pages in the range, combine it, and send to AI for summary
- Need to pass `pdfDoc` reference to PdfChatSidebar so it can extract text from multiple pages

**Files:** 
- `src/components/PdfChatSidebar.tsx` - Add page range UI and multi-page text extraction
- `src/components/PdfReaderView.tsx` - Pass `pdfDoc` and `totalPages` props to PdfChatSidebar

---

## 3. Sidebar Button Visibility Fix

**Problem:** Some sidebar elements use `text-foreground` and `text-muted-foreground` which resolve to dark colors in light mode, but the sidebar background is always dark (`240 10% 5%`). So text becomes invisible.

Specific issues in `Sidebar.tsx`:
- Line 28: `text-foreground` on "StudyBrain" title -- dark text on dark bg
- Line 29: `text-muted-foreground` on subtitle -- dark text on dark bg  
- Line 65: `text-muted-foreground` on "Your Exams" label
- Line 111: `text-muted-foreground` on Settings button

**Fix:** Replace these with sidebar-specific color classes:
- `text-foreground` becomes `text-sidebar-foreground` 
- `text-muted-foreground` becomes `text-sidebar-foreground/60` (60% opacity for muted effect)

**File:** `src/components/Sidebar.tsx`

---

## Files to Modify

| File | Change |
|------|--------|
| `supabase/functions/pdf-chat/index.ts` | Simplify Hindi translation prompt |
| `src/components/PdfChatSidebar.tsx` | Add page range selector for summary, accept pdfDoc prop |
| `src/components/PdfReaderView.tsx` | Pass pdfDoc and totalPages to chat sidebar |
| `src/components/Sidebar.tsx` | Fix text color classes to use sidebar-specific tokens |

No new files. No database changes. Edge function redeploy needed for the translation prompt change.
