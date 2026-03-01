

# Video Player UX Overhaul + Clips Organization

## Issues Identified (from your screenshots)

1. **Scroll problem** — Video player and clip form are stacked vertically, forcing you to scroll past the video every time you want to save a clip
2. **No saved clips visible** — After adding clips, they don't appear below the video player for that video
3. **YouTube "More Videos" overlay on pause** — YouTube hijacks the pause screen with recommendations (frustrating)
4. **AI Doubt via screenshot** — You want to screenshot/select area of the video for AI. Unfortunately, YouTube iframe is cross-origin protected — browsers physically block any screenshot/canvas capture of embedded YouTube content. The transcript-based approach is the only viable method. We'll keep that but improve the UX.
5. **Add Clips page — flat list** — Recently added clips are just a flat list, no organization by topic/subtopic

## Plan

### 1. Two-Column Layout for VideoPlayerView
Split the page into two columns side-by-side:
- **Left column (60%)**: Video player + playback controls + timeline + Set Start/End buttons
- **Right column (40%)**: Scrollable panel with Assign to Sub-Topic form + clip type + label + Add button + list of clips already saved for this video

No more scrolling past the video. Everything is visible at once.

### 2. Show Saved Clips for Current Video
Below the "Add Clip" button in the right column, show a list of clips that belong to the current YouTube video (filter `clips` where `videoId` matches). Each clip shows start→end time, label, sub-topic name, and a delete button.

### 3. Block YouTube Pause Overlay
Add a transparent click-through overlay `div` on top of the YouTube iframe that activates when the video is paused. This overlay intercepts YouTube's "More Videos" recommendation popup. When user clicks the overlay, it calls `play()` to resume. YouTube's native pause overlay is blocked because our div sits on top.

### 4. Add Clips Page — Folder/Tree Structure
Replace the flat "Recently Added Clips" list with a collapsible tree structure:
```text
📁 Placement (Exam)
  └─ 📂 DSA (Subject)
      └─ 📂 Depesh Malviya (Topic)
          └─ 📄 L-1 Repl and Output (Sub-Topic)
              ├─ ⭐ 0:00 → 5:17  Getting Started With Node JS...
              ├─ ⭐ 19:29 → 31:21  Getting Started With Node JS...
              └─ ⭐ 32:31 → 45:28  Getting Started With Node JS...
```
Collapsible accordion sections by Exam → Subject → Topic → SubTopic, with clips nested inside.

### Files to Change
- **`src/components/VideoPlayerView.tsx`** — Two-column layout, pause overlay, saved clips list
- **`src/components/AddClipsView.tsx`** — Replace flat list with folder/tree structure
- **`src/hooks/useYouTubePlayer.ts`** — No changes needed (rel=0 already set)

