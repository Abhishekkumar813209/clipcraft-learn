CREATE TABLE public.ssc_chapter_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  chapter text NOT NULL,
  subtopic text NOT NULL DEFAULT '',
  serial_no integer NOT NULL,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_option text NOT NULL,
  exam_name text,
  explanation_hinglish text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ssc_chapter_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ssc_chapter_questions TO authenticated;
GRANT ALL ON public.ssc_chapter_questions TO service_role;
ALTER TABLE public.ssc_chapter_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapter questions readable" ON public.ssc_chapter_questions FOR SELECT USING (true);
CREATE POLICY "admin insert chapter questions" ON public.ssc_chapter_questions FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin update chapter questions" ON public.ssc_chapter_questions FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin delete chapter questions" ON public.ssc_chapter_questions FOR DELETE TO authenticated USING (public.is_admin());
CREATE INDEX idx_scq_subject_chapter ON public.ssc_chapter_questions (subject, chapter, subtopic, serial_no);
CREATE TRIGGER trg_scq_updated BEFORE UPDATE ON public.ssc_chapter_questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ssc_chapter_theory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  chapter text NOT NULL,
  subtopic text NOT NULL DEFAULT '',
  theory_md text NOT NULL,
  question_count integer NOT NULL DEFAULT 0,
  generated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject, chapter, subtopic)
);
GRANT SELECT ON public.ssc_chapter_theory TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ssc_chapter_theory TO authenticated;
GRANT ALL ON public.ssc_chapter_theory TO service_role;
ALTER TABLE public.ssc_chapter_theory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chapter theory readable" ON public.ssc_chapter_theory FOR SELECT USING (true);
CREATE POLICY "admin insert chapter theory" ON public.ssc_chapter_theory FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "admin update chapter theory" ON public.ssc_chapter_theory FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "admin delete chapter theory" ON public.ssc_chapter_theory FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER trg_sct_updated BEFORE UPDATE ON public.ssc_chapter_theory FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();