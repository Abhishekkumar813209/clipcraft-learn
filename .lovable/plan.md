

# In-App Playlist Browser & Video Player

## Problem

Abhi current workflow mein:
1. Source Library mein playlist save hoti hai
2. "Open" button YouTube ko naye tab mein kholta hai
3. User ko manually video URL copy karke Add Clips section mein paste karna padta hai
4. Start/end time bhi manually type karna padta hai

Tumhe chahiye:
1. **Playlist ke andar videos dekho** - apni app mein
2. **Embedded player** - video dekho without leaving the app
3. **Click-to-set timestamps** - current time pe click karke start/end set karo
4. **Quick clip creation** - while watching, directly clip banao

---

## Solution Overview

```text
+------------------+     +-------------------+     +------------------+
|  Source Library  | --> |  Playlist Browser | --> |  Video Player    |
|  (existing)      |     |  (new)            |     |  with Clip Tool  |
+------------------+     +-------------------+     +------------------+
       |                         |                         |
  Save playlists           See all videos           Watch & create
  & channels               in playlist              clips instantly
```

---

## Implementation Plan

### 1. YouTube Data Integration (Edge Function)

Ek backend function jo YouTube Data API v3 se playlist videos fetch kare:

**File:** `supabase/functions/youtube-playlist/index.ts`

```text
Input: playlistId
Output: {
  videos: [
    { videoId, title, thumbnail, duration, position }
  ]
}
```

- Uses YouTube Data API (requires API key - will be stored as secret)
- Fetches all videos from a playlist with pagination
- Returns video metadata for in-app display

### 2. New Component: PlaylistBrowserView

**File:** `src/components/PlaylistBrowserView.tsx`

Features:
- Grid/list of videos from selected playlist
- Thumbnail, title, duration, position shown
- Click on video → opens Video Player View
- Search/filter videos within playlist

```text
+------------------------------------------------+
|  PW History Marathon                    [Back] |
|  24 videos                                     |
+------------------------------------------------+
|  +-------+  Lecture 1: Ancient India    45:30  |
|  | thumb |  Position: 1                        |
|  +-------+                              [Play] |
|------------------------------------------------|
|  +-------+  Lecture 2: Medieval         52:10  |
|  | thumb |  Position: 2                        |
|  +-------+                              [Play] |
+------------------------------------------------+
```

### 3. New Component: VideoPlayerView

**File:** `src/components/VideoPlayerView.tsx`

Features:
- Embedded YouTube iframe player (using YouTube IFrame API)
- Player controls exposed to React
- Current time display (live)
- Buttons:
  - **"Set Start"** → captures current time as start
  - **"Set End"** → captures current time as end
- Quick assignment dropdowns (Exam → Subject → Topic → Sub-Topic)
- Create clip button

```text
+--------------------------------------------------+
|  [Back]  Lecture 5: French Revolution            |
+--------------------------------------------------+
|                                                  |
|           +------------------------+             |
|           |                        |             |
|           |   YouTube Player       |             |
|           |   (embedded iframe)    |             |
|           |                        |             |
|           +------------------------+             |
|                                                  |
|   Current: 15:42                                 |
|   [Set Start: --:--]    [Set End: --:--]         |
|                                                  |
|   Timeline: 12:30 ------[====]------ 18:45       |
|                                                  |
+--------------------------------------------------+
|   Assign to:                                     |
|   Exam: [UPSC v]  Subject: [History v]           |
|   Topic: [Modern v]  Sub-Topic: [French Rev v]   |
|                                                  |
|   Label: [Best explanation of causes______]      |
|   Type: [Primary] [Supplementary]                |
|                                                  |
|   [Add Clip to Sub-Topic]                        |
+--------------------------------------------------+
```

### 4. YouTube IFrame API Integration

**File:** `src/hooks/useYouTubePlayer.ts`

Custom hook for YouTube player control:
- Load YouTube IFrame API dynamically
- Get current time, duration, play/pause state
- Seek to specific time
- Event callbacks (onReady, onStateChange)

### 5. Update Navigation & Routing

**File:** `src/pages/Index.tsx`

Add new views:
```typescript
type ViewType = 'dashboard' | 'sources' | 'clips' | 'topic' 
              | 'playlist-browser' | 'video-player';
```

**File:** `src/stores/studyStore.ts`

Add state for:
- `selectedSourceId` - which playlist is being browsed
- `selectedVideoForPlayer` - which video is in the player

### 6. Update Source Library

**File:** `src/components/SourceLibraryView.tsx`

Change "Open" button:
- Old: `window.open(youtubeUrl)` → Opens YouTube
- New: Navigate to Playlist Browser View within app

Add "Browse Videos" button that opens in-app playlist browser.

---

## Technical Details

### YouTube Data API Setup

1. Need YouTube Data API v3 key
2. Store as secret: `YOUTUBE_API_KEY`
3. Edge function calls: `GET https://www.googleapis.com/youtube/v3/playlistItems`

### Video Player Component

Using YouTube IFrame Player API:
```typescript
// Load API
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';

// Create player
new YT.Player('player', {
  videoId: 'VIDEO_ID',
  events: {
    onReady: onPlayerReady,
    onStateChange: onPlayerStateChange
  }
});

// Get current time
player.getCurrentTime(); // returns seconds
```

### Workflow Summary

```text
1. User opens Source Library
2. Clicks "Browse" on a saved playlist
3. PlaylistBrowserView shows all videos (fetched via edge function)
4. User clicks a video
5. VideoPlayerView opens with embedded player
6. User watches, clicks "Set Start" at 12:30
7. User continues, clicks "Set End" at 18:45
8. User selects Exam/Subject/Topic/Sub-Topic from dropdowns
9. Clicks "Add Clip"
10. Clip saved, user can continue adding more or go back
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/youtube-playlist/index.ts` | Create | Fetch playlist videos from YouTube API |
| `src/components/PlaylistBrowserView.tsx` | Create | Display videos from a playlist |
| `src/components/VideoPlayerView.tsx` | Create | Embedded player with clip creation |
| `src/hooks/useYouTubePlayer.ts` | Create | YouTube IFrame API integration |
| `src/stores/studyStore.ts` | Modify | Add selectedSourceId, selectedVideoForPlayer |
| `src/pages/Index.tsx` | Modify | Add new view types |
| `src/components/SourceLibraryView.tsx` | Modify | Add "Browse" button |
| `src/components/Sidebar.tsx` | Modify | Navigation updates |

---

## Prerequisites

Before implementation, I'll need to:
1. Ask you to provide a YouTube Data API key (free from Google Cloud Console)
2. Store it as a secret in the project

---

## Summary

Ye solution tumhe allow karega:
- Playlist ke videos **apni app mein** dekhna
- Video **embedded player** mein play karna
- **Click-to-set** timestamps (start/end)
- **Instantly assign** to Exam/Subject/Topic/Sub-Topic
- Fast daily workflow without leaving the app

Approve karo toh main implementation shuru karta hoon!

