CREATE TABLE public.ssc_grammar_rules (
  id uuid primary key default gen_random_uuid(),
  rule_id integer not null unique,
  rule_title text not null,
  rule_statement_hinglish text,
  rule_details text,
  exception_note text,
  formula_short text,
  examples text,
  difficulty text,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.ssc_grammar_rules TO anon, authenticated;
GRANT ALL ON public.ssc_grammar_rules TO service_role;
ALTER TABLE public.ssc_grammar_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Grammar rules readable by everyone" ON public.ssc_grammar_rules FOR SELECT USING (true);

CREATE TABLE public.ssc_grammar_rule_questions (
  id uuid primary key default gen_random_uuid(),
  question_id integer not null unique,
  rule_id integer not null references public.ssc_grammar_rules(rule_id) on delete cascade,
  q_order integer not null default 1,
  question_text text not null,
  correct_option text not null,
  correct_answer_word text,
  explanation_hinglish text,
  source text,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.ssc_grammar_rule_questions TO anon, authenticated;
GRANT ALL ON public.ssc_grammar_rule_questions TO service_role;
ALTER TABLE public.ssc_grammar_rule_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Grammar rule questions readable by everyone" ON public.ssc_grammar_rule_questions FOR SELECT USING (true);
CREATE INDEX idx_grammar_q_rule ON public.ssc_grammar_rule_questions(rule_id, q_order);