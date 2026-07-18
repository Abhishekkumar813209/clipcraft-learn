
-- Bookmarks table for questions and options
CREATE TABLE public.ssc_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('question','option')),
  subject TEXT NOT NULL,           -- 'english' | 'maths' | 'reasoning' | 'gk'
  chapter TEXT NOT NULL,           -- e.g. 'idiom', 'ows', 'syn_ant', 'grammar_verb_basic', 'calc_squares'
  subcategory TEXT,                -- optional
  item_ref TEXT,                   -- source item id / slug for dedupe
  question_text TEXT NOT NULL,
  option_text TEXT,                -- required when kind='option'
  correct_text TEXT,               -- store correct answer for context
  meta JSONB,                      -- any extra (hinglish meaning, example, etc.)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookmarks_user ON public.ssc_bookmarks(user_id, subject, chapter);
CREATE UNIQUE INDEX idx_bookmarks_dedupe ON public.ssc_bookmarks(user_id, kind, chapter, coalesce(item_ref,''), coalesce(option_text,''));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ssc_bookmarks TO authenticated;
GRANT ALL ON public.ssc_bookmarks TO service_role;
ALTER TABLE public.ssc_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own bookmarks" ON public.ssc_bookmarks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
