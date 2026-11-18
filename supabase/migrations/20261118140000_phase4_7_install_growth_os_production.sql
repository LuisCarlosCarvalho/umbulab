-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4.7: INSTALAÇÃO DEFINITIVA EM PRODUÇÃO
-- Ficheiro: supabase/migrations/20261118140000_phase4_7_install_growth_os_production.sql
--
-- OBJETIVO:
--   Instalação atómica e idempotente das 15 tabelas do Growth OS, índices,
--   funções de FinOps, políticas RLS de privilégio mínimo e concessões de permissões.
--
-- GARANTIAS OPERACIONAIS:
--   - 100% transacional: Envolvido em BEGIN; ... COMMIT; com verificação de saída.
--   - Pré-verificação: Valida integridade prévia da tabela public.profiles e do hotfix.
--   - Preservação estrita: Zero alterações em tabelas, triggers ou dados legados.
--   - Pós-verificação: Valida contagem das 15 tabelas criadas com RLS ativo.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 0. PRÉ-VERIFICAÇÃO DE INTEGRIDADE DO AMBIENTE DE PRODUÇÃO
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_has_profiles boolean;
  v_has_hotfix_trigger boolean;
BEGIN
  -- Verificar existência de public.profiles
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) INTO v_has_profiles;

  IF NOT v_has_profiles THEN
    RAISE EXCEPTION 'PRÉ-VERIFICAÇÃO FALHOU: Tabela public.profiles não encontrada!';
  END IF;

  -- Verificar presença do trigger de segurança do hotfix
  SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE event_object_table = 'profiles' 
      AND trigger_name = 'trg_guard_profiles_sensitive_columns'
  ) INTO v_has_hotfix_trigger;

  IF NOT v_has_hotfix_trigger THEN
    RAISE EXCEPTION 'PRÉ-VERIFICAÇÃO FALHOU: Trigger trg_guard_profiles_sensitive_columns não está ativo em public.profiles!';
  END IF;

  RAISE NOTICE 'PRÉ-VERIFICAÇÃO CONCLUÍDA: profiles e hotfix de segurança confirmados.';
END $$;

-- -----------------------------------------------------------------------------
-- 1. FUNÇÃO CANÓNICA DE AUTORIZAÇÃO ADMINISTRATIVA (IDEMPOTENTE)
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

