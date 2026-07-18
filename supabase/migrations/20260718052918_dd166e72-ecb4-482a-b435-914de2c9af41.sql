CREATE TABLE IF NOT EXISTS public.ssc_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('question','option')),
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  subcategory TEXT,
  item_ref TEXT NOT NULL DEFAULT '',
  question_text TEXT NOT NULL,
  option_text TEXT,
  correct_text TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ssc_bookmarks_dedupe
  ON public.ssc_bookmarks (user_id, kind, chapter, item_ref, COALESCE(option_text, ''));
CREATE INDEX IF NOT EXISTS ssc_bookmarks_user_idx ON public.ssc_bookmarks(user_id, subject, chapter);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ssc_bookmarks TO authenticated;
GRANT ALL ON public.ssc_bookmarks TO service_role;

ALTER TABLE public.ssc_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own bookmarks read"   ON public.ssc_bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own bookmarks insert" ON public.ssc_bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own bookmarks delete" ON public.ssc_bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);