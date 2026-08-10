CREATE TABLE public.ssc_english_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  serial_no integer NOT NULL,
  set_no integer,
  passage text,
  question_text text NOT NULL,
  question_hinglish text,
  hint text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_option text NOT NULL,
  correct_answer text,
  solution_hinglish text,
  book_solution text,
  word_meanings text,
  why_a text,
  why_b text,
  why_c text,
  why_d text,
  usage_a text,
  usage_b text,
  usage_c text,
  usage_d text,
  error_word text,
  correction text,
  corrected_sentence text,
  topic text,
  exam text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_ssc_english_items_cat_serial ON public.ssc_english_items (category, serial_no);

GRANT SELECT ON public.ssc_english_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ssc_english_items TO authenticated;
GRANT ALL ON public.ssc_english_items TO service_role;

ALTER TABLE public.ssc_english_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ssc_english_items_read" ON public.ssc_english_items FOR SELECT USING (true);
CREATE POLICY "ssc_english_items_admin_insert" ON public.ssc_english_items FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "ssc_english_items_admin_update" ON public.ssc_english_items FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "ssc_english_items_admin_delete" ON public.ssc_english_items FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER trg_ssc_english_items_updated BEFORE UPDATE ON public.ssc_english_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();