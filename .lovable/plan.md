
# Fixes and Enhancements for PDF Reader

## Issues to Fix

### 1. Translation Showing Previous Page's Content (Bug Fix)
The root cause: when you change pages, the `useEffect` at line 160 fires `handleLanguageSelect(activeLanguage)` immediately, but `pageText` (used in the API call at line 215) still holds the **old page's text** because `renderPage` is async and hasn't updated `pageText` yet. So the translation request sends the previous page's text.

**Fix:** Instead of relying on `pageText` state, extract text directly from `pdfDoc` inside `handleLanguageSelect` for the current page. This guarantees fresh text.

### 2. Rate Limiting on Fast Page Changes
When you flip pages quickly, each page triggers a translation API call, overwhelming the backend. 

**Fix:** Add a debounce (e.g., 800ms) to the auto-translate `useEffect` so it waits for you to settle on a page before firing the translation request. Also cancel any in-flight fetch when a new page is selected.

### 3. Custom Timings for Auto-Play
Currently only preset values (5s, 10s, 15s, 30s, 60s). 

**Fix:** Add a "Custom" option that shows a small number input where you can type any value in seconds.

### 4. Quiz Question Types and Custom Count
Currently only MCQ and short answer with preset counts (3, 5, 8, 10).

**Fix:** 
- Add checkboxes for question types: MCQ, True/False, Fill in the Blanks, Multiple Correct, Short Answer
- Add a custom number input alongside the preset buttons so you can type any number (1-20)
- Update the edge function prompt to generate the selected question types
- Update `PdfQuizPanel` to render True/False as radio buttons, Fill in the Blanks as text inputs with blanks, and Multiple Correct as checkboxes

### 5. Parallel/Prefetch Translation
When you select Hindi/Hinglish, automatically start translating the next 2-3 pages in the background so they're cached and ready when you navigate.

**Fix:** After a successful translation, queue background fetches for pages `currentPage+1`, `currentPage+2`, etc. (skipping already cached ones). Use a simple sequential queue with a small delay between requests to avoid rate limits.

---

## Technical Details

### File: `src/components/PdfReaderView.tsx`

**Translation bug fix:**
- Modify `handleLanguageSelect` to accept an optional `pageNum` parameter (defaults to `currentPage`)
- Extract text directly: `const page = await pdfDoc.getPage(pageNum); const content = await page.getTextContent(); const text = content.items.map(i => i.str).join(' ');`
- Use this fresh text in the API call instead of `pageText` state
- In the auto-translate `useEffect`, wrap with a debounce timer (800ms) and pass `currentPage` explicitly

**Rate limiting fix:**
- Add a `translateTimeoutRef` to debounce the auto-translate effect
- Add an `AbortController` ref to cancel in-flight translation requests when page changes

**Prefetch translation:**
- After a successful translation, call a `prefetchTranslations` function that sequentially translates pages `currentPage+1` to `currentPage+3` (if not cached), with 500ms gaps between requests
- Use a ref to track if prefetch is active and cancel it on page change

### File: `src/components/PdfAutoPlay.tsx`

**Custom timing:**
- Add a "Custom" entry to the intervals list
- When selected, show a small number input (min 1, max 300)
- Store custom value in state, use it as the interval

### File: `src/components/PdfReaderView.tsx` (Quiz section)

**Quiz types and custom count:**
- Add state: `quizTypes` as a Set of selected types (default: all selected)
- Add checkboxes in the quiz popover for: MCQ, True/False, Fill in the Blanks, Multiple Correct, Short Answer
- Add a custom number input next to the preset buttons
- Pass `quizTypes` array to the edge function

### File: `supabase/functions/pdf-chat/index.ts`

**Quiz types in prompt:**
- Accept `questionTypes` array parameter
- Update the system prompt to instruct the AI to generate the specified mix of question types
- Add new type enums: `mcq`, `true_false`, `fill_blank`, `multiple_correct`, `short`

### File: `src/components/PdfQuizPanel.tsx`

**Render new question types:**
- `true_false`: Two radio buttons (True / False)
- `fill_blank`: Text shown with `___` blanks, input field below
- `multiple_correct`: Checkboxes instead of radio buttons (multiple selections allowed)
- Existing `mcq` and `short` stay as-is

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/PdfReaderView.tsx` | Fix translation bug (extract text directly), debounce auto-translate, prefetch next pages, quiz type checkboxes + custom count |
| `src/components/PdfAutoPlay.tsx` | Add custom timing input option |
| `src/components/PdfQuizPanel.tsx` | Render true/false, fill-in-blank, multiple-correct question types |
| `supabase/functions/pdf-chat/index.ts` | Accept `questionTypes` param, update quiz prompt for new types |
