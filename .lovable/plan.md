

## Plan: Remove blur from pause shield + test keyboard shortcuts

### Problem
The pause shield overlay on the video player has `bg-background/60 backdrop-blur-sm` which creates a blurry effect over the video thumbnail (as seen in the screenshot). User wants recommendations hidden but without the blur.

### Change
**File: `src/components/VideoPlayerView.tsx` (line 210)**

Replace the blurry shield with a clean dark overlay — no blur, just a semi-transparent black background:

```tsx
// Before
className="absolute inset-0 z-20 bg-background/60 backdrop-blur-sm cursor-pointer ..."

// After  
className="absolute inset-0 z-20 bg-black/70 cursor-pointer ..."
```

This keeps the shield functional (blocks YouTube recommendations, click to play) but removes the blur so the video thumbnail looks clean behind it.

### Testing
Will also verify keyboard shortcuts (Space, Arrow keys) and visual feedback are working correctly.

