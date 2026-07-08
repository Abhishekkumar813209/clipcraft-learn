
ALTER TABLE public.ssc_root_words ADD COLUMN IF NOT EXISTS hindi_meaning text;

CREATE TABLE IF NOT EXISTS public.ssc_word_hindi (
  word_key text PRIMARY KEY,
  display text NOT NULL,
  hindi text NOT NULL,
  kind text NOT NULL DEFAULT 'word',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ssc_word_hindi TO anon, authenticated;
GRANT ALL ON public.ssc_word_hindi TO service_role;

ALTER TABLE public.ssc_word_hindi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "word hindi is public" ON public.ssc_word_hindi FOR SELECT USING (true);

CREATE TRIGGER update_ssc_word_hindi_updated_at
  BEFORE UPDATE ON public.ssc_word_hindi
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
