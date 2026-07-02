## Goals
1. Make the SSC section usable on phone screens (sidebar currently eats 60–70% of viewport width).
2. Clean up the Black Book URLs so `/ssc/blackbook/practice` and `/ssc/blackbook/browse` work without the `:category` param.

## 1. Responsive SSC layout (`src/pages/SscLayout.tsx`)
- Convert the fixed `w-64` sidebar into a collapsible drawer on mobile:
  - On `md:` and up → current fixed left sidebar (unchanged).
  - On mobile (`<md`) → hidden by default; toggle via a top bar hamburger button using the existing shadcn `Sheet` component (slides in from the left).
- Add a slim mobile top bar (only visible `<md`) with:
  - Hamburger (opens the Sheet)
  - "SSC Prep" title
- Main content wrapper: `flex-1 overflow-auto` stays; add `w-full min-w-0` so children (Black Book pages) can shrink instead of overflowing.
- Close the drawer automatically after a nav click.

## 2. Black Book route cleanup
- Update routes in `src/App.tsx`:
  - `blackbook/practice` → `<BlackBookPractice />` (defaults to `mixed`)
  - `blackbook/practice/:category` → keep for direct category links
  - Same pattern for `blackbook/browse` and `blackbook/browse/:category`
- Update `BlackBookPractice.tsx` and `BlackBookBrowse.tsx` to treat missing `category` param as `'mixed'`.
- Update `SscLayout.tsx` nav items:
  - `BB Practice` → `/ssc/blackbook/practice`
  - `BB Browse` → `/ssc/blackbook/browse`
- Update any internal links in `BlackBookHub.tsx` that currently include `/mixed` (leave category-specific browse/practice links intact — those legitimately need the category).

## 3. Light responsive polish for Black Book pages
- `BlackBookHub.tsx`, `BlackBookPractice.tsx`, `BlackBookBrowse.tsx`: reduce outer padding on mobile (`p-4 md:p-6`) and ensure grids collapse to single column on small screens (already mostly correct — verify).

## Out of scope
- No visual redesign, no changes to duel flows beyond what's needed for the routes.
- Other sections (BPSC/NQT/RBI) untouched; can mirror the pattern later if requested.
