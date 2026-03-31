

## Plan: Fix AutoPlay Timer in PDF Reader

### Problem
The AutoPlay timer has two bugs:
1. **Side effect in state updater** — `goNext()` is called inside `setElapsed`'s updater function. React state updaters should be pure; calling side effects (like `onPageChange`) from within them is unreliable, especially in StrictMode where updaters run twice.
2. **Interval recreation** — `goNext` is a `useCallback` that depends on `currentPage`, so it changes every page. Since it's a dependency of the timer `useEffect`, the interval is destroyed and recreated on every page change, resetting timing.

### Fix

**File: `src/components/PdfAutoPlay.tsx`**

Refactor the timer to use a `useRef` for elapsed tracking and separate the "advance page" logic from the tick:

```typescript
const elapsedRef = useRef(0);
const [progress, setProgress] = useState(0);

useEffect(() => {
  if (!isPlaying) return;
  elapsedRef.current = 0;
  setProgress(0);
  
  const tick = setInterval(() => {
    elapsedRef.current += 0.1;
    const pct = (elapsedRef.current / activeInterval) * 100;
    setProgress(pct);
    
    if (elapsedRef.current >= activeInterval) {
      elapsedRef.current = 0;
      // Use functional ref to avoid stale closure on currentPage
      goNextRef.current();
    }
  }, 100);
  
  return () => clearInterval(tick);
}, [isPlaying, activeInterval]);
```

Use a ref (`goNextRef`) to always point to the latest `goNext` function, so the interval doesn't need to depend on `currentPage`.

### Files Modified

| File | Change |
|------|--------|
| `src/components/PdfAutoPlay.tsx` | Fix timer: use ref for elapsed + stable goNext ref to avoid interval recreation |

