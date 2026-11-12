-- =============================================================================
-- UMBULAB — FASE 2B.1: SCRIPT DE VERIFICAÇÃO READ-ONLY (ANTES E DEPOIS)
-- =============================================================================
-- REGRAS DE SEGURANÇA:
-- 1. Estritamente READ-ONLY sobre pg_catalog / pg_policies.
-- 2. Não lê dados de utilizadores, não lê prosrc e não imprime segredos.
-- =============================================================================

WITH checks AS (
  -- 1. Verificar função canónica is_admin() e proteção de funções críticas
  SELECT
    1 AS check_order,
    '1_CRITICAL_FUNCTIONS' AS check_group,
    n.nspname || '.' || p.proname AS object_name,
    pg_get_function_identity_arguments(p.oid) AS sub_object,
    format(
      'secdef=%s | search_path=%s | anon_exec=%s | auth_exec=%s',
      p.prosecdef,
      COALESCE(array_to_string(p.proconfig, ','), 'NONE'),
      has_function_privilege('anon', p.oid, 'EXECUTE'),
      has_function_privilege('authenticated', p.oid, 'EXECUTE')
    ) AS status_summary
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public'
    AND p.proname IN (
      'is_admin',
      'sync_user_role_to_metadata',
      'trg_sync_profile_role_to_auth',
      'guard_profiles_sensitive_columns',
      'toggle_maintenance',
      'handle_new_user',
      'increment_visit_count',
      'check_ai_site_draw_quota',
      'check_ai_generation_log_quota'
    )

  UNION ALL

  -- 2. Verificar view profiles_debug (deve retornar 0 linhas / exists=false após migração)
  SELECT
    2 AS check_order,
    '2_PROFILES_DEBUG_VIEW' AS check_group,
    'public.profiles_debug' AS object_name,
    'view_presence' AS sub_object,
    format('exists=%s', to_regclass('public.profiles_debug') IS NOT NULL) AS status_summary

  UNION ALL

  -- 3. Verificar triggers ativos em public.profiles
  SELECT
    3 AS check_order,
    '3_PROFILES_TRIGGERS' AS check_group,
    'public.profiles' AS object_name,
    t.tgname AS sub_object,
    format(
      'enabled=%s | fn=%s | fn_secdef=%s',
      t.tgenabled,
      p.proname,
      p.prosecdef
    ) AS status_summary
  FROM pg_trigger t
  JOIN pg_class c ON c.oid = t.tgrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_proc p ON p.oid = t.tgfoid
  WHERE n.nspname = 'public'
    AND c.relname = 'profiles'
    AND NOT t.tgisinternal

  UNION ALL

  -- 4. Verificar políticas RLS nas tabelas endurecidas
  SELECT
    4 AS check_order,
    '4_HARDENED_POLICIES' AS check_group,
    schemaname || '.' || tablename AS object_name,
    policyname AS sub_object,
    format(
      'cmd=%s | roles=%s | using=%s | check=%s',
      cmd,
      array_to_string(roles, ','),
      COALESCE(qual, 'NULL'),
      COALESCE(with_check, 'NULL')
    ) AS status_summary
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN (
      'profiles',
      'configuracoes',
      'ai_generation_logs',
      'sites_gerados_por_ia',
      'ai_generated_sites',
      'seo_logs'
    )
)
SELECT
  check_order,
  check_group,
  object_name,
  sub_object,
  status_summary
FROM checks
ORDER BY check_order, object_name, sub_object;

