

## Plan: Add RBI Grade B Segment

### What
Add "RBI Grade B" as a new exam prep section in the main sidebar and build its layout + dashboard + practice flow — same pattern as SSC, NQT, and BPSC.

### RBI Grade B Structure
RBI Grade B has 3 phases:
- **Phase 1**: General Awareness, English, Quantitative Aptitude, Reasoning
- **Phase 2**: Economic & Social Issues, Finance & Management
- **Phase 3**: Interview (not applicable for practice)

### Files to Create

| File | Purpose |
|------|---------|
| `src/types/rbi.ts` | Topics, subjects, metadata (Phase 1 & 2 topics) |
| `src/pages/RbiLayout.tsx` | Sidebar layout (like SscLayout) with nav: Dashboard, Practice, Mock Test |
| `src/pages/RbiDashboard.tsx` | Stats dashboard — daily goal, accuracy, streak, topic cards |
| `src/pages/RbiPractice.tsx` | Subject → topic grid for practice |
| `src/pages/RbiPracticeSession.tsx` | Question-by-question practice session |
| `src/hooks/useRbiQuestions.ts` | Fetch questions from DB |
| `src/hooks/useRbiProgress.ts` | Track progress/stats |

### Database Changes

**New enum**: `rbi_topic` — covering Phase 1 (GA, English, Quant, Reasoning) and Phase 2 (ESI, F&M) topics.

**New table**: `rbi_questions` — same structure as `ssc_questions` (question_text, options, correct_option, explanation, topic, difficulty, is_pyq, exam, year).

**New table**: `rbi_progress` — same as `ssc_progress` (user_id, question_id, selected_option, is_correct, answered_at).

RLS: Public read on questions, user-only on progress.

### Route Changes in `App.tsx`
```
/rbi           → RbiLayout
  /rbi         → RbiDashboard
  /rbi/practice → RbiPractice
  /rbi/practice/:topic → RbiPracticeSession
```

### Sidebar Change (`src/components/Sidebar.tsx`)
Add nav item:
```
{ icon: Landmark, label: "RBI Grade B", path: "/rbi" }
```
(Use `Landmark` icon — fits banking/RBI theme)

### Topics Covered

**Phase 1**: idioms_phrases, synonyms_antonyms, error_detection, reading_comprehension, percentage, profit_loss, number_system, data_interpretation, analogy, coding_decoding, series, syllogism, history, polity, economy, current_affairs

**Phase 2**: economic_social_issues, monetary_policy, fiscal_policy, banking_regulation, financial_markets, management_theory

### No Initial Seeding
Tables will be created empty. Questions can be seeded later via edge function (same pattern as SSC).

