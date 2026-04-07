

## Plan: GD (Group Discussion) Prep Module

### What You Get
A full GD preparation page at `/gd` with 4 tabs:

1. **Topic Bank** — 50+ common GD topics organized by category (Current Affairs, Social, Tech, Business, Abstract) with pre-written points FOR and AGAINST each topic
2. **AI Practice** — Pick/enter a topic, write your arguments, get AI feedback on clarity, structure, persuasiveness, and vocabulary
3. **Tips & Strategies** — A reference guide covering opening techniques, body language, dos/don'ts, summarization tips, and common mistakes
4. **Mock Timer** — Timed practice: 2-min thinking phase + 3-min speaking phase with audio cues, track your practice sessions

### What Changes

**New files:**
- `src/pages/GdPrep.tsx` — Main page with 4 tabs (similar structure to existing prep pages)
- `src/data/gdTopics.ts` — Static data: 50+ topics with FOR/AGAINST points, organized by category
- `src/data/gdTips.ts` — Static data: GD strategies, dos/don'ts, techniques
- `supabase/functions/gd-feedback/index.ts` — Edge function that takes user's topic + arguments, returns AI feedback on structure, vocabulary, persuasiveness, and improvement suggestions (uses existing `callGemini` with HF fallback)

**Modified files:**
- `src/App.tsx` — Add route `/gd` pointing to `GdPrep`
- `src/components/Sidebar.tsx` — Add "GD Prep" nav item with `MessageSquare` icon

### AI Practice Flow
- User selects a topic from the bank or types their own
- Writes their arguments (what they'd say in a GD)
- Hits "Get Feedback" → streams AI response with scores on: Content (structure, depth), Communication (clarity, grammar), Leadership traits (initiative, summarization ability)
- Uses existing `callGemini` shared module (Gemini first, HF fallback)

### Mock Timer Flow
- User picks prep time (1-3 min) and speaking time (2-5 min)
- Phase 1: "Think" countdown with topic displayed
- Phase 2: "Speak" countdown
- Browser notification sound at phase transitions
- Session count tracked locally

### No database changes needed
All topic data is static. Practice history stored in component state (no persistence needed for v1).

