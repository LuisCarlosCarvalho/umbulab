-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4: EXPORTAÇÃO SEGURA DO CATÁLOGO DE PRODUÇÃO (READ-ONLY)
-- Ficheiro: supabase/backups/phase4_export_safe_production_catalog.sql
--
-- REGRAS DE SEGURANÇA:
--   - 100% READ-ONLY (apenas SELECT sobre catálogos PostgreSQL).
--   - NUNCA consulta valores secretos de public.configuracoes, public.ai_integration_secrets
--     nem hashes de auth.users.
--   - Executar antes da Migração 1 e guardar o resultado CSV/JSON como registo de auditoria.
-- =============================================================================

-- 0. PRÉ-REQUISITO OBRIGATÓRIO: colunas de public.profiles referenciadas pelo trigger
--    guard_profiles_sensitive_columns (Migração 1). Se alguma linha devolver
--    'AUSENTE', NÃO aplicar a Migração 1 e reportar antes de prosseguir.
SELECT
  '0_PRECHECK_PROFILES_COLUMNS' AS section,
  'public' AS schemaname,
  'profiles' AS object_name,
  req.col AS sub_object,
  CASE WHEN c.column_name IS NULL THEN 'AUSENTE' ELSE 'PRESENTE' END AS metadata,
  COALESCE(c.data_type, 'n/a') AS definition
FROM (VALUES ('role'), ('payment_score'), ('manual_payment_override'), ('payment_settings'), ('os_number'), ('force_password_reset')) AS req(col)
LEFT JOIN information_schema.columns c
  ON c.table_schema = 'public' AND c.table_name = 'profiles' AND c.column_name = req.col

UNION ALL

SELECT
  '1_POLICIES' AS section,
  schemaname,
  tablename AS object_name,
  policyname AS sub_object,
  permissive || ' | ' || cmd || ' | roles=' || array_to_string(roles, ',') AS metadata,
  COALESCE(qual, '') || ' || WITH CHECK: ' || COALESCE(with_check, '') AS definition
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT
  '2_FUNCTIONS' AS section,
  n.nspname AS schemaname,
  p.proname AS object_name,
  p.oid::regprocedure::text AS sub_object,
  'secdef=' || p.prosecdef::text || ' | config=' || COALESCE(array_to_string(p.proconfig, ';'), 'NONE') AS metadata,
  pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'sync_user_role_to_metadata',
    'sync_role_to_metadata',
    'internal_sync_profile_role_to_auth',
    'is_verified_admin',
    'guard_profiles_sensitive_columns',
    'handle_new_user',
    'increment_visit_count',
    'toggle_maintenance',
    'check_rate_limit'
  )

UNION ALL

SELECT
  '3_CONFIG_KEYS_METADATA_ONLY' AS section,
  'public' AS schemaname,
  'configuracoes' AS object_name,
  chave AS sub_object,
  'json_type=' || jsonb_typeof(valor) AS metadata,
  'VALOR_OMITIDO_POR_SEGURANCA' AS definition
FROM public.configuracoes

ORDER BY section, object_name, sub_object;

