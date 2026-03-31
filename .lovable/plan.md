

## Plan: Send AI-Generated Quiz to WhatsApp via Twilio

### What It Does
After a quiz is generated in the PDF reader, a "Send to WhatsApp" button appears. User enters their WhatsApp number once (saved for future use), and the quiz questions + correct answers are formatted and sent as a WhatsApp message via Twilio, including the PDF name and page range.

### Prerequisites
1. **Connect Twilio** — Link the Twilio connector to this project (provides `TWILIO_API_KEY` and uses `LOVABLE_API_KEY` for gateway auth)
2. **User provides their Twilio WhatsApp-enabled "From" number** — stored as a secret

### Architecture

```text
PdfQuizPanel (UI)
  └─ "Send to WhatsApp" button
       └─ supabase.functions.invoke('send-quiz-whatsapp', { body })
            └─ Edge Function
                 └─ Twilio Gateway (connector-gateway.lovable.dev/twilio)
                      └─ WhatsApp message delivered
```

### Implementation

**1. Edge Function: `supabase/functions/send-quiz-whatsapp/index.ts`**
- Accepts: `{ phone, pdfName, pageRange, questions }` 
- Validates input with Zod
- Formats quiz as a clean WhatsApp message:
  ```
  📝 Quiz from "Indian Polity.pdf" (Pages 5-8)
  
  Q1. [MCQ] What is Article 21?
  A) Right to Life ✅
  B) Right to Vote
  C) Right to Property
  D) Right to Education
  
  Q2. [True/False] President is elected directly.
  Answer: False ✅
  ...
  ```
- Sends via Twilio gateway using `application/x-www-form-urlencoded`
- Uses `whatsapp:+14155238886` (Twilio sandbox) or user's registered number as `From`

**2. UI Changes: `src/components/PdfQuizPanel.tsx`**
- Add `fileName` prop (passed from PdfReaderView)
- After quiz is generated (questions visible), show a WhatsApp icon button in the header
- On click: show a small popover/dialog asking for phone number (with country code, e.g. `+919876543210`)
- Save the number in `localStorage` so they don't re-enter it
- Call the edge function with quiz data
- Show toast on success/failure

**3. Pass `fileName` from `PdfReaderView.tsx` to `PdfQuizPanel`**
- Already have `fileName` state in PdfReaderView — just pass it as a prop

### Files Modified

| File | Change |
|------|--------|
| `supabase/functions/send-quiz-whatsapp/index.ts` | New edge function: format quiz + send via Twilio gateway |
| `src/components/PdfQuizPanel.tsx` | Add `fileName` prop, WhatsApp send button with phone input |
| `src/components/PdfReaderView.tsx` | Pass `fileName` to PdfQuizPanel |

### Setup Steps (before implementation)
1. Connect Twilio connector to the project
2. Store Twilio WhatsApp "From" number as a secret (`TWILIO_WHATSAPP_FROM`)

