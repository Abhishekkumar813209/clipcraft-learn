

## Plan: AI-Powered Productivity Coach Page

### Overview
Build a new standalone page at `/productivity` — a real-time intelligent productivity coach with live clock, timetable awareness, AI motivation via Gemini, and an "I'll go to the library" commitment system.

### Files to Create/Modify

**1. New: `src/pages/ProductivityCoach.tsx`** — Main page component (~400 lines)

Contains all 9 features in one page:

- **Real-time clock** — `setInterval` every second, shows current time (large digital clock), remaining time till 11:59 PM, and remaining work hours
- **Timetable engine** — Hardcoded schedule: Study 10:30 AM–1:30 PM, Break 1:30–2:30 PM, Study 2:30–5:30 PM, Break 5:30–6:45 PM, Study 6:45–8:00 PM, Break 8:00–9:00 PM, Study 9:00–11:59 PM. Shows active slot status ("You should be studying now" / "This is your break time")
- **Smart time pressure** — Contextual nudge messages based on remaining study time and current slot
- **Progress bars** — Day progress (0–24h), Work completion (actual/planned), Study slot progress
- **Library commitment button** — "I will go to the library in 10 minutes" → starts 10-min countdown → "Time's up. Get up now." with full-screen nudge
- **Planned/Actual hours inputs** — User enters planned hours and logs actual hours; remaining is calculated live
- **Underconfidence breaker** — Static motivational messages shown when session hasn't started
- **AI Motivation button** — Calls existing Gemini round-robin system via a new edge function to generate a personalized motivational message based on remaining time, productivity score, and session status
- **AI Daily Reflection button** — Same edge function, different prompt mode: 2-line review + 1 improvement + 1 motivational line

**2. New: `supabase/functions/productivity-coach/index.ts`** — Edge function

Uses the existing `callGemini` shared utility. Two modes:
- `mode: "motivate"` — Takes remaining hours, productivity %, session status → returns a short punchy motivational message (2-3 lines max)
- `mode: "reflect"` — Takes planned/actual hours, tasks done → returns daily reflection (2-line review + suggestion + motivation)

**3. Modify: `src/App.tsx`** — Add route `/productivity`

**4. Modify: `src/components/Sidebar.tsx`** — Add "Productivity" nav item with Timer icon

### UI Layout (top to bottom)
```text
┌─────────────────────────────────────┐
│  ⏰ 03:47:22 PM    (large clock)    │
│  Remaining today: 8h 12m 38s       │
│  Status: 🟢 STUDY TIME             │
│  "You should be studying right now" │
├─────────────────────────────────────┤
│  Day Progress  ████████░░░░ 65%    │
│  Work Done     ████░░░░░░░░ 33%    │
│  Planned: [8h] Actual: [2.5h]     │
│  "You planned 8h. Done 2.5h.      │
│   5.5h still possible."           │
├─────────────────────────────────────┤
│  🔥 AI Motivation                  │
│  [Get Motivation]  [Daily Review]  │
│  "It takes 10 min to reach the    │
│   library. Why are you sitting?"   │
├─────────────────────────────────────┤
│  💪 Underconfidence Breaker        │
│  "You don't need confidence.       │
│   You need action."               │
│  [I'll go to library in 10 min]   │
│  ⏱ 09:42 remaining...             │
└─────────────────────────────────────┘
```

### Fix: `src/data/humorTemplates.ts` build error
The TypeScript compiler shows no error locally, but the build system reports line 5154. Will add an explicit newline or ensure the file ends cleanly with no trailing issues.

### Technical Details
- Clock uses `useState` + `useEffect` with `setInterval(1000)`
- Timetable slots defined as an array of `{ start: "HH:MM", end: "HH:MM", type: "study" | "break" }`
- Library countdown uses `setTimeout`/`setInterval` with state tracking
- AI calls use `supabase.functions.invoke` or direct fetch to the edge function
- Edge function reuses `callGemini` from `_shared/gemini.ts` (no streaming needed — short responses)
- Full-screen nudge: fixed overlay with z-50, dismiss on click

