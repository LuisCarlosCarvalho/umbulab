/**
 * Contratos tipados canónicos do UmbuLab AI Growth OS (Fase 1B — UI Demonstrativa).
 * Todos os campos respeitam snake_case estrito conforme umbulab-agent-contract e umbulab-finance-ledger.
 */

export const GROWTH_OS_SECTION_KEYS = [
  'overview',
  'agents',
  'opportunities',
  'ab_campaigns',
  'creative_studio',
  'tasks_approvals',
  'finance',
  'reports',
  'settings',
] as const;

export type GrowthOsSection = (typeof GROWTH_OS_SECTION_KEYS)[number];

export function isValidGrowthOsSection(value: string | null | undefined): value is GrowthOsSection {
  if (!value) return false;
  return (GROWTH_OS_SECTION_KEYS as readonly string[]).includes(value);
}

export function parseGrowthOsSection(value: string | null | undefined): GrowthOsSection {
  return isValidGrowthOsSection(value) ? value : 'overview';
}

export type GrowthOsCurrency = 'EUR' | 'BRL' | 'USD';

export type GrowthOsMarket = 'PT' | 'BR' | 'GLOBAL';

export type GrowthOsLocale = 'pt-PT' | 'pt-BR' | 'en-US';

export type ExecutionMode = 'browser_assisted' | 'server_async';

export type RiskLevel = 'L0' | 'L1' | 'L2';

export type DataOrigin = 'demo_fictitious';

export type AgentKey =
  | 'ops_director'
  | 'market_intel'
  | 'commercial_analyst'
  | 'marketing_seo'
  | 'creative_director'
  | 'traffic_manager'
  | 'affiliate_ecom'
  | 'b2b_prospector'
  | 'finance_analyst'
  | 'quality_auditor';

export type AgentRuntimeState = 'standby_no_backend';

export type TaskLifecycleStatus =
  | 'queued'
  | 'running'
  | 'awaiting_audit'
  | 'awaiting_approval'
  | 'paused_budget'
  | 'completed'
  | 'failed_retryable'
  | 'dead_letter';

export type AccountingRegime = 'cash_basis' | 'accrual_basis';

export type LedgerModelView = 'cashflow_subledger' | 'double_entry_preview';

export interface GrowthOsSectionMeta {
  key: GrowthOsSection;
  short_label: string;
  title: string;
  description: string;
  step_number: number;
}

export interface DemoAgentSpec {
  agent_key: AgentKey;
  display_name: string;
  role_title: string;
  department: 'Orquestração' | 'Inteligência & Comercial' | 'Marketing & Criativo' | 'Canais & B2B' | 'Finanças & Governação';
  reports_to: AgentKey | 'human_admin';
  runtime_state: AgentRuntimeState;
  planned_execution_mode: ExecutionMode;
  default_risk_level: RiskLevel;
  requires_human_approval: boolean;
  planned_runtime_skills: string[];
  responsibility_summary: string;
  is_demo_data: true;
}

export interface DemoOpportunityItem {
  opportunity_id: string;
  title: string;
  channel: 'B2B Serviços UmbuLab' | 'Afiliados Autorizados' | 'E-commerce / Produto Digital' | 'Conteúdo & SEO';
  market: GrowthOsMarket;
  currency: GrowthOsCurrency;
  estimated_ticket_cents: number;
  estimated_margin_pct: number;
  viability_label: 'Alta (Fictícia)' | 'Média (Fictícia)' | 'Em Triagem (Fictícia)';
  verified_facts_note: string;
  hypothesis_note: string;
  compliance_basis: string;
  risk_level: RiskLevel;
  is_demo_data: true;
}

export interface DemoAbCampaignItem {
  campaign_id: string;
  title: string;
  objective: string;
  market: GrowthOsMarket;
  currency: GrowthOsCurrency;
  planned_budget_cap_cents: number;
  variant_a_summary: string;
  variant_b_summary: string;
  primary_metric_label: string;
  risk_level: 'L2';
  approval_gate_note: string;
  status_label: 'Rascunho Fictício (Bloqueado)';
  is_demo_data: true;
}

