-- =============================================================================
-- UMBULAB — FASE 2B.1 (REV 3.2 HOMOLOGADA): HARDENING CRÍTICO DE SEGURANÇA (P0-A a P0-E)
-- Ficheiro: supabase/migrations/20261110100000_phase2b1_critical_security_hardening.sql
--
-- REGRAS DE GOVERNANÇA:
--   1. Alinhado com o catálogo real de produção auditado na Fase 2B.0.1.
--   2. Preserva 100% dos fluxos legítimos:
--      - Login / Registo / OAuth
--      - PasswordChangeModal.tsx (transição force_password_reset: true -> false)
--      - App.tsx & AtivarPage.tsx (leitura pública apenas de maintenance_settings)
--      - AdminRssSettings.tsx & PaymentConfigTab.tsx (leitura/escrita exclusiva Admin)
--      - DesenharSitePage.tsx & api/ai/generate-site.ts (quotas sem enumeração de PII)
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 0. FUNÇÃO CANÓNICA DE AUTORIZAÇÃO ADMINISTRATIVA (public.is_verified_admin)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_verified_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_verified_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_verified_admin() TO authenticated, service_role;

-- Alias compatível para políticas que referenciem public.is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT public.is_verified_admin();
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- P0-A: PROTEGER ALTERAÇÃO DE profiles.role E COLUNAS ADMINISTRATIVAS SENSÍVEIS
-- -----------------------------------------------------------------------------
-- Revogar privilégios de escrita anónima na tabela profiles
REVOKE INSERT, UPDATE, DELETE ON TABLE public.profiles FROM anon;

-- Função definida como SECURITY INVOKER para que current_user reflita o papel
-- real da sessão (authenticated / anon vs service_role / postgres).
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

  -- Bloquear alteração de colunas financeiras/administrativas por clientes
  IF NEW.manual_payment_override IS DISTINCT FROM OLD.manual_payment_override
     OR NEW.payment_score IS DISTINCT FROM OLD.payment_score
     OR NEW.payment_settings IS DISTINCT FROM OLD.payment_settings
     OR NEW.os_number IS DISTINCT FROM OLD.os_number THEN
    RAISE EXCEPTION 'Operação não autorizada: apenas administradores podem alterar parâmetros financeiros ou administrativos do perfil.';
  END IF;

  -- Permitir apenas a transição legítima force_password_reset: true -> false pelo próprio utilizador
  -- (necessário para src/components/auth/PasswordChangeModal.tsx)
  IF NEW.force_password_reset IS DISTINCT FROM OLD.force_password_reset THEN
    IF NOT (OLD.force_password_reset IS TRUE AND NEW.force_password_reset IS FALSE AND auth.uid() = OLD.id) THEN
      RAISE EXCEPTION 'Operação não autorizada: alteração inválida de force_password_reset.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profiles_sensitive_columns ON public.profiles;
CREATE TRIGGER trg_guard_profiles_sensitive_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profiles_sensitive_columns();

-- Consolidar políticas RLS de public.profiles (incluindo os nomes exatos de produção)
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users and admins" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile safely" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users and verified admins can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Users and verified admins can read profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (SELECT public.is_verified_admin()));

CREATE POLICY "Users can update own profile safely"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_verified_admin()))
  WITH CHECK ((SELECT public.is_verified_admin()));

CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING ((SELECT public.is_verified_admin()));

-- -----------------------------------------------------------------------------
-- P0-B: PROTEGER E REVOGAR EXECUÇÃO PÚBLICA DE sync_user_role_to_metadata
--       E DEMAIS FUNÇÕES ADMINISTRATIVAS / TRIGGERS SECURITY DEFINER
-- -----------------------------------------------------------------------------
-- 1. Atualizar a sobrecarga de produção public.sync_user_role_to_metadata(uuid)
--    com verificação explícita de autorização (defesa em profundidade) e search_path fixo.
CREATE OR REPLACE FUNCTION public.sync_user_role_to_metadata(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  user_role text;
BEGIN
  IF current_user NOT IN ('service_role', 'postgres', 'supabase_admin', 'supabase_auth_admin')
     AND NOT public.is_verified_admin() THEN
    RAISE EXCEPTION 'Operação não autorizada: apenas service_role ou administradores verificados podem sincronizar metadados de perfil.';
  END IF;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_id;

  IF user_role IS NOT NULL THEN
    UPDATE auth.users
    SET raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{role}',
      to_jsonb(user_role)
    )
    WHERE id = user_id;
  END IF;
END;
$$;

