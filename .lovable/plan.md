

## Plan: RBI Grade B PYQ Upload + Analysis Dashboard

### What
Build a PYQ upload system for RBI Grade B (same pattern as BPSC PYQ upload) plus an analysis dashboard showing topic frequency, difficulty trends, and year-wise breakdowns across 6 years of papers.

### Implementation

**1. Edge Function: `rbi-pyq-extract`**
- Clone the `bpsc-pyq-extract` pattern but with RBI topics from `src/types/rbi.ts`
- AI extracts MCQs from PDF text, classifies by RBI topic, assigns difficulty, identifies correct answer
- Uses tool calling for structured output
- Handles rate limits (429) and credit exhaustion (402)

**2. New Page: `RbiPyqUpload.tsx`**
- Mirrors `BpscPyqUpload.tsx` but uses RBI topics/types
- PDF upload → client-side text extraction via pdfjs-dist → page range selection → batch AI extraction (3 pages/batch)
- Review table with topic reassignment, difficulty badges, delete option
- Saves to `ssc_questions` table with `exam: 'RBI'`, `is_pyq: true`, year tag

**3. New Page: `RbiPyqAnalysis.tsx`**
- **Topic Frequency Chart**: Bar chart showing which topics appear most across 6 years
- **Year-wise Breakdown**: Table/grid showing question count per topic per year
- **Difficulty Distribution**: Easy/Medium/Hard split per year
- **Subject-wise Summary**: Aggregated by Phase 1 subjects (English, Quant, Reasoning, GA) and Phase 2 (ESI & Finance)
- All data pulled from `ssc_questions` where `exam = 'RBI'` and `is_pyq = true`

**4. New Page: `RbiPyqPractice.tsx`**
- Filter by year, topic, difficulty — practice extracted PYQs
- Same practice session pattern as existing modules

**5. Route & Nav Updates**
- Add routes: `/rbi/pyq`, `/rbi/pyq/upload`, `/rbi/pyq/analysis`, `/rbi/pyq/practice`
- Add "PYQ Bank" nav item in `RbiLayout.tsx` sidebar
- Sub-navigation within PYQ section for Upload, Analysis, Practice

### Files

| File | Action |
|------|--------|
| `supabase/functions/rbi-pyq-extract/index.ts` | Create — AI extraction with RBI topics |
| `src/pages/RbiPyqUpload.tsx` | Create — PDF upload + review |
| `src/pages/RbiPyqAnalysis.tsx` | Create — charts + trends dashboard |
| `src/pages/RbiPyqPractice.tsx` | Create — PYQ browser + filter |
| `src/pages/RbiPyqSession.tsx` | Create — practice session for PYQs |
| `src/pages/RbiLayout.tsx` | Edit — add PYQ Bank nav item |
| `src/App.tsx` | Edit — add 4 new routes under `/rbi` |

### No DB Changes Needed
The existing `ssc_questions` table already supports `exam: 'RBI'`, `is_pyq: true`, `year`, and all RBI topics via the shared enum. No migration required.

### Flow
```text
Upload PDF → Select page range → AI extracts questions (3 pages/batch)
    → Review & edit topics/answers → Save to DB
    → View Analysis Dashboard (topic frequency, difficulty trends, year breakdown)
    → Practice PYQs with filters
```

