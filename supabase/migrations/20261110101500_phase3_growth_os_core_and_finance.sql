-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 3 (REV 3.1): INFRAESTRUTURA MULTIAGENTE E FINANÇAS
-- Ficheiro: supabase/migrations/20261110101500_phase3_growth_os_core_and_finance.sql
--
-- CORREÇÕES DE SEGURANÇA FASE 3.1 INCLUÍDAS:
--   - Ponto 5.3: Validação estrita em reserve_ai_budget e settle_ai_budget
--     (valores > 0, bloqueio FOR UPDATE antes de idempotência, expiração atómica,
--     proibição de liquidação acima do valor reservado e rasto automático em fin_cashflow_entries).
--   - Ponto 5.4: Isolamento físico de encrypted_secret_payload na tabela privada
--     public.ai_integration_secrets (acessível exclusivamente a service_role;
--     inacessível a consultas genéricas do browser mesmo por administradores).
-- =============================================================================

BEGIN;

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
-- 3. CENTRO DE INTEGRAÇÕES E COFRE DE CREDENCIAIS ISOLADO (PONTO 5.4)
-- -----------------------------------------------------------------------------
-- Metadados operacionais visíveis aos administradores (SEM a coluna de segredo encriptado)
CREATE TABLE IF NOT EXISTS public.ai_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('ai_llm', 'search_market', 'payments_commerce', 'ads_social', 'messaging_email', 'automation_infra')),
  status text NOT NULL DEFAULT 'not_configured' CHECK (status IN ('not_configured', 'secret_saved', 'pending_test', 'connected', 'disabled', 'error')),
  auth_mode text NOT NULL DEFAULT 'api_key' CHECK (auth_mode IN ('api_key', 'oauth2', 'webhook_hmac', 'service_role')),
  env_var_name text NOT NULL,
  has_saved_secret boolean NOT NULL DEFAULT false,
  key_hint text, -- Ex.: "••••8f2a" (nunca contém a chave completa)
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

