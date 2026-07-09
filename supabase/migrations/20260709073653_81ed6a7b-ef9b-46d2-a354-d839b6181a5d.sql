ALTER TABLE public.ssc_black_book_items ADD COLUMN IF NOT EXISTS subcategory text;
UPDATE public.ssc_black_book_items SET subcategory = 'top_100' WHERE category = 'idiom' AND subcategory IS NULL;
CREATE INDEX IF NOT EXISTS idx_bb_subcategory ON public.ssc_black_book_items (category, subcategory);