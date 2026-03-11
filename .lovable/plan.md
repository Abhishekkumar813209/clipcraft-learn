

## Plan: Quick-Mark Mode with C/D Shortcuts + Draft Clips System

### Changes — all in `src/components/VideoPlayerView.tsx`

**1. Add C/D keyboard shortcuts (case-insensitive)**
- `C` → calls `handleSetStart()` (same as clicking Set Start button)
- `D` → calls `handleSetEnd()` (same as clicking Set End button)
- Add `<kbd>C</kbd>` and `<kbd>D</kbd>` badges on Set Start / Set End buttons

**2. Draft Clips system**
- New state: `draftClips: { id: string, startTime: number, endTime: number, label: string }[]`
- When both start AND end are set, after pressing D, auto-push a draft clip with empty label and reset start/end. Show a toast with the time range.
- Draft clips appear on the timeline as green dashed markers (`bg-emerald-400/60 border-dashed`), distinct from saved clips (amber/blue)
- Hovering a draft marker shows label via `title` attribute

**3. Draft Clips panel (right sidebar, above Saved Clips)**
- Each draft shows: time range, editable label input, play button, delete button
- Expanding "Assign" on a draft shows the exam → subject → topic → sub-topic selector + save button
- Saving calls `addClip()` with the selected sub-topic and removes from drafts

**4. G shortcut — remove fullscreen note**
- G shortcut stays as-is for normal mode (toggles AI Doubt). No special fullscreen handling needed since native fullscreen takes over the page and our keydown listener won't fire anyway. No misleading "works in fullscreen" claims in UI.

**5. Inline label prompt after C+D**
- After a draft is created, the most recent draft in the panel auto-focuses its label input so user can quickly type a label and move on

### No other files need changes.

