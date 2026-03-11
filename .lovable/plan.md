

## Plan: Fix back arrow navigation in VideoPlayerView

### Problem
The left arrow button uses `navigate(-1)` (browser back). If the user landed on the player route directly or there's no browser history, it does nothing.

### Fix in `src/components/VideoPlayerView.tsx` (line 167)

Replace `navigate(-1)` with a smarter fallback — try going back, but if there's no history, navigate to the home/sources page:

```tsx
// Before
<Button variant="ghost" size="icon" onClick={() => navigate(-1)}>

// After
<Button variant="ghost" size="icon" onClick={() => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate('/');
  }
}}>
```

This ensures the back button always takes the user somewhere — either the previous page or the dashboard as a fallback.

