

## Plan: Fix Streak Counter to Track Goal Completion

### Problem
The existing streak counter (line 237-245) only checks if `actual_hours > 0`. It should check if `actual_hours >= planned_hours` to track consecutive days where you actually met your goal.

### Change — `src/pages/ProductivityCoach.tsx`

**Update the `currentStreak` useMemo (lines 237-245)**

Change the condition from:
```typescript
if (log && log.actual_hours > 0) streak++;
```
to:
```typescript
if (log && log.planned_hours > 0 && log.actual_hours >= log.planned_hours) streak++;
```

This ensures the streak only counts days where you hit or exceeded your planned target. One line change, no new files.

### Files Modified
- `src/pages/ProductivityCoach.tsx` — Update streak condition (~1 line)

