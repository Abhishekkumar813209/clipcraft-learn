
CREATE TABLE public.ssc_vocab_learn_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  root text NOT NULL,
  word text NOT NULL,
  module_data jsonb NOT NULL,
  exercises_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, word)
);

ALTER TABLE public.ssc_vocab_learn_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cache" ON public.ssc_vocab_learn_cache
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cache" ON public.ssc_vocab_learn_cache
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cache" ON public.ssc_vocab_learn_cache
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cache" ON public.ssc_vocab_learn_cache
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
