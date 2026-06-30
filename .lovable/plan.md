# PDF Splitter in PDF Reader

PDF Reader view me ek "Split & Download" tool jodenge jisse user current uploaded PDF me se selective page range chunke naya PDF download kar sake — sab kuch client-side, koi upload nahi.

## Kya banega

- PDF Reader toolbar me naya **"Split PDF"** button (scissors icon)
- Click karne pe ek modal khulega jisme:
  - Total pages ka info (e.g. "Total: 240 pages")
  - **Start page** aur **End page** ke independent text inputs (spinner-free, jaise admin uploader me kiya tha)
  - Optional: quick presets — "First 10", "Last 10", "All"
  - Live validation: range valid hai ya nahi, kitne pages select hue
  - **Download split PDF** button → filename `{originalName}_p{start}-{end}.pdf`
- Splitting purely browser me hogi using `pdf-lib` (zero cloud storage rule maintained)
- Original PDF reader state (current page, annotations, quiz) untouched rahega

## Technical details

- New component: `src/components/PdfSplitterDialog.tsx`
  - Props: `file: File`, `totalPages: number`, `open`, `onOpenChange`
  - `pdf-lib` se: `PDFDocument.load(arrayBuffer)` → `newDoc.copyPages(src, indices)` → `newDoc.save()` → Blob → `URL.createObjectURL` → anchor download
- `PdfReaderView.tsx` me:
  - Toolbar me Scissors button add (existing icon row me, mobile + desktop dono)
  - State: `splitterOpen`
  - Already-loaded `file` aur `numPages` pass karenge — koi re-parse nahi
- `pdf-lib` already dependency me hai (admin flows use karte hain); agar nahi to install karenge
- No backend, no edge function, no DB change
- Memory rule respected: client-side only, zero cloud storage

## Out of scope

- Multi-range split (e.g. "1-5, 10-15") — abhi single contiguous range
- Re-ordering / rotation
- Merging multiple PDFs
