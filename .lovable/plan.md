## Changes

### 1. Sidebar label rename
- File: `src/components/Sidebar.tsx`
- Change the nav item label `"SSC English"` → `"SSC"` (icon and route `/ssc` unchanged).

### 2. Add Black Book links inside SSC section
- File: `src/pages/SscLayout.tsx`
- Extend `NAV_ITEMS` with new entries under the SSC sidebar:
  - `Black Book Hub` → `/ssc/blackbook` (icon: `BookMarked` or `Sparkles`)
  - `BB Practice` → `/ssc/blackbook/practice/mixed` (icon: `Grid3X3`)
  - `BB Browse` → `/ssc/blackbook/browse/mixed` (icon: `Search`)
- Keep active-state logic (`startsWith`) working for these nested routes.

No other files touched. No business logic changes.