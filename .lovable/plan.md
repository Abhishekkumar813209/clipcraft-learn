

# PDF Reader Enhancements: Bookmarks, Notes, Sidebar Toggle & Visual Polish

## What You're Getting

1. **Page Bookmarks & Notes** - Bookmark any page and add notes per page (stored in session)
2. **Collapsible StudyBrain Sidebar** - Toggle button to hide/show the main sidebar, giving PDF full screen width
3. **Better Visual Theme** - Improved shadows, page transitions, and overall polish
4. **Thumbnail bookmark indicators** - Bookmarked pages show a visual marker in the thumbnail sidebar

---

## The Main Problem (from screenshot)

The StudyBrain sidebar (264px wide) + thumbnail sidebar (112px) + AI chat sidebar are eating into the PDF page display area. Solution: make the main StudyBrain sidebar collapsible.

---

## Implementation Plan

### 1. Collapsible Main Sidebar

**Files:** `src/pages/Index.tsx`, `src/components/Sidebar.tsx`

- Add a `sidebarCollapsed` state to `Index.tsx`
- Pass it to `Sidebar` component
- When collapsed, sidebar shrinks to `w-0` with `overflow-hidden` (fully hidden)
- Add a toggle button (hamburger/panel icon) in the PDF Reader top bar to show/hide sidebar
- Smooth transition animation on collapse/expand

### 2. Page Bookmarks & Notes System

**File:** `src/components/PdfReaderView.tsx` (main state management)

New state:
- `bookmarkedPages: Set<number>` - which pages are bookmarked
- `pageNotes: Map<number, string>` - notes per page

Features:
- Bookmark toggle button in the top bar (star icon) - bookmarks current page
- Notes panel: a small textarea that appears below the main page or in a popover
- Bookmarked pages get a star indicator on their thumbnail
- A "Bookmarks" dropdown in top bar showing all bookmarked pages for quick jump

### 3. Visual Improvements to PdfReaderView

**File:** `src/components/PdfReaderView.tsx`

- Add smooth page transition animation (fade effect when changing pages)
- Better canvas shadow: `shadow-2xl` with a subtle glow
- Slightly darker background behind the PDF canvas for contrast
- Thumbnail sidebar: add subtle hover effects, better spacing
- Top bar: subtle gradient or deeper background

### 4. Thumbnail Bookmark Indicators

In the thumbnail sidebar loop, show a small bookmark/star icon overlay on bookmarked pages.

---

## Technical Details

### Sidebar Toggle

```text
Index.tsx:
- const [sidebarCollapsed, setSidebarCollapsed] = boolean state
- Sidebar gets: collapsed, onToggle props
- When collapsed: sidebar div has w-0 overflow-hidden transition-all
- PdfReaderView gets: onToggleSidebar prop to trigger from its top bar
```

### Bookmarks & Notes (Session-Only, No Cost)

```text
- Stored in React state (Map/Set) inside PdfReaderView
- Lost on refresh (no cloud storage cost)
- Bookmark: toggle current page in Set
- Notes: store text per page in Map
- Quick jump: dropdown listing bookmarked pages
```

### Page Transition Animation

```text
- CSS transition on canvas opacity when page changes
- Brief fade-out (100ms) -> render new page -> fade-in (200ms)
- Smooth feel without heavy animation overhead
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Add `sidebarCollapsed` state, pass to Sidebar and PdfReaderView |
| `src/components/Sidebar.tsx` | Accept `collapsed` prop, conditionally render `w-0`/`w-64` with transition |
| `src/components/PdfReaderView.tsx` | Add bookmarks, notes, sidebar toggle button, visual improvements, page transitions |

No new files needed. No database changes. No new dependencies. Everything stays client-side and session-only.

