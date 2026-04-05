

## Plan: Fix Two Issues in Productivity Coach

### Issue 1: Green "slot progress" bar is confusing
The progress bar under "STUDY TIME — Night Study" shows how far through the *current time slot* you are (e.g., 94% through the 9pm-midnight slot). It looks like a random green bar with no context. The user doesn't understand what it represents.

**Fix**: Add a label showing the slot time range and percentage, so it's clear. e.g., "21:00 – 23:59 (94% elapsed)" instead of just "You should be studying right now."

### Issue 2: Pressure message says "3.5h still possible" when only 1h 20m left in the day
The `getPressureMessage()` function uses `remainingWork` (planned - actual = 8 - 4.5 = 3.5h) and says "3.5h still possible." But the actual remaining *study time* in the timetable is only ~1h 20m. The message should be aware of actual remaining study time and say something realistic.

**Fix**: In `getPressureMessage()`, compare `remainingWork` against `remainingStudyHours` (already calculated from the timetable). If remaining work exceeds remaining study time, show a realistic message like "You planned 8h, done 4.5h. Only 1.3h of study time left — push hard!" instead of the misleading "3.5h still possible."

### Changes — `src/pages/ProductivityCoach.tsx`

**1. Update slot progress label (line ~481-483)**
Change from generic "You should be studying right now" to include the time range:
```typescript
<p className="text-xs text-muted-foreground mt-1">
  {currentSlot.start} – {currentSlot.end} ({Math.round(slotProgress)}% elapsed)
  {currentSlot.type === 'study' ? ' • You should be studying right now.' : ' • Recharge for next session.'}
</p>
```

**2. Fix `getPressureMessage()` (lines 271-277)**
Make it use `remainingStudyHours` instead of blindly saying remaining work is "still possible":
```typescript
const getPressureMessage = () => {
  if (currentSlot?.type === 'break') return `...`;
  const remStudy = parseFloat(remainingStudyHours);
  if (actualHours === 0 && currentSlot?.type === 'study')
    return `You have only ${remainingStudyHours}h of study time left today. Start now.`;
  if (remainingWork <= 0) return "Great work! You've hit your target.";
  if (remainingWork > remStudy)
    return `You planned ${plannedHours}h, done ${actualHours}h. Only ${remainingStudyHours}h study time left — push hard!`;
  return `You planned ${plannedHours}h. You've done ${actualHours}h. ${remainingWork.toFixed(1)}h still possible.`;
};
```

### Files Modified
- `src/pages/ProductivityCoach.tsx` — Fix pressure message logic + improve slot progress label

