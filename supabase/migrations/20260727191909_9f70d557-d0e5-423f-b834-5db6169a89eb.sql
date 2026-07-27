CREATE TABLE public.upsc_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL DEFAULT 'ancient_history',
  chapter_no integer NOT NULL,
  chapter_name text NOT NULL,
  topic_tag text,
  serial_no integer NOT NULL,
  global_serial integer NOT NULL,
  q_type text NOT NULL DEFAULT 'mcq',
  question_text text NOT NULL,
  statements text,
  list_i text,
  list_ii text,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_option text NOT NULL,
  ncert_source text,
  explanation_hinglish text,
  why_a text,
  why_b text,
  why_c text,
  why_d text,
  ncert_extra text,
  hint_hinglish text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX upsc_questions_subject_global_serial_key ON public.upsc_questions (subject, global_serial);
CREATE INDEX upsc_questions_chapter_idx ON public.upsc_questions (subject, chapter_no, serial_no);

GRANT SELECT ON public.upsc_questions TO authenticated;
GRANT ALL ON public.upsc_questions TO service_role;

ALTER TABLE public.upsc_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read upsc questions"
ON public.upsc_questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage upsc questions"
ON public.upsc_questions FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TRIGGER upsc_questions_set_updated_at
BEFORE UPDATE ON public.upsc_questions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();