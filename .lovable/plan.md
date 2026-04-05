

## Plan: White Theme + Monthly Dashboard with Green Dots + AI Score Tracking

### Problems Identified
1. Current UI is forced dark theme — user wants white/light theme
2. No dashboard showing daily history — user wants GitHub-style green contribution grid (monthly)
3. AI motivation score/points are not tracked anywhere — they should persist and show trends

### Changes

**1. Database Migration — Add `ai_score` column to `productivity_logs`**

```sql
ALTER TABLE public.productivity_logs ADD COLUMN ai_score integer DEFAULT 0;
```

This lets the edge function assign a daily productivity score (0–100) that gets saved per day.

**2. Update Edge Function (`supabase/functions/productivity-coach/index.ts`)**

- In `reflect` mode, instruct Gemini to also return a numeric `score` (0–100) alongside the text
- Parse the JSON response and return `{ message, score }`

**3. Rewrite `src/pages/ProductivityCoach.tsx` — White Theme + Dashboard**

- **Theme**: Replace all `hsl(230,15%,8%)` dark backgrounds with white/light backgrounds. Use proper text colors (gray-800, gray-600). Cards get white bg with subtle borders and shadows.
- **New Dashboard Section** (top of page, below header):
  - Fetch last 30 days of `productivity_logs` for the user
  - Render a **GitHub-style contribution grid**: 30 boxes in a row, each colored from light green to dark green based on `actual_hours / planned_hours` ratio (0% = gray, 25% = light green, 50% = medium, 75% = dark green, 100% = deepest green)
  - Show stats row: Total days active, Average score, Current streak, Best streak
- **AI Score Display**: After daily review, save the returned score to the database. Show the score prominently in the dashboard stats.
- **Keep all existing features**: clock, timetable, pressure messages, AI motivation, library countdown — just re-skinned to white theme

### UI Layout (updated)
```text
┌──────────────────────────────────────┐
│  ← Productivity Coach               │
├──────────────────────────────────────┤
│  📊 Monthly Dashboard               │
│  [□□□■■□■■■■□□□■■■■■□□■■■■■□□□□□]   │
│  (30 green-shaded dots for 30 days) │
│                                      │
│  Active: 18d  Avg Score: 72  🔥 5d  │
├──────────────────────────────────────┤
│  ⏰ 03:47 PM   Remaining: 8h 12m   │
│  Status: 🟢 STUDY TIME              │
├──────────────────────────────────────┤
│  Progress bars + Circular ring       │
│  Planned: [8h]  Actual: [2.5h]      │
├──────────────────────────────────────┤
│  🔥 AI Motivation / Daily Review    │
│  AI Score: 72/100                    │
├──────────────────────────────────────┤
│  💪 Library Countdown               │
├──────────────────────────────────────┤
│  📅 Timetable                       │
└──────────────────────────────────────┘
```

### Files Modified
- **Migration** — Add `ai_score` column to `productivity_logs`
- **`supabase/functions/productivity-coach/index.ts`** — Return score from reflect mode
- **`src/pages/ProductivityCoach.tsx`** — White theme, contribution grid dashboard, score tracking