export interface DemoCreativeAssetItem {
  asset_id: string;
  title: string;
  format: 'Copy Landing Page' | 'Storyboard Vídeo Curto' | 'Criativo Estático Social' | 'Sequência B2B Consultiva';
  locale: GrowthOsLocale;
  target_channel: string;
  brand_tokens_used: string[];
  brief_summary: string;
  compliance_check_note: string;
  risk_level: 'L1' | 'L2';
  status_label: 'Modelo Fictício (Não Publicado)';
  is_demo_data: true;
}

export interface DemoApprovalTaskItem {
  task_id: string;
  mission_title: string;
  agent_key: AgentKey;
  skill_key: string;
  execution_mode: ExecutionMode;
  lifecycle_status: TaskLifecycleStatus;
  risk_level: RiskLevel;
  requires_human_approval: boolean;
  currency: GrowthOsCurrency;
  budget_allowance_cents: number;
  auditor_verdict_label: string;
  finance_verdict_label: string;
  impact_summary: string;
  is_demo_data: true;
}

export interface DemoCashflowEntry {
  entry_id: string;
  description: string;
  direction: 'inflow' | 'outflow';
  category: string;
  currency: GrowthOsCurrency;
  amount_cents: number;
  competence_date: string;
  cash_date: string | null;
  settlement_state: 'planned_demo' | 'settled_demo';
  immutable_rule_note: string;
  is_demo_data: true;
}

export interface DemoDoubleEntryJournal {
  journal_entry_id: string;
  description: string;
  currency: GrowthOsCurrency;
  entry_date: string;
  lines: {
    line_id: string;
    account_code: string;
    account_name: string;
    debit_cents: number;
    credit_cents: number;
  }[];
  is_demo_data: true;
}

export interface DemoBudgetEnvelope {
  budget_id: string;
  scope_label: string;
  currency: GrowthOsCurrency;
  limit_cents: number;
  reserved_cents: number;
  settled_cents: number;
  hard_stop: boolean;
  is_demo_data: true;
}

export interface DemoPerformanceChannelRow {
  channel_id: string;
  channel_label: string;
  market: GrowthOsMarket;
  native_currency: GrowthOsCurrency;
  demo_attributed_revenue_cents: number;
  demo_direct_cost_cents: number;
  demo_ai_cost_usd_cents: number;
  demo_share_pct: number;
  note: string;
  is_demo_data: true;
}

export interface DemoIntegrationItem {
  integration_key: string;
  name: string;
  category: 'Core Existente' | 'IA & Orquestração (Futuro)' | 'Canais & Mensagens (Futuro)';
  connection_state_label: 'Não Conectado ao Growth OS (Fase 1B)';
  auth_boundary_note: string;
  server_env_var_reference: string;
  phase_planned: string;
  is_demo_data: true;
}

// =============================================================================
// FASE 3 — CONTRATOS OPERACIONAIS REAIS (MULTIAGENTE, INTEGRAÇÕES, MISSÕES E FINOPS)
// =============================================================================

export type OperationalExecutionStatus =
  | 'queued'
  | 'running'
  | 'awaiting_approval'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type AgentOperationalStatus =
  | 'idle'
  | 'running'
  | 'awaiting_approval'
  | 'paused'
  | 'error';

export type AgentAutonomyMode =
  | 'read_only'
  | 'draft_only'
  | 'approval_required'
  | 'auto_low_risk';

export type AdapterMode = 'live_api' | 'live_provider_api' | 'sandbox_test_adapter';

export type ApprovalLevelCode = 'L0_auto' | 'L1_content_ops' | 'L2_financial_admin';

export type IntegrationCategoryKey =
  | 'ai_llm'
  | 'search_market'
  | 'payments_commerce'
  | 'ads_social'
  | 'messaging_email'
  | 'automation_infra';

export type IntegrationConnectionStatus =
  | 'connected'
  | 'configured_pending_test'
  | 'planned'
  | 'disabled'
  | 'error';

export interface OperationalAgentConfig {
  agent_key: AgentKey;
  display_name: string;
  role_title: string;
  department: DemoAgentSpec['department'];
  reports_to: AgentKey | 'human_admin';
  status: AgentOperationalStatus;
  execution_mode: AgentAutonomyMode;
  default_risk_level: RiskLevel;
  requires_human_approval: boolean;
  preferred_provider: string;
  preferred_model: string;
  temperature: number;
  max_tokens: number;
  daily_budget_cents: number;
  daily_consumed_cents: number;
  currency: GrowthOsCurrency;
  allowed_tools: string[];
  runtime_skills: string[];
  responsibility_summary: string;
  system_prompt: string;
  last_run_at: string | null;
  total_runs_count: number;
  updated_at: string;
}

