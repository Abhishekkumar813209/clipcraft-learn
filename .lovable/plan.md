

## Plan: Remove custom visual feedback overlay

Keep keyboard shortcuts (Space, ArrowLeft, ArrowRight) working — just remove the custom feedback UI since YouTube's native feedback is sufficient.

### Changes in `src/components/VideoPlayerView.tsx`

1. **Remove state & refs** (lines 51-53): `feedbackText`, `feedbackVisible`, `feedbackTimeout`
2. **Remove `showFeedback` callback** (lines 107-112)
3. **Remove `showFeedback()` calls** from keyboard handler (lines 122-131) — keep the play/pause/seek logic
4. **Remove `showFeedback` from useEffect deps** (line 136)
5. **Remove the feedback overlay div** (lines 218-222)

Keyboard shortcuts stay intact, just no extra UI badge on top.

