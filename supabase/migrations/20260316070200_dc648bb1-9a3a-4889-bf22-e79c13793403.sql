
-- Add NQT-specific topic values to ssc_topic enum
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'probability';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'permutation_combination';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'simple_compound_interest';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'seating_arrangement';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'pattern_recognition';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'sentence_correction';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'vocabulary';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'sentence_rearrangement';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'advanced_probability';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'perm_comb_puzzles';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'logical_mathematics';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'mixture_problems';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'data_sufficiency';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'seating_puzzles';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'multi_variable_logic';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'caselet_reasoning';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'pattern_deduction';
