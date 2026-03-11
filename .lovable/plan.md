

# Video Player UX: Auto-hide Sidebar + Resizable Screenshot Frame for AI

## Two Features

### 1. Auto-collapse sidebar on `/player/*` routes

**Current behavior**: Sidebar is always visible, eating 256px of horizontal space on the video player page.

**Fix in `src/pages/Index.tsx`**:
- Detect if current route starts with `/player/` using `useLocation()`
- Auto-set `sidebarCollapsed = true` when on player routes
- The existing toggle button (PanelLeft icon) already works to bring it back
- Add a `useEffect` that watches `location.pathname` and collapses sidebar when entering `/player/`

### 2. Resizable selection frame on video for AI screenshot queries

**Concept**: When user clicks "AI Doubt", a draggable + resizable rectangle overlay appears on top of the video. User positions/resizes it over the area they want to ask about, clicks a "Ask AI about this" button, the frame area is captured as a screenshot and sent to the AI.

**New component `src/components/VideoScreenshotFrame.tsx`**:
- Renders an absolutely-positioned div overlay on the video container
- **Draggable**: mousedown on the frame body to move it
- **Resizable from 8 handles**: 4 corners + 4 edges, each with a small drag handle
- Uses `mousedown/mousemove/mouseup` events with state for position (`x, y`) and size (`width, height`)
- Semi-transparent border with highlighted handles
- Contains a floating "Capture & Ask AI" button
- On capture: uses `html2canvas` or the native Canvas API to screenshot the video iframe region — **however**, YouTube iframes are cross-origin so we can't screenshot them directly

**Screenshot approach** (since YouTube iframe can't be captured):
- Instead of actual screenshot, capture the **frame coordinates relative to video** and convert to a **timestamp + description** approach
- OR: Use the YouTube video thumbnail at the current timestamp as context: `https://img.youtube.com/vi/{videoId}/hqdefault.jpg` (static thumbnail, not frame-accurate)
- **Best approach**: Send the current timestamp + frame position description to the AI, along with transcript context. The AI already has transcript access. The frame acts as a visual UX cue for the student to focus their question.

**Revised approach**: The frame overlay is a UX affordance. When user captures:
1. Record current video timestamp
2. Auto-populate the chat input with "At [timestamp], explain what's shown on screen"
3. The AI uses transcript context around that timestamp to answer

**Integration in `src/components/VideoPlayerView.tsx`**:
- When `showChat` is true, render `<VideoScreenshotFrame>` over the video container
- Frame has a "Ask about this" button that triggers the chat with timestamp context
- Pass `onCapture` callback that sends a message to VideoChatSidebar

**Integration in `src/components/VideoChatSidebar.tsx`**:
- Accept an optional `onSendMessage` ref or expose a `sendMessage` function via callback so the frame can trigger messages

### Files to change

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Auto-collapse sidebar on `/player/` routes |
| `src/components/VideoScreenshotFrame.tsx` | New: draggable + resizable frame overlay |
| `src/components/VideoPlayerView.tsx` | Show frame when AI mode active, wire up capture → chat |
| `src/components/VideoChatSidebar.tsx` | Accept external message trigger |

