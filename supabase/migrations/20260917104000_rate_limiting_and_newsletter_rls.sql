
-- ==========================================
-- 1. Rate Limiting Table & RPC
-- ==========================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_ip text NOT NULL,
    action_type text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamptz DEFAULT now(),
    UNIQUE(client_ip, action_type)
);

-- Habilita RLS na tabela de rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Ninguém tem acesso direto de leitura/escrita público
-- Toda a interação é feita através do RPC (SECURITY DEFINER)

CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_client_ip text,
    p_action_type text,
    p_max_requests integer,
    p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $unction$
DECLARE
    v_request_count integer;
    v_window_start timestamptz;
BEGIN
    -- Busca o registro atual
    SELECT request_count, window_start INTO v_request_count, v_window_start
    FROM public.rate_limits
    WHERE client_ip = p_client_ip AND action_type = p_action_type;

    IF NOT FOUND THEN
        -- Primeiro request
        INSERT INTO public.rate_limits (client_ip, action_type, request_count, window_start)
        VALUES (p_client_ip, p_action_type, 1, now());
        RETURN true; -- Permitido
    END IF;

    -- Se a janela de tempo já passou, reseta
    IF now() > (v_window_start + (p_window_seconds || ' seconds')::interval) THEN
        UPDATE public.rate_limits
        SET request_count = 1,
            window_start = now()
        WHERE client_ip = p_client_ip AND action_type = p_action_type;
        RETURN true; -- Permitido
    END IF;

    -- Se está dentro da janela, verifica limite
    IF v_request_count >= p_max_requests THEN
        RETURN false; -- Bloqueado (Rate Limited)
    END IF;

    -- Incrementa contagem
    UPDATE public.rate_limits
    SET request_count = request_count + 1
    WHERE client_ip = p_client_ip AND action_type = p_action_type;

    RETURN true; -- Permitido
END;
$unction$;

-- Garante que a função pode ser acedida pelo cliente
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO authenticated;

-- ==========================================
-- 2. Newsletter Leads RLS
-- ==========================================

-- Cria tabela caso não exista
CREATE TABLE IF NOT EXISTS public.newsletter_leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Ativa RLS
ALTER TABLE public.newsletter_leads ENABLE ROW LEVEL SECURITY;

-- Limpa policies antigas (se existirem)
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.newsletter_leads;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.newsletter_leads;
DROP POLICY IF EXISTS "Enable all access for admins" ON public.newsletter_leads;

-- Permite que qualquer visitante insira o seu e-mail
CREATE POLICY "Allow public insert to newsletter_leads" 
ON public.newsletter_leads 
FOR INSERT TO public 
WITH CHECK (true);

-- Permite que apenas administradores leiam e giram
CREATE POLICY "Allow admins full access to newsletter_leads"
ON public.newsletter_leads
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
