ALTER TABLE public.ssc_chapter_questions
  ADD COLUMN IF NOT EXISTS why_a text,
  ADD COLUMN IF NOT EXISTS why_b text,
  ADD COLUMN IF NOT EXISTS why_c text,
  ADD COLUMN IF NOT EXISTS why_d text;