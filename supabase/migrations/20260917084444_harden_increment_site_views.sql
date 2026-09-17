CREATE OR REPLACE FUNCTION public.increment_site_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.site_analytics
  SET
    value = value + 1,
    updated_at = now()
  WHERE metric_name = 'total_views';
END;
$function$;
