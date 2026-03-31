
-- Create folders table
CREATE TABLE public.pdf_quiz_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pdf_quiz_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own pdf_quiz_folders" ON public.pdf_quiz_folders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create saved quizzes table
CREATE TABLE public.pdf_saved_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id uuid REFERENCES public.pdf_quiz_folders(id) ON DELETE SET NULL,
  name text NOT NULL,
  pdf_name text,
  page_range text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  language text NOT NULL DEFAULT 'english',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pdf_saved_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own pdf_saved_quizzes" ON public.pdf_saved_quizzes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
