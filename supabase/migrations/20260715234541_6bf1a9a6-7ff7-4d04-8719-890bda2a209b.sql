CREATE TABLE public.ssc_pos_spot_error (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pos TEXT NOT NULL,
  level TEXT NOT NULL,
  q_no INT NOT NULL,
  full_sentence TEXT NOT NULL,
  part_a TEXT NOT NULL,
  part_b TEXT NOT NULL,
  part_c TEXT NOT NULL,
  part_d TEXT NOT NULL,
  error_in TEXT NOT NULL,
  correct_form TEXT,
  rule_tag TEXT,
  hint TEXT,
  solution TEXT,
  practice JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pos, level, q_no)
);
GRANT SELECT ON public.ssc_pos_spot_error TO anon, authenticated;
GRANT ALL ON public.ssc_pos_spot_error TO service_role;
ALTER TABLE public.ssc_pos_spot_error ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read spot-error items" ON public.ssc_pos_spot_error FOR SELECT USING (true);
CREATE POLICY "Admins manage spot-error items" ON public.ssc_pos_spot_error FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_ssc_pos_spot_error_updated BEFORE UPDATE ON public.ssc_pos_spot_error FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();