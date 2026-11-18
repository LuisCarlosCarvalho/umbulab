-- =============================================================================
-- UMBULAB AI GROWTH OS — CONJUNTO A: CRIAÇÃO INCREMENTAL DO GROWTH OS
-- Ficheiro: supabase/migrations/set_a_growth_os_tables.sql
--
-- OBJETIVO:
--   Criação das 15 tabelas exclusivas do Growth OS, índices, funções de reserva
--   orçamental (FinOps) e políticas RLS de privilégio mínimo.
--
-- INDEPENDÊNCIA E SEGURANÇA:
--   - 100% autossuficiente (NÃO depende do Conjunto B).
--   - Define public.is_verified_admin() como leitura estável de profiles.role = 'admin'.
--   - ZERO alterações em tabelas pré-existentes (profiles, configuracoes, blog_posts, ai_generation_logs).
--   - Acesso negado a anon em todas as 15 tabelas.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 0. FUNÇÃO CANÓNICA DE AUTORIZAÇÃO ADMINISTRATIVA (IDEMPOTENTE E AUTOSSUFICIENTE)
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
-- 1. CONTROLO DE EMERGÊNCIA GLOBAL (KILL-SWITCHES OPERACIONAIS)
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

-- -----------------------------------------------------------------------------
-- 2. EQUIPA DE AGENTES DE IA (CONFIGURAÇÃO E CONTRATO OPERACIONAL)
-- -----------------------------------------------------------------------------
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
  depends_on text[] NOT NULL DEFAULT '{}'::text[],
  estimated_cost_cents bigint NOT NULL DEFAULT 100 CHECK (estimated_cost_cents >= 0),
  actual_cost_cents bigint NOT NULL DEFAULT 0 CHECK (actual_cost_cents >= 0),
  input_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_details jsonb,
  retry_count integer NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  max_retries integer NOT NULL DEFAULT 3 CHECK (max_retries >= 0),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ai_tasks_mission_task_unique UNIQUE (mission_id, task_key)
);

CREATE TABLE IF NOT EXISTS public.ai_task_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  mission_id uuid NOT NULL REFERENCES public.ai_missions(id) ON DELETE CASCADE,
  agent_key text NOT NULL,
  provider text NOT NULL,
  model text NOT NULL,
  prompt_tokens integer NOT NULL DEFAULT 0 CHECK (prompt_tokens >= 0),
  completion_tokens integer NOT NULL DEFAULT 0 CHECK (completion_tokens >= 0),
  total_tokens integer NOT NULL DEFAULT 0 CHECK (total_tokens >= 0),
  cost_cents bigint NOT NULL DEFAULT 0 CHECK (cost_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  latency_ms integer NOT NULL DEFAULT 0 CHECK (latency_ms >= 0),
  status text NOT NULL CHECK (status IN ('success', 'error', 'timeout', 'cancelled')),
  error_code text,
  error_message text,
  adapter_mode text NOT NULL DEFAULT 'auto',
  request_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  response_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES public.ai_missions(id) ON DELETE CASCADE,
  task_id uuid REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  risk_level text NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  summary text NOT NULL,
  payload_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  estimated_impact text,
  requested_by_agent text NOT NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes text,
  reviewed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  opportunity_type text NOT NULL CHECK (opportunity_type IN ('content_gap', 'competitor_move', 'lead_surge', 'cro_win', 'affiliate_niche')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'analyzing', 'in_mission', 'implemented', 'dismissed')),
  potential_impact_cents bigint NOT NULL DEFAULT 0,
  confidence_score numeric(3,2) NOT NULL DEFAULT 0.70 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  source text NOT NULL,
  source_reference text,
  suggested_mission_title text,
  rationale text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  mission_id uuid REFERENCES public.ai_missions(id) ON DELETE SET NULL,
  detected_by_agent text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 5. IDEMPOTÊNCIA DO WORKER QSTASH (ANTI-REPLAY)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.processed_worker_messages (
  message_id text PRIMARY KEY,
  event_type text NOT NULL,
  payload_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days')
);

