
-- Create enums for SSC
CREATE TYPE public.ssc_topic AS ENUM (
  'idioms_phrases', 'one_word_substitution', 'synonyms_antonyms', 'error_detection',
  'sentence_improvement', 'fill_in_blanks', 'cloze_test', 'reading_comprehension',
  'active_passive', 'direct_indirect', 'parajumbles', 'spelling_correction'
);

CREATE TYPE public.ssc_exam AS ENUM ('CGL', 'CHSL', 'MTS', 'GD');
CREATE TYPE public.ssc_difficulty AS ENUM ('easy', 'medium', 'hard');

-- 1. ssc_questions
CREATE TABLE public.ssc_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  topic public.ssc_topic NOT NULL,
  exam public.ssc_exam,
  year integer,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_option integer NOT NULL DEFAULT 0,
  explanation text,
  difficulty public.ssc_difficulty NOT NULL DEFAULT 'medium',
  is_pyq boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.ssc_questions ENABLE ROW LEVEL SECURITY;

-- Everyone can read global (seeded) questions + own questions
CREATE POLICY "Anyone can read global ssc_questions" ON public.ssc_questions
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert own ssc_questions" ON public.ssc_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ssc_questions" ON public.ssc_questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ssc_questions" ON public.ssc_questions
  FOR DELETE USING (auth.uid() = user_id);

-- 2. ssc_user_progress
CREATE TABLE public.ssc_user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.ssc_questions(id) ON DELETE CASCADE NOT NULL,
  is_correct boolean NOT NULL,
  answered_at timestamptz NOT NULL DEFAULT now(),
  time_taken_seconds integer DEFAULT 0
);

ALTER TABLE public.ssc_user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own ssc_user_progress" ON public.ssc_user_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. ssc_user_stats
CREATE TABLE public.ssc_user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  questions_solved integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  streak_days integer NOT NULL DEFAULT 0,
  xp_points integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

ALTER TABLE public.ssc_user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own ssc_user_stats" ON public.ssc_user_stats
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
