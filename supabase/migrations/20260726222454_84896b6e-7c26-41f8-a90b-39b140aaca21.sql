CREATE TABLE public.rbi_vocab_words (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_no integer NOT NULL,
  word text NOT NULL,
  meaning text NOT NULL,
  example text,
  hinglish_meaning text,
  root_word text NOT NULL,
  root_meaning text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX rbi_vocab_words_serial_idx ON public.rbi_vocab_words (serial_no);
GRANT SELECT ON public.rbi_vocab_words TO authenticated;
GRANT ALL ON public.rbi_vocab_words TO service_role;
ALTER TABLE public.rbi_vocab_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone signed in can read RBI vocab" ON public.rbi_vocab_words FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage RBI vocab" ON public.rbi_vocab_words FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());