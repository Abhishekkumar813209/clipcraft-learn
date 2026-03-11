

# Two Fixes for Video Player

## 1. Sidebar toggle icon visibility issue

The sidebar toggle button in `Index.tsx` (absolute top-2 left-2) is hidden behind VideoPlayerView's header which has its own back arrow at the same position. The header covers it.

**Fix**: Move the sidebar toggle into the VideoPlayerView header bar itself, next to the back arrow. In `Index.tsx`, hide the toggle button when on `/player/` routes. In `VideoPlayerView.tsx`, add the sidebar toggle as the first item in the header.

**`src/pages/Index.tsx`**:
- Pass `sidebarCollapsed` and `setSidebarCollapsed` via Outlet context
- Hide the default toggle button on `/player/` routes (since VideoPlayerView will render its own)

**`src/components/VideoPlayerView.tsx`**:
- Import `useOutletContext` to get sidebar state
- Add PanelLeft/PanelLeftClose button before the back arrow in the header

## 2. Right panel width reduction

**`src/components/VideoPlayerView.tsx`**:
- Change left column from `w-[60%]` to `w-[64%]`
- Change right column from `w-[40%]` to `w-[36%]`

This gives ~10% relative reduction to the right panel width while giving more space to the video.