-- Cofre privado server-side: inacessível via PostgREST/browser para anon e authenticated
CREATE TABLE IF NOT EXISTS public.ai_integration_secrets (
  provider_key text PRIMARY KEY REFERENCES public.ai_integrations(provider_key) ON DELETE CASCADE,
  encrypted_secret_payload text NOT NULL,
  key_version integer NOT NULL DEFAULT 1,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 4. MISSÕES, TAREFAS, EXECUÇÕES (TELEMETRIA) E APROVAÇÕES HUMANAS (L0/L1/L2)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  objective text NOT NULL,
  coordinator_agent_key text NOT NULL DEFAULT 'ops_director' REFERENCES public.ai_agents(agent_key),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'awaiting_approval', 'approved', 'rejected', 'completed', 'failed', 'cancelled')),
  priority text NOT NULL DEFAULT 'high' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  execution_mode text NOT NULL DEFAULT 'draft_only' CHECK (execution_mode IN ('read_only', 'draft_only', 'approval_required', 'auto_low_risk')),
  adapter_mode text NOT NULL DEFAULT 'sandbox_test_adapter' CHECK (adapter_mode IN ('live_api', 'sandbox_test_adapter')),
  budget_cap_cents bigint NOT NULL DEFAULT 2500 CHECK (budget_cap_cents >= 0),
  budget_used_cents bigint NOT NULL DEFAULT 0 CHECK (budget_used_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  consolidated_summary text,
  deliverables_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid NOT NULL REFERENCES public.ai_missions(id) ON DELETE CASCADE,
  step_order integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  assigned_agent_key text NOT NULL REFERENCES public.ai_agents(agent_key),
  skill_key text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'awaiting_approval', 'approved', 'rejected', 'completed', 'failed', 'cancelled')),
  execution_mode text NOT NULL DEFAULT 'draft_only' CHECK (execution_mode IN ('read_only', 'draft_only', 'approval_required', 'auto_low_risk')),
  requires_approval boolean NOT NULL DEFAULT false,
  approval_level text NOT NULL DEFAULT 'L0_auto' CHECK (approval_level IN ('L0_auto', 'L1_content_ops', 'L2_financial_admin')),
  estimated_cost_cents bigint NOT NULL DEFAULT 0 CHECK (estimated_cost_cents >= 0),
  actual_cost_cents bigint NOT NULL DEFAULT 0 CHECK (actual_cost_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  input_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  evidence_summary text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_task_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES public.ai_missions(id) ON DELETE CASCADE,
  agent_key text NOT NULL REFERENCES public.ai_agents(agent_key),
  skill_key text NOT NULL,
  correlation_id text NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  execution_mode text NOT NULL CHECK (execution_mode IN ('read_only', 'draft_only', 'approval_required', 'auto_low_risk')),
  adapter_mode text NOT NULL DEFAULT 'sandbox_test_adapter' CHECK (adapter_mode IN ('live_api', 'sandbox_test_adapter')),
  status text NOT NULL CHECK (status IN ('queued', 'running', 'awaiting_approval', 'approved', 'rejected', 'completed', 'failed', 'cancelled')),
  model_provider text NOT NULL,
  model_name text NOT NULL,
  prompt_tokens integer NOT NULL DEFAULT 0 CHECK (prompt_tokens >= 0),
  completion_tokens integer NOT NULL DEFAULT 0 CHECK (completion_tokens >= 0),
  raw_cost_usd_micros bigint NOT NULL DEFAULT 0 CHECK (raw_cost_usd_micros >= 0),
  cost_source text NOT NULL DEFAULT 'estimated' CHECK (cost_source IN ('measured', 'estimated', 'hybrid')),
  latency_ms integer NOT NULL DEFAULT 0 CHECK (latency_ms >= 0),
  sanitized_input jsonb NOT NULL DEFAULT '{}'::jsonb,
  sanitized_output jsonb NOT NULL DEFAULT '{}'::jsonb,
  audit_notes text,
  error_code text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES public.ai_missions(id) ON DELETE CASCADE,
  title text NOT NULL,
  requested_by_agent_key text NOT NULL REFERENCES public.ai_agents(agent_key),
  approval_level text NOT NULL CHECK (approval_level IN ('L0_auto', 'L1_content_ops', 'L2_financial_admin')),
  category text NOT NULL CHECK (category IN ('campaign_launch', 'budget_allocation', 'b2b_outreach', 'affiliate_offer', 'content_publish', 'mission_deliverable')),
  status text NOT NULL DEFAULT 'awaiting_approval' CHECK (status IN ('queued', 'running', 'awaiting_approval', 'approved', 'rejected', 'completed', 'failed', 'cancelled')),
  estimated_impact text NOT NULL,
  financial_impact_cents bigint NOT NULL DEFAULT 0 CHECK (financial_impact_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  diff_summary text NOT NULL,
  payload_preview jsonb NOT NULL DEFAULT '{}'::jsonb,
  decision_notes text,
  decided_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.ai_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid REFERENCES public.ai_missions(id) ON DELETE SET NULL,
  title text NOT NULL,
  segment text NOT NULL,
  source_channel text NOT NULL,
  country_market text NOT NULL CHECK (country_market IN ('PT', 'BR', 'GLOBAL')),
  estimated_ticket_cents bigint NOT NULL DEFAULT 0 CHECK (estimated_ticket_cents >= 0),
  currency_code text NOT NULL DEFAULT 'EUR' CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  confidence_score integer NOT NULL DEFAULT 75 CHECK (confidence_score >= 0 AND confidence_score <= 100),
  intent_score integer NOT NULL DEFAULT 75 CHECK (intent_score >= 0 AND intent_score <= 100),
  roi_potential_score integer NOT NULL DEFAULT 75 CHECK (roi_potential_score >= 0 AND roi_potential_score <= 100),
  recommended_action text NOT NULL,
  discovered_by_agent text NOT NULL REFERENCES public.ai_agents(agent_key),
  status text NOT NULL DEFAULT 'validated' CHECK (status IN ('new', 'analyzing', 'validated', 'converted_to_mission', 'discarded')),
  rationale text,
  sources_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Anti-replay de mensagens QStash / Workers
CREATE TABLE IF NOT EXISTS public.processed_worker_messages (
  message_id text PRIMARY KEY,
  idempotency_key text NOT NULL UNIQUE,
  handler_route text NOT NULL,
  body_sha256 text,
  processed_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 5. MÓDULO FINANCEIRO MULTI-MOEDA (EUR, BRL, USD) & FINOPS LEDGER
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fin_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  scope_name text NOT NULL,
  period_month text NOT NULL, -- YYYY-MM
  currency_code text NOT NULL CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  allocated_cents bigint NOT NULL CHECK (allocated_cents >= 0),
  reserved_cents bigint NOT NULL DEFAULT 0 CHECK (reserved_cents >= 0),
  consumed_cents bigint NOT NULL DEFAULT 0 CHECK (consumed_cents >= 0),
  alert_threshold_pct integer NOT NULL DEFAULT 80 CHECK (alert_threshold_pct BETWEEN 1 AND 100),
  hard_stop_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_fin_budgets_non_negative_available CHECK (reserved_cents + consumed_cents >= 0)
);

CREATE TABLE IF NOT EXISTS public.fin_budget_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES public.fin_budgets(id) ON DELETE RESTRICT,
  mission_id uuid REFERENCES public.ai_missions(id) ON DELETE SET NULL,
  task_id uuid REFERENCES public.ai_tasks(id) ON DELETE SET NULL,
  idempotency_key text NOT NULL UNIQUE,
  currency_code text NOT NULL CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  reserved_cents bigint NOT NULL CHECK (reserved_cents > 0),
  settled_cents bigint NOT NULL DEFAULT 0 CHECK (settled_cents >= 0),
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'settled', 'released', 'expired')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_settled_within_reserved CHECK (settled_cents <= reserved_cents)
);

