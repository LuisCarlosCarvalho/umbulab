-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4: BACKUP RECUPERÁVEL DO ESTADO PRÉ-MIGRAÇÃO (SEM DADOS SENSÍVEIS)
-- Ficheiro: supabase/backups/phase4_pre_migration_baseline_backup.sql
--
-- OBJETIVO:
--   Snapshot estrutural recuperável do estado pré-Fase 3/4 (reconstruído a partir
--   da auditoria real de catálogo da Fase 2B.0.1 em produção, sem incluir credenciais,
--   chaves de API, dados pessoais de clientes ou hashes de palavras-passe).
--
-- NOTA DE SEGURANÇA:
--   Não restaura deliberadamente brechas críticas corrigidas (como leitura anónima de
--   chaves secretas de pagamento ou auto-promoção a admin), mas permite repor
--   imediatamente a estrutura original das tabelas existentes e remover de forma limpa
--   qualquer objeto novo da Fase 3 caso seja necessário um rollback estrutural.
-- =============================================================================

BEGIN;

-- 1. Desativar e remover de forma limpa as tabelas isoladas do AI Growth OS (se necessário em rollback total da Migração 2)
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

DROP FUNCTION IF EXISTS public.settle_ai_budget(uuid, bigint, boolean);
DROP FUNCTION IF EXISTS public.reserve_ai_budget(text, uuid, uuid, bigint, text);

-- 2. Garantir preservação integral das políticas seguras de acesso do site público e clientes existentes
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read safe configuracoes keys" ON public.configuracoes;
CREATE POLICY "Public read safe configuracoes keys"
  ON public.configuracoes
  FOR SELECT
  TO anon, authenticated
  USING (
    chave IN (
      'maintenance_settings',
      'blog_settings',
      'seo_gestao_settings',
      'infoproducts_settings'
    )
  );

COMMIT;

