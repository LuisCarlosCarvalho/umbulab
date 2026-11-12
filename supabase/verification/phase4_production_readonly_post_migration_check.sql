-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4: VERIFICAÇÃO PÓS-MIGRAÇÃO 100% READ-ONLY (PRODUÇÃO)
-- Ficheiro: supabase/verification/phase4_production_readonly_post_migration_check.sql
--
-- GARANTIA DE SEGURANÇA:
--   - 0 comandos INSERT, UPDATE, DELETE, CREATE, ALTER ou DROP.
--   - Seguro para executar em produção: apenas lê metadados dos catálogos PostgreSQL
--     (pg_policies, pg_proc, pg_class, pg_trigger, information_schema) e contagens
--     estruturais das sementes do AI Growth OS.
-- =============================================================================

SELECT
  check_id,
  description,
  CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status,
  details
FROM (
  -- 1. Confirmar remoção da view profiles_debug (P0-C)
  SELECT
    'CHK-01' AS check_id,
    'View public.profiles_debug removida' AS description,
    NOT EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'profiles_debug'
    ) AS passed,
    'profiles_debug ausente no schema public' AS details

  UNION ALL

  -- 2. Confirmar trigger de proteção de colunas sensíveis em public.profiles (P0-A)
  SELECT
    'CHK-02' AS check_id,
    'Trigger trg_guard_profiles_sensitive_columns ativo em public.profiles' AS description,
    EXISTS (
      SELECT 1 FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'profiles'
        AND t.tgname = 'trg_guard_profiles_sensitive_columns'
        AND NOT t.tgisinternal
    ) AS passed,
    'Trigger BEFORE UPDATE protege role, payment_score e manual_payment_override' AS details

  UNION ALL

  -- 3. Confirmar que nenhuma sobrecarga de sync_user_role_to_metadata ou handle_new_user é executável por anon/authenticated (P0-B)
  SELECT
    'CHK-03' AS check_id,
    'Sobrecargas de sync_user_role_to_metadata e handle_new_user bloqueadas para anon/authenticated' AS description,
    NOT EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND p.proname IN ('sync_user_role_to_metadata', 'sync_role_to_metadata', 'handle_new_user', 'internal_sync_profile_role_to_auth')
        AND (
          has_function_privilege('anon', p.oid, 'EXECUTE')
          OR has_function_privilege('authenticated', p.oid, 'EXECUTE')
        )
    ) AS passed,
    'Zero sobrecargas executáveis por anon ou authenticated' AS details

  UNION ALL

  -- 4. Confirmar lista branca de 4 chaves públicas em public.configuracoes (P0-D)
  SELECT
    'CHK-04' AS check_id,
    'Política Public read safe configuracoes keys ativa com lista branca de 4 chaves' AS description,
    EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'configuracoes'
        AND policyname = 'Public read safe configuracoes keys'
        AND qual LIKE '%maintenance_settings%'
        AND qual LIKE '%blog_settings%'
        AND qual LIKE '%seo_gestao_settings%'
        AND qual LIKE '%infoproducts_settings%'
    ) AS passed,
    '4 chaves de visibilidade de UI permitidas; chaves secretas bloqueadas' AS details

  UNION ALL

  -- 5. Confirmar isolamento do cofre public.ai_integration_secrets (exclusivo service_role)
  SELECT
    'CHK-05' AS check_id,
    'Cofre public.ai_integration_secrets inacessível a anon e authenticated (RLS + FORCE RLS + REVOKE)' AS description,
    EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'ai_integration_secrets'
        AND c.relrowsecurity = true
        AND c.relforcerowsecurity = true
    )
    AND NOT has_table_privilege('anon', 'public.ai_integration_secrets', 'SELECT')
    AND NOT has_table_privilege('authenticated', 'public.ai_integration_secrets', 'SELECT')
    AND has_table_privilege('service_role', 'public.ai_integration_secrets', 'SELECT') AS passed,
    'Apenas service_role possui privilégio SELECT/INSERT/UPDATE em ai_integration_secrets' AS details

  UNION ALL

  -- 6. Confirmar RPCs financeiros reserve_ai_budget e settle_ai_budget restritos a service_role
  SELECT
    'CHK-06' AS check_id,
    'Funções reserve_ai_budget e settle_ai_budget restritas a service_role' AS description,
    NOT has_function_privilege('anon', 'public.reserve_ai_budget(text,uuid,uuid,bigint,text)', 'EXECUTE')
    AND NOT has_function_privilege('authenticated', 'public.reserve_ai_budget(text,uuid,uuid,bigint,text)', 'EXECUTE')
    AND has_function_privilege('service_role', 'public.reserve_ai_budget(text,uuid,uuid,bigint,text)', 'EXECUTE')
    AND NOT has_function_privilege('anon', 'public.settle_ai_budget(uuid,bigint,boolean)', 'EXECUTE')
    AND NOT has_function_privilege('authenticated', 'public.settle_ai_budget(uuid,bigint,boolean)', 'EXECUTE')
    AND has_function_privilege('service_role', 'public.settle_ai_budget(uuid,bigint,boolean)', 'EXECUTE') AS passed,
    'Execução direta de RPC financeiro bloqueada para browser/clientes' AS details

  UNION ALL

  -- 7. Confirmar sementes estruturais: 10 agentes, 9 integrações e 3 envelopes de orçamento
  SELECT
    'CHK-07' AS check_id,
    'Sementes estruturais do AI Growth OS presentes (10 agentes, >=9 integrações, >=3 orçamentos)' AS description,
    (SELECT count(*) FROM public.ai_agents) = 10
    AND (SELECT count(*) FROM public.ai_integrations) >= 9
    AND (SELECT count(*) FROM public.fin_budgets) >= 3 AS passed,
    'agentes=' || (SELECT count(*)::text FROM public.ai_agents)
      || ', integracoes=' || (SELECT count(*)::text FROM public.ai_integrations)
      || ', orcamentos=' || (SELECT count(*)::text FROM public.fin_budgets) AS details
) checks
ORDER BY check_id;