-- 2. Varrer pg_proc para proteger TODAS as sobrecargas existentes de
--    sync_user_role_to_metadata e sync_role_to_metadata (0-arg, uuid-arg ou outras).
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('sync_user_role_to_metadata', 'sync_role_to_metadata')
  LOOP
    EXECUTE format('ALTER FUNCTION %s SECURITY DEFINER SET search_path = public, auth, pg_temp', r.proc_sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.proc_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.proc_sig);
  END LOOP;
END;
$$;

-- 3. Proteger search_path e privilégios de handle_new_user() e increment_visit_count(text)
--    identificados no catálogo de produção (Fase 2B.0.1 linhas 139 e 141)
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'handle_new_user'
  LOOP
    EXECUTE format('ALTER FUNCTION %s SECURITY DEFINER SET search_path = public, auth, pg_temp', r.proc_sig);
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.proc_sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.proc_sig);
  END LOOP;

  FOR r IN
    SELECT p.oid::regprocedure AS proc_sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'increment_visit_count'
  LOOP
    EXECUTE format('ALTER FUNCTION %s SECURITY DEFINER SET search_path = public, pg_temp', r.proc_sig);
  END LOOP;
END;
$$;

-- Trigger interna segura para sincronizar role -> auth.users.raw_app_meta_data
CREATE OR REPLACE FUNCTION public.internal_sync_profile_role_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.internal_sync_profile_role_to_auth() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.internal_sync_profile_role_to_auth() TO service_role;

DROP TRIGGER IF EXISTS trg_sync_profile_role_to_auth ON public.profiles;
CREATE TRIGGER trg_sync_profile_role_to_auth
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.internal_sync_profile_role_to_auth();

-- -----------------------------------------------------------------------------
-- P0-C: ELIMINAR A VIEW public.profiles_debug QUE EXPÕE DADOS PESSOAIS
-- -----------------------------------------------------------------------------
DROP VIEW IF EXISTS public.profiles_debug;

-- -----------------------------------------------------------------------------
-- P0-D: RESTRINGIR LEITURA DE public.configuracoes APENAS À CHAVE PÚBLICA REAL
-- -----------------------------------------------------------------------------
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.configuracoes FROM anon;

-- Remover todas as políticas antigas de public.configuracoes (incluindo nomes exatos de produção)
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'configuracoes'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.configuracoes', pol.policyname);
  END LOOP;
END;
$$;

-- Whitelist estrita de chaves públicas de visibilidade de UI (booleanos is_active lidos
-- por App.tsx, Navbar.tsx, BlogSection.tsx, BlogPage.tsx, BlogPostPage.tsx, InfoproductsPage.tsx
-- e ProductDetailsPage.tsx). Chaves sensíveis/administrativas (payment_methods,
-- payment_global_settings, global_payment_settings, blog_rss_sync) ficam 100% bloqueadas para não-admins.
CREATE POLICY "Public read safe configuracoes keys"
  ON public.configuracoes
  FOR SELECT
  TO anon, authenticated
  USING (chave IN ('maintenance_settings', 'blog_settings', 'seo_gestao_settings', 'infoproducts_settings'));

CREATE POLICY "Admins full access configuracoes"
  ON public.configuracoes
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_verified_admin()))
  WITH CHECK ((SELECT public.is_verified_admin()));

-- Proteção de toggle_maintenance (exige administrador autenticado verificado na BD)
CREATE OR REPLACE FUNCTION public.toggle_maintenance(secret_key text, is_active_val boolean)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_verified_admin() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Acesso negado: apenas administradores autenticados podem alterar o modo de manutenção.'
    );
  END IF;

  INSERT INTO public.configuracoes (chave, valor, updated_at)
  VALUES (
    'maintenance_settings',
    jsonb_build_object('is_active', is_active_val, 'updated_by', auth.uid(), 'updated_at', now()),
    now()
  )
  ON CONFLICT (chave) DO UPDATE
  SET valor = EXCLUDED.valor,
      updated_at = now();

  RETURN jsonb_build_object('success', true, 'is_active', is_active_val);
END;
$$;

