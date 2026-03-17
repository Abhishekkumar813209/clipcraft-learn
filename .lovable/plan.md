

## Plan: Make Topic Cards Show Filtered Counts

### Problem
The topic cards at the bottom always show total counts from all questions (`topicCounts` is computed from `pyqQuestions` — the full unfiltered dataset). When user selects a year or month filter, the cards should reflect only the matching questions.

### Solution

Change `topicCounts` to be computed from the `filtered` list instead of the full `pyqQuestions` list. This means:

1. **`topicCounts` uses `filtered` data** — When year or month is selected, topic cards update to show only questions matching those filters. When topic filter is active, we exclude it from the count computation so you still see per-topic breakdown.

2. **Card visibility** — Only show cards for topics that have questions in the filtered set (already done via `.filter(t => topicCounts[t])`).

### Changes

**`src/pages/BpscPyqPractice.tsx`** (single file change):
- Recompute `topicCounts` from a "filtered-except-topic" list. This filters by year and month but NOT by topic, so you can see the per-topic breakdown within the selected year/month.
- Replace lines 63-68:
  ```typescript
  const filteredByYearMonth = useMemo(() => {
    if (!pyqQuestions) return [];
    return pyqQuestions.filter(q => {
      if (yearFilter !== 'all' && q.year !== parseInt(yearFilter)) return false;
      if (monthFilter !== 'all' && q.month !== parseInt(monthFilter)) return false;
      return true;
    });
  }, [pyqQuestions, yearFilter, monthFilter]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredByYearMonth.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    return counts;
  }, [filteredByYearMonth]);
  ```

This way: select "2024" → cards show only 2024 question counts per topic. Select a specific month → further narrows. Topic dropdown counts in the filter bar also update accordingly.

