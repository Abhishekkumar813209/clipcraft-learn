CREATE TABLE public.ssc_homonym_words (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_no integer NOT NULL,
  word text NOT NULL,
  pos text,
  hinglish_meaning text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ssc_homonym_words_group_idx ON public.ssc_homonym_words(group_no);
GRANT SELECT ON public.ssc_homonym_words TO anon;
GRANT SELECT ON public.ssc_homonym_words TO authenticated;
GRANT ALL ON public.ssc_homonym_words TO service_role;
ALTER TABLE public.ssc_homonym_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homonyms are readable by everyone" ON public.ssc_homonym_words FOR SELECT USING (true);
CREATE POLICY "Admins manage homonyms" ON public.ssc_homonym_words FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());