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

export type GrowthOsLocale = 'pt-PT' | 'pt-BR';

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

