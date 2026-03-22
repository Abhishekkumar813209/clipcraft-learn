
-- Add RBI Grade B specific topics to ssc_topic enum
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'economic_social_issues';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'monetary_policy';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'fiscal_policy';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'banking_regulation';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'financial_markets';
ALTER TYPE public.ssc_topic ADD VALUE IF NOT EXISTS 'management_theory';

-- Add RBI to ssc_exam enum
ALTER TYPE public.ssc_exam ADD VALUE IF NOT EXISTS 'RBI';
