CREATE TABLE public.trainer_content_edits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_key text NOT NULL,
  selector text NOT NULL,
  html text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trainer_key, selector)
);
GRANT SELECT ON public.trainer_content_edits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainer_content_edits TO authenticated;
GRANT ALL ON public.trainer_content_edits TO service_role;
ALTER TABLE public.trainer_content_edits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trainer_edits_public_read" ON public.trainer_content_edits FOR SELECT USING (true);
CREATE POLICY "trainer_edits_admin_insert" ON public.trainer_content_edits FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "trainer_edits_admin_update" ON public.trainer_content_edits FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "trainer_edits_admin_delete" ON public.trainer_content_edits FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER trainer_content_edits_set_updated_at BEFORE UPDATE ON public.trainer_content_edits FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();