-- 1. Criar tabela de configurações
CREATE TABLE IF NOT EXISTS public.configuracoes (
    chave text PRIMARY KEY,
    valor jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Política de Leitura Pública
CREATE POLICY "Allow public read-only access to configuracoes" 
    ON public.configuracoes FOR SELECT 
    USING (true);

-- Política de Gerenciamento para Admins
CREATE POLICY "Allow admins full access to configuracoes" 
    ON public.configuracoes FOR ALL 
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Inserir Configurações Iniciais
INSERT INTO public.configuracoes (chave, valor) VALUES
('maintenance_settings', '{"is_active": false}'),
('blog_settings', '{"is_active": true}'),
('infoproducts_settings', '{"is_active": true}'),
('global_payment_settings', '{"default_currency_br": "BRL", "default_currency_pt": "EUR", "payment_timeout_minutes": 30, "manual_approval_enabled": false, "mode": "test", "webhook_status": "online"}')
ON CONFLICT (chave) DO NOTHING;


-- 2. Criar tabela de posts do blog
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    excerpt text NOT NULL,
    content text NOT NULL,
    featured_image_url text NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Política de Leitura Pública para Posts Publicados
CREATE POLICY "Allow public read access to published posts" 
    ON public.blog_posts FOR SELECT 
    USING (status = 'published');

-- Política de Gerenciamento para Admins
CREATE POLICY "Allow admins full access to blog_posts" 
    ON public.blog_posts FOR ALL 
    USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Inserir Posts Iniciais (Seed Data)
INSERT INTO public.blog_posts (title, slug, excerpt, content, featured_image_url, status, published_at) VALUES
('Como o SEO de Alta Performance Duplica Suas Vendas', 'como-seo-alta-performance-duplica-vendas', 'Descubra os principais pilares de otimização para motores de busca que trazem tráfego qualificado e geram conversão real.', '<p>O SEO (Search Engine Optimization) moderno vai muito além de repetir palavras-chave. Trata-se de experiência do usuário, autoridade de domínio e relevância técnica.</p><h3>1. Performance e Core Web Vitals</h3><p>O Google prioriza sites que carregam rapidamente. Ter um Lighthouse score acima de 90 no celular não é opcional, é pré-requisito para rankear bem.</p>', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop', 'published', now()),
('Criação de Sites de Alta Performance: O Guia Definitivo', 'criacao-de-sites-alta-performance-guia-definitivo', 'Ter um site lento ou mal estruturado custa caro ao seu negócio. Aprenda como desenvolver plataformas focadas em conversão.', '<p>Seu site institucional ou e-commerce é a vitrine virtual do seu negócio. Ele precisa carregar em menos de 2 segundos para evitar o abandono de possíveis clientes.</p><h3>Como otimizar a velocidade?</h3><p>Utilizar frameworks modernos de renderização, otimizar imagens com formatos de última geração como WebP e configurar CDNs são os primeiros passos.</p>', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop', 'published', now())
ON CONFLICT (slug) DO NOTHING;


-- 3. Criar função RPC toggle_maintenance
CREATE OR REPLACE FUNCTION public.toggle_maintenance(secret_key text, is_active_val boolean)
RETURNS jsonb AS $$
DECLARE
    correct_key text := 'UmbuLab2026!'; -- Chave de segurança padrão
BEGIN
    IF secret_key = correct_key THEN
        INSERT INTO public.configuracoes (chave, valor)
        VALUES ('maintenance_settings', jsonb_build_object('is_active', is_active_val))
        ON CONFLICT (chave)
        DO UPDATE SET valor = jsonb_build_object('is_active', is_active_val), updated_at = now();
        
        RETURN jsonb_build_object('success', true);
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Chave de segurança incorreta.');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir acesso para os papéis anônimo e autenticado
GRANT EXECUTE ON FUNCTION public.toggle_maintenance(text, boolean) TO anon, authenticated, service_role;
