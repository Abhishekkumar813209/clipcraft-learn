

## Plan: Update Question Palette Colors

### Change

Update `statusColors` in `src/pages/QuizTest.tsx` (lines 137-143):

| Status | Current | New |
|--------|---------|-----|
| Answered | Green (keep) | Slightly lighter green |
| Not Answered | Red (keep as red) | Red |
| Not Visited | Blue | Yellow |
| Marked for Review | Blue | Orange |
| Answered & Marked | Cyan | Keep or adjust to complement orange+green |

### Exact Color Mapping

```typescript
const statusColors = {
  'not-visited':     'bg-yellow-50 text-yellow-500 border-yellow-300 ...',
  'not-answered':    'bg-red-100 text-red-600 border-red-300 ...',
  'answered':        'bg-green-100 text-green-600 border-green-300 ...',
  'marked':          'bg-orange-100 text-orange-600 border-orange-300 ...',
  'answered-marked': 'bg-teal-100 text-teal-600 border-teal-300 ...',
};
```

### File Modified

| File | Change |
|------|--------|
| `src/pages/QuizTest.tsx` | Update `statusColors` object (lines 137-143) with new color values |

Single edit, no logic changes.

