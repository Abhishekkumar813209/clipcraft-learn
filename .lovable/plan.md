

## Plan: Increase Max Quiz Questions from 20 to 40

Three places need the limit changed from 20 to 40:

### File 1: `src/components/PdfReaderView.tsx`
- **Line 430**: Change `Math.min(..., 20)` → `Math.min(..., 40)` (the actual cap on question count sent to AI)
- **Line 625**: Change `max={20}` → `max={40}` (the HTML input max attribute)

### File 2: `supabase/functions/pdf-chat/index.ts`
- **Line ~77**: Change `Math.min(Math.max(numQuestions || 4, 1), 20)` → `Math.min(Math.max(numQuestions || 4, 1), 40)` (server-side cap)

Three lines across two files — no other changes needed.

