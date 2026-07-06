
CREATE TABLE public.ssc_root_words (
  id BIGSERIAL PRIMARY KEY,
  sno INT,
  root TEXT NOT NULL,
  root_meaning TEXT,
  root_plus_word TEXT,
  word TEXT NOT NULL,
  definition TEXT,
  hinglish_meaning TEXT,
  example TEXT,
  synonym TEXT,
  antonym TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ssc_root_words_root_idx ON public.ssc_root_words(root);
CREATE INDEX ssc_root_words_word_idx ON public.ssc_root_words(word);
GRANT SELECT ON public.ssc_root_words TO anon, authenticated;
GRANT ALL ON public.ssc_root_words TO service_role;
ALTER TABLE public.ssc_root_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "root words are public" ON public.ssc_root_words FOR SELECT USING (true);

CREATE TABLE public.root_practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  total INT NOT NULL DEFAULT 0,
  correct INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.root_practice_sessions TO authenticated;
GRANT ALL ON public.root_practice_sessions TO service_role;
ALTER TABLE public.root_practice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own root sessions" ON public.root_practice_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.root_practice_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.root_practice_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  word_id BIGINT REFERENCES public.ssc_root_words(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INT NOT NULL,
  picked_index INT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  qtype TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.root_practice_attempts TO authenticated;
GRANT ALL ON public.root_practice_attempts TO service_role;
ALTER TABLE public.root_practice_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own root attempts" ON public.root_practice_attempts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
