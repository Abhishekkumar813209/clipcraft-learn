
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO authenticated, service_role;
