

## Plan: Add Missing RBI Topic Values to Database Enum

### Problem
Questions fail to save with error `invalid input value for enum ssc_topic: "ga"` because the database `ssc_topic` enum is missing 4 RBI Phase 1 values: `english`, `quant`, `reasoning`, `ga`. Only `esi`, `fm`, `english_p2` were added in the last migration.

### Fix
Run a single migration to add the 4 missing values to the `ssc_topic` enum.

### Changes

**Migration SQL:**
```sql
ALTER TYPE ssc_topic ADD VALUE IF NOT EXISTS 'english';
ALTER TYPE ssc_topic ADD VALUE IF NOT EXISTS 'quant';
ALTER TYPE ssc_topic ADD VALUE IF NOT EXISTS 'reasoning';
ALTER TYPE ssc_topic ADD VALUE IF NOT EXISTS 'ga';
```

No code changes needed — the frontend and types are already correct. This is purely a database enum gap.

| File | Action |
|------|--------|
| New migration | Add 4 missing enum values to `ssc_topic` |

