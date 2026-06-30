
## Issue
In `PdfPagePicker.tsx`, the Start and End page inputs are coupled — changing Start auto-bumps End to `max(start, end)` and changing End auto-clamps Start. Also they use `type="number"` which shows browser spinners.

## Fix (only `src/components/admin/PdfPagePicker.tsx`)
- Change both inputs from `type="number"` to `type="text"` with `inputMode="numeric"` so the user can just type a number — no increment/decrement spinners.
- Make the two onChange handlers independent: Start updates only `startPage`, End updates only `endPage`. Just clamp each to `[1, pageCount]`. No cross-coupling.
- Keep the click-on-thumbnail range picker behaviour as-is (that flow is separate from manual typing).

No changes to AdminUpload or any other file.
