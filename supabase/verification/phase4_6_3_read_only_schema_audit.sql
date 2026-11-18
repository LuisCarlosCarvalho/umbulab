-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4.6.3: AUDITORIA READ-ONLY COMPLETA DA BASE REAL
-- Ficheiro: supabase/verification/phase4_6_3_read_only_schema_audit.sql
--
-- OBJETIVO:
--   Levantamento exato, 100% não-destrutivo e reprodutível do estado atual da
--   base de dados PostgreSQL em produção no Supabase da UmbuLab.
--
-- GARANTIA OPERACIONAL ABSOLUTA:
--   - Este script contém EXCLUSIVAMENTE instruções SELECT.
--   - NÃO contém CREATE, ALTER, DROP, TRUNCATE, INSERT, UPDATE, DELETE, GRANT ou REVOKE.
--   - Risco de execução: ZERO (apenas lê metadados de catálogo do PostgreSQL).
--   - Não expõe segredos nem hashes de palavras-passe.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. INVENTÁRIO COMPLETO DE TABELAS (PUBLIC E STORAGE)
--    Distingue tabelas do núcleo da UmbuLab, gerador de sites antigo e Growth OS.
-- -----------------------------------------------------------------------------
SELECT
  '1_TABLES_INVENTORY' AS audit_section,
  table_schema,
  table_name,
  table_type,
  CASE
    WHEN table_name IN ('ai_generation_logs', 'ai_generated_sites', 'sites_gerados_por_ia', 'seo_logs')
      THEN 'CORE_UMBULAB_WEBSITE (AI GENERATOR PRE-EXISTING - DO NOT DROP)'
    WHEN table_name LIKE 'ai_%' OR table_name LIKE 'fin_%' OR table_name = 'processed_worker_messages'
      THEN 'GROWTH_OS_OBJECT'
    ELSE 'CORE_UMBULAB_WEBSITE'
  END AS object_category
FROM information_schema.tables
WHERE table_schema IN ('public', 'storage')
ORDER BY table_schema, table_name;

-- -----------------------------------------------------------------------------
-- 2. ESTRUTURA REAL DA TABELA PUBLIC.PROFILES (ROLE VS IS_ADMIN)
--    Garante que identificamos as colunas exatas de autorização existentes.
-- -----------------------------------------------------------------------------
SELECT
  '2_PROFILES_COLUMNS' AS audit_section,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- -----------------------------------------------------------------------------
-- 3. POLÍTICAS ROW LEVEL SECURITY (RLS) ATIVAS EM PUBLIC E STORAGE
--    Inspeciona se RLS está ativo e quais as regras para cada papel.
-- -----------------------------------------------------------------------------
SELECT
  '3_RLS_POLICIES' AS audit_section,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual AS using_expression,
  with_check AS check_expression
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, policyname;

-- -----------------------------------------------------------------------------
-- 4. FUNÇÕES CANÓNICAS, RPCs E STATUS DE SECURITY DEFINER
--    Verifica se is_verified_admin, check_rate_limit, etc. já existem.
-- -----------------------------------------------------------------------------
SELECT
  '4_ROUTINES_AND_SECURITY' AS audit_section,
  n.nspname AS schema_name,
  p.proname AS routine_name,
  pg_get_function_identity_arguments(p.oid) AS identity_args,
  p.prosecdef AS is_security_definer,
  array_to_string(p.proconfig, '; ') AS runtime_settings,
  d.description AS comments
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
LEFT JOIN pg_description d ON d.objoid = p.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'is_verified_admin',
    'is_admin',
    'guard_profiles_sensitive_columns',
    'sync_user_role_to_metadata',
    'internal_sync_profile_role_to_auth',
    'toggle_maintenance',
    'check_rate_limit',
    'check_ai_site_draw_quota',
    'check_ai_generation_log_quota',
    'reserve_ai_budget',
    'settle_ai_budget'
  )
ORDER BY routine_name;

-- -----------------------------------------------------------------------------
-- 5. TRIGGERS ATIVOS EM PUBLIC
--    Identifica triggers existentes (ex.: sincronização de perfis ou auth).
-- -----------------------------------------------------------------------------
SELECT
  '5_TRIGGERS' AS audit_section,
  event_object_schema AS schema_name,
  event_object_table AS table_name,
  trigger_name,
  event_manipulation AS event,
  action_timing AS timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- -----------------------------------------------------------------------------
-- 6. PRIVILÉGIOS (GRANTS) CONCEDIDOS AOS PAPÉIS ANON E AUTHENTICATED
--    Verifica permissões diretas nas tabelas de public.
-- -----------------------------------------------------------------------------
SELECT
  '6_ROLE_GRANTS' AS audit_section,
  table_schema,
  table_name,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;

-- -----------------------------------------------------------------------------
-- 7. BUCKETS DE ARMAZENAMENTO NO SUPABASE STORAGE
--    Lista todos os buckets para o plano de backup de ficheiros físicos.
-- -----------------------------------------------------------------------------
SELECT
  '7_STORAGE_BUCKETS' AS audit_section,
  id AS bucket_id,
  name AS bucket_name,
  public AS is_public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY id;
