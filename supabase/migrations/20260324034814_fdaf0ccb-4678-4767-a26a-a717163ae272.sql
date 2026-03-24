
CREATE TABLE public.ssc_vocabulary (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  root text,
  root_meaning text,
  word text NOT NULL,
  meaning text,
  example_sentence text,
  source_book text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, word)
);

ALTER TABLE public.ssc_vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read global ssc_vocabulary"
  ON public.ssc_vocabulary FOR SELECT
  TO public
  USING ((user_id IS NULL) OR (auth.uid() = user_id));

CREATE POLICY "Users can insert own ssc_vocabulary"
  ON public.ssc_vocabulary FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ssc_vocabulary"
  ON public.ssc_vocabulary FOR UPDATE
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ssc_vocabulary"
  ON public.ssc_vocabulary FOR DELETE
  TO public
  USING (auth.uid() = user_id);
