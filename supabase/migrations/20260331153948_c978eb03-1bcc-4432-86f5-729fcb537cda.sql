ALTER TABLE public.pdf_saved_quizzes ADD COLUMN user_answers jsonb DEFAULT NULL;
ALTER TABLE public.pdf_saved_quizzes ADD COLUMN ai_feedback text DEFAULT NULL;