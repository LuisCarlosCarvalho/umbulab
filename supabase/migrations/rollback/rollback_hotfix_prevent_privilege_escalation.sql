-- =============================================================================
-- UMBULAB — REVERSÃO CIRÚRGICA DO HOTFIX DE SEGURANÇA EM PUBLIC.PROFILES
-- Ficheiro: supabase/migrations/rollback/rollback_hotfix_prevent_privilege_escalation.sql
--
-- OBJETIVO:
--   Reversão estrita e não-destrutiva do hotfix em public.profiles caso necessário.
--   - Remove o trigger de guarda trg_guard_profiles_sensitive_columns.
--   - Restaura as políticas RLS padrão de profiles.
--   - NUNCA apaga nem trunca a tabela public.profiles ou auth.users.
-- =============================================================================

BEGIN;

-- 1. Remover o trigger de guarda
DROP TRIGGER IF EXISTS trg_guard_profiles_sensitive_columns ON public.profiles;
DROP FUNCTION IF EXISTS public.guard_profiles_sensitive_columns();

-- 2. Restaurar políticas originais de public.profiles
DROP POLICY IF EXISTS "Users and verified admins can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Política de leitura original
CREATE POLICY "Users and verified admins can read profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (SELECT public.is_verified_admin()));

-- Política de atualização original
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

COMMIT;