-- -----------------------------------------------------------------------------
-- 2. TABELAS DE CONTROLO GLOBAL E AGENTES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_system_controls (
  control_key text PRIMARY KEY DEFAULT 'global',
  pause_new_executions boolean NOT NULL DEFAULT false,
  paused_agent_keys text[] NOT NULL DEFAULT '{}'::text[],
  default_adapter_mode text NOT NULL DEFAULT 'auto' CHECK (default_adapter_mode IN ('auto', 'live_api', 'sandbox_test_adapter')),
  emergency_reason text,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.ai_system_controls (control_key, pause_new_executions, paused_agent_keys, default_adapter_mode)
VALUES ('global', false, '{}'::text[], 'auto')
ON CONFLICT (control_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  role_title text NOT NULL,
  summary text NOT NULL,
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'awaiting_approval', 'paused', 'error')),
  autonomy_level text NOT NULL DEFAULT 'supervised' CHECK (autonomy_level IN ('read_only', 'supervised', 'gated_autonomous')),
  requires_approval_for text[] NOT NULL DEFAULT '{}'::text[],
  skills text[] NOT NULL DEFAULT '{}'::text[],
  reports_to text,
  preferred_provider text NOT NULL DEFAULT 'google_gemini',
  preferred_model text NOT NULL DEFAULT 'gemini-2.5-flash',
  temperature numeric(3,2) NOT NULL DEFAULT 0.30 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens integer NOT NULL DEFAULT 2048 CHECK (max_tokens >= 128 AND max_tokens <= 32768),
  daily_budget_cents bigint NOT NULL DEFAULT 1500 CHECK (daily_budget_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  allowed_tools text[] NOT NULL DEFAULT '{}'::text[],
  system_prompt text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 3. CENTRO DE INTEGRAÇÕES E COFRE DE CREDENCIAIS ISOLADO
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('ai_llm', 'search_market', 'payments_commerce', 'ads_social', 'messaging_email', 'automation_infra')),
  status text NOT NULL DEFAULT 'not_configured' CHECK (status IN ('not_configured', 'secret_saved', 'pending_test', 'connected', 'disabled', 'error')),
  auth_mode text NOT NULL DEFAULT 'api_key' CHECK (auth_mode IN ('api_key', 'oauth2', 'webhook_hmac', 'service_role')),
  env_var_name text NOT NULL,
  has_saved_secret boolean NOT NULL DEFAULT false,
  key_hint text,
  base_url text,
  webhook_url text,
  rate_limit_per_min integer NOT NULL DEFAULT 60 CHECK (rate_limit_per_min > 0),
  monthly_cap_cents bigint NOT NULL DEFAULT 10000 CHECK (monthly_cap_cents >= 0),
  currency_code text NOT NULL DEFAULT 'USD' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  is_active boolean NOT NULL DEFAULT false,
  last_tested_at timestamptz,
  last_test_status text CHECK (last_test_status IN ('ok', 'warning', 'error')),
  last_test_message text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_integration_secrets (
  provider_key text PRIMARY KEY REFERENCES public.ai_integrations(provider_key) ON DELETE CASCADE,
  encrypted_secret_payload text NOT NULL,
  key_version integer NOT NULL DEFAULT 1,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 4. MISSÕES, TAREFAS, TELEMETRIA E APROVAÇÕES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  objective text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'running', 'waiting_approval', 'completed', 'failed', 'cancelled')),
  mission_type text NOT NULL DEFAULT 'custom_request' CHECK (mission_type IN ('market_research', 'competitor_tracking', 'content_creation', 'lead_scraping', 'cro_audit', 'custom_request')),
  quote_request_id uuid REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  assigned_agents text[] NOT NULL DEFAULT '{}'::text[],
  budget_cap_cents bigint NOT NULL DEFAULT 5000 CHECK (budget_cap_cents >= 0),
  spent_amount_cents bigint NOT NULL DEFAULT 0 CHECK (spent_amount_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  progress_percent integer NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  result_summary text,
  error_message text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES public.ai_missions(id) ON DELETE CASCADE,
  task_key text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  assigned_agent text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'waiting_approval', 'failed', 'skipped')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  execution_mode text NOT NULL DEFAULT 'live_api' CHECK (execution_mode IN ('live_api', 'sandbox_test_adapter')),
  input_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_payload jsonb,
  error_details text,
  retry_count integer NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  max_retries integer NOT NULL DEFAULT 3 CHECK (max_retries >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_task_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  agent_key text NOT NULL,
  provider text NOT NULL,
  model text NOT NULL,
  prompt_tokens integer NOT NULL DEFAULT 0 CHECK (prompt_tokens >= 0),
  completion_tokens integer NOT NULL DEFAULT 0 CHECK (completion_tokens >= 0),
  total_tokens integer NOT NULL DEFAULT 0 CHECK (total_tokens >= 0),
  estimated_cost_cents bigint NOT NULL DEFAULT 0 CHECK (estimated_cost_cents >= 0),
  duration_ms integer NOT NULL DEFAULT 0 CHECK (duration_ms >= 0),
  status text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failure', 'timed_out')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('mission', 'task', 'budget_increase', 'publish_external', 'action_execution')),
  entity_id uuid NOT NULL,
  requested_by_agent text NOT NULL,
  action_summary text NOT NULL,
  proposed_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  risk_level text NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at timestamptz,
  decision_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  domain_niche text NOT NULL,
  opportunity_type text NOT NULL CHECK (opportunity_type IN ('content_gap', 'cro_lead', 'affiliate_product', 'seo_keyword', 'competitor_weakness')),
  potential_score integer NOT NULL DEFAULT 50 CHECK (potential_score >= 0 AND potential_score <= 100),
  estimated_revenue_cents bigint NOT NULL DEFAULT 0 CHECK (estimated_revenue_cents >= 0),
  estimated_effort_hours numeric(5,1) NOT NULL DEFAULT 5.0 CHECK (estimated_effort_hours >= 0),
  status text NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'evaluating', 'approved_for_action', 'in_execution', 'archived', 'discarded')),
  raw_signals jsonb NOT NULL DEFAULT '{}'::jsonb,
  discovered_by_agent text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.processed_worker_messages (
  message_id text PRIMARY KEY,
  channel text NOT NULL DEFAULT 'default',
  processed_at timestamptz NOT NULL DEFAULT now(),
  handler_name text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- -----------------------------------------------------------------------------
-- 5. MÓDULO FINANCEIRO (FINOPS, LIVRO-RAZÃO E CONTROLO ORÇAMENTAL)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fin_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL CHECK (scope_type IN ('global', 'agent', 'mission', 'client')),
  scope_id text NOT NULL,
  allocated_amount_cents bigint NOT NULL CHECK (allocated_amount_cents >= 0),
  spent_amount_cents bigint NOT NULL DEFAULT 0 CHECK (spent_amount_cents >= 0),
  reserved_amount_cents bigint NOT NULL DEFAULT 0 CHECK (reserved_amount_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_fin_budget_period CHECK (period_end >= period_start),
  CONSTRAINT chk_fin_budget_not_exceeded CHECK (spent_amount_cents + reserved_amount_cents <= allocated_amount_cents)
);

CREATE TABLE IF NOT EXISTS public.fin_budget_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES public.fin_budgets(id) ON DELETE CASCADE,
  reservation_key text NOT NULL UNIQUE,
  reserved_cents bigint NOT NULL CHECK (reserved_cents > 0),
  agent_key text,
  mission_id uuid REFERENCES public.ai_missions(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'settled', 'released', 'expired')),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 minutes'),
  created_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.fin_cashflow_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type text NOT NULL CHECK (entry_type IN ('income', 'expense')),
  category text NOT NULL,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  due_date date NOT NULL,
  settlement_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'settled', 'cancelled')),
  source_reference text,
  description text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fin_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number bigint GENERATED ALWAYS AS IDENTITY,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  memo text NOT NULL,
  source_document_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fin_journal_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid NOT NULL REFERENCES public.fin_journal_entries(id) ON DELETE CASCADE,
  account_code text NOT NULL,
  debit_cents bigint NOT NULL DEFAULT 0 CHECK (debit_cents >= 0),
  credit_cents bigint NOT NULL DEFAULT 0 CHECK (credit_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  memo text,
  CONSTRAINT chk_debit_or_credit CHECK (
    (debit_cents > 0 AND credit_cents = 0) OR
    (credit_cents > 0 AND debit_cents = 0)
  )
);

