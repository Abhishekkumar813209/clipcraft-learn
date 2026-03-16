

## Plan: BPSC Preparation Platform at `/bpsc/*`

### Overview
Add a standalone BPSC (Bihar Public Service Commission) exam prep section following the exact same architecture as NQT and SSC modules. Reuses `ssc_questions`, `ssc_user_progress`, `ssc_user_stats` tables with new topic enum values.

### Phase 1 Scope (This Build)
- Dashboard, Prelims Practice (9 topics), AI Explanations
- Mains, PYQ Mode, Mock Tests, Current Affairs, Smart Revision, PYQ Trend Analysis marked as "Coming Soon"

### 1. Database Changes

**Extend `ssc_topic` enum** with BPSC-specific values:
- `indian_history`, `bihar_history`, `indian_polity`, `indian_economy`, `geography_india`, `geography_bihar`, `environment_ecology`, `general_science`, `current_affairs_bpsc`

**Seed ~40 sample questions** across all 9 Prelims GS topics.

### 2. New Type File — `src/types/bpsc.ts`

```text
BpscSubject = 'general_studies'

BPSC_SUBJECT_TOPICS mapping:
  general_studies: indian_history, bihar_history, indian_polity, indian_economy,
                   geography_india, geography_bihar, environment_ecology,
                   general_science, current_affairs_bpsc

BPSC_TOPIC_META: label + icon for each topic
```

### 3. New Files

| File | Purpose |
|------|---------|
| `src/types/bpsc.ts` | Topics, subjects, metadata |
| `src/pages/BpscLayout.tsx` | Sidebar with Dashboard, Prelims Practice, Mains (disabled), PYQ (disabled), Mock Tests (disabled), Current Affairs (disabled) |
| `src/pages/BpscDashboard.tsx` | Stats, streak, weak topics, topic overview |
| `src/pages/BpscPractice.tsx` | Topic grid for General Studies |
| `src/pages/BpscPracticeSession.tsx` | Timed MCQ with AI explain (reuses nqt-explain edge function) |
| `src/hooks/useBpscQuestions.ts` | Fetch questions filtered to BPSC topics |
| `src/hooks/useBpscProgress.ts` | Progress tracking using same DB tables |

### 4. Files to Edit

- `src/App.tsx` — Add `/bpsc/*` routes
- `src/components/Sidebar.tsx` — Add "BPSC Prep" nav link with `Landmark` icon
- Migration SQL — Extend enum + seed questions

### 5. Routing

```text
/bpsc                    → BPSC Dashboard
/bpsc/practice           → Topic grid (Prelims GS)
/bpsc/practice/:topic    → Timed MCQ session
```

### 6. Coming Soon (Phase 2)
- Mains preparation (GS Paper 1, Paper 2, Essay Writing, Optional)
- PYQ Practice Mode with year/subject/topic filters
- Mock Tests with timer + score analysis
- Current Affairs section
- Smart Revision (spaced repetition)
- PYQ Trend Analysis charts

### UI
- Green/emerald color scheme for BPSC branding
- Same Duolingo-inspired clean design as other modules

