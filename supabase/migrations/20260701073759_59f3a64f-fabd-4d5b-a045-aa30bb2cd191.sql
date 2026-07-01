
-- Black Book unified content table
CREATE TABLE public.ssc_black_book_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('syn_ant','idiom','ows')),
  serial_no int,
  prompt text NOT NULL,
  answer text NOT NULL,
  pos text,
  hindi_meaning text,
  english_meaning text,
  hinglish_meaning text,
  synonyms text[],
  antonyms text[],
  example text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ssc_black_book_items TO anon, authenticated;
GRANT ALL ON public.ssc_black_book_items TO service_role;
ALTER TABLE public.ssc_black_book_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read black book items" ON public.ssc_black_book_items FOR SELECT USING (true);
CREATE POLICY "Admin can manage black book items" ON public.ssc_black_book_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX idx_bb_category ON public.ssc_black_book_items(category);

-- Daily progress
CREATE TABLE public.black_book_daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT current_date,
  category text NOT NULL CHECK (category IN ('syn_ant','idiom','ows')),
  target int NOT NULL DEFAULT 20,
  attempted int NOT NULL DEFAULT 0,
  correct int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date, category)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.black_book_daily_progress TO authenticated;
GRANT ALL ON public.black_book_daily_progress TO service_role;
ALTER TABLE public.black_book_daily_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.black_book_daily_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Duel matches
CREATE TABLE public.duel_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('syn_ant','idiom','ows','mixed')),
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','live','done')),
  question_ids uuid[] NOT NULL DEFAULT '{}',
  seconds_per_q int NOT NULL DEFAULT 30,
  winner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.duel_matches TO authenticated;
GRANT ALL ON public.duel_matches TO service_role;
ALTER TABLE public.duel_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Host or guest can read match" ON public.duel_matches FOR SELECT USING (auth.uid() = host_id OR auth.uid() = guest_id OR guest_id IS NULL);
CREATE POLICY "Anyone authenticated can create match" ON public.duel_matches FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host or joining guest can update" ON public.duel_matches FOR UPDATE USING (auth.uid() = host_id OR auth.uid() = guest_id OR guest_id IS NULL) WITH CHECK (auth.uid() = host_id OR auth.uid() = guest_id);

-- Duel answers
CREATE TABLE public.duel_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.duel_matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  q_index int NOT NULL,
  selected int NOT NULL,
  is_correct boolean NOT NULL,
  ms_taken int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (match_id, user_id, q_index)
);
GRANT SELECT, INSERT ON public.duel_answers TO authenticated;
GRANT ALL ON public.duel_answers TO service_role;
ALTER TABLE public.duel_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can read answers" ON public.duel_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.duel_matches m WHERE m.id = match_id AND (m.host_id = auth.uid() OR m.guest_id = auth.uid()))
);
CREATE POLICY "User inserts own answer" ON public.duel_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.duel_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.duel_answers;
