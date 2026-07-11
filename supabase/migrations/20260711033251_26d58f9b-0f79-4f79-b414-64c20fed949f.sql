
CREATE TABLE public.ssc_syn_ant_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('synonym','antonym')),
  subcategory text not null check (subcategory in ('top_100','all_repeated')),
  serial_no int,
  word text not null,
  meaning text,
  hinglish_meaning text,
  example_sentence text,
  synonyms text,
  antonyms text,
  antonym_hinglish_meaning text,
  antonym_example_sentence text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.ssc_syn_ant_items TO anon, authenticated;
GRANT ALL ON public.ssc_syn_ant_items TO service_role;
ALTER TABLE public.ssc_syn_ant_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read syn/ant items" ON public.ssc_syn_ant_items FOR SELECT USING (true);
CREATE POLICY "Admins manage syn/ant items" ON public.ssc_syn_ant_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX idx_ssc_syn_ant_kind_sub ON public.ssc_syn_ant_items(kind, subcategory);
CREATE TRIGGER trg_ssc_syn_ant_updated BEFORE UPDATE ON public.ssc_syn_ant_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
