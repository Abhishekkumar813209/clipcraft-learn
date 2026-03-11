

## Plan: Fix AI Selection Frame drag behavior + add 'F' keyboard shortcut

### Problem
The selection frame moves/resizes on mere cursor hover because the YouTube iframe swallows `mouseup` events. Once a drag starts (even accidentally), `dragRef.current` never resets to `null`, so every subsequent mouse movement keeps dragging/resizing the frame.

### Fix 1: Use Pointer Capture (`VideoScreenshotFrame.tsx`)

Replace `mousedown/mousemove/mouseup` with `pointerdown/pointermove/pointerup` and use `setPointerCapture` on the drag element. This ensures the `pointerup` event is always received by our element, even when the cursor is over the YouTube iframe.

- On `pointerdown`: call `e.currentTarget.setPointerCapture(e.pointerId)` + set `dragRef`
- Change window listeners from `mousemove/mouseup` to `pointermove/pointerup`
- Add a safety check: only process moves when `dragRef.current` is set

### Fix 2: Add 'F' keyboard shortcut (`VideoPlayerView.tsx`)

In the existing `handleKeyDown` handler, add a case for `KeyF` that toggles `showChat` (which controls the AI Doubt sidebar + selection frame visibility). This gives users a quick way to toggle the AI frame on/off.

Also show a small hint near the AI Doubt button like `(F)` so users know the shortcut exists.

### Files to edit
- `src/components/VideoScreenshotFrame.tsx` — switch to pointer events with capture
- `src/components/VideoPlayerView.tsx` — add 'F' key shortcut to toggle AI Doubt

