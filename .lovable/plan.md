

# Fix Form Input Colors, Icon Backgrounds & Create Exam Button

## Problems
1. All form inputs use `bg-secondary border-border` — `secondary` is `hsl(0 0% 32%)` (dark gray), making inputs look dull
2. Icon selector buttons in CreateExamDialog also use `bg-secondary` — dark and unattractive
3. "Create Your First Exam" button should be orange with white text

## Changes

### 1. Global input styling fix
Replace `bg-secondary border-border` with `bg-background border-input` across all form components. This gives a clean light background (`hsl(0 0% 96%)`) instead of dark gray.

**Files affected** (9 files, ~25 occurrences):
- `src/components/CreateExamDialog.tsx`
- `src/components/EditExamDialog.tsx`
- `src/components/SourceLibraryView.tsx`
- `src/components/CreateSubjectDialog.tsx`
- `src/components/CreateTopicDialog.tsx`
- `src/components/VideoPlayerView.tsx`
- `src/components/AddClipsView.tsx`
- `src/components/PlaylistBrowserView.tsx`
- `src/components/TopicView.tsx`

### 2. Icon selector backgrounds (CreateExamDialog + EditExamDialog)
Change unselected icon buttons from `bg-secondary` to `bg-muted/20 hover:bg-muted/30` for a lighter, more appealing look. Selected state stays `bg-primary/20 ring-2 ring-primary`.

### 3. "Create Your First Exam" button (Sidebar)
Change from `bg-primary/10 border-primary/40 text-primary` to an orange background with white text:
`bg-orange-500 hover:bg-orange-600 text-white border-orange-500`

