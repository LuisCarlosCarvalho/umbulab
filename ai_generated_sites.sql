-- Executar isto no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS public.ai_generated_sites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  form_data jsonb NOT NULL,
  generated_html text NOT NULL,
  prompt_used text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar Row Level Security
ALTER TABLE public.ai_generated_sites ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode inserir (útil para formulários públicos ou authenticated dependendo do caso)
CREATE POLICY "Enable insert for authenticated users only" ON public.ai_generated_sites
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Utilizadores podem ver
CREATE POLICY "Enable select for authenticated users" ON public.ai_generated_sites
  FOR SELECT
  USING (auth.role() = 'authenticated');
