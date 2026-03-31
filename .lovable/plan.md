

## Plan: Add Pause/Resume for Quiz Timer

### What Changes

**File:** `src/pages/QuizTest.tsx`

Add a `paused` state. When paused:
- The elapsed timer stops counting
- The fast mode per-question timer stops counting (no auto-advance)
- A semi-transparent overlay covers the question area so the user can't interact with questions
- A "Paused" indicator + Resume button is shown

### Implementation Details

1. **New state:** `const [paused, setPaused] = useState(false);`

2. **Elapsed timer** (line 71-74): Add `if (paused) return;` guard so the interval doesn't tick when paused

3. **Fast mode timer** (line 83-103): Add `paused` to the guard — `if (!fastMode || isSubmitting || paused) return;`

4. **Pause button:** Add a Pause/Play toggle button next to the timer display in the header. When clicked, toggles `paused` state.

5. **Overlay when paused:** Render a semi-transparent overlay over the question card area with a "Quiz Paused" message and a Resume button. This prevents answering questions or navigating while paused.

6. **Navigation blocked:** Disable Prev/Next buttons and question palette clicks when `paused` is true.

### UI

| Element | Behavior |
|---------|----------|
| Timer display | Shows current time but stops counting when paused |
| Pause button (⏸/▶) | Toggles pause state, placed next to clock icon |
| Question area | Covered by blur overlay when paused |
| Sidebar question buttons | Disabled (no navigation) when paused |
| Fast mode timer | Frozen when paused |

Single file change, no new dependencies.

