-- =============================================================================
-- UMBULAB — CORREÇÃO PRIORITÁRIA DE SEGURANÇA (HOTFIX P0)
-- Ficheiro: supabase/migrations/20261116140000_hotfix_prevent_privilege_escalation.sql
--
-- OBJETIVO:
--   Bloquear imediatamente qualquer tentativa de elevação de privilégios na tabela
--   public.profiles (tentativa de alteração de role para 'admin' por clientes)
--   e proteger campos financeiros/administrativos sensíveis, preservando atualizações
--   legítimas de perfil pelo próprio utilizador e operações administrativas do backend.
--
-- VULNERABILIDADE CORRIGIDA:
--   - A política UPDATE em public.profiles verificava apenas "auth.uid() = id".
--   - Falta de trigger impeditivo permitia que qualquer cliente autenticado
--     alterasse a sua própria coluna 'role' para 'admin' ou manipulasse parâmetros financeiros.
--
-- ESCOPO:
--   - Isolado exclusivamente na tabela public.profiles e funções de autorização.
--   - ZERO dependências de tabelas do Growth OS.
--   - 100% retrocompatível com website, login, registo, dashboard de cliente e admin.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. FUNÇÃO CANÓNICA DE AUTORIZAÇÃO ADMINISTRATIVA (STANDALONE E PURA)
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

-- Alias compatível para consultas que utilizem public.is_admin()
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
-- 2. REVOGAR PRIVILÉGIOS DE ESCRITA DE UTILIZADORES ANÓNIMOS
-- -----------------------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE ON TABLE public.profiles FROM anon;

-- -----------------------------------------------------------------------------
-- 3. TRIGGER DE PROTEÇÃO CONTRA ELEVAÇÃO DE PRIVILÉGIOS E CAMPOS FINANCEIROS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_profiles_sensitive_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- 1. Permitir bypass imediato para papéis de sistema e infraestrutura backend
  IF current_user IN ('service_role', 'postgres', 'supabase_admin', 'supabase_auth_admin') THEN
    RETURN NEW;
  END IF;

  -- 2. Permitir se o utilizador autenticado for um administrador verificado na base de dados
  IF public.is_verified_admin() THEN
    RETURN NEW;
  END IF;

  -- 3. Regras estritas aplicáveis a clientes e utilizadores não-administradores:

  -- 3.1. Proibir alteração do identificador único (id)
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Operação não autorizada: não é permitido alterar o identificador do perfil.';
  END IF;

  -- 3.2. Proibir alteração de email por UPDATE direto (deve seguir fluxo auth do Supabase)
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Operação não autorizada: a alteração de email deve ser solicitada através da gestão de conta de autenticação.';
  END IF;

  -- 3.3. Proibir alteração da coluna role (ELEVAÇÃO DE PRIVILÉGIOS - P0)
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Operação não autorizada: utilizadores comuns não possuem permissão para alterar o perfil de acesso (role).';
  END IF;

  -- 3.4. Proibir alteração de parâmetros financeiros e operacionais restritos
  IF NEW.manual_payment_override IS DISTINCT FROM OLD.manual_payment_override
     OR NEW.payment_score IS DISTINCT FROM OLD.payment_score
     OR NEW.payment_settings IS DISTINCT FROM OLD.payment_settings
     OR NEW.os_number IS DISTINCT FROM OLD.os_number THEN
    RAISE EXCEPTION 'Operação não autorizada: apenas administradores podem alterar parâmetros financeiros ou administrativos do perfil.';
  END IF;

  -- 3.5. Proibir manipulação arbitrária de force_password_reset (permitir apenas true -> false na conclusão do reset)
  IF NEW.force_password_reset IS DISTINCT FROM OLD.force_password_reset THEN
    IF NOT (OLD.force_password_reset = true AND NEW.force_password_reset = false) THEN
      RAISE EXCEPTION 'Operação não autorizada: apenas administradores podem ativar a redefinição obrigatória de senha.';
    END IF;
  END IF;

  -- 3.6. Preservar a data de criação original
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    NEW.created_at := OLD.created_at;
  END IF;

  -- Todos os campos legítimos (full_name, phone, avatar_url, nif, cpf_cnpj, endereço, etc.)
  -- são autorizados e atualizados normalmente.
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profiles_sensitive_columns ON public.profiles;
CREATE TRIGGER trg_guard_profiles_sensitive_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profiles_sensitive_columns();

-- -----------------------------------------------------------------------------
-- 4. POLÍTICAS RLS ROBUSTAS EM PUBLIC.PROFILES (DEFESA EM PROFUNDIDADE)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Manter/atualizar política de leitura
DROP POLICY IF EXISTS "Users and verified admins can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles securely" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users and verified admins can read profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (SELECT public.is_verified_admin()));

-- Política de UPDATE para o próprio utilizador (protegida pelo trigger acima)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política de UPDATE para administradores em qualquer perfil
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_verified_admin()))
  WITH CHECK ((SELECT public.is_verified_admin()));

-- -----------------------------------------------------------------------------
-- 5. PROTEÇÃO DE RPCs DE SINCRONIZAÇÃO DE METADADOS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_user_role_to_metadata(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_user_role text;
BEGIN
  -- Se invocado no contexto de uma sessão de utilizador autenticado, exigir administrador verificado
  IF auth.uid() IS NOT NULL AND NOT public.is_verified_admin() THEN
    RAISE EXCEPTION 'Operação não autorizada: apenas administradores verificados podem sincronizar metadados de perfil.';
  END IF;

  SELECT role INTO v_user_role
  FROM public.profiles
  WHERE id = user_id;

  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(v_user_role)
  )
  WHERE id = user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_user_role_to_metadata(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_user_role_to_metadata(uuid) TO authenticated, service_role;

COMMIT;
