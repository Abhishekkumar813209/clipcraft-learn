

## Plan: Create Hidden `/humor` Route — AI Humor Coach

A private route (not shown in sidebar) where you paste conversation transcripts and AI analyzes humor opportunities, teaches joke-writing techniques, and trains you in the style of comedians like Samay Raina.

### 1. New Edge Function: `supabase/functions/humor-coach/index.ts`

- Uses the existing `callGemini` round-robin utility
- Accepts a conversation/transcript text and returns humor analysis
- System prompt crafted to act as a standup comedy coach that:
  - Identifies moments where a joke could have been cracked
  - Suggests specific punchlines you could have used
  - Explains the humor technique (callback, misdirection, observational, self-deprecating, etc.)
  - Gives a "Samay Raina style" take on the situation
  - Rates humor difficulty and provides practice exercises
- Supports streaming for real-time response rendering

### 2. New Page: `src/pages/HumorCoach.tsx`

- Full-page layout with:
  - Large textarea to paste conversation/transcript
  - "Analyze Humor" button
  - Streaming AI response area rendered with markdown
  - History of past analyses (stored in state, not DB — keeps it lightweight and private)
- No sidebar link — only accessible by typing `/humor` in the URL
- Protected by auth (reuses existing auth check)

### 3. Route Registration: `src/App.tsx`

- Add `/humor` as a standalone authenticated route (similar to `/quizzes/:quizId`)
- Not nested under Index layout to keep it completely hidden from sidebar

### Technical Details

- **Model**: `gemini-2.5-flash` via `callGemini`
- **Streaming**: SSE streaming for real-time coach response
- **No DB tables needed** — stateless, no persistence
- **No sidebar entry** — completely hidden route
- **Auth-protected** — requires login

