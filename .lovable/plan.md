

# Fix Button Colors in Sidebar

## Problem
From the screenshots:
1. "Create Your First Exam" button: dashed border is barely visible, text is too faint against the dark sidebar
2. "Sign Out" hover: light background makes dark text invisible

## Changes in `src/components/Sidebar.tsx`

1. **"Create Your First Exam" button**: Change to use a visible primary/accent color with proper contrast — use `bg-primary/20 border-primary/40 text-primary hover:bg-primary/30` instead of the current outline with sidebar-border colors
2. **"Sign Out" button hover**: Fix hover to use `hover:bg-sidebar-accent hover:text-sidebar-foreground` so text stays visible on hover

