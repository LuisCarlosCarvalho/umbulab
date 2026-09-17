
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name text UNIQUE NOT NULL,
    value numeric DEFAULT 0,
    updated_at timestamptz DEFAULT now()
);

-- Ensure initial row exists so UPDATE works
INSERT INTO public.site_analytics (metric_name, value) 
VALUES ('total_views', 0)
ON CONFLICT (metric_name) DO NOTHING;

-- RLS
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read on site_analytics" ON public.site_analytics
    FOR SELECT TO public USING (true);
