

## Plan: Improve Humor Coach UI + Add 50 Snapchat Conversation Templates

### 1. Redesign Response UI — Trainer/Coach Style

Instead of raw markdown dump, parse and render the response into structured coach-style cards:

- **Coach avatar/header** at the top with a "🎤 Your Coach Says..." banner
- **Conversation lines** highlighted with colored left-border (like chat bubbles)
- **"Comedy Goldmine"** sections rendered as gradient-bordered tip cards with a lightbulb/fire icon
- **Opportunity Rate** badges rendered as colored pills (🟢 Easy = green, 🟡 Medium = yellow, 🔴 Advanced = red)
- **Punchline suggestions** rendered as numbered cards with distinct backgrounds per type (Safe/Clean, Edgy/Roast, Absurdist)
- **Technique** tags rendered as small badges
- Keep markdown as fallback — parse known patterns from the AI response (e.g., "Comedy Goldmine:", "Punchline 1", "Technique:", "Opportunity Rate:") into styled components
- Streaming cursor stays at bottom

### 2. Add 50 Snapchat/DM Conversation Templates

New category: **"Snapchat"** — 50 templates focused on:
- Opening conversations with girls after hi/hello
- Finding humor in mundane DM exchanges
- Turning awkward silences into comedy
- Replying to stories with wit
- Handling "seen" and late replies with humor
- Flirty-but-funny openers
- Group snap chaos
- Streak conversations gone wrong

All in Hinglish, Indian context, realistic scenarios.

### 3. Template Category Tabs

Add horizontal scrollable category filter tabs above the template grid so user can filter by: All, Family, Street, Cricket, Office, College, Snapchat, etc.

### Files Modified
- **`src/data/humorTemplates.ts`** — Add 50 Snapchat templates (IDs 51-100)
- **`src/pages/HumorCoach.tsx`** — Redesign response section with coach-style UI, add category filter tabs

### Technical Details
- Response parsing: Use regex to detect patterns like `Comedy Goldmine:`, `Punchline \d`, `Opportunity Rate:`, `Technique:` and render them as styled components
- Fallback: If parsing fails, show raw markdown as before
- Category filter: Simple state-based filter on template grid, no new dependencies