-- -----------------------------------------------------------------------------
-- 6. ÍNDICES DE PERFORMANCE E INTEGRIDADE
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ai_agents_key ON public.ai_agents(agent_key);
CREATE INDEX IF NOT EXISTS idx_ai_integrations_provider ON public.ai_integrations(provider_key);
CREATE INDEX IF NOT EXISTS idx_ai_missions_status ON public.ai_missions(status);
CREATE INDEX IF NOT EXISTS idx_ai_missions_quote ON public.ai_missions(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_mission ON public.ai_tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON public.ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_task_runs_task ON public.ai_task_runs(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_approvals_status ON public.ai_approvals(status);
CREATE INDEX IF NOT EXISTS idx_ai_opportunities_status ON public.ai_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_fin_budgets_scope ON public.fin_budgets(scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_fin_reservations_key ON public.fin_budget_reservations(reservation_key);
CREATE INDEX IF NOT EXISTS idx_fin_reservations_status ON public.fin_budget_reservations(status);
CREATE INDEX IF NOT EXISTS idx_fin_cashflow_status ON public.fin_cashflow_entries(status);
CREATE INDEX IF NOT EXISTS idx_fin_journal_lines_entry ON public.fin_journal_lines(entry_id);
CREATE INDEX IF NOT EXISTS idx_processed_worker_msgs_channel ON public.processed_worker_messages(channel);

-- -----------------------------------------------------------------------------
-- 7. FUNÇÕES ATÓMICAS DE FINOPS (CONCORRÊNCIA E RESERVA ORÇAMENTAL)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reserve_ai_budget(
  p_budget_id uuid,
  p_amount_cents bigint,
  p_reservation_key text,
  p_agent_key text DEFAULT NULL,
  p_mission_id uuid DEFAULT NULL,
  p_currency_code text DEFAULT 'EUR'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_budget record;
  v_available_cents bigint;
BEGIN
  IF p_amount_cents <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_AMOUNT', 'message', 'O montante de reserva deve ser superior a zero.');
  END IF;

  SELECT * INTO v_budget
  FROM public.fin_budgets
  WHERE id = p_budget_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'BUDGET_NOT_FOUND', 'message', 'Orçamento não localizado.');
  END IF;

  IF NOT v_budget.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'BUDGET_INACTIVE', 'message', 'Orçamento encontra-se inativo.');
  END IF;

  v_available_cents := v_budget.allocated_amount_cents - (v_budget.spent_amount_cents + v_budget.reserved_amount_cents);

  IF v_available_cents < p_amount_cents THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'BUDGET_EXCEEDED',
      'message', 'Saldo orçamental insuficiente para reserva.',
      'available_cents', v_available_cents,
      'requested_cents', p_amount_cents
    );
  END IF;

  INSERT INTO public.fin_budget_reservations (
    budget_id, reservation_key, reserved_cents, agent_key, mission_id, currency_code, status
  ) VALUES (
    p_budget_id, p_reservation_key, p_amount_cents, p_agent_key, p_mission_id, p_currency_code, 'active'
  );

  UPDATE public.fin_budgets
  SET reserved_amount_cents = reserved_amount_cents + p_amount_cents,
      updated_at = now()
  WHERE id = p_budget_id;

  RETURN jsonb_build_object(
    'success', true,
    'reservation_key', p_reservation_key,
    'reserved_cents', p_amount_cents,
    'remaining_available_cents', v_available_cents - p_amount_cents
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.settle_ai_budget(
  p_reservation_key text,
  p_actual_spent_cents bigint,
  p_description text DEFAULT 'Execução de Agente IA'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_res record;
  v_budget record;
  v_diff_cents bigint;
BEGIN
  IF p_actual_spent_cents < 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_SPENT_AMOUNT', 'message', 'Gasto real não pode ser negativo.');
  END IF;

  SELECT * INTO v_res
  FROM public.fin_budget_reservations
  WHERE reservation_key = p_reservation_key AND status = 'active'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'RESERVATION_NOT_FOUND', 'message', 'Reserva ativa não localizada.');
  END IF;

  SELECT * INTO v_budget
  FROM public.fin_budgets
  WHERE id = v_res.budget_id
  FOR UPDATE;

  UPDATE public.fin_budget_reservations
  SET status = 'settled',
      settled_at = now()
  WHERE id = v_res.id;

  v_diff_cents := v_res.reserved_cents - p_actual_spent_cents;

  UPDATE public.fin_budgets
  SET reserved_amount_cents = reserved_amount_cents - v_res.reserved_cents,
      spent_amount_cents = spent_amount_cents + p_actual_spent_cents,
      updated_at = now()
  WHERE id = v_res.budget_id;

  IF p_actual_spent_cents > 0 THEN
    INSERT INTO public.fin_cashflow_entries (
      entry_type, category, amount_cents, currency_code, due_date, settlement_date, status, source_reference, description
    ) VALUES (
      'expense', 'ai_compute', p_actual_spent_cents, v_res.currency_code, CURRENT_DATE, CURRENT_DATE, 'settled', p_reservation_key, p_description
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'settled_cents', p_actual_spent_cents,
    'released_difference_cents', v_diff_cents
  );
END;
$$;

-- Permissões estritas: revogação de PUBLIC, anon e authenticated; concessão exclusiva para service_role
REVOKE ALL ON FUNCTION public.reserve_ai_budget(uuid, bigint, text, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_budget(uuid, bigint, text, text, uuid, text) TO service_role;

REVOKE ALL ON FUNCTION public.settle_ai_budget(text, bigint, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.settle_ai_budget(text, bigint, text) TO service_role;

-- -----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) E POLÍTICAS DE ACESSO
-- -----------------------------------------------------------------------------
ALTER TABLE public.ai_system_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_integration_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_task_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_worker_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_budget_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_cashflow_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fin_journal_lines ENABLE ROW LEVEL SECURITY;

-- Políticas RLS exclusivas para Administradores Verificados
DROP POLICY IF EXISTS "Admins manage ai_system_controls" ON public.ai_system_controls;
CREATE POLICY "Admins manage ai_system_controls" ON public.ai_system_controls
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_agents" ON public.ai_agents;
CREATE POLICY "Admins manage ai_agents" ON public.ai_agents
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_integrations" ON public.ai_integrations;
CREATE POLICY "Admins manage ai_integrations" ON public.ai_integrations
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

-- ai_integration_secrets: ZERO políticas para authenticated ou anon (acesso exclusivo service_role backend)

DROP POLICY IF EXISTS "Admins manage ai_missions" ON public.ai_missions;
CREATE POLICY "Admins manage ai_missions" ON public.ai_missions
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_tasks" ON public.ai_tasks;
CREATE POLICY "Admins manage ai_tasks" ON public.ai_tasks
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_task_runs" ON public.ai_task_runs;
CREATE POLICY "Admins manage ai_task_runs" ON public.ai_task_runs
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_approvals" ON public.ai_approvals;
CREATE POLICY "Admins manage ai_approvals" ON public.ai_approvals
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_opportunities" ON public.ai_opportunities;
CREATE POLICY "Admins manage ai_opportunities" ON public.ai_opportunities
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins read processed_worker_messages" ON public.processed_worker_messages;
CREATE POLICY "Admins read processed_worker_messages" ON public.processed_worker_messages
  FOR SELECT TO authenticated USING ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage fin_budgets" ON public.fin_budgets;
CREATE POLICY "Admins manage fin_budgets" ON public.fin_budgets
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins read fin_budget_reservations" ON public.fin_budget_reservations;
CREATE POLICY "Admins read fin_budget_reservations" ON public.fin_budget_reservations
  FOR SELECT TO authenticated USING ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage fin_cashflow_entries" ON public.fin_cashflow_entries;
CREATE POLICY "Admins manage fin_cashflow_entries" ON public.fin_cashflow_entries
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage fin_journal_entries" ON public.fin_journal_entries;
CREATE POLICY "Admins manage fin_journal_entries" ON public.fin_journal_entries
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage fin_journal_lines" ON public.fin_journal_lines;
CREATE POLICY "Admins manage fin_journal_lines" ON public.fin_journal_lines
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

-- -----------------------------------------------------------------------------
-- 9. PERMISSÕES EXPLÍCITAS (DAC): GRANTs E REVOKEs SEGUROS
-- -----------------------------------------------------------------------------
-- Revogação estrita de acessos anónimos
REVOKE ALL ON TABLE public.ai_system_controls FROM anon;
REVOKE ALL ON TABLE public.ai_agents FROM anon;
REVOKE ALL ON TABLE public.ai_integrations FROM anon;
REVOKE ALL ON TABLE public.ai_integration_secrets FROM anon, authenticated;
REVOKE ALL ON TABLE public.ai_missions FROM anon;
REVOKE ALL ON TABLE public.ai_tasks FROM anon;
REVOKE ALL ON TABLE public.ai_task_runs FROM anon;
REVOKE ALL ON TABLE public.ai_approvals FROM anon;
REVOKE ALL ON TABLE public.ai_opportunities FROM anon;
REVOKE ALL ON TABLE public.processed_worker_messages FROM anon;
REVOKE ALL ON TABLE public.fin_budgets FROM anon;
REVOKE ALL ON TABLE public.fin_budget_reservations FROM anon;
REVOKE ALL ON TABLE public.fin_cashflow_entries FROM anon;
REVOKE ALL ON TABLE public.fin_journal_entries FROM anon;
REVOKE ALL ON TABLE public.fin_journal_lines FROM anon;

-- Concessão explícita para authenticated (sempre protegido pelas políticas RLS acima)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_system_controls TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_agents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_integrations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_missions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_task_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_approvals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ai_opportunities TO authenticated;
GRANT SELECT ON TABLE public.processed_worker_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.fin_budgets TO authenticated;
GRANT SELECT ON TABLE public.fin_budget_reservations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.fin_cashflow_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.fin_journal_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.fin_journal_lines TO authenticated;

-- Concessão direcionada exclusivamente para as 15 tabelas do Growth OS (menor privilégio)
GRANT ALL ON TABLE public.ai_system_controls TO service_role;
GRANT ALL ON TABLE public.ai_agents TO service_role;
GRANT ALL ON TABLE public.ai_integrations TO service_role;
GRANT ALL ON TABLE public.ai_integration_secrets TO service_role;
GRANT ALL ON TABLE public.ai_missions TO service_role;
GRANT ALL ON TABLE public.ai_tasks TO service_role;
GRANT ALL ON TABLE public.ai_task_runs TO service_role;
GRANT ALL ON TABLE public.ai_approvals TO service_role;
GRANT ALL ON TABLE public.ai_opportunities TO service_role;
GRANT ALL ON TABLE public.processed_worker_messages TO service_role;
GRANT ALL ON TABLE public.fin_budgets TO service_role;
GRANT ALL ON TABLE public.fin_budget_reservations TO service_role;
GRANT ALL ON TABLE public.fin_cashflow_entries TO service_role;
GRANT ALL ON TABLE public.fin_journal_entries TO service_role;
GRANT ALL ON TABLE public.fin_journal_lines TO service_role;

-- -----------------------------------------------------------------------------
-- 10. PÓS-VERIFICAÇÃO DE INTEGRIDADE DA INSTALAÇÃO
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename = ANY(ARRAY[
      'ai_system_controls', 'ai_agents', 'ai_integrations', 'ai_integration_secrets',
      'ai_missions', 'ai_tasks', 'ai_task_runs', 'ai_approvals', 'ai_opportunities',
      'processed_worker_messages', 'fin_budgets', 'fin_budget_reservations',
      'fin_cashflow_entries', 'fin_journal_entries', 'fin_journal_lines'
    ])
    AND rowsecurity = true;

  IF v_count <> 15 THEN
    RAISE EXCEPTION 'PÓS-VERIFICAÇÃO FALHOU: Apenas % das 15 tabelas foram criadas com RLS ativo!', v_count;
  END IF;

  RAISE NOTICE 'PÓS-VERIFICAÇÃO CONCLUÍDA: Todas as 15 tabelas do Growth OS estão presentes e com RLS ativo (15/15).';
END $$;

COMMIT;
