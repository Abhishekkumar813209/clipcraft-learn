

## Plan: SSC English Practice Platform — Phase 1 (Core)

### Overview
Build a standalone SSC English learning section at `/ssc/*` routes with its own sidebar navigation, separate from the existing StudyBrain app. Phase 1 covers: Dashboard, Practice Section, and Question Database with seeded sample data.

### Architecture

```text
/ssc                → SSC Dashboard (stats, streak, weak topics)
/ssc/practice       → Topic grid (12 modules)
/ssc/practice/:topic → Question practice UI (timer, MCQ, explanation)
```

Existing StudyBrain routes remain untouched. A link in the main Sidebar will navigate to `/ssc`.

### Database Schema (New Tables)

**1. `ssc_questions`** — Stores all questions
- `id`, `user_id` (null for seeded/global), `topic` (enum: idioms, synonyms, etc.), `exam` (CGL/CHSL/MTS/GD), `year` (nullable), `question_text`, `options` (jsonb array), `correct_option` (int), `explanation`, `difficulty` (easy/medium/hard), `is_pyq` (boolean)

**2. `ssc_user_progress`** — Tracks per-question attempts
- `id`, `user_id`, `question_id`, `is_correct`, `answered_at`, `time_taken_seconds`

**3. `ssc_user_stats`** — Daily aggregated stats
- `id`, `user_id`, `date`, `questions_solved`, `correct_count`, `streak_days`, `xp_points`

All tables have RLS: users see only their own progress. Questions with `user_id IS NULL` are globally visible (seeded data).

### Seed Data
Insert ~50-100 sample questions across all 12 topics with realistic SSC-style MCQs, correct answers, and explanations. Mix of PYQ-tagged and general questions.

### UI Components

**SSC Layout (`/ssc` wrapper)**
- Own sidebar with: Dashboard, Practice, PYQ Mode (grayed out — Phase 2), Vocabulary (Phase 2), Mock Test (Phase 2)
- Clean Duolingo-inspired design: rounded cards, progress rings, warm colors

**SSC Dashboard**
- Daily goal ring (target: 30 questions)
- Questions solved today / accuracy %
- Streak counter with fire icon
- Weak topics list (topics with <60% accuracy)
- XP points display

**Practice Grid (`/ssc/practice`)**
- 12 topic cards in a responsive grid (3 cols desktop, 2 tablet, 1 mobile)
- Each card shows: topic name, icon, questions available, user accuracy %

**Practice Session (`/ssc/practice/:topic`)**
- One question at a time, 4 MCQ options
- Timer per question (30 seconds default)
- On answer: show correct/wrong + explanation
- Progress bar showing question X of N
- End screen: score, accuracy, time taken

### Files to Create
1. `src/pages/SscLayout.tsx` — Layout wrapper with SSC sidebar
2. `src/pages/SscDashboard.tsx` — Dashboard with stats
3. `src/pages/SscPractice.tsx` — Topic grid
4. `src/pages/SscPracticeSession.tsx` — Question practice UI
5. `src/hooks/useSscQuestions.ts` — Fetch/filter questions
6. `src/hooks/useSscProgress.ts` — Track & fetch user progress
7. `src/types/ssc.ts` — Types for SSC domain

### Files to Edit
- `src/App.tsx` — Add `/ssc/*` routes
- `src/components/Sidebar.tsx` — Add "SSC English" nav link

### Migration
- Create 3 tables + RLS policies + seed ~80 sample questions via SQL migration

### Phase 2 (Later)
PYQ Mode filters, Vocabulary Builder, Mock Tests, Spaced Repetition, Leaderboard, Level system

