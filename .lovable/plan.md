

# PDF Reader: Hindi Translation Toggle & Auto Quiz Generator

## What You're Getting

1. **Language Toggle (English to Hindi)** - A button in the PDF top bar to translate the current page content into Hindi with simplified explanation. The translated content appears as an overlay/panel replacing the PDF canvas view, so you can toggle between original PDF and Hindi translation.

2. **Auto Quiz Mode** - After reading a page (in either language), click "Generate Questions" to get AI-generated MCQ/short-answer questions based on that page. You answer them inline, and AI checks your answers to confirm you're reading attentively.

---

## How It Will Work

### Language Toggle Flow

```text
[PDF Page in English] --click "Hindi" button--> [Hindi translated + explained version shown as text overlay]
                      --click "English" button--> [Back to original PDF canvas]
```

- When you click "Hindi", AI translates the extracted page text into Hindi with better/simpler explanation
- The translated content replaces the PDF canvas area (as a styled text panel with markdown)
- Toggle back to "English" to see the original PDF page again
- Translation is cached per page so it doesn't re-call AI if you toggle back and forth

### Auto Quiz Flow

```text
[Reading page] --click "Quiz Me"--> [AI generates 3-4 questions based on page content]
               --you answer-->      [AI checks answers and gives feedback]
```

- "Quiz Me" button in the top bar (or quick action in chat sidebar)
- AI generates questions in whichever language is currently active (English or Hindi)
- Questions appear in a modal/panel with input fields
- Submit answers, AI evaluates and gives score + explanations

---

## Implementation Plan

### 1. Update Edge Function: `supabase/functions/pdf-chat/index.ts`

Add support for two new `action` types in the request body:

- `action: "translate"` - Translates page text to Hindi with simplified explanation
- `action: "quiz"` - Generates 3-4 questions based on page text in the specified language
- `action: "check-answers"` - Checks user's answers against the page content

The system prompt will branch based on action type. For translate, it instructs AI to provide Hindi translation with simpler explanation. For quiz, it instructs AI to generate questions in the active language.

### 2. Update `PdfReaderView.tsx`

New state:
- `translatedText: Map<number, string>` - cached Hindi translations per page
- `showTranslation: boolean` - whether to show translated overlay vs PDF canvas
- `isTranslating: boolean` - loading state for translation
- `showQuiz: boolean` - whether quiz modal is open

New UI:
- **"हिंदी" toggle button** in the top bar next to zoom controls
- When active, the center panel shows translated text (styled markdown) instead of canvas
- Button toggles between "हिंदी" and "English"

### 3. Create `PdfQuizPanel.tsx` (New Component)

A modal/overlay component that:
- Shows 3-4 AI-generated questions (MCQ or short answer)
- Has input fields for each answer
- Submit button to check answers
- Shows AI feedback with score and explanations
- Works in both English and Hindi based on active language

### 4. Update `PdfChatSidebar.tsx`

Add two new quick action buttons:
- "हिंदी में समझाओ" (Explain in Hindi) - triggers translation
- "Quiz Me" - triggers quiz generation

---

## Technical Details

### Edge Function Changes

The existing `pdf-chat` function will accept an optional `action` field:

```text
Request body:
{
  messages: [...],
  pageText: "...",
  action: "translate" | "quiz" | "check-answers" | undefined (default = chat),
  language: "hindi" | "english",
  answers: [...] (only for check-answers)
}
```

For `translate`: System prompt instructs to translate to Hindi with simplified explanation, no streaming needed (non-streaming response).

For `quiz`: System prompt instructs to generate 3-4 questions in JSON format using tool calling for structured output.

For `check-answers`: System prompt evaluates answers against page content.

### Translation Caching

- Translations are stored in a `Map<number, string>` in React state
- When toggling to Hindi on a page that's already translated, it shows cached version instantly
- No cloud storage needed, session-only

### Quiz Panel Structure

```text
+----------------------------------+
|  Quiz: Page 5 (Hindi)            |
|                                  |
|  Q1: [question text]             |
|  Your answer: [input field]      |
|                                  |
|  Q2: [question text]             |
|  O Option A  O Option B          |
|  O Option C  O Option D          |
|                                  |
|  Q3: [question text]             |
|  Your answer: [input field]      |
|                                  |
|  [Submit Answers]                |
+----------------------------------+
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/pdf-chat/index.ts` | Modify | Add translate, quiz, check-answers action branching |
| `src/components/PdfReaderView.tsx` | Modify | Add Hindi toggle button, translation overlay, quiz trigger |
| `src/components/PdfQuizPanel.tsx` | Create | Quiz modal with questions, answers, and feedback |
| `src/components/PdfChatSidebar.tsx` | Modify | Add "Hindi" and "Quiz Me" quick actions |

No new dependencies. No database changes. Everything stays client-side and session-only (zero cost).
