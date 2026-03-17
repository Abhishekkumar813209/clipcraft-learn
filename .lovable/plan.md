

## Plan: BPSC Mains Section — PYQ Browser + Answer Writing Practice

### What's Missing
The sidebar has "Mains Prep" with `disabled: true` and no route/page exists for `/bpsc/mains`. Need to build a full Mains section with PYQ browsing and AI-powered answer writing practice.

### BPSC Mains Structure
BPSC Mains has 4 papers:
- **GS Paper 1** (General Science, Indian Polity, Economy, Geography, History)
- **GS Paper 2** (Indian & Bihar History, Culture, Geography of Bihar)
- **Essay** (Hindi/English essay writing)
- **Hindi** (Hindi language proficiency)

### Database Changes

**New table: `bpsc_mains_questions`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| paper | enum (`gs1`, `gs2`, `essay`, `hindi`) | Which mains paper |
| topic | text | Sub-topic within the paper |
| question_text | text | The descriptive question |
| model_answer | text | Model/ideal answer (nullable) |
| marks | integer | Marks for the question |
| word_limit | integer | Suggested word limit (nullable) |
| year | integer | PYQ year (nullable) |
| is_pyq | boolean | default true |
| difficulty | enum | easy/medium/hard |
| created_at | timestamptz | default now() |

RLS: Public read (no user_id needed — global content), similar to `ssc_questions` pattern.

**New table: `bpsc_mains_user_answers`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to auth.users |
| question_id | uuid | FK to bpsc_mains_questions |
| answer_text | text | User's written answer |
| ai_feedback | text | AI evaluation (nullable) |
| ai_score | integer | AI-assigned score (nullable) |
| submitted_at | timestamptz | default now() |

RLS: Users can CRUD own answers only.

### New Files

| File | Purpose |
|------|---------|
| `src/types/bpsc.ts` | Add mains paper types and topic metadata |
| `src/pages/BpscMains.tsx` | Main landing — browse papers, filter by year, see PYQs |
| `src/pages/BpscMainsQuestion.tsx` | Single question view — read question, write answer, get AI feedback |
| `src/hooks/useBpscMains.ts` | Hooks for fetching mains questions and user answers |
| `supabase/functions/bpsc-mains-evaluate/index.ts` | Edge function — AI evaluates user's answer against model answer |

### UI Flow

1. **`/bpsc/mains`** — Grid of 4 paper cards (GS-1, GS-2, Essay, Hindi). Each shows question count + year filter dropdown. Click a paper to see its questions.
2. **Question list** — Filterable by year, topic. Each shows marks, word limit, whether user has attempted.
3. **Question detail** — Shows question + word limit + marks. Textarea for answer writing. Submit button triggers AI evaluation via edge function. Shows AI feedback + score + model answer after submission.

### Edge Function: `bpsc-mains-evaluate`
- Takes: question_text, model_answer, user_answer, marks, word_limit
- Uses Lovable AI (gemini-2.5-flash) to evaluate answer on: content accuracy, structure, language, completeness
- Returns: score (out of marks), detailed feedback, improvement suggestions
- Saves result to `bpsc_mains_user_answers`

### Route Changes in `App.tsx`
```
/bpsc/mains          → BpscMains (paper browser)
/bpsc/mains/:paper   → BpscMains (filtered by paper)
/bpsc/mains/q/:id    → BpscMainsQuestion (answer writing)
```

### Sidebar Update
Remove `disabled: true` from "Mains Prep" nav item in `BpscLayout.tsx`.

### Seed Initial Content
Use the existing `seed-ssc-questions` pattern to create a small seeder call with ~20-30 BPSC mains PYQs across all 4 papers to populate initial content.

