-- Executar isto no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS public.site_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir uma página de demonstração para testes do Agente de IA
INSERT INTO public.site_pages (id, content) 
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  '{
    "hero": {
      "title": "Welcome to AI Builder",
      "image": "https://example.com/hero.jpg",
      "subtitle": "Edit me via prompt"
    },
    "gallery": [
      { "id": "0043", "url": "https://example.com/img1.jpg" },
      { "id": "0044", "url": "https://example.com/img2.jpg" }
    ]
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- Ativar Row Level Security
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Política simples: permitir tudo para authenticated
CREATE POLICY "Enable all for authenticated users" ON public.site_pages
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
