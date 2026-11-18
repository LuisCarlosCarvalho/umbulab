-- =============================================================================
-- UMBULAB AI GROWTH OS — CONJUNTO B: HARDENING DE SEGURANÇA DE TABELAS EXISTENTES
-- Ficheiro: supabase/migrations/set_b_existing_hardening.sql
--
-- OBJETIVO:
--   Reforço de segurança nas tabelas compartilhadas da UmbuLab (profiles, configuracoes)
--   e proteção das tabelas de auditoria do gerador de sites (ai_generation_logs).
--
-- INDEPENDÊNCIA E CONDICIONALIDADE:
--   - Executado APENAS após o Conjunto A estar estabilizado.
--   - Não cria novas tabelas de dados.
--   - Utiliza guardas defensivas IF EXISTS para preservar retrocompatibilidade total.
--   - NÃO remove nem modifica o funcionamento do gerador de websites.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. PROTEÇÃO CONTRA AUTO-PROMOÇÃO NA TABELA PUBLIC.PROFILES
-- -----------------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE ON TABLE public.profiles FROM anon;

CREATE OR REPLACE FUNCTION public.guard_profiles_sensitive_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Permitir operações internas de administração de base de dados / service_role
  IF current_user IN ('service_role', 'postgres', 'supabase_admin', 'supabase_auth_admin') THEN
    RETURN NEW;
  END IF;

  -- Permitir se o utilizador autenticado já for um administrador verificado na BD
  IF public.is_verified_admin() THEN
    RETURN NEW;
  END IF;

  -- Bloquear qualquer tentativa de alterar o identificador ou email do perfil
  IF NEW.id IS DISTINCT FROM OLD.id OR NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Operação não autorizada: não é permitido alterar o identificador ou email do perfil.';
  END IF;

  -- Bloquear qualquer tentativa de auto-promoção na coluna role
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Operação não autorizada: apenas administradores podem alterar o perfil de acesso (role).';
  END IF;

  -- Bloquear alteração de colunas financeiras/administrativas por utilizadores não-admin
  IF NEW.manual_payment_override IS DISTINCT FROM OLD.manual_payment_override
     OR NEW.payment_score IS DISTINCT FROM OLD.payment_score
     OR NEW.payment_settings IS DISTINCT FROM OLD.payment_settings
     OR NEW.os_number IS DISTINCT FROM OLD.os_number THEN
    RAISE EXCEPTION 'Operação não autorizada: apenas administradores podem alterar parâmetros financeiros ou administrativos do perfil.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profiles_sensitive_columns ON public.profiles;
CREATE TRIGGER trg_guard_profiles_sensitive_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profiles_sensitive_columns();

-- -----------------------------------------------------------------------------
-- 2. POLÍTICAS RLS REFORÇADAS EM PUBLIC.PROFILES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles securely" ON public.profiles;

CREATE POLICY "Users can view profiles securely"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (SELECT public.is_verified_admin()));

-- -----------------------------------------------------------------------------
-- 3. POLÍTICAS RLS REFORÇADAS EM PUBLIC.CONFIGURACOES
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'configuracoes') THEN
    ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow authenticated full access to configuracoes" ON public.configuracoes;
    DROP POLICY IF EXISTS "Admins manage configuracoes" ON public.configuracoes;
    
    CREATE POLICY "Admins manage configuracoes"
      ON public.configuracoes
      FOR ALL
      TO authenticated
      USING ((SELECT public.is_verified_admin()))
      WITH CHECK ((SELECT public.is_verified_admin()));
      
    REVOKE ALL ON TABLE public.configuracoes FROM anon;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. POLÍTICAS DEFENSIVAS NAS TABELAS DO GERADOR DE SITES
--    (Garante que logs de geração não são visíveis publicamente)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_generation_logs') THEN
    ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admins read ai_generation_logs" ON public.ai_generation_logs;
    CREATE POLICY "Admins read ai_generation_logs"
      ON public.ai_generation_logs
      FOR SELECT
      TO authenticated
      USING ((SELECT public.is_verified_admin()));
    REVOKE ALL ON TABLE public.ai_generation_logs FROM anon;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_generated_sites') THEN
    ALTER TABLE public.ai_generated_sites ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admins read ai_generated_sites" ON public.ai_generated_sites;
    CREATE POLICY "Admins read ai_generated_sites"
      ON public.ai_generated_sites
      FOR SELECT
      TO authenticated
      USING ((SELECT public.is_verified_admin()));
    REVOKE ALL ON TABLE public.ai_generated_sites FROM anon;
  END IF;
END $$;

COMMIT;
