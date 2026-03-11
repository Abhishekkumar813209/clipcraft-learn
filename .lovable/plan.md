

## Plan: Make back arrow reliably navigate to the source playlist

### Problem
The current back arrow reads `selectedSourceId` from the zustand store, but since the store isn't persisted, if state is lost for any reason, `selectedSourceId` is `null` and navigation falls back to `/sources` instead of the specific playlist.

### Fix

**1. Pass sourceId when navigating to the player** (`PlaylistBrowserView.tsx`, line ~80)

Add `sourceId` as a query parameter when navigating to the video player:

```tsx
navigate(`/player/${video.videoId}?source=${selectedSourceId}`);
```

**2. Read sourceId from URL in VideoPlayerView** (`VideoPlayerView.tsx`)

Read `source` from search params as the primary source, with store as fallback:

```tsx
const sourceFromUrl = searchParams.get('source');

// In the back button onClick:
const sourceId = sourceFromUrl || useStudyStore.getState().selectedSourceId;
if (sourceId) {
  navigate(`/sources/${sourceId}`);
} else {
  navigate('/sources');
}
```

This makes the back navigation reliable regardless of store state.

### Files to edit
- `src/components/PlaylistBrowserView.tsx` — add `?source=` param to player navigation
- `src/components/VideoPlayerView.tsx` — read `source` from URL params for back navigation

