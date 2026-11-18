-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4.6.3: REVERSÃO CIRÚRGICA DO CONJUNTO B (TABELAS EXISTENTES)
-- Ficheiro: supabase/migrations/rollback/rollback_set_b_existing_tables_hardening.sql
--
-- REGRAS DE SEGURANÇA:
--   - NÃO remove nem trunca tabelas (preserva perfis, configurações e quotas).
--   - Remove apenas os triggers e funções adicionados pelo hardening da Fase 2B.1.
--   - Restaura as políticas de compatibilidade do site público.
-- =============================================================================

BEGIN;

-- 1. Reversão de triggers e funções em public.profiles
DROP TRIGGER IF EXISTS trg_guard_profiles_sensitive_columns ON public.profiles;
DROP FUNCTION IF EXISTS public.guard_profiles_sensitive_columns();

DROP TRIGGER IF EXISTS trg_sync_profile_role_to_auth ON public.profiles;
DROP FUNCTION IF EXISTS public.internal_sync_profile_role_to_auth();

-- 2. Restauração de políticas originais em public.profiles
DROP POLICY IF EXISTS "Users and verified admins can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile safely" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. Reversão de políticas em public.configuracoes
DROP POLICY IF EXISTS "Public read safe configuracoes keys" ON public.configuracoes;
DROP POLICY IF EXISTS "Admins full access configuracoes" ON public.configuracoes;

CREATE POLICY "Anyone can view configurations"
  ON public.configuracoes FOR SELECT
  USING (true);

-- 4. Reversão de políticas e funções do gerador de sites
DROP POLICY IF EXISTS "Admins read ai_generation_logs" ON public.ai_generation_logs;
DROP POLICY IF EXISTS "Admins read sites_gerados_por_ia" ON public.sites_gerados_por_ia;
DROP POLICY IF EXISTS "Admins read ai_generated_sites" ON public.ai_generated_sites;
DROP POLICY IF EXISTS "Admins read seo_logs" ON public.seo_logs;

DROP FUNCTION IF EXISTS public.check_ai_site_draw_quota(text);
DROP FUNCTION IF EXISTS public.check_ai_generation_log_quota(text, text);

COMMIT;