REVOKE ALL ON FUNCTION public.toggle_maintenance(text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.toggle_maintenance(text, boolean) TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- P0-E: PROTEGER DADOS PESSOAIS EM LOGS/SITES IA E PREVENIR ENUMERAÇÃO EM QUOTAS
-- -----------------------------------------------------------------------------
-- 1. Remover todas as políticas SELECT públicas/permissivas existentes nas 4 tabelas
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('ai_generation_logs', 'sites_gerados_por_ia', 'ai_generated_sites', 'seo_logs')
      AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END;
$$;

REVOKE SELECT, UPDATE, DELETE ON TABLE
  public.ai_generation_logs,
  public.sites_gerados_por_ia,
  public.ai_generated_sites,
  public.seo_logs
FROM anon;

CREATE POLICY "Admins read ai_generation_logs"
  ON public.ai_generation_logs
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_verified_admin()));

CREATE POLICY "Admins read sites_gerados_por_ia"
  ON public.sites_gerados_por_ia
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_verified_admin()));

CREATE POLICY "Admins read ai_generated_sites"
  ON public.ai_generated_sites
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_verified_admin()));

CREATE POLICY "Admins read seo_logs"
  ON public.seo_logs
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_verified_admin()));

-- 2. RPCs de verificação de quota anti-enumeração (Fase 3.1/3.2 - Ponto 5.2):
--    - Normalizam entradas
--    - Aplicam rate-limiting persistente via public.check_rate_limit(text,text,integer,integer)
--    - Devolvem APENAS `{"allowed": boolean}` (sem expor contagens exatas nem
--      revelar se um e-mail ou IP específico existe na base de dados).
CREATE OR REPLACE FUNCTION public.check_ai_site_draw_quota(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_email text;
  v_count integer;
  v_rate_ok boolean := true;
BEGIN
  v_clean_email := lower(trim(COALESCE(p_email, '')));

  IF length(v_clean_email) < 5 OR length(v_clean_email) > 254 OR position('@' IN v_clean_email) <= 1 THEN
    RETURN jsonb_build_object('allowed', false);
  END IF;

  -- Proteção anti-enumeração: limita consultas repetidas ao RPC (máx 10 por minuto por hash)
  IF to_regprocedure('public.check_rate_limit(text,text,integer,integer)') IS NOT NULL THEN
    SELECT public.check_rate_limit(substr(md5(v_clean_email), 1, 16), 'rpc_draw_quota', 10, 60)
    INTO v_rate_ok;
    IF NOT COALESCE(v_rate_ok, true) THEN
      RETURN jsonb_build_object('allowed', false);
    END IF;
  END IF;

  SELECT count(*)::integer
  INTO v_count
  FROM public.ai_generated_sites
  WHERE lower(trim(COALESCE(form_data->>'email', ''))) = v_clean_email;

  RETURN jsonb_build_object(
    'allowed', (COALESCE(v_count, 0) < 2)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.check_ai_site_draw_quota(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_ai_site_draw_quota(text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.check_ai_generation_log_quota(p_email text, p_ip text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_clean_email text;
  v_clean_ip text;
  v_email_count integer := 0;
  v_ip_count integer := 0;
  v_rate_ok boolean := true;
BEGIN
  v_clean_email := lower(trim(COALESCE(p_email, '')));
  v_clean_ip := trim(COALESCE(p_ip, 'unknown'));

  IF length(v_clean_email) < 5 OR length(v_clean_email) > 254 OR position('@' IN v_clean_email) <= 1 THEN
    RETURN jsonb_build_object('allowed', false);
  END IF;

  -- Proteção anti-enumeração: limita consultas repetidas ao RPC (máx 10 por minuto)
  IF to_regprocedure('public.check_rate_limit(text,text,integer,integer)') IS NOT NULL THEN
    SELECT public.check_rate_limit(
      substr(md5(v_clean_email || ':' || v_clean_ip), 1, 16),
      'rpc_gen_log_quota',
      10,
      60
    )
    INTO v_rate_ok;
    IF NOT COALESCE(v_rate_ok, true) THEN
      RETURN jsonb_build_object('allowed', false);
    END IF;
  END IF;

  SELECT count(*)::integer
  INTO v_email_count
  FROM public.ai_generation_logs
  WHERE lower(trim(email)) = v_clean_email;

  IF v_clean_ip <> '' AND v_clean_ip <> 'unknown' THEN
    SELECT count(*)::integer
    INTO v_ip_count
    FROM public.ai_generation_logs
    WHERE trim(ip_address) = v_clean_ip;
  END IF;

  -- Resposta opaca booleana: não distingue se o bloqueio foi por email ou por IP
  RETURN jsonb_build_object(
    'allowed', (COALESCE(v_email_count, 0) < 1 AND COALESCE(v_ip_count, 0) < 1)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.check_ai_generation_log_quota(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_ai_generation_log_quota(text, text) TO anon, authenticated, service_role;

COMMIT;
