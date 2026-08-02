CREATE TABLE public.upsc_chapter_theory (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject text NOT NULL,
  chapter_no integer NOT NULL,
  chapter_name text NOT NULL,
  theory_md text NOT NULL,
  question_count integer NOT NULL DEFAULT 0,
  generated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject, chapter_no)
);

GRANT SELECT ON public.upsc_chapter_theory TO authenticated;
GRANT ALL ON public.upsc_chapter_theory TO service_role;

ALTER TABLE public.upsc_chapter_theory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone signed in can read theory"
  ON public.upsc_chapter_theory FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins manage theory"
  ON public.upsc_chapter_theory FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER upsc_chapter_theory_updated_at
  BEFORE UPDATE ON public.upsc_chapter_theory
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();