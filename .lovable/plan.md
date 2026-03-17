

# Improvements: Clip Organization, Routing, and In-App Playback

## 1. URL-Based Routing (fixes refresh/tab-change losing state)

Currently `Index.tsx` uses `useState` for all views — refresh = back to dashboard. Fix by converting to proper URL routes:

**`src/App.tsx`** — Add routes:
- `/` → Dashboard
- `/sources` → Source Library  
- `/sources/:sourceId` → Playlist Browser
- `/clips` → Add Clips
- `/player/:videoId` → Video Player
- `/pdf` → PDF Reader
- `/topic` → Topic View

**`src/pages/Index.tsx`** — Becomes a layout wrapper with `<Outlet />`. Each view becomes its own route child.

**`src/components/Sidebar.tsx`** — Use `<NavLink>` / `useNavigate()` instead of `onViewChange` callbacks.

All views updated to use `useNavigate()` / `useParams()` instead of prop callbacks.

## 2. Clips Grouped by Video (within sub-topic)

In `AddClipsView.tsx` `ClipsTree`, after reaching a sub-topic, group clips by `videoId` and show:

```text
📄 Striver Hard (4)
  🎬 Video: "Majority Element | Striver SDE Sheet"
    ⭐ 4:47 → 7:54  majority element brute force n2
    ⭐ 6:17 → 10:02  Factorial ka logic
  🎬 Video: "Moore's Voting Algorithm"  
    ⭐ 10:54 → 16:50  Moore's voting algo
```

Each clip row gets a "copy link" button that generates `https://youtube.com/watch?v={id}&t={startTime}&end={endTime}` (YouTube doesn't support `end` natively, but we generate the timestamped URL).

## 3. In-App Clip Playback (start→end enforcement)

When user clicks Play on a clip from the clips list:
- Navigate to `/player/:youtubeId?start=X&end=Y`
- `VideoPlayerView` reads query params, seeks to `startTime` on load
- Add an `endTime` boundary check in the time tracking interval — when `currentTime >= endTime`, auto-pause the video
- Show a banner: "Playing clip: 4:47 → 7:54 — [Watch Full Video]"

**`useYouTubePlayer.ts`** — Add optional `endTime` prop. In the time tracking interval, if `currentTime >= endTime`, call `pause()`.

## Files to Change

| File | Change |
|------|--------|
| `src/App.tsx` | Add child routes under `/` |
| `src/pages/Index.tsx` | Convert to layout with `<Outlet />`, remove useState view switching |
| `src/components/Sidebar.tsx` | Use `useNavigate`/`useLocation` for nav |
| `src/components/AddClipsView.tsx` | Group clips by video, add play-in-app + copy-link buttons |
| `src/components/VideoPlayerView.tsx` | Read `start`/`end` query params, enforce end-time boundary |
| `src/hooks/useYouTubePlayer.ts` | Add optional `endTime` auto-pause |
| `src/components/PlaylistBrowserView.tsx` | Use `useNavigate` instead of `onSelectVideo` prop |
| `src/components/SourceLibraryView.tsx` | Use `useNavigate` instead of `onBrowsePlaylist` prop |
| Other views | Update `onBack` to use `useNavigate(-1)` |

