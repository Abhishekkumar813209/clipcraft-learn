

## Current Architecture — Why `ssc_topic`?

The app uses **one shared table** (`ssc_questions`) for all exam questions — SSC, BPSC, NQT, and RBI. The `ssc_topic` enum is the column type for that table. So when we add RBI topics like `english`, `quant`, `ga`, we're adding them to that shared enum. The name `ssc_topic` is just legacy naming from when SSC was the first exam added.

**The migration that just ran is correct.** It added the 4 missing Phase 1 values (`english`, `quant`, `reasoning`, `ga`) to the `ssc_topic` enum so RBI questions can be saved. Without this, saving fails with `invalid input value for enum ssc_topic: "ga"`.

### Two options going forward:

**Option A: Keep as-is (recommended for now)**
- The shared table works fine functionally
- RBI hooks already filter by RBI-specific topics using `.in('topic', [...RBI_ALL_TOPICS])`
- No migration or code rewrite needed
- Just confusing naming — but only visible in code, not to users

**Option B: Create a separate `rbi_questions` table**
- Cleaner separation but requires: new table, new migration, new RLS policies, rewriting all RBI hooks and pages
- Significant effort for a cosmetic improvement
- Can be done later as a refactor

### Verdict
The migration is correct and your RBI questions will save properly now. The `ssc_topic` enum name is just an internal label — users never see it. **Retry saving your extracted questions — it should work now.**

No additional changes needed at this point.

