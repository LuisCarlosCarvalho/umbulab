-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4.6.3: REVERSÃO CIRÚRGICA DO CONJUNTO A (SEM CASCADE)
-- Ficheiro: supabase/migrations/rollback/rollback_set_a_growth_os_tables.sql
--
-- REGRAS DE SEGURANÇA:
--   - Proibido DROP CASCADE generalizado.
--   - Ordem reversa estrita baseada nas chaves estrangeiras.
--   - Remove única e exclusivamente objetos criados pelo AI Growth OS.
--   - Preserva 100% dos dados, tabelas e triggers do website UmbuLab.
-- =============================================================================

BEGIN;

-- 1. Funções analíticas exclusivas do Growth OS
DROP FUNCTION IF EXISTS public.settle_ai_budget(uuid, bigint, boolean);
DROP FUNCTION IF EXISTS public.reserve_ai_budget(text, uuid, uuid, bigint, text);

-- 2. Linhas e lançamentos contábeis (filhos de fin_journal_entries e fin_budgets)
DROP TABLE IF EXISTS public.fin_journal_lines;
DROP TABLE IF EXISTS public.fin_journal_entries;
DROP TABLE IF EXISTS public.fin_cashflow_entries;
DROP TABLE IF EXISTS public.fin_budget_reservations;
DROP TABLE IF EXISTS public.fin_budgets;

-- 3. Mensagens de workers e idempotência
DROP TABLE IF EXISTS public.processed_worker_messages;

-- 4. Oportunidades e aprovações
DROP TABLE IF EXISTS public.ai_opportunities;
DROP TABLE IF EXISTS public.ai_approvals;

-- 5. Execuções e tarefas (filhos de ai_missions)
DROP TABLE IF EXISTS public.ai_task_runs;
DROP TABLE IF EXISTS public.ai_tasks;

-- 6. Missões
DROP TABLE IF EXISTS public.ai_missions;

-- 7. Cofre e integrações
DROP TABLE IF EXISTS public.ai_integration_secrets;
DROP TABLE IF EXISTS public.ai_integrations;

-- 8. Catálogo de agentes e controlos globais
DROP TABLE IF EXISTS public.ai_agents;
DROP TABLE IF EXISTS public.ai_system_controls;

COMMIT;