CREATE TABLE IF NOT EXISTS public.fin_cashflow_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  direction text NOT NULL CHECK (direction IN ('inflow', 'outflow')),
  category text NOT NULL,
  description text NOT NULL,
  counterparty text NOT NULL,
  currency_code text NOT NULL CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  settlement_status text NOT NULL DEFAULT 'settled' CHECK (settlement_status IN ('projected', 'pending', 'settled', 'cancelled')),
  linked_mission_id uuid REFERENCES public.ai_missions(id) ON DELETE SET NULL,
  linked_reservation_id uuid REFERENCES public.fin_budget_reservations(id) ON DELETE SET NULL,
  reversed_from_id uuid REFERENCES public.fin_cashflow_entries(id) ON DELETE RESTRICT,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fin_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text NOT NULL UNIQUE,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  memo text NOT NULL,
  source_module text NOT NULL CHECK (source_module IN ('agency_service', 'affiliate_commission', 'ai_infrastructure', 'paid_media', 'saas_subscription', 'tax_provision')),
  status text NOT NULL DEFAULT 'posted' CHECK (status IN ('draft', 'posted', 'reversed')),
  reversed_from_id uuid REFERENCES public.fin_journal_entries(id) ON DELETE RESTRICT,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fin_journal_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id uuid NOT NULL REFERENCES public.fin_journal_entries(id) ON DELETE CASCADE,
  account_code text NOT NULL,
  account_name text NOT NULL,
  currency_code text NOT NULL CHECK (currency_code IN ('EUR', 'BRL', 'USD')),
  debit_cents bigint NOT NULL DEFAULT 0 CHECK (debit_cents >= 0),
  credit_cents bigint NOT NULL DEFAULT 0 CHECK (credit_cents >= 0),
  fx_rate_to_eur_micros bigint NOT NULL DEFAULT 1000000 CHECK (fx_rate_to_eur_micros > 0),
  eur_equivalent_cents bigint NOT NULL DEFAULT 0 CHECK (eur_equivalent_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_fin_journal_line_single_side CHECK (
    (debit_cents > 0 AND credit_cents = 0) OR (credit_cents > 0 AND debit_cents = 0)
  )
);

