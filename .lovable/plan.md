

# Custom Keyboard Shortcuts for Video Player

## What
- Keep YouTube's `disablekb: 0` (default) so native controls work
- Add our own keyboard event listener on the player page for Space (play/pause), Left Arrow (-10s), Right Arrow (+10s)
- Show brief visual feedback overlay (e.g., "⏪ -10s", "⏩ +10s", "▶ Play", "⏸ Pause") that fades out after ~500ms

## Changes

### 1. `src/components/VideoPlayerView.tsx`
- Add a `useEffect` with `keydown` listener on `document`:
  - **Space** → toggle play/pause (prevent default scroll)
  - **ArrowLeft** → `seekTo(currentTime - 10)`
  - **ArrowRight** → `seekTo(currentTime + 10)`
  - Skip if user is focused on an `<input>`, `<textarea>`, or `<select>` (so form fields still work normally)
- Add state `feedbackText` + `feedbackVisible` for visual indicator
- Render a small centered overlay on the video container showing the feedback text, auto-hidden after 600ms with fade animation

### 2. `src/hooks/useYouTubePlayer.ts`
- No changes needed — `disablekb: 0` is already set

## Visual Feedback Design
- Small pill/badge centered on the video area
- Semi-transparent dark background, white text, rounded
- Shows icon + text like "▶ Play", "⏸ Pause", "⏪ 10s", "⏩ 10s"
- Fades in/out with CSS transition (~600ms)

