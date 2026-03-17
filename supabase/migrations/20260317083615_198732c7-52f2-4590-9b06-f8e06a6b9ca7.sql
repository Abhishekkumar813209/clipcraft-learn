
-- Create enum for mains papers
CREATE TYPE public.bpsc_mains_paper AS ENUM ('gs1', 'gs2', 'essay', 'hindi');

-- Create bpsc_mains_questions table
CREATE TABLE public.bpsc_mains_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paper bpsc_mains_paper NOT NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  model_answer TEXT,
  marks INTEGER NOT NULL DEFAULT 10,
  word_limit INTEGER,
  year INTEGER,
  is_pyq BOOLEAN NOT NULL DEFAULT true,
  difficulty ssc_difficulty NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bpsc_mains_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bpsc_mains_questions"
  ON public.bpsc_mains_questions
  FOR SELECT
  TO public
  USING (true);

-- Create bpsc_mains_user_answers table
CREATE TABLE public.bpsc_mains_user_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID NOT NULL REFERENCES public.bpsc_mains_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  ai_feedback TEXT,
  ai_score INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bpsc_mains_user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own bpsc_mains_user_answers"
  ON public.bpsc_mains_user_answers
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
