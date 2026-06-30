## Problem
Abhi `/admin/upload` me start/end page inputs hain, par sirf PDF upload ke baad dikhte hain — aur koi visual preview nahi hai, isliye decide karna mushkil hai ki kaunse page se kaunse tak select karna hai.

## Solution — Smart PDF Range Picker with Thumbnail Preview

### 1. Thumbnail grid preview
PDF upload hone ke baad har page ka chhota thumbnail (pdf.js canvas render, ~150px wide) ek scrollable grid me dikhega. Page number niche label.

### 2. Click-to-select range
- Pehla click pe page = **Start page** set
- Doosra click pe page = **End page** set
- Range me aane wale thumbnails highlighted (blue border + tint)
- "Reset selection" button range clear karne ke liye
- Manual number inputs bhi rahenge (jo kuch users prefer karte hain), dono in-sync rahenge

### 3. Live feedback
- Selection bar upar: "Pages 12 → 34 selected (23 pages, ~8 AI batches)"
- Approx batches = `ceil(pages / 3)` — user ko quota ka andaaza ho jaaye
- Agar bahut zyada select kiya (e.g. >60 pages) to ek subtle warning ke "this may take a while / use lots of AI calls"

### 4. Performance
- Thumbnails sequentially render (background, non-blocking) using a small render queue — UI lock nahi hoga bade PDFs me
- Each thumbnail rendered at low scale (0.3-0.4) so memory bhi controlled
- Already-rendered thumbnails cached in component state

### 5. Layout
```text
┌──────────────────────────────────────────────────┐
│ [Choose PDF]  filename.pdf · 87 pages            │
├──────────────────────────────────────────────────┤
│ Start [12]  End [34]   ✓ 23 pages, ~8 batches    │
│ [Reset]                                          │
├──────────────────────────────────────────────────┤
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐               │
│ │ 1│ │ 2│ │ 3│ │ 4│ │ 5│ │ 6│ │ 7│  ...          │
│ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘               │
│   (12-34 highlighted in blue)                    │
└──────────────────────────────────────────────────┘
[Answer key textarea unchanged]
[Extract Questions]
```

### 6. Optional: full-page preview on hover/click
Thumbnail pe hover → bigger preview tooltip (peek mode), ya double-click → modal me full-page render. Decide karna hai ki ye chahiye ya nahi (extra complexity).

## Files to change
- `src/pages/admin/AdminUpload.tsx` — add thumbnail grid, click-to-select logic, batch estimate (only edit this one file; backend/extract flow same rehega)

## Out of scope
- Backend changes (already accepts whatever pages you slice)
- PDF text re-extraction logic (no change)
- Other admin pages

## Question for you
Full-page preview on double-click chahiye, ya sirf thumbnail grid hi enough hai (faster to build, lighter UI)?
