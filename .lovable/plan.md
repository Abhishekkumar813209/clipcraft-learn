

## Plan: Persist Productivity Coach Data to Database

### What
Create a `productivity_logs` table to store daily planned/actual hours per user, and update the ProductivityCoach page to load/save this data automatically.

### Database Migration

Create table `productivity_logs`:
```sql
CREATE TABLE public.productivity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  planned_hours numeric(4,1) NOT NULL DEFAULT 8,
  actual_hours numeric(4,1) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.productivity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own productivity_logs"
  ON public.productivity_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Code Changes — `src/pages/ProductivityCoach.tsx`

1. Import `useAuth` from AuthContext
2. On mount, fetch today's row from `productivity_logs` for the current user
3. Initialize `plannedHours` and `actualHours` from the fetched row (or defaults)
4. On change of either value, upsert (insert or update on conflict) the row back to the database with a short debounce (~1s)
5. If user is not logged in, fall back to local state only (no DB calls)

### Files Modified
- **Migration** — New table `productivity_logs`
- **`src/pages/ProductivityCoach.tsx`** — Add load/save logic with upsert

