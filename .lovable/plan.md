

## Plan: Fix Tab-Switch Reloads + Add Fast Mode Timer

### Problem 1: App reloads on tab switch
Two causes:
1. **React Query** defaults to `refetchOnWindowFocus: true` — every query refetches when you return to the tab, causing loading spinners and data flickering
2. **Supabase auth** fires `TOKEN_REFRESHED` event on tab return, which updates state in AuthContext and triggers cascading re-renders through `fetchAllData()` in Index.tsx

### Fix
- Configure `QueryClient` with `refetchOnWindowFocus: false` in `App.tsx`
- In `Index.tsx`, guard `fetchAllData()` so it only runs once (not on every auth state change)
- In `AuthContext.tsx`, avoid setting state if values haven't actually changed

### Problem 2: Fast Mode for tests
Add a "Fast Mode" toggle in the QuizTest top bar. When enabled:
- User picks seconds-per-question (15s, 30s, 45s, 60s)
- A countdown timer appears per question
- When time expires, the question is auto-skipped and it moves to the next one
- Progress bar shows remaining time visually

### Files Modified

| File | Change |
|------|--------|
| `src/App.tsx` | Set `refetchOnWindowFocus: false` on QueryClient defaults |
| `src/pages/Index.tsx` | Guard `fetchAllData` to run only once per user session |
| `src/contexts/AuthContext.tsx` | Skip redundant state updates on token refresh |
| `src/pages/QuizTest.tsx` | Add Fast Mode toggle with configurable per-question countdown timer, auto-advance on timeout |

