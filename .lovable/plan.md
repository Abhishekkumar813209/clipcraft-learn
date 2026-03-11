

# Fix: Infinite Loop in PlaylistBrowserView

## Root Cause
Line 67: `useEffect` depends on `source` (an object). On line 57, `updateSource(source.id, { videoCount: ... })` updates the Zustand store's `sources` array. This causes `source = sources.find(...)` to return a **new object reference**, re-triggering the effect → fetch → updateSource → new source reference → fetch again → infinite loop.

## Fix
**`src/components/PlaylistBrowserView.tsx`** — Change the `useEffect` dependency from the full `source` object to primitive values that actually matter: `source?.id` and `source?.youtubeId`. These don't change when `videoCount` gets updated.

```tsx
// Line 67: Change from
}, [source]);

// To
}, [source?.id, source?.youtubeId]);
```

Single line change, one file only.

