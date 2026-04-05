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