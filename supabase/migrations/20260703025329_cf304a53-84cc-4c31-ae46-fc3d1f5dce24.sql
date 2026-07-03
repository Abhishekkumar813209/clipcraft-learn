
CREATE TABLE public.bb_practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  total int NOT NULL DEFAULT 0,
  correct int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bb_practice_sessions TO authenticated;
GRANT ALL ON public.bb_practice_sessions TO service_role;
ALTER TABLE public.bb_practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sessions" ON public.bb_practice_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bb_practice_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.bb_practice_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  item_id uuid REFERENCES public.ssc_black_book_items(id) ON DELETE SET NULL,
  category text NOT NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_index int NOT NULL,
  picked_index int,
  is_correct boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bb_practice_attempts TO authenticated;
GRANT ALL ON public.bb_practice_attempts TO service_role;
ALTER TABLE public.bb_practice_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts" ON public.bb_practice_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX bb_attempts_user_cat_idx ON public.bb_practice_attempts(user_id, category);
CREATE INDEX bb_attempts_session_idx ON public.bb_practice_attempts(session_id);
CREATE INDEX bb_attempts_item_idx ON public.bb_practice_attempts(item_id);
CREATE INDEX bb_sessions_user_idx ON public.bb_practice_sessions(user_id, created_at DESC);
