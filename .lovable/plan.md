

## Plan: TCS NQT Preparation Platform at `/nqt/*`

### Overview
Build a standalone TCS NQT prep section at `/nqt` routes, separate from the existing SSC platform. Reuses the same database tables (`ssc_questions`, `ssc_user_progress`, `ssc_user_stats`) and hooks pattern, but with NQT-specific topic definitions, branding, and an AI explanation edge function.

### Phase 1 Scope (This Build)
- Dashboard, Practice (3 subjects + Advanced), AI Explanations
- Mock Tests and deep analytics deferred to Phase 2

### Database Changes

**Extend `ssc_topic` enum** with new NQT-specific values:
- `probability`, `permutation_combination`, `simple_compound_interest` (Aptitude)
- `seating_arrangement`, `pattern_recognition` (Reasoning)
- `sentence_correction`, `vocabulary`, `sentence_rearrangement` (Verbal)
- `advanced_probability`, `perm_comb_puzzles`, `logical_mathematics`, `mixture_problems`, `data_sufficiency` (Advanced Aptitude)
- `seating_puzzles`, `multi_variable_logic`, `caselet_reasoning`, `pattern_deduction` (Advanced Reasoning)

Many existing enum values (percentage, profit_loss, coding_decoding, error_detection, etc.) are shared with SSC and will be reused.

**Seed ~100 sample questions** tagged for NQT topics with explanations.

### Type System — `src/types/nqt.ts`

```text
NqtSubject = 'aptitude' | 'reasoning' | 'verbal' | 'advanced'

SUBJECT_TOPICS mapping:
  aptitude: percentage, profit_loss, ratio_proportion, average, time_work, 
            time_speed_distance, probability, permutation_combination, 
            number_system, simple_compound_interest
  reasoning: series, coding_decoding, blood_relation, direction, 
             seating_arrangement, puzzle, pattern_recognition, analogy
  verbal: sentence_correction, error_detection, reading_comprehension, 
          vocabulary, synonyms_antonyms, fill_in_blanks, sentence_rearrangement
  advanced: advanced_probability, perm_comb_puzzles, logical_mathematics, 
            mixture_problems, data_sufficiency, seating_puzzles, 
            multi_variable_logic, caselet_reasoning, pattern_deduction
```

### Routing

```text
/nqt                    → NQT Dashboard
/nqt/practice           → Subject selector + topic grid
/nqt/practice/:topic    → Timed MCQ session (reuse pattern from SSC)
```

Add "TCS NQT" nav link to main StudyBrain sidebar.

### New Files

| File | Purpose |
|------|---------|
| `src/types/nqt.ts` | NQT subjects, topics, metadata |
| `src/pages/NqtLayout.tsx` | Layout with NQT sidebar (Dashboard, Practice, Mock Tests [disabled], Progress [disabled]) |
| `src/pages/NqtDashboard.tsx` | Dashboard with stats, streak, weak topics, subject overview |
| `src/pages/NqtPractice.tsx` | Subject selector (4 cards) + topic grid |
| `src/pages/NqtPracticeSession.tsx` | Timed MCQ UI with AI explanation button |
| `src/hooks/useNqtQuestions.ts` | Fetch questions filtered to NQT topics |
| `src/hooks/useNqtProgress.ts` | Progress tracking (reuses same DB tables) |
| `supabase/functions/nqt-explain/index.ts` | AI explanation edge function using Lovable AI |

### Files to Edit

- `src/App.tsx` — Add `/nqt/*` routes
- `src/components/Sidebar.tsx` — Add NQT nav link

### AI Explanation System

Create an edge function `nqt-explain` that:
- Takes a question, correct answer, and user's answer
- Calls Lovable AI (google/gemini-3-flash-preview) to generate:
  - Concept explanation
  - Step-by-step solution
  - Shortcut method
- Returns structured explanation
- User clicks "AI Explain" button after answering to get detailed explanation

### UI Design
- Same Duolingo-inspired clean design as SSC section
- NQT branding: blue/indigo color scheme, TCS NQT logo area
- Mobile-friendly responsive layout
- The practice session shows a new "AI Explain" button alongside the static explanation

### Phase 2 (Later)
- Full-length mock tests with timer + sectional scoring
- Performance analytics with improvement graphs
- Smart practice engine (random question sets by exam pattern)

