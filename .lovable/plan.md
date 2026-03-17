

## Plan: Add Exam Type (Prelims) & Month Categorization for BPSC PYQs

### Problem
Some years had multiple BPSC exams (e.g., 2024 had exams in different months). Currently there's no way to distinguish between them — only year is stored.

### Solution

**1. Database Migration — Add `month` column to `ssc_questions`**
- Add nullable `integer` column `month` (1-12) to `ssc_questions` table
- This keeps it simple and backward-compatible (existing questions get `null`)

**2. Upload Page (`BpscPyqUpload.tsx`)**
- Add a "Month" dropdown next to the "Exam Year" selector with options: January through December (+ optional "Not specified")
- Pass the selected month when saving questions to the database
- Simple Select component, no constraints

**3. Practice Filter Page (`BpscPyqPractice.tsx`)**
- Add a "Month" filter dropdown alongside existing Year and Topic filters
- Dynamically populate months from available data (only show months that have questions)
- Store month filter in URL search params for refresh persistence

**4. Practice Session (`BpscPyqSession.tsx`)**
- Pass month filter through URL params
- Filter questions by month when set
- Show month badge on question header

**5. Edge Function (`bpsc-pyq-extract/index.ts`)**
- No changes needed — month is metadata set by the user during upload, not extracted by AI

### Files to Change

| File | Change |
|------|--------|
| **Migration** | `ALTER TABLE ssc_questions ADD COLUMN month integer` |
| `src/pages/BpscPyqUpload.tsx` | Add month selector, include month in saved rows |
| `src/pages/BpscPyqPractice.tsx` | Add month filter dropdown + URL param |
| `src/pages/BpscPyqSession.tsx` | Read month param, filter by it, show in badge |

