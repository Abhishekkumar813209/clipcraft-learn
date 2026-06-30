
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT (auth.jwt() ->> 'email') = 'abhishek.kumar.chy21@itbhu.ac.in'),
    false
  );
$$;