-- -----------------------------------------------------------------------------
-- 6. MÓDULO FINANCEIRO (FINOPS, FLUXO DE CAIXA E PARTIDAS DOBRADAS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fin_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL CHECK (scope_type IN ('global', 'agent', 'mission', 'marketing_channel')),
  scope_id text NOT NULL,
  allocated_amount_cents bigint NOT NULL CHECK (allocated_amount_cents >= 0),
  reserved_amount_cents bigint NOT NULL DEFAULT 0 CHECK (reserved_amount_cents >= 0),
  spent_amount_cents bigint NOT NULL DEFAULT 0 CHECK (spent_amount_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  warning_threshold_pct integer NOT NULL DEFAULT 80 CHECK (warning_threshold_pct > 0 AND warning_threshold_pct <= 100),
  hard_limit_enabled boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fin_budgets_scope_period_unique UNIQUE (scope_type, scope_id, period_start, period_end, currency_code)
);

CREATE TABLE IF NOT EXISTS public.fin_budget_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES public.fin_budgets(id) ON DELETE RESTRICT,
  task_id uuid REFERENCES public.ai_tasks(id) ON DELETE SET NULL,
  mission_id uuid REFERENCES public.ai_missions(id) ON DELETE SET NULL,
  reservation_key text NOT NULL UNIQUE,
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  currency_code text NOT NULL CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'settled', 'released', 'expired')),
  actual_settled_cents bigint CHECK (actual_settled_cents >= 0),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
  settled_at timestamptz,
  released_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fin_cashflow_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  direction text NOT NULL CHECK (direction IN ('inflow', 'outflow')),
  category text NOT NULL CHECK (category IN ('client_payment', 'ai_token_cost', 'subscription_infra', 'marketing_spend', 'affiliate_commission', 'operational_expense', 'tax_or_fee', 'other')),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  currency_code text NOT NULL CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  description text NOT NULL,
  related_mission_id uuid REFERENCES public.ai_missions(id) ON DELETE SET NULL,
  related_task_id uuid REFERENCES public.ai_tasks(id) ON DELETE SET NULL,
  source_reference text,
  payment_method text,
  is_reconciled boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fin_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  source_document_type text NOT NULL,
  source_document_id text NOT NULL,
  status text NOT NULL DEFAULT 'posted' CHECK (status IN ('draft', 'posted', 'voided')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fin_journal_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id uuid NOT NULL REFERENCES public.fin_journal_entries(id) ON DELETE CASCADE,
  account_code text NOT NULL,
  account_name text NOT NULL,
  line_description text,
  entry_type text NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  currency_code text NOT NULL CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 7. ÍNDICES DE PERFORMANCE
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ai_missions_status ON public.ai_missions(status);
CREATE INDEX IF NOT EXISTS idx_ai_missions_quote_req ON public.ai_missions(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_mission_id ON public.ai_tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON public.ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_task_runs_task_id ON public.ai_task_runs(task_id);
CREATE INDEX IF NOT EXISTS idx_ai_approvals_status ON public.ai_approvals(status);
CREATE INDEX IF NOT EXISTS idx_fin_reservations_budget ON public.fin_budget_reservations(budget_id);
CREATE INDEX IF NOT EXISTS idx_fin_reservations_status ON public.fin_budget_reservations(status);
CREATE INDEX IF NOT EXISTS idx_fin_cashflow_entries_date ON public.fin_cashflow_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_fin_journal_lines_entry ON public.fin_journal_lines(journal_entry_id);

-- -----------------------------------------------------------------------------
-- 8. FUNÇÕES RPC TRANSACIONAIS CONCORRENTES (FINOPS ATÓMICO)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reserve_ai_budget(
  p_budget_id uuid,
  p_amount_cents bigint,
  p_reservation_key text,
  p_task_id uuid DEFAULT NULL,
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
  v_reservation_id uuid;
  v_existing record;
BEGIN
  IF p_amount_cents <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'O valor da reserva deve ser superior a zero.');
  END IF;

  SELECT id, status, amount_cents INTO v_existing
  FROM public.fin_budget_reservations
  WHERE reservation_key = p_reservation_key;

  IF FOUND THEN
    IF v_existing.status = 'reserved' THEN
      RETURN jsonb_build_object('success', true, 'reservation_id', v_existing.id, 'already_reserved', true);
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'Esta chave de reserva já foi liquidada ou liberada anteriormente.');
    END IF;
  END IF;

  SELECT * INTO v_budget
  FROM public.fin_budgets
  WHERE id = p_budget_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Orçamento não encontrado.');
  END IF;

  IF NOT v_budget.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'Orçamento inativo.');
  END IF;

  IF v_budget.currency_code <> p_currency_code THEN
    RETURN jsonb_build_object('success', false, 'error', 'Incompatibilidade de moedas entre o orçamento e a reserva.');
  END IF;

  IF v_budget.hard_limit_enabled AND (v_budget.reserved_amount_cents + v_budget.spent_amount_cents + p_amount_cents > v_budget.allocated_amount_cents) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Limite orçamental excedido.',
      'allocated', v_budget.allocated_amount_cents,
      'reserved', v_budget.reserved_amount_cents,
      'spent', v_budget.spent_amount_cents,
      'requested', p_amount_cents
    );
  END IF;

  UPDATE public.fin_budgets
  SET reserved_amount_cents = reserved_amount_cents + p_amount_cents,
      updated_at = now()
  WHERE id = p_budget_id;

  INSERT INTO public.fin_budget_reservations (
    budget_id, task_id, mission_id, reservation_key, amount_cents, currency_code, status
  ) VALUES (
    p_budget_id, p_task_id, p_mission_id, p_reservation_key, p_amount_cents, p_currency_code, 'reserved'
  )
  RETURNING id INTO v_reservation_id;

  RETURN jsonb_build_object('success', true, 'reservation_id', v_reservation_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.settle_ai_budget(
  p_reservation_key text,
  p_actual_cents bigint,
  p_description text DEFAULT 'Execução de tarefa de IA'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_res record;
  v_budget record;
BEGIN
  IF p_actual_cents < 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'O valor liquidado não pode ser negativo.');
  END IF;

  SELECT * INTO v_res
  FROM public.fin_budget_reservations
  WHERE reservation_key = p_reservation_key
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reserva orçamental não encontrada.');
  END IF;

  IF v_res.status <> 'reserved' THEN
    IF v_res.status = 'settled' THEN
      RETURN jsonb_build_object('success', true, 'already_settled', true);
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'A reserva não se encontra em estado reservado.');
    END IF;
  END IF;

  SELECT * INTO v_budget
  FROM public.fin_budgets
  WHERE id = v_res.budget_id
  FOR UPDATE;

  UPDATE public.fin_budgets
  SET reserved_amount_cents = GREATEST(0, reserved_amount_cents - v_res.amount_cents),
      spent_amount_cents = spent_amount_cents + p_actual_cents,
      updated_at = now()
  WHERE id = v_res.budget_id;

  UPDATE public.fin_budget_reservations
  SET status = 'settled',
      actual_settled_cents = p_actual_cents,
      settled_at = now()
  WHERE id = v_res.id;

  IF p_actual_cents > 0 THEN
    INSERT INTO public.fin_cashflow_entries (
      entry_date, direction, category, amount_cents, currency_code, description, related_mission_id, related_task_id
    ) VALUES (
      CURRENT_DATE, 'outflow', 'ai_token_cost', p_actual_cents, v_res.currency_code, p_description, v_res.mission_id, v_res.task_id
    );
  END IF;

  RETURN jsonb_build_object('success', true, 'settled_cents', p_actual_cents);
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_ai_budget FROM PUBLIC;
REVOKE ALL ON FUNCTION public.settle_ai_budget FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reserve_ai_budget TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.settle_ai_budget TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 9. HABILITAÇÃO DE ROW LEVEL SECURITY (RLS) E POLÍTICAS RESTRITAS
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

-- Políticas administrativas (apenas utilizadores que forem admins verificados)
DROP POLICY IF EXISTS "Admins manage ai_system_controls" ON public.ai_system_controls;
CREATE POLICY "Admins manage ai_system_controls" ON public.ai_system_controls
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_agents" ON public.ai_agents;
CREATE POLICY "Admins manage ai_agents" ON public.ai_agents
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_integrations" ON public.ai_integrations;
CREATE POLICY "Admins manage ai_integrations" ON public.ai_integrations
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

-- ai_integration_secrets NÃO possui política para authenticated nem anon (acesso exclusivo service_role)

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

-- Revogação estrita de anon
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

COMMIT;
