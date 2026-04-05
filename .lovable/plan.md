

## Plan: Sync Weekly Chart & Contribution Grid with Live Edits

### Problem
When you change Planned/Actual hours, those values are saved to the database but the `historyLogs` state (which feeds both the weekly bar chart and the monthly contribution grid) is never updated. It's only loaded once on mount.

### Fix — `src/pages/ProductivityCoach.tsx`

**Update `historyLogs` in memory whenever `plannedHours` or `actualHours` change:**

Add a `useEffect` that watches `plannedHours`, `actualHours`, `lastAiScore`, and `dbLoaded`. Once loaded, it updates/inserts today's entry in `historyLogs` so that `logMap`, `weeklyData`, and the contribution grid all reactively reflect the current values.

```typescript
useEffect(() => {
  if (!dbLoaded) return;
  const today = new Date().toISOString().slice(0, 10);
  setHistoryLogs(prev => {
    const existing = prev.findIndex(l => l.date === today);
    const entry = { date: today, planned_hours: plannedHours, actual_hours: actualHours, ai_score: lastAiScore };
    if (existing >= 0) {
      const updated = [...prev];
      updated[existing] = entry;
      return updated;
    }
    return [...prev, entry];
  });
}, [plannedHours, actualHours, lastAiScore, dbLoaded]);
```

This single `useEffect` is the only change needed. The weekly chart and contribution grid will immediately update because they derive from `historyLogs` via `useMemo`.

### Files Modified
- `src/pages/ProductivityCoach.tsx` — Add one `useEffect` (~10 lines)

