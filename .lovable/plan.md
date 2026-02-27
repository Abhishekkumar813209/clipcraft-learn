

# Make Exam Add Button Visible + Improve Exam Section UX

## Problem
The "+" button next to "Your Exams" is a 24x24 ghost button that blends into the sidebar background. Users can't find it.

## Changes

### `src/components/Sidebar.tsx`
1. Replace the tiny ghost "+" icon with a visible, styled "Create Exam" button when no exams exist — full-width with border, icon, and label
2. When exams exist, keep the "+" but make it larger, with a visible border/background so it's actually noticeable
3. Add a subtle tooltip on the "+" button saying "Add new exam"
4. Make the "No exams yet" empty state include a prominent call-to-action button instead of just plain text

The result: users will see a clear, obvious button to create exams — not a nearly invisible 24px icon.

