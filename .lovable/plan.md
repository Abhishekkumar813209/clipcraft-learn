

# Plan: SSC Vocabulary Upload System

## What We're Building

A new page at `/ssc/vocab/upload` where you can upload a vocabulary book PDF, extract words with their roots/meanings using AI, review them, and save to the database. Then a `/ssc/vocab` page to browse and study saved vocabulary.

## Database Changes

### New table: `ssc_vocabulary`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto |
| user_id | uuid | nullable (null = global) |
| root | text | nullable (some words have no root) |
| root_meaning | text | nullable |
| word | text | not null |
| meaning | text | nullable |
| example_sentence | text | nullable |
| source_book | text | nullable (e.g. "Neetu Singh Vol 1") |
| created_at | timestamptz | default now() |

- RLS: same pattern as ssc_questions (anyone can read global, users CRUD own)
- Unique constraint on (user_id, word) to prevent duplicates

### No enum changes needed — vocabulary is separate from MCQ topics.

## New Edge Function: `ssc-vocab-extract`

- Accepts `{ pageText: string }` from the frontend
- Uses the system prompt you provided (root word parser) with Lovable AI
- Uses tool calling to return structured JSON: `{ entries: [{ root, root_meaning, words: string[] }] }`
- Returns cleaned, deduplicated, alphabetically sorted words

## New Pages

### 1. `src/pages/SscVocabUpload.tsx` — Upload & Extract

Follows the same pattern as `RbiPyqUpload.tsx`:
- PDF upload with pdfjs-dist (client-side text extraction)
- Page range selector (process in batches of 5 pages)
- Extracted words shown in a review table grouped by root
- Edit/delete individual words before saving
- "Save All" button inserts into `ssc_vocabulary`
- Optional "Source Book" text input for tagging

### 2. `src/pages/SscVocab.tsx` — Browse & Study

- Shows all saved vocabulary words
- Filter by root letter (A-Z)
- Search bar
- Cards showing: word, root, root meaning
- Count display (e.g. "1,847 words saved")

## Navigation

Add to `SscLayout.tsx` sidebar:
- New nav item: `{ label: 'Vocabulary', path: '/ssc/vocab', icon: BookMarked }`

Add routes in `App.tsx`:
```
<Route path="vocab" element={<SscVocab />} />
<Route path="vocab/upload" element={<SscVocabUpload />} />
```

## Files to Create/Edit

| File | Action |
|------|--------|
| Migration SQL | Create `ssc_vocabulary` table + RLS |
| `supabase/functions/ssc-vocab-extract/index.ts` | New edge function for AI extraction |
| `src/pages/SscVocabUpload.tsx` | New upload page (PDF → extract → review → save) |
| `src/pages/SscVocab.tsx` | New browse/study page |
| `src/pages/SscLayout.tsx` | Add Vocabulary nav item |
| `src/App.tsx` | Add 2 new routes under `/ssc` |