-- -----------------------------------------------------------------------------
-- 6. ÍNDICES DE PERFORMANCE E CONCORRÊNCIA
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ai_missions_status_created ON public.ai_missions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_mission_step ON public.ai_tasks(mission_id, step_order);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_agent_status ON public.ai_tasks(assigned_agent_key, status);
CREATE INDEX IF NOT EXISTS idx_ai_task_runs_mission_created ON public.ai_task_runs(mission_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_task_runs_agent_created ON public.ai_task_runs(agent_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_approvals_status_requested ON public.ai_approvals(status, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_opportunities_mission ON public.ai_opportunities(mission_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fin_reservations_budget_status ON public.fin_budget_reservations(budget_id, status);
CREATE INDEX IF NOT EXISTS idx_fin_cashflow_date_currency ON public.fin_cashflow_entries(entry_date DESC, currency_code);
CREATE INDEX IF NOT EXISTS idx_fin_journal_lines_entry ON public.fin_journal_lines(journal_entry_id);

-- -----------------------------------------------------------------------------
-- 7. FUNÇÕES ATÓMICAS DE ORÇAMENTO CORRIGIDAS (PONTO 5.3)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reserve_ai_budget(
  p_budget_code text,
  p_mission_id uuid,
  p_task_id uuid,
  p_amount_cents bigint,
  p_idempotency_key text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_budget public.fin_budgets%ROWTYPE;
  v_existing public.fin_budget_reservations%ROWTYPE;
  v_expired_cents bigint := 0;
  v_available bigint;
  v_res_id uuid;
  v_clean_idem text;
BEGIN
  v_clean_idem := trim(COALESCE(p_idempotency_key, ''));
  IF length(v_clean_idem) < 6 THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_IDEMPOTENCY_KEY');
  END IF;

  IF p_amount_cents IS NULL OR p_amount_cents <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_RESERVATION_AMOUNT');
  END IF;

  -- 1. Bloqueio pessimista da linha de orçamento ANTES de verificar idempotência/expiração
  SELECT * INTO v_budget
  FROM public.fin_budgets
  WHERE code = trim(COALESCE(p_budget_code, ''))
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'BUDGET_NOT_FOUND');
  END IF;

  -- 2. Verificação de idempotência protegida pelo lock do orçamento
  SELECT * INTO v_existing
  FROM public.fin_budget_reservations
  WHERE idempotency_key = v_clean_idem;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'idempotent_replay', true,
      'reservation_id', v_existing.id,
      'reserved_cents', v_existing.reserved_cents,
      'status', v_existing.status,
      'currency_code', v_existing.currency_code
    );
  END IF;

  -- 3. Libertação atómica de reservas expiradas na mesma transação
  WITH expired_rows AS (
    UPDATE public.fin_budget_reservations
    SET status = 'expired', updated_at = now()
    WHERE budget_id = v_budget.id
      AND status = 'reserved'
      AND expires_at <= now()
    RETURNING reserved_cents
  )
  SELECT COALESCE(sum(reserved_cents), 0) INTO v_expired_cents
  FROM expired_rows;

  IF v_expired_cents > 0 THEN
    UPDATE public.fin_budgets
    SET reserved_cents = GREATEST(0, reserved_cents - v_expired_cents),
        updated_at = now()
    WHERE id = v_budget.id
    RETURNING * INTO v_budget;
  END IF;

  -- 4. Cálculo rigoroso do saldo disponível
  v_available := v_budget.allocated_cents - v_budget.reserved_cents - v_budget.consumed_cents;

  IF v_budget.hard_stop_enabled AND p_amount_cents > v_available THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'BUDGET_HARD_STOP_EXCEEDED',
      'available_cents', GREATEST(0, v_available),
      'requested_cents', p_amount_cents,
      'currency_code', v_budget.currency_code
    );
  END IF;

  -- 5. Inserção da reserva e atualização do saldo reservado
  INSERT INTO public.fin_budget_reservations (
    budget_id, mission_id, task_id, idempotency_key, currency_code, reserved_cents, status
  ) VALUES (
    v_budget.id, p_mission_id, p_task_id, v_clean_idem, v_budget.currency_code, p_amount_cents, 'reserved'
  )
  RETURNING id INTO v_res_id;

  UPDATE public.fin_budgets
  SET reserved_cents = reserved_cents + p_amount_cents,
      updated_at = now()
  WHERE id = v_budget.id;

  RETURN jsonb_build_object(
    'success', true,
    'reservation_id', v_res_id,
    'reserved_cents', p_amount_cents,
    'remaining_available_cents', v_available - p_amount_cents,
    'currency_code', v_budget.currency_code
  );
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_ai_budget(text, uuid, uuid, bigint, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_ai_budget(text, uuid, uuid, bigint, text) TO service_role;

CREATE OR REPLACE FUNCTION public.settle_ai_budget(
  p_reservation_id uuid,
  p_actual_cost_cents bigint,
  p_release_only boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_res public.fin_budget_reservations%ROWTYPE;
  v_budget public.fin_budgets%ROWTYPE;
  v_cashflow_id uuid;
BEGIN
  IF p_reservation_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_RESERVATION_ID');
  END IF;

  IF NOT p_release_only AND (p_actual_cost_cents IS NULL OR p_actual_cost_cents < 0) THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_SETTLEMENT_AMOUNT');
  END IF;

  -- Bloquear reserva e respetivo orçamento em ordem determinística
  SELECT * INTO v_res
  FROM public.fin_budget_reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'RESERVATION_NOT_FOUND');
  END IF;

  IF v_res.status IN ('settled', 'released', 'expired') THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_finalized', true,
      'status', v_res.status,
      'settled_cents', v_res.settled_cents
    );
  END IF;

  SELECT * INTO v_budget
  FROM public.fin_budgets
  WHERE id = v_res.budget_id
  FOR UPDATE;

  -- Impedir liquidação acima do montante autorizado na reserva
  IF NOT p_release_only AND p_actual_cost_cents > v_res.reserved_cents THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'SETTLEMENT_EXCEEDS_RESERVED_LIMIT',
      'reserved_cents', v_res.reserved_cents,
      'requested_settlement_cents', p_actual_cost_cents
    );
  END IF;

  IF p_release_only THEN
    UPDATE public.fin_budget_reservations
    SET status = 'released', settled_cents = 0, updated_at = now()
    WHERE id = v_res.id;

    UPDATE public.fin_budgets
    SET reserved_cents = GREATEST(0, reserved_cents - v_res.reserved_cents),
        updated_at = now()
    WHERE id = v_budget.id;

    RETURN jsonb_build_object('success', true, 'status', 'released', 'settled_cents', 0);
  ELSE
    UPDATE public.fin_budget_reservations
    SET status = 'settled', settled_cents = p_actual_cost_cents, updated_at = now()
    WHERE id = v_res.id;

    UPDATE public.fin_budgets
    SET reserved_cents = GREATEST(0, reserved_cents - v_res.reserved_cents),
        consumed_cents = consumed_cents + p_actual_cost_cents,
        updated_at = now()
    WHERE id = v_budget.id;

    -- Registo automático rastreável no Subledger de Fluxo de Caixa quando há consumo > 0
    IF p_actual_cost_cents > 0 THEN
      INSERT INTO public.fin_cashflow_entries (
        entry_date,
        direction,
        category,
        description,
        counterparty,
        currency_code,
        amount_cents,
        settlement_status,
        linked_mission_id,
        linked_reservation_id
      ) VALUES (
        CURRENT_DATE,
        'outflow',
        'Operações AI Growth OS',
        'Liquidação automática de reserva de orçamento (' || v_res.id::text || ')',
        'Motor Multiagente UmbuLab',
        v_res.currency_code,
        p_actual_cost_cents,
        'settled',
        v_res.mission_id,
        v_res.id
      )
      RETURNING id INTO v_cashflow_id;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'status', 'settled',
      'settled_cents', p_actual_cost_cents,
      'cashflow_entry_id', v_cashflow_id
    );
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.settle_ai_budget(uuid, bigint, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.settle_ai_budget(uuid, bigint, boolean) TO service_role;

-- -----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) — ISOLAMENTO EXCLUSIVO PARA ADMIN / SERVICE_ROLE
-- -----------------------------------------------------------------------------
ALTER TABLE public.ai_system_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_integration_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_integration_secrets FORCE ROW LEVEL SECURITY;
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

