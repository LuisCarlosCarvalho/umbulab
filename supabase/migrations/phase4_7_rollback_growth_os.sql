-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4.7: PLANO DE REVERSÃO ESPECÍFICO (ROLLBACK)
-- Ficheiro: supabase/migrations/phase4_7_rollback_growth_os.sql
--
-- OBJETIVO:
--   Remoção estrita e segura das 15 tabelas exclusivas do Growth OS e das 2
--   funções de FinOps, restaurando a base ao estado imediatamente anterior.
--
-- PRESERVAÇÃO GARANTIDA:
--   - NÃO remove a função public.is_verified_admin() (usada pelo hotfix de profiles).
--   - NÃO toca em public.profiles, blog_posts, quote_requests ou ai_generation_logs.
--   - NÃO remove triggers ou políticas das tabelas pré-existentes.
-- =============================================================================

BEGIN;

-- 1. Remoção das 15 tabelas do Growth OS (em ordem inversa de dependência)
DROP TABLE IF EXISTS public.fin_journal_lines CASCADE;
DROP TABLE IF EXISTS public.fin_journal_entries CASCADE;
DROP TABLE IF EXISTS public.fin_cashflow_entries CASCADE;
DROP TABLE IF EXISTS public.fin_budget_reservations CASCADE;
DROP TABLE IF EXISTS public.fin_budgets CASCADE;
DROP TABLE IF EXISTS public.processed_worker_messages CASCADE;
DROP TABLE IF EXISTS public.ai_opportunities CASCADE;
DROP TABLE IF EXISTS public.ai_approvals CASCADE;
DROP TABLE IF EXISTS public.ai_task_runs CASCADE;
DROP TABLE IF EXISTS public.ai_tasks CASCADE;
DROP TABLE IF EXISTS public.ai_missions CASCADE;
DROP TABLE IF EXISTS public.ai_integration_secrets CASCADE;
DROP TABLE IF EXISTS public.ai_integrations CASCADE;
DROP TABLE IF EXISTS public.ai_agents CASCADE;
DROP TABLE IF EXISTS public.ai_system_controls CASCADE;

-- 2. Remoção das funções de FinOps do Growth OS
DROP FUNCTION IF EXISTS public.settle_ai_budget(text, bigint, text) CASCADE;
DROP FUNCTION IF EXISTS public.reserve_ai_budget(uuid, bigint, text, text, uuid, text) CASCADE;

-- 3. Verificação de integridade pós-rollback (assegurar que tabelas legadas continuam intactas)
DO $$
DECLARE
  v_profiles_count integer;
  v_blog_count integer;
  v_quotes_count integer;
  v_growth_count integer;
BEGIN
  SELECT count(*) INTO v_profiles_count FROM public.profiles;
  SELECT count(*) INTO v_blog_count FROM public.blog_posts;
  SELECT count(*) INTO v_quotes_count FROM public.quote_requests;
  
  SELECT count(*) INTO v_growth_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name = ANY(ARRAY[
      'ai_system_controls', 'ai_agents', 'ai_integrations', 'ai_integration_secrets',
      'ai_missions', 'ai_tasks', 'ai_task_runs', 'ai_approvals', 'ai_opportunities',
      'processed_worker_messages', 'fin_budgets', 'fin_budget_reservations',
      'fin_cashflow_entries', 'fin_journal_entries', 'fin_journal_lines'
    ]);

  IF v_growth_count <> 0 THEN
    RAISE EXCEPTION 'ROLLBACK FALHOU: Ainda restam % tabelas do Growth OS!', v_growth_count;
  END IF;

  RAISE NOTICE 'ROLLBACK CONCLUÍDO COM SUCESSO: 0 tabelas do Growth OS restantes. Perfis intactos (%), Posts (%), Pedidos (%).',
    v_profiles_count, v_blog_count, v_quotes_count;
END $$;

COMMIT;
