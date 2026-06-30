
-- Admin check function (REPLACE the email below with your real admin email)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT (auth.jwt() ->> 'email') = 'admin@example.com'),
    false
  );
$$;

-- updated_at trigger helper (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ admin_books ============
CREATE TABLE public.admin_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  exam_tag text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_books TO authenticated;
GRANT ALL ON public.admin_books TO service_role;
ALTER TABLE public.admin_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "books read all authed" ON public.admin_books FOR SELECT TO authenticated USING (true);
CREATE POLICY "books admin insert" ON public.admin_books FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "books admin update" ON public.admin_books FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "books admin delete" ON public.admin_books FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER trg_admin_books_updated BEFORE UPDATE ON public.admin_books FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ admin_topics ============
CREATE TABLE public.admin_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.admin_books(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_admin_topics_book ON public.admin_topics(book_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_topics TO authenticated;
GRANT ALL ON public.admin_topics TO service_role;
ALTER TABLE public.admin_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics read all authed" ON public.admin_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "topics admin insert" ON public.admin_topics FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "topics admin update" ON public.admin_topics FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "topics admin delete" ON public.admin_topics FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER trg_admin_topics_updated BEFORE UPDATE ON public.admin_topics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ admin_subtopics ============
CREATE TABLE public.admin_subtopics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.admin_topics(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_admin_subtopics_topic ON public.admin_subtopics(topic_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_subtopics TO authenticated;
GRANT ALL ON public.admin_subtopics TO service_role;
ALTER TABLE public.admin_subtopics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subtopics read all authed" ON public.admin_subtopics FOR SELECT TO authenticated USING (true);
CREATE POLICY "subtopics admin insert" ON public.admin_subtopics FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "subtopics admin update" ON public.admin_subtopics FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "subtopics admin delete" ON public.admin_subtopics FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER trg_admin_subtopics_updated BEFORE UPDATE ON public.admin_subtopics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ admin_questions ============
CREATE TABLE public.admin_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.admin_books(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.admin_topics(id) ON DELETE CASCADE,
  subtopic_id uuid REFERENCES public.admin_subtopics(id) ON DELETE SET NULL,
  exam_tag text NOT NULL,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_option int NOT NULL,
  explanation text,
  difficulty text DEFAULT 'medium',
  source_pdf_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_admin_questions_subtopic ON public.admin_questions(subtopic_id);
CREATE INDEX idx_admin_questions_topic ON public.admin_questions(topic_id);
CREATE INDEX idx_admin_questions_book ON public.admin_questions(book_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_questions TO authenticated;
GRANT ALL ON public.admin_questions TO service_role;
ALTER TABLE public.admin_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions read all authed" ON public.admin_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "questions admin insert" ON public.admin_questions FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "questions admin update" ON public.admin_questions FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "questions admin delete" ON public.admin_questions FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER trg_admin_questions_updated BEFORE UPDATE ON public.admin_questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ admin_study_log ============
CREATE TABLE public.admin_study_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtopic_id uuid NOT NULL REFERENCES public.admin_subtopics(id) ON DELETE CASCADE,
  studied_at timestamptz NOT NULL DEFAULT now(),
  questions_attempted int NOT NULL DEFAULT 0
);
CREATE INDEX idx_study_log_user_time ON public.admin_study_log(user_id, studied_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_study_log TO authenticated;
GRANT ALL ON public.admin_study_log TO service_role;
ALTER TABLE public.admin_study_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "study_log own select" ON public.admin_study_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "study_log own insert" ON public.admin_study_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_log own delete" ON public.admin_study_log FOR DELETE TO authenticated USING (auth.uid() = user_id);