DROP POLICY IF EXISTS "Admins manage ai_system_controls" ON public.ai_system_controls;
CREATE POLICY "Admins manage ai_system_controls" ON public.ai_system_controls
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_agents" ON public.ai_agents;
CREATE POLICY "Admins manage ai_agents" ON public.ai_agents
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

DROP POLICY IF EXISTS "Admins manage ai_integrations" ON public.ai_integrations;
CREATE POLICY "Admins manage ai_integrations" ON public.ai_integrations
  FOR ALL TO authenticated USING ((SELECT public.is_verified_admin())) WITH CHECK ((SELECT public.is_verified_admin()));

-- NOTA DE SEGURANÇA (PONTO 5.4): public.ai_integration_secrets NÃO possui política para authenticated nem anon!
-- Apenas o backend com SUPABASE_SERVICE_ROLE_KEY pode ler ou escrever segredos encriptados.

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

-- Revogar acesso de anon a todas as tabelas do AI Growth OS e revogar acesso de authenticated ao cofre de segredos
REVOKE ALL ON
  public.ai_system_controls,
  public.ai_agents,
  public.ai_integrations,
  public.ai_integration_secrets,
  public.ai_missions,
  public.ai_tasks,
  public.ai_task_runs,
  public.ai_approvals,
  public.ai_opportunities,
  public.processed_worker_messages,
  public.fin_budgets,
  public.fin_budget_reservations,
  public.fin_cashflow_entries,
  public.fin_journal_entries,
  public.fin_journal_lines
FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.ai_system_controls,
  public.ai_agents,
  public.ai_integrations,
  public.ai_missions,
  public.ai_tasks,
  public.ai_task_runs,
  public.ai_approvals,
  public.ai_opportunities,
  public.processed_worker_messages,
  public.fin_budgets,
  public.fin_budget_reservations,
  public.fin_cashflow_entries,
  public.fin_journal_entries,
  public.fin_journal_lines
TO authenticated, service_role;

REVOKE ALL ON public.ai_integration_secrets FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.ai_integration_secrets TO service_role;

-- -----------------------------------------------------------------------------
-- 9. SEMENTES ESTRUTURAIS IDEMPOTENTES (10 AGENTES, INTEGRAÇÕES E ENVELOPES)
-- -----------------------------------------------------------------------------
INSERT INTO public.ai_agents (
  agent_key, display_name, role_title, summary, status, autonomy_level,
  requires_approval_for, skills, reports_to, preferred_provider, preferred_model,
  temperature, max_tokens, daily_budget_cents, currency_code, allowed_tools, system_prompt
)
VALUES
  ('ops_director', 'Diretor de Operações IA', 'Orquestrador Central & Governação', 'Decompõe objetivos de negócio em planos DAG, reserva orçamento e exige validação do Auditor de Qualidade.', 'idle', 'supervised', ARRAY['budget_allocation','mission_deliverable'], ARRAY['mission_decomposition_dag','budget_gate_enforcement'], NULL, 'google_gemini', 'gemini-2.5-pro', 0.25, 2048, 2500, 'EUR', ARRAY['dag_planner','budget_reservation_rpc','approval_gate_router','agent_dispatcher'], 'Atua como Diretor de Operações e Orquestrador Central da UmbuLab.'),
  ('market_intel', 'Radar de Mercado & Tendências', 'Especialista de Inteligência de Mercado', 'Identifica oportunidades reais de produtos digitais, SaaS e serviços B2B em PT, BR e Global.', 'idle', 'supervised', ARRAY['affiliate_offer'], ARRAY['market_signal_scanner','competitor_benchmarking'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.25, 2048, 1200, 'EUR', ARRAY['web_market_research','competitor_matrix','demand_signal_analyzer','opportunity_radar_writer'], 'Atua como Especialista de Inteligência de Mercado (PT/BR/Global).'),
  ('commercial_analyst', 'Estrategista Comercial & Ofertas', 'Analista de Viabilidade e Preço', 'Avalia unit economics, ticket médio, LTV/CAC e margens multi-moeda (EUR, BRL, USD).', 'idle', 'supervised', ARRAY['affiliate_offer'], ARRAY['offer_unit_economics','pricing_tier_architect'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.25, 2048, 1200, 'EUR', ARRAY['unit_economics_calculator','pricing_simulator_multi_currency','offer_scorecard'], 'Atua como Estrategista Comercial da UmbuLab.'),
  ('marketing_seo', 'Arquiteto de Conteúdo & SEO', 'Especialista em Posicionamento Orgânico', 'Estrutura páginas de venda, clusters semânticos e copy em pt-PT e pt-BR.', 'idle', 'supervised', ARRAY['content_publish'], ARRAY['seo_topical_authority','conversion_copywriting'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.30, 2048, 1200, 'EUR', ARRAY['seo_cluster_builder','landing_page_copywriter','locale_adapter_pt_br'], 'Atua como Especialista de Conteúdo, SEO e Posicionamento.'),
  ('creative_director', 'Diretor Criativo & Estúdio', 'Especialista Visual & Storyboards', 'Desenha conceitos visuais, argumentos criativos e variações para campanhas.', 'idle', 'supervised', ARRAY['content_publish'], ARRAY['creative_angle_matrix','video_script_storyboard'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.60, 2048, 1200, 'EUR', ARRAY['brand_token_validator','ad_creative_storyboard','ab_visual_brief'], 'Atua como Diretor Criativo da UmbuLab.'),
  ('traffic_manager', 'Gestor de Tráfego & Testes A/B', 'Especialista em Performance e Aquisição', 'Planeia experiências A/B e alocação de tráfego sempre sujeitas a aprovação L2.', 'idle', 'supervised', ARRAY['campaign_launch','budget_allocation'], ARRAY['ab_experiment_design','roas_guardrail_modeling'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.25, 2048, 2500, 'EUR', ARRAY['campaign_ab_architect','roas_simulator','ad_spend_guard'], 'Atua como Gestor de Tráfego Pago e Experimentação A/B.'),
  ('affiliate_ecom', 'Operador de Afiliados & E-commerce', 'Especialista em Produtos Digitais e Checkout', 'Analisa ofertas, funis e comissões com integração comercial segura.', 'idle', 'supervised', ARRAY['affiliate_offer'], ARRAY['checkout_conversion_audit','affiliate_program_evaluator'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.25, 2048, 1200, 'EUR', ARRAY['digital_product_catalog','checkout_funnel_mapper','appmax_order_sync_readonly'], 'Atua como Especialista de Afiliados, Produtos Digitais e E-commerce.'),
  ('b2b_prospector', 'Especialista de Prospeção B2B', 'Desenvolvimento Comercial Consultivo', 'Prepara cadências consultivas B2B em estrita conformidade com RGPD e LGPD.', 'idle', 'supervised', ARRAY['b2b_outreach'], ARRAY['b2b_icp_qualification','consultative_outreach_sequence'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.25, 2048, 1500, 'EUR', ARRAY['b2b_account_profiler','consultative_cadence_drafter','gdpr_lgpd_optout_checker'], 'Atua como Especialista de Prospeção B2B Consultiva.'),
  ('finance_analyst', 'Controller Financeiro & FinOps', 'Guardião de Orçamento e Partidas Dobradas', 'Supervisiona envelopes multi-moeda (EUR, BRL, USD), reservas atómicas e custos de IA.', 'idle', 'supervised', ARRAY['budget_allocation'], ARRAY['finops_cost_attribution','double_entry_reconciliation'], 'ops_director', 'google_gemini', 'gemini-2.5-flash', 0.20, 2048, 1500, 'EUR', ARRAY['atomic_budget_ledger','double_entry_validator','finops_token_auditor'], 'Atua como Controller Financeiro e FinOps da UmbuLab.'),
  ('quality_auditor', 'Auditor de Qualidade & Segurança', 'Brand Safety, RGPD/LGPD & AppSec', 'Inspeciona todas as entregas antes da aprovação humana distinguindo factos de hipóteses.', 'idle', 'supervised', ARRAY['mission_deliverable'], ARRAY['fact_hypothesis_separation','appsec_privacy_gate'], 'ops_director', 'google_gemini', 'gemini-2.5-pro', 0.20, 2048, 1500, 'EUR', ARRAY['fact_vs_hypothesis_checker','rgpd_lgpd_compliance_gate','secret_leak_scanner'], 'Atua como Auditor de Qualidade, Brand Safety e AppSec.')
ON CONFLICT (agent_key) DO NOTHING;

INSERT INTO public.ai_integrations (
  provider_key, display_name, category, status, auth_mode, env_var_name, has_saved_secret, currency_code, monthly_cap_cents
)
VALUES
  ('google_gemini', 'Google Gemini API (Motor Principal Partilhado)', 'ai_llm', 'not_configured', 'api_key', 'GEMINI_API_KEY', false, 'USD', 15000),
  ('serpapi', 'SerpAPI / Google Search & Trends', 'search_market', 'not_configured', 'api_key', 'SERPAPI_API_KEY', false, 'USD', 5000),
  ('appmax', 'Appmax E-commerce & Infoprodutos (BR)', 'payments_commerce', 'not_configured', 'api_key', 'APPMAX_ACCESS_TOKEN', false, 'BRL', 50000),
  ('stripe', 'Stripe Payments (PT/EU/Global)', 'payments_commerce', 'not_configured', 'api_key', 'STRIPE_SECRET_KEY', false, 'EUR', 50000),
  ('meta_ads', 'Meta Ads Marketing API', 'ads_social', 'not_configured', 'oauth2', 'META_ADS_ACCESS_TOKEN', false, 'EUR', 30000),
  ('google_ads', 'Google Ads API', 'ads_social', 'not_configured', 'oauth2', 'GOOGLE_ADS_DEVELOPER_TOKEN', false, 'EUR', 30000),
  ('resend', 'Resend Transactional Email', 'messaging_email', 'not_configured', 'api_key', 'RESEND_API_KEY', false, 'USD', 2500),
  ('whatsapp_zapi', 'WhatsApp Z-API Gateway', 'messaging_email', 'not_configured', 'api_key', 'ZAPI_TOKEN', false, 'BRL', 15000),
  ('qstash', 'Upstash QStash Async Worker Queue', 'automation_infra', 'not_configured', 'webhook_hmac', 'QSTASH_TOKEN', false, 'USD', 2500)
ON CONFLICT (provider_key) DO NOTHING;

INSERT INTO public.fin_budgets (
  code, scope_name, period_month, currency_code, allocated_cents, reserved_cents, consumed_cents, alert_threshold_pct, hard_stop_enabled
)
VALUES
  ('FINOPS_AI_USD', 'Orçamento Mensal de Consumo de IA & APIs (USD)', '2026-11', 'USD', 15000, 0, 0, 80, true),
  ('GROWTH_PT_EUR', 'Orçamento Mensal de Operações e Campanhas Europa (EUR)', '2026-11', 'EUR', 45000, 0, 0, 80, true),
  ('OPERATIONS_BR_BRL', 'Orçamento Mensal de Operações e E-commerce Brasil (BRL)', '2026-11', 'BRL', 250000, 0, 0, 80, true)
ON CONFLICT (code) DO NOTHING;

COMMIT;
