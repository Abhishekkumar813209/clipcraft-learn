

## Plan: Show saved clips as colored markers on the video timeline

### What
Render each saved clip as a colored segment on the progress bar (line 225-233) so users can visually see where their clips are on the timeline.

### Change in `src/components/VideoPlayerView.tsx`

After the existing progress indicators (current time, start/end selection, clip mode), add a loop over `videoClips` to render colored segments:

```tsx
{/* Saved clip markers */}
{duration > 0 && videoClips.map(clip => (
  <div
    key={clip.id}
    className={`absolute inset-y-0 rounded-full cursor-pointer ${
      clip.isPrimary ? 'bg-amber-400/70' : 'bg-blue-400/70'
    }`}
    style={{
      left: `${(clip.startTime / duration) * 100}%`,
      width: `${((clip.endTime - clip.startTime) / duration) * 100}%`,
    }}
    title={`${clip.label || 'Clip'}: ${formatDuration(clip.startTime)} → ${formatDuration(clip.endTime)}`}
    onClick={() => { seekTo(clip.startTime); play(); }}
  />
))}
```

- **Primary clips** → amber/orange color (matches the star icon in saved clips list)
- **Supplementary clips** → blue color
- Clicking a marker seeks to that clip's start and plays
- Tooltip on hover shows clip label and time range