export interface OperationalIntegrationRecord {
  provider_key: string;
  display_name: string;
  category: IntegrationCategoryKey;
  category_label: string;
  status: IntegrationConnectionStatus;
  auth_mode: 'api_key' | 'oauth2' | 'webhook_hmac' | 'service_role';
  env_var_name: string;
  has_saved_secret: boolean;
  key_hint: string | null;
  base_url: string;
  webhook_url: string;
  rate_limit_per_min: number;
  monthly_cap_cents: number;
  currency: GrowthOsCurrency;
  is_active: boolean;
  last_tested_at: string | null;
  last_test_status: 'ok' | 'warning' | 'error' | null;
  last_test_message: string | null;
  documentation_note: string;
  updated_at: string;
}

export interface OperationalTaskRecord {
  task_id: string;
  mission_id: string;
  step_order: number;
  title: string;
  assigned_agent_key: AgentKey;
  skill_key: string;
  status: OperationalExecutionStatus;
  execution_mode: AgentAutonomyMode;
  risk_level: RiskLevel;
  requires_approval: boolean;
  approval_level: ApprovalLevelCode;
  estimated_cost_cents: number;
  actual_cost_cents: number;
  currency: GrowthOsCurrency;
  input_summary: string;
  output_summary: string;
  structured_output: Record<string, unknown>;
  auditor_verdict: string;
  finance_verdict: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface OperationalTaskRunRecord {
  run_id: string;
  task_id: string;
  mission_id: string;
  mission_title: string;
  agent_key: AgentKey;
  skill_key: string;
  correlation_id: string;
  idempotency_key: string;
  execution_mode: AgentAutonomyMode;
  adapter_mode: AdapterMode;
  status: OperationalExecutionStatus;
  model_provider: string;
  model_name: string;
  prompt_tokens: number;
  completion_tokens: number;
  raw_cost_usd_micros: number;
  cost_source: 'measured' | 'estimated' | 'hybrid';
  latency_ms: number;
  sanitized_input: Record<string, unknown>;
  sanitized_output: Record<string, unknown>;
  audit_notes: string;
  error_message: string | null;
  created_at: string;
}

export interface OperationalApprovalRecord {
  approval_id: string;
  task_id: string;
  mission_id: string;
  mission_title: string;
  title: string;
  requested_by_agent_key: AgentKey;
  approval_level: ApprovalLevelCode;
  risk_level: RiskLevel;
  category:
    | 'campaign_launch'
    | 'budget_allocation'
    | 'b2b_outreach'
    | 'affiliate_offer'
    | 'content_publish'
    | 'mission_deliverable'
    | 'ab_campaign_activation'
    | 'creative_asset';
  status: OperationalExecutionStatus;
  estimated_impact: string;
  financial_impact_cents: number;
  currency: GrowthOsCurrency;
  diff_summary: string;
  deliverable_preview: Record<string, unknown>;
  auditor_notes: string;
  decision_notes: string | null;
  decided_by_email: string | null;
  requested_at: string;
  decided_at: string | null;
}

export interface OperationalMissionDeliverable {
  deliverable_id: string;
  title: string;
  produced_by_agent: AgentKey;
  category: 'research_matrix' | 'viability_scorecard' | 'positioning_copy' | 'quality_audit' | 'executive_plan';
  summary: string;
  verified_facts: string[];
  hypotheses: string[];
  recommendations: string[];
}

export interface OperationalMissionRecord {
  mission_id: string;
  code: string;
  title: string;
  objective: string;
  coordinator_agent_key: AgentKey;
  status: OperationalExecutionStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  execution_mode: AgentAutonomyMode;
  adapter_mode: AdapterMode;
  market: GrowthOsMarket;
  budget_cap_cents: number;
  budget_reserved_cents: number;
  budget_used_cents: number;
  currency: GrowthOsCurrency;
  reservation_id: string | null;
  consolidated_summary: string | null;
  deliverables: OperationalMissionDeliverable[];
  tasks: OperationalTaskRecord[];
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  is_demo_data: boolean;
}

export interface OperationalOpportunityRecord {
  opportunity_id: string;
  mission_id: string | null;
  title: string;
  channel: DemoOpportunityItem['channel'] | 'Produto Digital / Serviços B2B' | string;
  market: GrowthOsMarket;
  currency: GrowthOsCurrency;
  estimated_ticket_cents: number;
  estimated_margin_pct: number;
  confidence_score: number;
  intent_score: number;
  roi_potential_score: number;
  viability_label: string;
  verified_facts_note: string;
  hypothesis_note: string;
  compliance_basis: string;
  recommended_action: string;
  discovered_by_agent: AgentKey;
  status: 'new' | 'analyzing' | 'validated' | 'converted_to_mission' | 'discarded';
  risk_level: RiskLevel;
  is_demo_data: boolean;
  created_at: string;
}

export interface OperationalBudgetEnvelope {
  budget_id: string;
  code: string;
  scope_label: string;
  currency: GrowthOsCurrency;
  limit_cents: number;
  reserved_cents: number;
  settled_cents: number;
  confirmed_external_cents?: number;
  alert_threshold_pct: number;
  hard_stop: boolean;
  notes?: string;
  is_demo_data: boolean;
  updated_at: string;
}

export interface OperationalCashflowEntry {
  entry_id: string;
  description: string;
  direction: 'inflow' | 'outflow';
  category: string;
  counterparty: string;
  currency: GrowthOsCurrency;
  amount_cents: number;
  competence_date: string;
  cash_date: string | null;
  settlement_state: 'projected' | 'pending' | 'settled' | 'reversed';
  linked_mission_id: string | null;
  reversed_from_id: string | null;
  reference_doc?: string | null;
  is_simulated_settlement?: boolean;
  immutable_rule_note: string;
  is_demo_data: boolean;
}

export interface OperationalSystemControls {
  pause_new_executions: boolean;
  paused_agent_keys: AgentKey[];
  default_adapter_mode: 'auto' | AdapterMode;
  emergency_reason: string | null;
  persistence_driver: 'supabase_backend' | 'local_operational_store';
  updated_at: string;
}

export interface CoordinatorConversationMessage {
  message_id: string;
  sender: 'admin' | 'ops_director' | 'specialist_agent';
  agent_key: AgentKey;
  speaker_label: string;
  text: string;
  suggested_mission_title?: string;
  created_mission_id?: string;
  timestamp: string;
}

export interface OperationalAbCampaignRecord {
  campaign_id: string;
  title: string;
  objective: string;
  target_audience: string;
  channel: string;
  market: GrowthOsMarket;
  currency: GrowthOsCurrency;
  planned_budget_cap_cents: number;
  period_days?: number;
  duration_days: number;
  variant_a_summary: string;
  variant_b_summary: string;
  primary_metric_label: string;
  risk_level: RiskLevel;
  status_label: string;
  approval_gate_note: string;
  is_draft_without_external_api: boolean;
  is_demo_data: boolean;
  created_at: string;
}

export interface OperationalCreativeAssetRecord {
  asset_id: string;
  title: string;
  content_type: string;
  objective: string;
  target_audience: string;
  target_channel: string;
  locale: GrowthOsLocale;
  tone: string;
  product_service?: string;
  format?: string;
  cta_label?: string;
  call_to_action: string;
  generated_text: string;
  brand_tokens_used?: string[];
  brief_summary?: string;
  compliance_check_note: string;
  risk_level: RiskLevel;
  status_label:
    | 'Rascunho Editável'
    | 'Enviado para Aprovação'
    | 'Aprovado'
    | 'Modelo Fictício (Não Publicado)'
    | 'draft'
    | 'awaiting_approval'
    | 'approved';
  adapter_mode?: AdapterMode;
  is_demo_data: boolean;
  created_at: string;
}

export interface GrowthOsOperationalState {
  system_controls: OperationalSystemControls;
  onboarding_dismissed?: boolean;
  agents: OperationalAgentConfig[];
  integrations: OperationalIntegrationRecord[];
  missions: OperationalMissionRecord[];
  task_runs: OperationalTaskRunRecord[];
  approvals: OperationalApprovalRecord[];
  opportunities: OperationalOpportunityRecord[];
  ab_campaigns: OperationalAbCampaignRecord[];
  creative_assets: OperationalCreativeAssetRecord[];
  budgets: OperationalBudgetEnvelope[];
  cashflow_entries: OperationalCashflowEntry[];
  journal_entries: DemoDoubleEntryJournal[];
  coordinator_messages: CoordinatorConversationMessage[];
}


