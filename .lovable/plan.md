

## Plan: Back arrow navigates to the source playlist page

### Problem
Currently the back arrow uses `navigate(-1)` with a fallback to `/`. The user expects it to go back to the playlist page the video was opened from.

### Fix in `src/components/VideoPlayerView.tsx`

The store already has `selectedSourceId` which tracks which playlist/source the user was browsing. Use that to navigate back to the correct playlist:

```tsx
<Button variant="ghost" size="icon" onClick={() => {
  const sourceId = useStudyStore.getState().selectedSourceId;
  if (sourceId) {
    navigate(`/sources/${sourceId}`);
  } else {
    navigate('/sources');
  }
}}>
```

This ensures the back arrow always goes to the playlist the video came from, or to the sources list as fallback.

