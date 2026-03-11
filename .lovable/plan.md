

# Fix: Block YouTube Recommendations on Pause

## Problem
When video is paused, YouTube shows "More Videos" recommendations overlay inside the iframe, which is distracting and covers the video content.

## Solution
Two-part fix:

### 1. Add restrictive `playerVars` in `src/hooks/useYouTubePlayer.ts`
Add these YouTube player parameters to suppress as much as possible:
- `iv_load_policy: 3` — disable video annotations
- `disablekb: 1` — disable keyboard controls (we have our own)

### 2. Always-on transparent overlay in `src/components/VideoPlayerView.tsx`
The current overlay only appears when paused. But the iframe renders above it because iframes have high stacking context. Fix:
- Keep the overlay **always rendered** with `pointer-events-none` when playing
- Switch to `pointer-events-auto` when paused, blocking all clicks to the iframe's recommendation UI
- Add a higher `z-20` to ensure it sits above the iframe
- The overlay intercepts clicks and resumes playback, so recommendations can never be interacted with

```tsx
// Always present, blocks iframe interactions when paused
<div 
  className={`absolute inset-0 z-20 ${!isPlaying && isReady ? 'cursor-pointer' : 'pointer-events-none'}`}
  onClick={() => { if (!isPlaying && isReady) play(); }}
/>
```

### Files
| File | Change |
|------|--------|
| `src/hooks/useYouTubePlayer.ts` | Add `iv_load_policy: 3` to playerVars |
| `src/components/VideoPlayerView.tsx` | Make overlay always-on, toggle pointer-events |

