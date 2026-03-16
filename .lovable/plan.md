

## Plan: Expand SSC Platform to Full Multi-Subject Exam Prep

### What's Already Built
- English section with 12 topics, ~70 seeded questions, practice session UI, dashboard, progress tracking
- Database tables: `ssc_questions`, `ssc_user_progress`, `ssc_user_stats`
- The `ssc_questions.topic` column uses a Postgres enum (`ssc_topic`) currently limited to English topics

### What Needs to Change

This is a massive expansion. I recommend building it incrementally — **Phase 2** adds the 3 new subjects (Quant, Reasoning, GK) with the same practice infrastructure that English already has.

#### 1. Database Changes

**Extend the `ssc_topic` enum** to include all new topics:
- **Quant** (12 topics): percentage, profit_loss, ratio_proportion, average, time_work, time_speed_distance, number_system, algebra, geometry, trigonometry, data_interpretation, simplification
- **Reasoning** (9 topics): analogy, coding_decoding, series, blood_relation, direction, syllogism, puzzle, venn_diagram, statement_conclusion
- **GK** (6 topics): history, polity, geography, economy, static_gk, current_affairs

**Seed ~120 sample questions** across all new subjects (roughly 3-4 per topic).

#### 2. Type System (`src/types/ssc.ts`)

- Add a `subject` concept: `'english' | 'quant' | 'reasoning' | 'gk'`
- Group topics by subject with metadata (label, icon, color per subject)
- Extend `SSC_TOPICS` array and `TOPIC_META` with all new topics

#### 3. Updated Sidebar & Routing

**SscLayout sidebar** — Replace flat nav with subject-grouped navigation:
- Dashboard
- English (current)
- Quantitative Aptitude (new)
- Reasoning (new)
- General Awareness (new)
- PYQ Mode (coming soon)
- Mock Test (coming soon)

**New routes:**
- `/ssc/practice/:subject` → Topic grid for that subject
- `/ssc/practice/:subject/:topic` → Practice session (reuse existing `SscPracticeSession`)

Or simpler: keep `/ssc/practice` as a subject selector page, then `/ssc/practice/:topic` stays the same since topics are globally unique.

**Recommended approach**: Add a subject selector page at `/ssc/practice` showing 4 subject cards (English, Quant, Reasoning, GK). Clicking a subject shows its topic grid. The practice session component stays unchanged.

#### 4. UI Components

**`SscPractice.tsx`** — Refactor to show:
- 4 subject tabs/cards at the top
- Topic grid filtered by selected subject
- Each subject has its own color theme

**`SscDashboard.tsx`** — Update weak topics and overview to include all subjects

**`SscPracticeSession.tsx`** — No changes needed (already topic-agnostic)

#### 5. Files to Edit
- `src/types/ssc.ts` — Add subjects, new topics, metadata
- `src/pages/SscPractice.tsx` — Add subject selector UI
- `src/pages/SscLayout.tsx` — Update sidebar with subject links
- `src/pages/SscDashboard.tsx` — Update overview for all subjects
- `src/App.tsx` — Minor route adjustments if needed
- Migration SQL — Extend enum + seed new questions

#### 6. Not in This Phase
- PYQ Mode filters, Mock Tests, Smart Revision, Vocabulary Builder, Leaderboard — these remain "coming soon"

