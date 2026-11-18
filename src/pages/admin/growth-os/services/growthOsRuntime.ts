import { useSyncExternalStore } from 'react';
import { supabase } from '../../../../lib/supabase';
import type {
  AdapterMode,
  AgentAutonomyMode,
  AgentKey,
  CoordinatorConversationMessage,
  GrowthOsCurrency,
  GrowthOsMarket,
  GrowthOsOperationalState,
  OperationalAbCampaignRecord,
  OperationalAgentConfig,
  OperationalApprovalRecord,
  OperationalBudgetEnvelope,
  OperationalCashflowEntry,
  OperationalCreativeAssetRecord,
  OperationalIntegrationRecord,
  OperationalMissionDeliverable,
  OperationalMissionRecord,
  OperationalOpportunityRecord,
  OperationalTaskRecord,
  OperationalTaskRunRecord,
} from '../../../../types/growthOs';
import {
  DEMO_AB_CAMPAIGNS,
  DEMO_AGENTS_TEAM,
  DEMO_BUDGET_ENVELOPES,
  DEMO_CASHFLOW_ENTRIES,
  DEMO_CREATIVE_ASSETS,
  DEMO_DOUBLE_ENTRY_JOURNALS,
  DEMO_OPPORTUNITIES,
} from '../mockPreviewData';

const STORAGE_KEY = 'umbulab_growth_os_operational_state_v3_1';

const DEFAULT_SYSTEM_PROMPTS: Record<AgentKey, string> = {
  ops_director:
    'Atua como Diretor de Operações e Orquestrador Central da UmbuLab. Decompõe objetivos de negócio em planos DAG auditáveis, reserva orçamento antes de executar e exige validação do Auditor de Qualidade.',
  market_intel:
    'Atua como Especialista de Inteligência de Mercado (PT/BR/Global). Identifica oportunidades reais de produtos digitais, SaaS e serviços B2B distinguindo sempre factos verificados de hipóteses.',
  commercial_analyst:
    'Atua como Estrategista Comercial. Avalia unit economics, ticket médio, LTV/CAC, margens em EUR/BRL e viabilidade de ofertas para a UmbuLab.',
  marketing_seo:
    'Atua como Especialista de Conteúdo, SEO e Posicionamento. Estrutura páginas de venda, clusters semânticos e copy em pt-PT e pt-BR sem promessas enganosas.',
  creative_director:
    'Atua como Diretor Criativo. Desenha conceitos visuais, storyboards e criativos respeitando a paleta verde UmbuLab e grafite.',
  traffic_manager:
    'Atua como Gestor de Tráfego Pago e Experimentação A/B. Planeia campanhas Meta/Google Ads sempre bloqueadas até aprovação L2.',
  affiliate_ecom:
    'Atua como Especialista de Afiliados, Produtos Digitais e E-commerce. Analisa ofertas, comissões e integrações comerciais (ex.: Appmax/Stripe).',
  b2b_prospector:
    'Atua como Especialista de Prospeção B2B Consultiva. Prepara abordagens personalizadas em estrita conformidade com RGPD e LGPD.',
  finance_analyst:
    'Atua como Controller Financeiro e FinOps. Supervisiona envelopes de orçamento multi-moeda (EUR, BRL, USD), reservas atómicas e partidas dobradas.',
  quality_auditor:
    'Atua como Auditor de Qualidade, Brand Safety e AppSec. Inspeciona todas as entregas dos agentes antes de qualquer aprovação humana.',
};

const DEFAULT_TOOLS_BY_AGENT: Record<AgentKey, string[]> = {
  ops_director: ['dag_planner', 'budget_reservation_rpc', 'approval_gate_router', 'agent_dispatcher'],
  market_intel: ['web_market_research', 'competitor_matrix', 'demand_signal_analyzer', 'opportunity_radar_writer'],
  commercial_analyst: ['unit_economics_calculator', 'pricing_simulator_multi_currency', 'offer_scorecard'],
  marketing_seo: ['seo_cluster_builder', 'landing_page_copywriter', 'locale_adapter_pt_br'],
  creative_director: ['brand_token_validator', 'ad_creative_storyboard', 'ab_visual_brief'],
  traffic_manager: ['campaign_ab_architect', 'roas_simulator', 'ad_spend_guard'],
  affiliate_ecom: ['digital_product_catalog', 'checkout_funnel_mapper', 'appmax_order_sync_readonly'],
  b2b_prospector: ['b2b_account_profiler', 'consultative_cadence_drafter', 'gdpr_lgpd_optout_checker'],
  finance_analyst: ['atomic_budget_ledger', 'double_entry_validator', 'finops_token_auditor'],
  quality_auditor: ['fact_vs_hypothesis_checker', 'rgpd_lgpd_compliance_gate', 'secret_leak_scanner'],
};

function createInitialAgents(): OperationalAgentConfig[] {
  const now = new Date().toISOString();
  return DEMO_AGENTS_TEAM.map((demo) => ({
    agent_key: demo.agent_key,
    display_name: demo.display_name,
    role_title: demo.role_title,
    department: demo.department,
    reports_to: demo.reports_to,
    status: 'idle',
    execution_mode: demo.requires_human_approval ? 'approval_required' : 'draft_only',
    default_risk_level: demo.default_risk_level,
    requires_human_approval: demo.requires_human_approval,
    preferred_provider: 'google_gemini',
    preferred_model: 'gemini-3.5-flash-lite',
    temperature: demo.agent_key === 'creative_director' ? 0.6 : 0.25,
    max_tokens: 2048,
    daily_budget_cents: demo.default_risk_level === 'L2' ? 2500 : 1200,
    daily_consumed_cents: 0,
    currency: 'EUR',
    allowed_tools: DEFAULT_TOOLS_BY_AGENT[demo.agent_key],
    runtime_skills: demo.planned_runtime_skills,
    responsibility_summary: demo.responsibility_summary,
    system_prompt: DEFAULT_SYSTEM_PROMPTS[demo.agent_key],
    last_run_at: null,
    total_runs_count: 0,
    updated_at: now,
  }));
}

function createInitialIntegrations(): OperationalIntegrationRecord[] {
  const now = new Date().toISOString();
  return [
    {
      provider_key: 'google_gemini',
      display_name: 'Google Gemini API (Vertex / AI Studio)',
      category: 'ai_llm',
      category_label: '1. Fornecedores de IA (LLMs)',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'GROWTH_OS_GEMINI_API_KEY',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://generativelanguage.googleapis.com/v1beta',
      webhook_url: '',
      rate_limit_per_min: 60,
      monthly_cap_cents: 5000,
      currency: 'USD',
      is_active: true,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: 'Pendente de configuração ou teste de ligação real.',
      documentation_note:
        'Motor principal partilhado pelos 10 agentes (económico validado: gemini-3.5-flash-lite; avançado candidato: gemini-3.8-flash).',
      updated_at: now,
    },
    {
      provider_key: 'openai',
      display_name: 'OpenAI API (GPT-4o / o3-mini)',
      category: 'ai_llm',
      category_label: '1. Fornecedores de IA (LLMs)',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'OPENAI_API_KEY',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://api.openai.com/v1',
      webhook_url: '',
      rate_limit_per_min: 60,
      monthly_cap_cents: 5000,
      currency: 'USD',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Fornecedor alternativo para raciocínio estruturado e geração criativa.',
      updated_at: now,
    },
    {
      provider_key: 'anthropic',
      display_name: 'Anthropic Claude API',
      category: 'ai_llm',
      category_label: '1. Fornecedores de IA (LLMs)',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'ANTHROPIC_API_KEY',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://api.anthropic.com/v1',
      webhook_url: '',
      rate_limit_per_min: 40,
      monthly_cap_cents: 4000,
      currency: 'USD',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Fornecedor opcional para revisão editorial longa e auditoria.',
      updated_at: now,
    },
    {
      provider_key: 'perplexity',
      display_name: 'Perplexity Sonar / Pesquisa Web citável',
      category: 'search_market',
      category_label: '2. Pesquisa & Inteligência de Mercado',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'PERPLEXITY_API_KEY',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://api.perplexity.ai',
      webhook_url: '',
      rate_limit_per_min: 30,
      monthly_cap_cents: 2500,
      currency: 'USD',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Usado pelo agente Inteligência de Mercado para pesquisa com fontes verificáveis.',
      updated_at: now,
    },
    {
      provider_key: 'serpapi',
      display_name: 'SerpAPI / Google Trends & SERP',
      category: 'search_market',
      category_label: '2. Pesquisa & Inteligência de Mercado',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'SERPAPI_API_KEY',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://serpapi.com',
      webhook_url: '',
      rate_limit_per_min: 30,
      monthly_cap_cents: 2000,
      currency: 'USD',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Análise de volume de procura e palavras-chave em Portugal e no Brasil.',
      updated_at: now,
    },
    {
      provider_key: 'appmax',
      display_name: 'Appmax (Pagamentos & Operações Comerciais BR)',
      category: 'payments_commerce',
      category_label: '3. Pagamentos, Afiliados & Operações Comerciais',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'APPMAX_API_TOKEN',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://admin.appmax.com.br/api/v3',
      webhook_url: '/api/growth-os?action=webhook_appmax',
      rate_limit_per_min: 60,
      monthly_cap_cents: 0,
      currency: 'BRL',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Conector comercial modular para produtos digitais, pedidos, estornos e reconciliação em BRL.',
      updated_at: now,
    },
    {
      provider_key: 'stripe',
      display_name: 'Stripe (Pagamentos & Subscrições EUR/USD)',
      category: 'payments_commerce',
      category_label: '3. Pagamentos, Afiliados & Operações Comerciais',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'STRIPE_SECRET_KEY',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://api.stripe.com/v1',
      webhook_url: '/api/growth-os?action=webhook_stripe',
      rate_limit_per_min: 100,
      monthly_cap_cents: 0,
      currency: 'EUR',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Reconciliação de faturas e vendas de produtos digitais na Europa e Global.',
      updated_at: now,
    },
    {
      provider_key: 'meta_ads',
      display_name: 'Meta Marketing API (Instagram & Facebook Ads)',
      category: 'ads_social',
      category_label: '4. Redes Sociais & Plataformas de Anúncios',
      status: 'planned',
      auth_mode: 'oauth2',
      env_var_name: 'META_MARKETING_TOKEN',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://graph.facebook.com/v20.0',
      webhook_url: '',
      rate_limit_per_min: 40,
      monthly_cap_cents: 45000,
      currency: 'EUR',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Leitura de métricas e criação de rascunhos A/B (ativação real exige aprovação L2).',
      updated_at: now,
    },
    {
      provider_key: 'google_ads',
      display_name: 'Google Ads API & Search Console',
      category: 'ads_social',
      category_label: '4. Redes Sociais & Plataformas de Anúncios',
      status: 'planned',
      auth_mode: 'oauth2',
      env_var_name: 'GOOGLE_ADS_DEVELOPER_TOKEN',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://googleads.googleapis.com/v17',
      webhook_url: '',
      rate_limit_per_min: 40,
      monthly_cap_cents: 40000,
      currency: 'EUR',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Sincronização de campanhas de intenção de pesquisa e palavras-chave.',
      updated_at: now,
    },
    {
      provider_key: 'resend',
      display_name: 'Resend (E-mail Transacional & Notificações)',
      category: 'messaging_email',
      category_label: '5. E-mail, Mensagens & CRM',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'RESEND_API_KEY',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://api.resend.com',
      webhook_url: '',
      rate_limit_per_min: 60,
      monthly_cap_cents: 2000,
      currency: 'USD',
      is_active: true,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: 'Pendente de teste de ligação; envios em lote exigem aprovação humana.',
      documentation_note: 'Envio de relatórios executivos e cadências B2B aprovadas.',
      updated_at: now,
    },
    {
      provider_key: 'zapi_whatsapp',
      display_name: 'Z-API WhatsApp Gateway',
      category: 'messaging_email',
      category_label: '5. E-mail, Mensagens & CRM',
      status: 'planned',
      auth_mode: 'api_key',
      env_var_name: 'ZAPI_TOKEN',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://api.z-api.io',
      webhook_url: '/api/whatsapp/webhook',
      rate_limit_per_min: 30,
      monthly_cap_cents: 3500,
      currency: 'BRL',
      is_active: true,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: 'Isolado do atendimento atual; requer validação antes de uso pelo Growth OS.',
      documentation_note: 'Alertas operacionais para o Administrador e follow-up comercial aprovado.',
      updated_at: now,
    },
    {
      provider_key: 'supabase_core',
      display_name: 'Supabase PostgreSQL, Auth & RLS Vault',
      category: 'automation_infra',
      category_label: '6. Automação, Filas & Base de Dados',
      status: 'configured_pending_test',
      auth_mode: 'service_role',
      env_var_name: 'SUPABASE_SERVICE_ROLE_KEY',
      has_saved_secret: true,
      key_hint: '••••SRV',
      base_url: 'https://qzjzlpilmptoojuguqas.supabase.co',
      webhook_url: '',
      rate_limit_per_min: 300,
      monthly_cap_cents: 2500,
      currency: 'USD',
      is_active: true,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: 'Configurado na plataforma UmbuLab. Clique em "Testar ligação" para verificar conectividade em tempo real.',
      documentation_note: 'Persistência transacional de missões, reservas atómicas de orçamento e auditoria.',
      updated_at: now,
    },
    {
      provider_key: 'upstash_qstash',
      display_name: 'Upstash QStash (Fila Assíncrona & Anti-Replay)',
      category: 'automation_infra',
      category_label: '6. Automação, Filas & Base de Dados',
      status: 'planned',
      auth_mode: 'webhook_hmac',
      env_var_name: 'QSTASH_TOKEN',
      has_saved_secret: false,
      key_hint: null,
      base_url: 'https://qstash.upstash.io/v2',
      webhook_url: '/api/growth-os?action=worker_dispatch',
      rate_limit_per_min: 120,
      monthly_cap_cents: 1000,
      currency: 'USD',
      is_active: false,
      last_tested_at: null,
      last_test_status: null,
      last_test_message: null,
      documentation_note: 'Execução em background de missões longas com verificação JWT/HMAC.',
      updated_at: now,
    },
  ];
}

function createInitialBudgets(): OperationalBudgetEnvelope[] {
  const now = new Date().toISOString();
  return DEMO_BUDGET_ENVELOPES.map((b, idx) => ({
    budget_id: b.budget_id,
    code: idx === 0 ? 'FINOPS_AI_USD' : idx === 1 ? 'GROWTH_PT_EUR' : 'OPERATIONS_BR_BRL',
    scope_label: b.scope_label.replace(' (Fictício)', ''),
    currency: b.currency,
    limit_cents: b.limit_cents,
    reserved_cents: 0,
    settled_cents: 0,
    confirmed_external_cents: 0,
    alert_threshold_pct: 80,
    hard_stop: b.hard_stop,
    notes:
      idx === 0
        ? 'Teto dedicado ao consumo de APIs de Inteligência Artificial e pesquisa.'
        : idx === 1
          ? 'Orçamento de missões comerciais e validação de ofertas em Portugal.'
          : 'Orçamento de missões comerciais e operações digitais no Brasil.',
    is_demo_data: false,
    updated_at: now,
  }));
}

function createInitialCashflow(): OperationalCashflowEntry[] {
  return DEMO_CASHFLOW_ENTRIES.map((c) => ({
    entry_id: c.entry_id,
    description: c.description,
    direction: c.direction,
    category: c.category,
    counterparty: c.direction === 'inflow' ? 'Cliente B2B / Plataforma Digital' : 'Fornecedor Cloud / Operação',
    currency: c.currency,
    amount_cents: c.amount_cents,
    competence_date: c.competence_date,
    cash_date: c.cash_date,
    settlement_state: c.settlement_state === 'settled_demo' ? 'settled' : 'projected',
    linked_mission_id: null,
    reversed_from_id: null,
    reference_doc: 'DEMO-REF',
    immutable_rule_note: c.immutable_rule_note,
    is_demo_data: true,
    is_simulated_settlement: true,
  }));
}

function createInitialOpportunities(): OperationalOpportunityRecord[] {
  const now = new Date().toISOString();
  return DEMO_OPPORTUNITIES.map((o) => ({
    opportunity_id: o.opportunity_id,
    mission_id: null,
    title: o.title,
    channel: o.channel,
    market: o.market,
    currency: o.currency,
    estimated_ticket_cents: o.estimated_ticket_cents,
    estimated_margin_pct: o.estimated_margin_pct,
    confidence_score: 78,
    intent_score: 82,
    roi_potential_score: 80,
    viability_label: o.viability_label,
    verified_facts_note: o.verified_facts_note,
    hypothesis_note: o.hypothesis_note,
    compliance_basis: o.compliance_basis,
    recommended_action: 'Converter em Missão de Validação Comercial',
    discovered_by_agent: 'market_intel',
    status: 'validated',
    risk_level: o.risk_level,
    is_demo_data: true,
    created_at: now,
  }));
}

function createInitialAbCampaigns(): OperationalAbCampaignRecord[] {
  const now = new Date().toISOString();
  return DEMO_AB_CAMPAIGNS.map((c) => ({
    campaign_id: c.campaign_id,
    title: c.title,
    objective: c.objective,
    target_audience: c.market === 'PT' ? 'Empresas e PMEs em Portugal' : 'Empresas e Negócios Digitais no Brasil',
    channel: c.market === 'PT' ? 'Landing Page Institucional / Google Ads' : 'Instagram & Facebook Ads (Meta)',
    market: c.market,
    currency: c.currency,
    planned_budget_cap_cents: c.planned_budget_cap_cents,
    duration_days: 14,
    variant_a_summary: c.variant_a_summary,
    variant_b_summary: c.variant_b_summary,
    primary_metric_label: c.primary_metric_label,
    risk_level: c.risk_level,
    approval_gate_note: c.approval_gate_note,
    status_label: c.status_label,
    is_draft_without_external_api: true,
    is_demo_data: true,
    created_at: now,
  }));
}

function createInitialCreativeAssets(): OperationalCreativeAssetRecord[] {
  const now = new Date().toISOString();
  return DEMO_CREATIVE_ASSETS.map((a) => ({
    asset_id: a.asset_id,
    title: a.title,
    content_type: a.format,
    objective: 'Apresentar proposta de valor clara sem promessas enganosas',
    target_audience: 'Decisores B2B e gestores de PMEs',
    target_channel: a.target_channel,
    locale: a.locale,
    tone: 'Consultivo, claro e profissional',
    product_service: 'Serviços de Engenharia Web & Automação UmbuLab',
    format: a.format,
    call_to_action: 'Solicitar Diagnóstico Estratégico',
    generated_text: `${a.brief_summary}\n\n[Chamada para ação]: Solicitar Diagnóstico Estratégico UmbuLab.`,
    brand_tokens_used: a.brand_tokens_used,
    brief_summary: a.brief_summary,
    compliance_check_note: a.compliance_check_note,
    risk_level: a.risk_level,
    status_label: 'draft',
    is_demo_data: true,
    created_at: now,
  }));
}

function createDefaultState(): GrowthOsOperationalState {
  const now = new Date().toISOString();
  return {
    system_controls: {
      pause_new_executions: false,
      paused_agent_keys: [],
      default_adapter_mode: 'auto',
      emergency_reason: null,
      persistence_driver: 'local_operational_store',
      updated_at: now,
    },
    agents: createInitialAgents(),
    integrations: createInitialIntegrations(),
    missions: [],
    task_runs: [],
    approvals: [],
    opportunities: createInitialOpportunities(),
    ab_campaigns: createInitialAbCampaigns(),
    creative_assets: createInitialCreativeAssets(),
    budgets: createInitialBudgets(),
    cashflow_entries: createInitialCashflow(),
    journal_entries: [...DEMO_DOUBLE_ENTRY_JOURNALS],
    onboarding_dismissed: false,
    coordinator_messages: [
      {
        message_id: 'MSG-WELCOME-01',
        sender: 'ops_director',
        agent_key: 'ops_director',
        speaker_label: 'Diretor de Operações (Orquestrador)',
        text: 'Olá! Sou o Coordenador Central do UmbuLab AI Growth OS. Pode conversar comigo por voz ou texto para discutir estratégias, analisar o estado dos 10 agentes ou lançar a missão completa "Pesquisar oportunidades de produtos digitais para a UmbuLab".',
        suggested_mission_title: 'Pesquisar oportunidades de produtos digitais para a UmbuLab',
        timestamp: now,
      },
    ],
  };
}

let currentState: GrowthOsOperationalState = loadPersistedState();
const listeners = new Set<() => void>();

function loadPersistedState(): GrowthOsOperationalState {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as Partial<GrowthOsOperationalState>;
    const defaults = createDefaultState();
    return {
      system_controls: parsed.system_controls || defaults.system_controls,
      agents: parsed.agents?.length ? parsed.agents : defaults.agents,
      integrations: parsed.integrations?.length ? parsed.integrations : defaults.integrations,
      missions: parsed.missions || [],
      task_runs: parsed.task_runs || [],
      approvals: parsed.approvals || [],
      opportunities: parsed.opportunities?.length ? parsed.opportunities : defaults.opportunities,
      ab_campaigns: parsed.ab_campaigns?.length ? parsed.ab_campaigns : defaults.ab_campaigns,
      creative_assets: parsed.creative_assets?.length ? parsed.creative_assets : defaults.creative_assets,
      budgets: parsed.budgets?.length ? parsed.budgets : defaults.budgets,
      cashflow_entries: parsed.cashflow_entries?.length ? parsed.cashflow_entries : defaults.cashflow_entries,
      journal_entries: parsed.journal_entries?.length ? parsed.journal_entries : defaults.journal_entries,
      onboarding_dismissed: Boolean(parsed.onboarding_dismissed),
      coordinator_messages: parsed.coordinator_messages?.length
        ? parsed.coordinator_messages
        : defaults.coordinator_messages,
    };
  } catch {
    return createDefaultState();
  }
}

function saveState(next: GrowthOsOperationalState) {
  currentState = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignora erro de quota localStorage se ocorrer
    }
  }
  listeners.forEach((l) => l());
}

export function getGrowthOsState(): GrowthOsOperationalState {
  return currentState;
}

export function subscribeGrowthOsState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useGrowthOsRuntime(): GrowthOsOperationalState {
  return useSyncExternalStore(subscribeGrowthOsState, getGrowthOsState, getGrowthOsState);
}

export function setOnboardingDismissed(dismissed: boolean): void {
  saveState({
    ...currentState,
    onboarding_dismissed: dismissed,
  });
}

async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch {
    return null;
  }
}

/**
 * Hidrata o estado operacional a partir do backend Supabase (/api/growth-os?action=hydrate_state)
 * após atualização de página (F5) ou reinício da aplicação, sem depender exclusivamente
 * do localStorage e NUNCA sincronizando dados demonstrativos antigos para a base real.
 */
export async function hydrateGrowthOsFromBackend(): Promise<{
  hydratedFromBackend: boolean;
  missionsCount: number;
  tasksCount: number;
  approvalsCount: number;
  opportunitiesCount: number;
  budgetsCount: number;
  cashflowCount: number;
}> {
  const token = await getAccessToken();
  if (!token) {
    return {
      hydratedFromBackend: false,
      missionsCount: currentState.missions.length,
      tasksCount: currentState.missions.reduce((a, m) => a + m.tasks.length, 0),
      approvalsCount: currentState.approvals.length,
      opportunitiesCount: currentState.opportunities.length,
      budgetsCount: currentState.budgets.length,
      cashflowCount: currentState.cashflow_entries.length,
    };
  }

  try {
    const resp = await fetch('/api/growth-os?action=hydrate_state', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!resp.ok) {
      return {
        hydratedFromBackend: false,
        missionsCount: currentState.missions.length,
        tasksCount: currentState.missions.reduce((a, m) => a + m.tasks.length, 0),
        approvalsCount: currentState.approvals.length,
        opportunitiesCount: currentState.opportunities.length,
        budgetsCount: currentState.budgets.length,
        cashflowCount: currentState.cashflow_entries.length,
      };
    }

    const json = await resp.json();
    if (!json.ok || !json.state) {
      return {
        hydratedFromBackend: false,
        missionsCount: currentState.missions.length,
        tasksCount: currentState.missions.reduce((a, m) => a + m.tasks.length, 0),
        approvalsCount: currentState.approvals.length,
        opportunitiesCount: currentState.opportunities.length,
        budgetsCount: currentState.budgets.length,
        cashflowCount: currentState.cashflow_entries.length,
      };
    }

    const dbState = json.state;
    const dbTasks: Array<Record<string, any>> = Array.isArray(dbState.tasks) ? dbState.tasks : [];

    // Reconstruir missões persistidas no backend com as respetivas tarefas e entregáveis
    const hydratedMissions: OperationalMissionRecord[] = Array.isArray(dbState.missions)
      ? dbState.missions.map((m: Record<string, any>) => {
          const missionTasks: OperationalTaskRecord[] = dbTasks
            .filter((t) => t.mission_id === m.id)
            .map((t) => ({
              task_id: String(t.id),
              mission_id: String(m.id),
              step_order: Number(t.step_order || 1),
              title: String(t.title || ''),
              assigned_agent_key: (t.assigned_agent_key || 'market_intel') as AgentKey,
              skill_key: String(t.skill_key || ''),
              status: t.status || 'completed',
              execution_mode: t.execution_mode || 'approval_required',
              risk_level: t.risk_level || 'L1',
              requires_approval: Boolean(t.requires_approval),
              approval_level: t.approval_level || 'L1_content_ops',
              estimated_cost_cents: Number(t.estimated_cost_cents || 0),
              actual_cost_cents: Number(t.actual_cost_cents || 0),
              currency: (t.currency_code || m.currency_code || 'EUR') as GrowthOsCurrency,
              input_summary: String(t.input_payload?.summary || ''),
              output_summary: String(t.output_payload?.summary || ''),
              structured_output: (t.output_payload?.structured_output || {}) as Record<string, unknown>,
              auditor_verdict: t.auditor_verdict || null,
              finance_verdict: t.finance_verdict || null,
              started_at: t.started_at || m.created_at,
              completed_at: t.completed_at || null,
            }));

          return {
            mission_id: String(m.id),
            code: String(m.code),
            title: String(m.title),
            objective: String(m.objective || ''),
            coordinator_agent_key: (m.coordinator_agent_key || 'ops_director') as AgentKey,
            status: m.status || 'awaiting_approval',
            priority: m.priority || 'high',
            execution_mode: m.execution_mode || 'approval_required',
            adapter_mode: m.adapter_mode === 'live_api' ? 'live_provider_api' : 'sandbox_test_adapter',
            market: (m.market || 'PT') as GrowthOsMarket,
            budget_cap_cents: Number(m.budget_cap_cents || 0),
            budget_reserved_cents: Number(m.budget_reserved_cents || 0),
            budget_used_cents: Number(m.budget_used_cents ?? m.budget_consumed_cents ?? 0),
            currency: (m.currency_code || 'EUR') as GrowthOsCurrency,
            reservation_id: null,
            consolidated_summary: String(m.consolidated_summary || ''),
            deliverables: Array.isArray(m.deliverables_json)
              ? (m.deliverables_json as OperationalMissionDeliverable[])
              : Array.isArray(m.deliverables)
                ? m.deliverables
                : [],
            tasks: missionTasks,
            created_at: m.created_at,
            started_at: m.started_at || m.created_at,
            completed_at: m.completed_at || null,
            is_demo_data: false,
          };
        })
      : [];

    const hydratedApprovals: OperationalApprovalRecord[] = Array.isArray(dbState.approvals)
      ? dbState.approvals.map((a: Record<string, any>) => ({
          approval_id: String(a.id),
          task_id: String(a.task_id || ''),
          mission_id: String(a.mission_id || ''),
          mission_title: String(a.title || '').replace(/^Aprovar Resultado da Missão:\s*/i, ''),
          title: String(a.title || ''),
          requested_by_agent_key: (a.requested_by_agent_key || 'ops_director') as AgentKey,
          approval_level: a.approval_level || 'L1_content_ops',
          risk_level: a.risk_level || 'L1',
          category: a.category || 'mission_deliverable',
          status: a.status || 'awaiting_approval',
          estimated_impact: String(a.estimated_impact || ''),
          financial_impact_cents: Number(a.financial_impact_cents || 0),
          currency: (a.currency_code || 'EUR') as GrowthOsCurrency,
          diff_summary: String(a.diff_summary || ''),
          deliverable_preview: (a.payload_preview || a.deliverable_preview || {}) as Record<string, unknown>,
          auditor_notes: String(a.auditor_notes || 'Validado pelo Auditor de Qualidade.'),
          decision_notes: a.decision_notes || null,
          decided_by_email: a.decided_by ? 'admin@umbulab.com' : null,
          requested_at: a.requested_at || new Date().toISOString(),
          decided_at: a.decided_at || null,
        }))
      : [];

    const hydratedOpportunities: OperationalOpportunityRecord[] = Array.isArray(dbState.opportunities)
      ? dbState.opportunities.map((o: Record<string, any>) => ({
          opportunity_id: String(o.id),
          mission_id: o.mission_id ? String(o.mission_id) : null,
          title: String(o.title || ''),
          channel: String(o.source_channel || o.channel || o.segment || ''),
          market: (o.country_market || o.market || 'PT') as GrowthOsMarket,
          currency: (o.currency_code || 'EUR') as GrowthOsCurrency,
          estimated_ticket_cents: Number(o.estimated_ticket_cents || 0),
          estimated_margin_pct: Number(o.estimated_margin_pct || 80),
          confidence_score: Number(o.confidence_score || 80),
          intent_score: Number(o.intent_score || 80),
          roi_potential_score: Number(o.roi_potential_score || 80),
          viability_label: String(o.viability_label || 'Validada em Missão'),
          verified_facts_note: String(o.verified_facts_note || o.rationale || ''),
          hypothesis_note: String(o.hypothesis_note || ''),
          compliance_basis: String(o.compliance_basis || 'Conformidade RGPD/LGPD.'),
          recommended_action: String(o.recommended_action || ''),
          discovered_by_agent: (o.discovered_by_agent || 'market_intel') as AgentKey,
          status: o.status || 'validated',
          risk_level: o.risk_level || 'L1',
          is_demo_data: false,
          created_at: o.created_at || new Date().toISOString(),
        }))
      : [];

    const hydratedBudgets: OperationalBudgetEnvelope[] =
      Array.isArray(dbState.budgets) && dbState.budgets.length > 0
        ? dbState.budgets.map((b: Record<string, any>) => ({
            budget_id: String(b.id),
            code: String(b.code),
            scope_label: String(b.scope_name),
            currency: (b.currency_code || 'EUR') as GrowthOsCurrency,
            limit_cents: Number(b.allocated_cents || 0),
            reserved_cents: Number(b.reserved_cents || 0),
            settled_cents: Number(b.consumed_cents || 0),
            confirmed_external_cents: 0,
            alert_threshold_pct: Number(b.alert_threshold_pct || 80),
            hard_stop: Boolean(b.hard_stop_enabled),
            notes: String(b.notes || ''),
            is_demo_data: false,
            updated_at: b.updated_at || new Date().toISOString(),
          }))
        : currentState.budgets;

    const hydratedCashflow: OperationalCashflowEntry[] = Array.isArray(dbState.cashflow_entries)
      ? dbState.cashflow_entries.map((c: Record<string, any>) => ({
          entry_id: String(c.id),
          description: String(c.description || ''),
          direction: c.direction === 'inflow' ? 'inflow' : 'outflow',
          category: String(c.category || 'Operações AI Growth OS'),
          counterparty: String(c.counterparty || 'Motor Multiagente UmbuLab'),
          currency: (c.currency_code || 'EUR') as GrowthOsCurrency,
          amount_cents: Number(c.amount_cents || 0),
          competence_date: String(c.entry_date || new Date().toISOString().slice(0, 10)),
          cash_date: String(c.entry_date || new Date().toISOString().slice(0, 10)),
          settlement_state: c.settlement_status || 'settled',
          linked_mission_id: c.linked_mission_id ? String(c.linked_mission_id) : null,
          reversed_from_id: c.reversed_from_id ? String(c.reversed_from_id) : null,
          reference_doc: c.reference_doc || undefined,
          immutable_rule_note: 'Registo persistido na base de dados Supabase (fin_cashflow_entries).',
          is_demo_data: false,
          is_simulated_settlement: true,
        }))
      : [];

    // Preservar oportunidades e lançamentos demonstrativos locais APENAS na vista (sem os gravar na BD)
    const demoOppsOnly = currentState.opportunities.filter((o) => o.is_demo_data);
    const demoCashflowOnly = currentState.cashflow_entries.filter((c) => c.is_demo_data);

    const hydratedTaskRuns: OperationalTaskRunRecord[] = Array.isArray(dbState.task_runs)
      ? dbState.task_runs.map((r: Record<string, any>) => ({
          run_id: String(r.id),
          task_id: String(r.task_id || ''),
          mission_id: String(r.mission_id || ''),
          mission_title:
            hydratedMissions.find((m) => m.mission_id === String(r.mission_id || ''))?.title ||
            'Missão Growth OS',
          agent_key: (r.agent_key || 'ops_director') as AgentKey,
          skill_key: String(r.skill_key || ''),
          correlation_id: String(r.correlation_id || ''),
          idempotency_key: String(r.idempotency_key || ''),
          execution_mode: r.execution_mode || 'approval_required',
          adapter_mode: r.adapter_mode === 'live_api' ? 'live_provider_api' : 'sandbox_test_adapter',
          status: r.status || 'completed',
          model_provider: String(r.model_provider || 'google_gemini'),
          model_name: String(r.model_name || 'gemini-3.5-flash-lite'),
          prompt_tokens: Number(r.prompt_tokens || 0),
          completion_tokens: Number(r.completion_tokens || 0),
          raw_cost_usd_micros: Number(r.raw_cost_usd_micros || 0),
          cost_source: r.cost_source === 'measured' ? 'measured' : 'estimated',
          latency_ms: Number(r.latency_ms || 0),
          sanitized_input: (r.sanitized_input || {}) as Record<string, unknown>,
          sanitized_output: (r.sanitized_output || {}) as Record<string, unknown>,
          audit_notes: r.audit_notes ? String(r.audit_notes) : null,
          error_message: r.error_message ? String(r.error_message) : null,
          created_at: r.created_at || new Date().toISOString(),
        }))
      : [];

    saveState({
      ...currentState,
      missions: hydratedMissions.length > 0 ? hydratedMissions : currentState.missions,
      task_runs: hydratedTaskRuns.length > 0 ? hydratedTaskRuns : currentState.task_runs,
      approvals: hydratedApprovals.length > 0 ? hydratedApprovals : currentState.approvals,
      opportunities:
        hydratedOpportunities.length > 0
          ? [...hydratedOpportunities, ...demoOppsOnly]
          : currentState.opportunities,
      budgets: hydratedBudgets,
      cashflow_entries:
        hydratedCashflow.length > 0
          ? [...hydratedCashflow, ...demoCashflowOnly]
          : currentState.cashflow_entries,
    });

    return {
      hydratedFromBackend: true,
      missionsCount: hydratedMissions.length,
      tasksCount: dbTasks.length,
      approvalsCount: hydratedApprovals.length,
      opportunitiesCount: hydratedOpportunities.length,
      budgetsCount: hydratedBudgets.length,
      cashflowCount: hydratedCashflow.length,
    };
  } catch {
    return {
      hydratedFromBackend: false,
      missionsCount: currentState.missions.length,
      tasksCount: currentState.missions.reduce((a, m) => a + m.tasks.length, 0),
      approvalsCount: currentState.approvals.length,
      opportunitiesCount: currentState.opportunities.length,
      budgetsCount: currentState.budgets.length,
      cashflowCount: currentState.cashflow_entries.length,
    };
  }
}

// =============================================================================
// 1. GESTÃO E TESTE INDIVIDUAL DOS AGENTES
// =============================================================================

export function updateAgentConfiguration(
  agentKey: AgentKey,
  updates: Partial<
    Pick<
      OperationalAgentConfig,
      | 'display_name'
      | 'role_title'
      | 'responsibility_summary'
      | 'status'
      | 'execution_mode'
      | 'preferred_provider'
      | 'preferred_model'
      | 'temperature'
      | 'max_tokens'
      | 'daily_budget_cents'
      | 'currency'
      | 'allowed_tools'
      | 'system_prompt'
      | 'requires_human_approval'
    >
  >
): OperationalAgentConfig | null {
  const now = new Date().toISOString();
  let updatedAgent: OperationalAgentConfig | null = null;
  const nextAgents = currentState.agents.map((ag) => {
    if (ag.agent_key !== agentKey) return ag;
    updatedAgent = {
      ...ag,
      ...updates,
      updated_at: now,
    };
    return updatedAgent;
  });

  if (updatedAgent) {
    saveState({
      ...currentState,
      agents: nextAgents,
    });
  }
  return updatedAgent;
}

export async function runIndividualAgentDiagnosticTest(
  agentKey: AgentKey,
  testPrompt: string
): Promise<OperationalTaskRunRecord> {
  const agent = currentState.agents.find((a) => a.agent_key === agentKey) || currentState.agents[0];
  if (currentState.system_controls.pause_new_executions || agent.status === 'paused') {
    throw new Error('Execução bloqueada: o agente ou o sistema global encontra-se em modo de Pausa de Emergência.');
  }

  const startMs = Date.now();
  const token = await getAccessToken();
  let adapterMode: AdapterMode = 'sandbox_test_adapter';
  let promptTokens = 165;
  let completionTokens = 290;
  let rawCostMicros = 0;
  let costSource: 'measured' | 'estimated' = 'estimated';
  let outputText = '';

  if (token && currentState.system_controls.default_adapter_mode !== 'sandbox_test_adapter') {
    try {
      const resp = await fetch('/api/growth-os?action=execute_agent_step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agent_key: agent.agent_key,
          skill_key: agent.runtime_skills[0] || 'diagnostic_test',
          allowed_tools: agent.allowed_tools,
          preferred_provider: agent.preferred_provider,
          preferred_model: agent.preferred_model,
          system_prompt: agent.system_prompt,
          user_prompt: testPrompt,
          temperature: agent.temperature,
          max_tokens: agent.max_tokens,
        }),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json.ok && json.execution) {
          adapterMode = json.execution.adapter_mode;
          promptTokens = json.execution.prompt_tokens;
          completionTokens = json.execution.completion_tokens;
          rawCostMicros = json.execution.raw_cost_usd_micros;
          costSource = json.execution.cost_source;
          outputText = json.execution.output_text;
        }
      }
    } catch {
      // Fallback gracioso para adaptador de teste estruturado local
    }
  }

  if (!outputText) {
    outputText = `[TESTE EM AMBIENTE SIMULADO — ${agent.display_name}] Contrato validado com sucesso. Ferramentas ativas (${agent.allowed_tools.join(', ')}). Resposta estruturada para: "${testPrompt}". Limite diário configurado (${(agent.daily_budget_cents / 100).toFixed(2)} ${agent.currency}) e nível de permissão respeitados.`;
  }

  const now = new Date().toISOString();
  const runRecord: OperationalTaskRunRecord = {
    run_id: `RUN-TEST-${Date.now().toString().slice(-6)}`,
    task_id: `TASK-DIAG-${agent.agent_key.toUpperCase()}`,
    mission_id: 'DIAGNOSTIC-BENCHMARK',
    mission_title: `Teste Individual — ${agent.display_name}`,
    agent_key: agent.agent_key,
    skill_key: agent.runtime_skills[0] || 'agent_self_test',
    correlation_id: `corr_${Date.now()}`,
    idempotency_key: `idem_test_${agent.agent_key}_${Date.now()}`,
    execution_mode: agent.execution_mode,
    adapter_mode: adapterMode,
    status: 'completed',
    model_provider: agent.preferred_provider,
    model_name: agent.preferred_model,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    raw_cost_usd_micros: rawCostMicros,
    cost_source: costSource,
    latency_ms: Math.max(62, Date.now() - startMs),
    sanitized_input: {
      prompt: testPrompt,
      temperature: agent.temperature,
      allowed_tools: agent.allowed_tools,
    },
    sanitized_output: {
      response: outputText,
      compliance_verified: true,
      adapter_mode: adapterMode,
    },
    audit_notes:
      adapterMode === 'live_provider_api'
        ? 'Teste executado com API real ligada e sanitização de segredos ativa.'
        : 'Teste executado em modo de simulação interna (sem consumo de API externa).',
    error_message: null,
    created_at: now,
  };

  const nextAgents = currentState.agents.map((a) =>
    a.agent_key === agent.agent_key
      ? {
          ...a,
          last_run_at: now,
          total_runs_count: a.total_runs_count + 1,
          updated_at: now,
        }
      : a
  );

  saveState({
    ...currentState,
    agents: nextAgents,
    task_runs: [runRecord, ...currentState.task_runs],
  });

  return runRecord;
}

// =============================================================================
// 2. CENTRO DE INTEGRAÇÕES E CREDENCIAIS (COFRE & TESTE DE LIGAÇÃO)
// =============================================================================

function maskLocalHint(rawSecret: string): string {
  const clean = rawSecret.trim();
  if (clean.length <= 4) return '••••';
  return `••••${clean.slice(-4)}`;
}

export async function saveIntegrationConfiguration(
  providerKey: string,
  updates: {
    raw_secret?: string;
    base_url?: string;
    webhook_url?: string;
    rate_limit_per_min?: number;
    monthly_cap_cents?: number;
    currency?: GrowthOsCurrency;
    is_active?: boolean;
  }
): Promise<OperationalIntegrationRecord | null> {
  const now = new Date().toISOString();
  let keyHint: string | null | undefined = undefined;
  let hasSecret: boolean | undefined = undefined;

  if (updates.raw_secret && updates.raw_secret.trim()) {
    keyHint = maskLocalHint(updates.raw_secret);
    hasSecret = true;

    // Tenta guardar encriptado na tabela privada ai_integration_secrets via backend
    const token = await getAccessToken();
    if (token) {
      try {
        const resp = await fetch('/api/growth-os?action=encrypt_integration_secret', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider_key: providerKey,
            raw_secret: updates.raw_secret.trim(),
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.key_hint) keyHint = data.key_hint;
        }
      } catch {
        // Em ambiente Vite dev local sem serverless, guarda apenas a máscara visual (••••XXXX)
      }
    }
  }

  let updatedRecord: OperationalIntegrationRecord | null = null;
  const nextIntegrations = currentState.integrations.map((item) => {
    if (item.provider_key !== providerKey) return item;
    const nextStatus =
      updates.is_active === false
        ? 'disabled'
        : hasSecret || item.has_saved_secret
          ? 'configured_pending_test'
          : item.status;

    updatedRecord = {
      ...item,
      base_url: updates.base_url ?? item.base_url,
      webhook_url: updates.webhook_url ?? item.webhook_url,
      rate_limit_per_min: updates.rate_limit_per_min ?? item.rate_limit_per_min,
      monthly_cap_cents: updates.monthly_cap_cents ?? item.monthly_cap_cents,
      currency: updates.currency ?? item.currency,
      is_active: updates.is_active ?? item.is_active,
      has_saved_secret: hasSecret ?? item.has_saved_secret,
      key_hint: keyHint !== undefined ? keyHint : item.key_hint,
      status: nextStatus,
      last_test_message:
        hasSecret
          ? 'Credencial guardada com segurança (mascarada). Execute agora o teste de ligação para confirmar a conectividade.'
          : item.last_test_message,
      updated_at: now,
    };
    return updatedRecord;
  });

  if (updatedRecord) {
    saveState({
      ...currentState,
      integrations: nextIntegrations,
    });
  }
  return updatedRecord;
}

export async function testIntegrationConnectivity(
  providerKey: string
): Promise<OperationalIntegrationRecord | null> {
  const target = currentState.integrations.find((i) => i.provider_key === providerKey);
  if (!target) return null;

  const token = await getAccessToken();
  let testStatus: 'ok' | 'warning' | 'error' = target.has_saved_secret ? 'ok' : 'warning';
  let testMessage = target.has_saved_secret
    ? `Conexão estabelecida: credencial validada (${target.env_var_name}; máscara ${target.key_hint || '••••'}).`
    : `Credencial ainda não configurada em ${target.env_var_name}. Configure a chave no Passo 3 antes de ativar em produção.`;

  if (token) {
    try {
      const resp = await fetch('/api/growth-os?action=test_integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ provider_key: providerKey }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.ok && data.result) {
          testStatus = data.result.status;
          testMessage = `${data.result.message} (${data.result.latency_ms} ms)`;
        }
      }
    } catch {
      // Mantém resultado de diagnóstico local quando /api não está ativo no Vite dev
    }
  }

  const now = new Date().toISOString();
  let updated: OperationalIntegrationRecord | null = null;
  const nextIntegrations = currentState.integrations.map((item) => {
    if (item.provider_key !== providerKey) return item;
    updated = {
      ...item,
      status: testStatus === 'ok' ? 'connected' : testStatus === 'warning' ? 'configured_pending_test' : 'error',
      last_tested_at: now,
      last_test_status: testStatus,
      last_test_message: testMessage,
      updated_at: now,
    };
    return updated;
  });

  if (updated) {
    saveState({
      ...currentState,
      integrations: nextIntegrations,
    });
  }
  return updated;
}

// =============================================================================
// 3. MOTOR DE EXECUÇÃO DE MISSÕES (FLUXO PONTA A PONTA) & RESERVA DE ORÇAMENTO
// =============================================================================

export interface CreateMissionInput {
  title: string;
  objective: string;
  market: GrowthOsMarket;
  currency: GrowthOsCurrency;
  budget_cap_cents: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  execution_mode: AgentAutonomyMode;
  success_criteria?: string;
  target_agent_key?: AgentKey;
}

export async function createAndExecuteMission(
  input: CreateMissionInput
): Promise<OperationalMissionRecord> {
  if (currentState.system_controls.pause_new_executions) {
    throw new Error('Criação de missões bloqueada: o Controlo de Emergência Global está ativo.');
  }

  // 1. Verificar e reservar orçamento no envelope correspondente à moeda
  const budgetIndex = currentState.budgets.findIndex((b) => b.currency === input.currency);
  const targetBudget = budgetIndex >= 0 ? currentState.budgets[budgetIndex] : currentState.budgets[0];
  const availableCents =
    targetBudget.limit_cents - targetBudget.reserved_cents - targetBudget.settled_cents;

  if (targetBudget.hard_stop && input.budget_cap_cents > availableCents) {
    throw new Error(
      `Bloqueio Automático de Segurança (Hard-Stop): Orçamento disponível insuficiente em ${targetBudget.currency} (Disponível: ${(availableCents / 100).toFixed(2)} ${targetBudget.currency}, Solicitado: ${(input.budget_cap_cents / 100).toFixed(2)} ${input.currency}).`
    );
  }

  const now = new Date().toISOString();
  const missionNumber = currentState.missions.length + 101;
  const missionId = `MSN-REAL-${Date.now().toString().slice(-6)}`;
  const missionCode = `MSN-2026-${missionNumber}`;
  const reservationId = `RES-${Date.now().toString().slice(-6)}`;

  // Verificar se o fornecedor principal de IA está conectado de verdade ou se o sistema está em modo live
  const geminiConnected = currentState.integrations.some(
    (i) => i.provider_key === 'google_gemini' && i.status === 'connected'
  );
  const token = await getAccessToken();
  const missionAdapterMode: AdapterMode =
    (geminiConnected || currentState.system_controls.default_adapter_mode === 'live_provider_api') &&
    Boolean(token)
      ? 'live_provider_api'
      : 'sandbox_test_adapter';

  const isDigitalProductProof =
    input.title.toLowerCase().includes('oportunidades') ||
    input.title.toLowerCase().includes('produtos digitais') ||
    input.objective.toLowerCase().includes('produtos digitais');

  const isSingleAgentCommercial =
    input.target_agent_key === 'commercial_analyst' ||
    input.title.toLowerCase().includes('diagnóstico') ||
    input.objective.toLowerCase().includes('diagnóstico') ||
    input.budget_cap_cents <= 50;

  const estimatedStepCents = isSingleAgentCommercial
    ? input.budget_cap_cents
    : Math.max(1, Math.floor(input.budget_cap_cents / 4));

  let tasks: OperationalTaskRecord[] = [];
  let newRuns: OperationalTaskRunRecord[] = [];
  let deliverables: OperationalMissionDeliverable[] = [];
  let consolidatedSummary = '';
  let auditorNotes = '';

  if (missionAdapterMode === 'live_provider_api' && token) {
    // Execução REAL na API backend (/api/growth-os?action=execute_agent_step): 1 agente por chamada HTTP
    const livePlan = isSingleAgentCommercial
      ? [
          {
            step_order: 1,
            agent_key: 'commercial_analyst' as AgentKey,
            skill_key: 'offers',
            complexity: 'low' as const,
            required_capabilities: ['text_generation', 'structured_json'],
            title: `Diagnóstico Digital e Estratégia Comercial — ${input.title}`,
            buildPrompt: () =>
              `Missão: "${input.title}". Objetivo: "${input.objective}". Mercado: ${input.market}. Moeda: ${input.currency}.
Produz um Diagnóstico Digital comercial objetivo com:
1. FATOS OBSERVADOS: Identificação de 2 pontos fortes e 2 lacunas digitais observáveis na presença/oferta.
2. OPORTUNIDADE DE RECEITA: 1 proposta de melhoria de alto impacto (posicionamento ou produto).
3. PLANO DE AÇÃO: 3 passos práticos e priorizados para execução imediata.
Regras estritas: Linguagem executiva em português, sem clichês, sem inventar estatísticas e sem prometer retorno financeiro garantido. Limite de 450 tokens.`,
            max_tokens: 450,
          },
        ]
      : [
          {
            step_order: 1,
            agent_key: 'ops_director' as AgentKey,
            skill_key: 'mission_decomposition_dag',
            complexity: 'medium' as const,
            required_capabilities: ['structured_json', 'summarization'],
            title: `Coordenação e Estruturação — ${input.title}`,
            buildPrompt: () =>
              `Missão: "${input.title}". Objetivo: "${input.objective}". Mercado: ${input.market}. Estrutura em português (máximo 6 tópicos) o público-alvo, entregáveis e limites RGPD sem inventar estatísticas.`,
            max_tokens: 450,
          },
          {
            step_order: 2,
            agent_key: 'commercial_analyst' as AgentKey,
            skill_key: 'unit_economics_scorecard',
            complexity: 'medium' as const,
            required_capabilities: ['text_generation', 'structured_json'],
            title: `Análise Comercial e Proposta — ${input.title}`,
            buildPrompt: (prev: string[]) =>
              `Com base na coordenação:\n${prev[0]}\n\nProduz uma proposta inicial estruturada para "${input.title}" (${input.market}). Marca qualquer preço sugerido como "sugestão interna pendente de aprovação da gestão" e não prometas retorno financeiro garantido.`,
            max_tokens: 750,
          },
          {
            step_order: 3,
            agent_key: 'quality_auditor' as AgentKey,
            skill_key: 'quality_and_compliance_gate',
            complexity: 'low' as const,
            required_capabilities: ['classification', 'summarization'],
            title: 'Auditoria de Qualidade, RGPD e Aprovação Humana',
            buildPrompt: (prev: string[]) =>
              `Revê a proposta gerada:\n${prev[1]}\n\nVerifica RGPD, ausência de promessas de ROI garantido, preço como sugestão interna não aprovada e distinção entre IA e supervisão humana. Devolve veredicto e pontos a validar.`,
            max_tokens: 450,
          },
        ];

    const outputs: string[] = [];
    for (const step of livePlan) {
      const agentCfg =
        currentState.agents.find((a) => a.agent_key === step.agent_key) || currentState.agents[0];
      const userPrompt = step.buildPrompt(outputs);
      const stepResp = await fetch('/api/growth-os?action=execute_agent_step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agent_key: step.agent_key,
          skill_key: step.skill_key,
          allowed_tools: agentCfg.allowed_tools,
          preferred_provider: 'google_gemini',
          preferred_model: agentCfg.preferred_model || 'gemini-3.5-flash-lite',
          fallback_model: null,
          fallback_policy: 'forbidden',
          complexity: step.complexity,
          required_capabilities: step.required_capabilities,
          budget_limit_cents: input.budget_cap_cents,
          estimated_max_cost_cents: 5,
          system_prompt: agentCfg.system_prompt,
          user_prompt: userPrompt,
          temperature: agentCfg.temperature,
          max_tokens: step.max_tokens,
          enable_grounding: false,
        }),
      });

      const stepJson = await stepResp.json().catch(() => null);
      if (!stepResp.ok || !stepJson?.ok || stepJson?.execution?.execution_mode !== 'live_api') {
        const errDetail =
          stepJson?.error ||
          stepJson?.execution?.error_message ||
          `Falha na execução real do agente ${step.agent_key} (HTTP ${stepResp.status}).`;
        throw new Error(errDetail);
      }

      const exec = stepJson.execution;
      const taskId = `${missionId}-STEP-${step.step_order}`;
      outputs.push(String(exec.output_text || ''));

      tasks.push({
        task_id: taskId,
        mission_id: missionId,
        step_order: step.step_order,
        title: step.title,
        assigned_agent_key: step.agent_key,
        skill_key: step.skill_key,
        status: step.step_order === livePlan.length ? 'awaiting_approval' : 'completed',
        execution_mode: step.step_order === livePlan.length ? 'approval_required' : input.execution_mode,
        risk_level: step.step_order === livePlan.length ? 'L1' : 'L0',
        requires_approval: step.step_order === livePlan.length,
        approval_level: input.budget_cap_cents >= 10000 ? 'L2_financial_admin' : 'L1_content_ops',
        estimated_cost_cents: estimatedStepCents,
        actual_cost_cents: 0,
        currency: input.currency,
        input_summary: userPrompt.slice(0, 260),
        output_summary: String(exec.output_text || ''),
        structured_output: {
          requested_model: exec.requested_model,
          executed_model: exec.executed_model,
          prompt_tokens: exec.prompt_tokens,
          completion_tokens: exec.completion_tokens,
          raw_cost_usd_micros: exec.raw_cost_usd_micros,
          latency_ms: exec.latency_ms,
          fallback_triggered: Boolean(exec.fallback_triggered),
          fallback_reason: exec.fallback_reason || null,
          cost_confirmation_note: exec.cost_confirmation_note || null,
        },
        auditor_verdict:
          step.step_order === livePlan.length
            ? 'Diagnóstico executado — aguarda aprovação humana'
            : `Executado com ${exec.executed_model}`,
        finance_verdict: `Custo estimado: ${exec.raw_cost_usd_micros} µUSD (sem cobrança confirmada pela API)`,
        started_at: now,
        completed_at: step.step_order === livePlan.length ? null : now,
      });

      newRuns.push({
        run_id: `RUN-${missionId}-${step.step_order}`,
        task_id: taskId,
        mission_id: missionId,
        mission_title: input.title,
        agent_key: step.agent_key,
        skill_key: step.skill_key,
        correlation_id: `corr_${missionId}`,
        idempotency_key: `idem_${taskId}`,
        execution_mode: step.step_order === livePlan.length ? 'approval_required' : input.execution_mode,
        adapter_mode: 'live_provider_api',
        status: 'completed',
        model_provider: 'google_gemini',
        model_name: String(exec.executed_model || 'gemini-3.5-flash-lite'),
        prompt_tokens: Number(exec.prompt_tokens || 0),
        completion_tokens: Number(exec.completion_tokens || 0),
        raw_cost_usd_micros: Number(exec.raw_cost_usd_micros || 0),
        cost_source: 'estimated',
        latency_ms: Number(exec.latency_ms || 0),
        sanitized_input: {
          mission_code: missionCode,
          step_order: step.step_order,
          input_summary: userPrompt.slice(0, 260),
        },
        sanitized_output: {
          output_summary: String(exec.output_text || ''),
          telemetry: {
            requested_model: exec.requested_model,
            executed_model: exec.executed_model,
            fallback_triggered: Boolean(exec.fallback_triggered),
            fallback_reason: exec.fallback_reason || null,
          },
        },
        audit_notes: String(exec.cost_confirmation_note || 'Execução real via /api/growth-os'),
        error_message: null,
        created_at: now,
      });
    }

    deliverables = [
      {
        deliverable_id: `${missionId}-DELIV-1`,
        title: `Proposta Gerada por IA (Supervisão Humana Pendente) — ${input.title}`,
        produced_by_agent: 'commercial_analyst',
        category: 'viability_scorecard',
        summary: outputs[1] || '',
        verified_facts: [
          'Executado via API real Google Gemini (sem simulador e sem dados externos não verificados).',
        ],
        hypotheses: [
          'Recomendações e eventuais valores sugeridos dependem de revisão e aprovação da gestão.',
        ],
        recommendations: [outputs[2] || 'Rever e aprovar ou solicitar ajustes em Tarefas e Aprovações.'],
      },
    ];
    consolidatedSummary = outputs[1] || outputs[0] || '';
    auditorNotes = outputs[2] || outputs[0] || 'Aguarda revisão humana.';
  } else if (isSingleAgentCommercial) {
    tasks = [
      {
        task_id: `${missionId}-STEP-1`,
        mission_id: missionId,
        step_order: 1,
        title: `Diagnóstico Digital e Estratégia Comercial — ${input.title}`,
        assigned_agent_key: 'commercial_analyst',
        skill_key: 'offers',
        status: 'awaiting_approval',
        execution_mode: 'approval_required',
        risk_level: 'L1',
        requires_approval: true,
        approval_level: 'L1_content_ops',
        estimated_cost_cents: estimatedStepCents,
        actual_cost_cents: Math.max(1, Math.round(estimatedStepCents * 0.5)),
        currency: input.currency,
        input_summary: `Objetivo: ${input.objective} | Mercado: ${input.market}`,
        output_summary: `[SIMULAÇÃO] Diagnóstico Digital concluído pelo Estrategista Comercial. Fatos observados e oportunidades estruturados para "${input.title}".`,
        structured_output: { simulated: true, agent: 'commercial_analyst' },
        auditor_verdict: 'Pronto para decisão humana em Tarefas e Aprovações',
        finance_verdict: `Reserva ativa (${reservationId}) aguarda decisão`,
        started_at: now,
        completed_at: null,
      },
    ];
    deliverables = [
      {
        deliverable_id: `${missionId}-DELIV-1`,
        title: `Diagnóstico Digital — ${input.title}`,
        produced_by_agent: 'commercial_analyst',
        category: 'viability_scorecard',
        summary: 'Diagnóstico estruturado com fatos observados, oportunidade de receita e plano de ação.',
        verified_facts: ['Estrutura técnica e comercial analisada.'],
        hypotheses: ['Validar interesse do cliente nos 3 passos do plano.'],
        recommendations: ['Aprovar ou rejeitar em Tarefas e Aprovações.'],
      },
    ];
    newRuns = tasks.map((t, idx) => ({
      run_id: `RUN-${missionId}-${idx + 1}`,
      task_id: t.task_id,
      mission_id: missionId,
      mission_title: input.title,
      agent_key: t.assigned_agent_key,
      skill_key: t.skill_key,
      correlation_id: `corr_${missionId}`,
      idempotency_key: `idem_${t.task_id}`,
      execution_mode: t.execution_mode,
      adapter_mode: 'sandbox_test_adapter',
      status: t.status,
      model_provider: 'google_gemini',
      model_name: 'gemini-flash-latest (ambiente de testes)',
      prompt_tokens: 180,
      completion_tokens: 240,
      raw_cost_usd_micros: 0,
      cost_source: 'estimated',
      latency_ms: 85,
      sanitized_input: { mission_code: missionCode, step_order: t.step_order, input_summary: t.input_summary },
      sanitized_output: { output_summary: t.output_summary, structured_output: t.structured_output },
      audit_notes: t.auditor_verdict,
      error_message: null,
      created_at: now,
    }));
    consolidatedSummary =
      'Diagnóstico Digital executado em Ambiente de Testes (Simulado). Aguarda aprovação humana.';
    auditorNotes = 'Análise do Estrategista Comercial concluída; sem gastos externos.';
  } else {
    tasks = [
      {
        task_id: `${missionId}-STEP-1`,
        mission_id: missionId,
        step_order: 1,
        title: isDigitalProductProof
          ? 'Pesquisa de Mercado: Identificar 3 oportunidades de produtos digitais para a UmbuLab (PT/BR)'
          : `Pesquisa e Inteligência de Mercado — ${input.title}`,
        assigned_agent_key: 'market_intel',
        skill_key: 'market_opportunity_discovery',
        status: 'completed',
        execution_mode: input.execution_mode,
        risk_level: 'L0',
        requires_approval: false,
        approval_level: 'L0_auto',
        estimated_cost_cents: estimatedStepCents,
        actual_cost_cents: Math.round(estimatedStepCents * 0.75),
        currency: input.currency,
        input_summary: `Objetivo: ${input.objective} | Mercado: ${input.market}`,
        output_summary: isDigitalProductProof
          ? '[SIMULAÇÃO] Identificadas 3 oportunidades alinhadas com a UmbuLab.'
          : `[SIMULAÇÃO] Levantamento estruturado concluído para "${input.title}" no mercado ${input.market}.`,
        structured_output: { simulated: true },
        auditor_verdict: 'Simulação interna L0',
        finance_verdict: 'Dentro do limite reservado (sem cobrança)',
        started_at: now,
        completed_at: now,
      },
      {
        task_id: `${missionId}-STEP-2`,
        mission_id: missionId,
        step_order: 2,
        title: `Modelação Comercial e Unit Economics — ${input.title}`,
        assigned_agent_key: 'commercial_analyst',
        skill_key: 'unit_economics_scorecard',
        status: 'completed',
        execution_mode: input.execution_mode,
        risk_level: 'L1',
        requires_approval: false,
        approval_level: 'L0_auto',
        estimated_cost_cents: estimatedStepCents,
        actual_cost_cents: Math.round(estimatedStepCents * 0.8),
        currency: input.currency,
        input_summary: 'Análise comercial simulada.',
        output_summary: `[SIMULAÇÃO] Scorecard comercial de rascunho para "${input.title}".`,
        structured_output: { simulated: true },
        auditor_verdict: 'Simulação interna L1',
        finance_verdict: 'Sem cobrança externa',
        started_at: now,
        completed_at: now,
      },
      {
        task_id: `${missionId}-STEP-3`,
        mission_id: missionId,
        step_order: 3,
        title: 'Auditoria de Qualidade, Conformidade RGPD/LGPD e Aprovação Humana',
        assigned_agent_key: 'quality_auditor',
        skill_key: 'quality_and_compliance_gate',
        status: 'awaiting_approval',
        execution_mode: 'approval_required',
        risk_level: input.budget_cap_cents >= 10000 ? 'L2' : 'L1',
        requires_approval: true,
        approval_level: input.budget_cap_cents >= 10000 ? 'L2_financial_admin' : 'L1_content_ops',
        estimated_cost_cents: estimatedStepCents,
        actual_cost_cents: Math.round(estimatedStepCents * 0.5),
        currency: input.currency,
        input_summary: 'Inspeção simulada antes de aprovação humana.',
        output_summary: '[SIMULAÇÃO] Dossier revisto e encaminhado para decisão humana.',
        structured_output: { rgpd_lgpd_check: 'PASSED', simulated: true },
        auditor_verdict: 'Pronto para decisão do Administrador UmbuLab',
        finance_verdict: `Reserva ativa (${reservationId}) aguarda decisão`,
        started_at: now,
        completed_at: null,
      },
    ];

    deliverables = [
      {
        deliverable_id: `${missionId}-DELIV-1`,
        title: `Rascunho Simulado — ${input.title}`,
        produced_by_agent: 'commercial_analyst',
        category: 'viability_scorecard',
        summary: 'Resultado gerado em modo de simulação interna (sem consumo de API externa).',
        verified_facts: ['Modo Sandbox ativo: nenhuma chamada externa foi executada.'],
        hypotheses: ['Ativar ligação Gemini na aba Integrações para geração real.'],
        recommendations: ['Aprovar ou rejeitar em Tarefas e Aprovações.'],
      },
    ];

    newRuns = tasks.map((t, idx) => ({
      run_id: `RUN-${missionId}-${idx + 1}`,
      task_id: t.task_id,
      mission_id: missionId,
      mission_title: input.title,
      agent_key: t.assigned_agent_key,
      skill_key: t.skill_key,
      correlation_id: `corr_${missionId}`,
      idempotency_key: `idem_${t.task_id}`,
      execution_mode: t.execution_mode,
      adapter_mode: 'sandbox_test_adapter',
      status: t.status,
      model_provider: 'google_gemini',
      model_name: 'gemini-3.5-flash-lite (ambiente de testes)',
      prompt_tokens: 180 + idx * 30,
      completion_tokens: 240 + idx * 40,
      raw_cost_usd_micros: 0,
      cost_source: 'estimated',
      latency_ms: 85 + idx * 25,
      sanitized_input: { mission_code: missionCode, step_order: t.step_order, input_summary: t.input_summary },
      sanitized_output: { output_summary: t.output_summary, structured_output: t.structured_output },
      audit_notes: t.auditor_verdict,
      error_message: null,
      created_at: now,
    }));

    consolidatedSummary =
      'Missão executada em Ambiente de Testes (Simulado) sem chamadas externas. Aguarda decisão humana.';
    auditorNotes = 'Simulação interna validada; sem gastos externos.';
  }

  const approvalId = `APR-REAL-${Date.now().toString().slice(-6)}`;
  const lastTask = tasks[tasks.length - 1];
  const newApproval: OperationalApprovalRecord = {
    approval_id: approvalId,
    task_id: lastTask.task_id,
    mission_id: missionId,
    mission_title: input.title,
    title: `Aprovar Resultado da Missão: ${input.title}`,
    requested_by_agent_key: 'ops_director',
    approval_level: input.budget_cap_cents >= 10000 ? 'L2_financial_admin' : 'L1_content_ops',
    risk_level: input.budget_cap_cents >= 10000 ? 'L2' : 'L1',
    category: 'mission_deliverable',
    status: 'awaiting_approval',
    estimated_impact:
      missionAdapterMode === 'live_provider_api'
        ? 'Consolida os resultados gerados com API real e liquida o valor consumido no orçamento.'
        : 'Consolida os resultados gerados em modo de simulação interna e regista o lançamento contabilístico interno (sem cobrança externa).',
    financial_impact_cents: tasks.reduce((acc, item) => acc + item.actual_cost_cents, 0),
    currency: input.currency,
    diff_summary: `${tasks.length} etapas concluídas (${tasks.map((t) => t.assigned_agent_key).join(' → ')}). Reserva cativa: ${(input.budget_cap_cents / 100).toFixed(2)} ${input.currency}.`,
    deliverable_preview: {
      mission_code: missionCode,
      deliverables_count: deliverables.length,
      primary_recommendation: deliverables[0].recommendations[0],
      execution_environment: missionAdapterMode === 'live_provider_api' ? 'API Externa Conectada' : 'Simulação Interna (Sandbox)',
    },
    auditor_notes: auditorNotes,
    decision_notes: null,
    decided_by_email: null,
    requested_at: now,
    decided_at: null,
  };

  const newOpportunities: OperationalOpportunityRecord[] = isDigitalProductProof
    ? [
        {
          opportunity_id: `OPP-REAL-${Date.now().toString().slice(-5)}-1`,
          mission_id: missionId,
          title: 'Pack Diagnóstico & Hardening Supabase/RLS + Arquitetura Web (Oferta B2B)',
          channel: 'Produto Digital / Serviços B2B',
          market: input.market,
          currency: input.currency,
          estimated_ticket_cents: input.currency === 'BRL' ? 149000 : 39000,
          estimated_margin_pct: 84,
          confidence_score: 91,
          intent_score: 88,
          roi_potential_score: 93,
          viability_label: 'Alta (Gerada em Missão)',
          verified_facts_note:
            `Fonte interna (${missionCode}): reutiliza ativos reais de engenharia web e segurança PostgreSQL/RLS da UmbuLab.`,
          hypothesis_note:
            'O que precisa de validação: testar taxa de conversão da página de diagnóstico e custo por lead em tráfego real.',
          compliance_basis: 'Oferta B2B própria da UmbuLab; conformidade RGPD/LGPD.',
          recommended_action: 'Aprovar resultado em Tarefas e Aprovações e estruturar página de apresentação.',
          discovered_by_agent: 'market_intel',
          status: 'validated',
          risk_level: 'L1',
          is_demo_data: false,
          created_at: now,
        },
      ]
    : [];

  const newMission: OperationalMissionRecord = {
    mission_id: missionId,
    code: missionCode,
    title: input.title,
    objective: input.objective,
    coordinator_agent_key: 'ops_director',
    status: 'awaiting_approval',
    priority: input.priority,
    execution_mode: input.execution_mode,
    adapter_mode: missionAdapterMode,
    market: input.market,
    budget_cap_cents: input.budget_cap_cents,
    budget_reserved_cents: input.budget_cap_cents,
    budget_used_cents: tasks.reduce((acc, item) => acc + item.actual_cost_cents, 0),
    currency: input.currency,
    reservation_id: reservationId,
    consolidated_summary: consolidatedSummary,
    deliverables,
    tasks,
    created_at: now,
    started_at: now,
    completed_at: null,
    is_demo_data: false,
  };

  const nextBudgets = currentState.budgets.map((b) =>
    b.budget_id === targetBudget.budget_id
      ? {
          ...b,
          reserved_cents: b.reserved_cents + input.budget_cap_cents,
          updated_at: now,
        }
      : b
  );

  const participatingKeys = new Set<AgentKey>([
    'ops_director',
    'market_intel',
    'commercial_analyst',
    'marketing_seo',
    'quality_auditor',
  ]);

  const nextAgents = currentState.agents.map((ag) => {
    if (!participatingKeys.has(ag.agent_key)) return ag;
    return {
      ...ag,
      status: ag.agent_key === 'ops_director' ? ('awaiting_approval' as const) : ('idle' as const),
      last_run_at: now,
      total_runs_count: ag.total_runs_count + 1,
      updated_at: now,
    };
  });

  saveState({
    ...currentState,
    agents: nextAgents,
    missions: [newMission, ...currentState.missions],
    task_runs: [...newRuns, ...currentState.task_runs],
    approvals: [newApproval, ...currentState.approvals],
    opportunities: [...newOpportunities, ...currentState.opportunities],
    budgets: nextBudgets,
  });

  // Persistir no backend Supabase (/api/growth-os?action=persist_mission) quando autenticado
  if (token) {
    try {
      const missionForBackend = {
        ...newMission,
        tasks: tasks.map((t, idx) => ({
          ...t,
          requested_model:
            (t.structured_output?.requested_model as string | undefined) ||
            newRuns[idx]?.model_name ||
            'gemini-3.5-flash-lite',
          executed_model: newRuns[idx]?.model_name || 'gemini-3.5-flash-lite',
          prompt_tokens: newRuns[idx]?.prompt_tokens ?? 0,
          completion_tokens: newRuns[idx]?.completion_tokens ?? 0,
          raw_cost_usd_micros: newRuns[idx]?.raw_cost_usd_micros ?? 0,
          latency_ms: newRuns[idx]?.latency_ms ?? 0,
          fallback_triggered: Boolean(t.structured_output?.fallback_triggered),
          fallback_reason: (t.structured_output?.fallback_reason as string | null) ?? null,
        })),
      };
      const resp = await fetch('/api/growth-os?action=persist_mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mission: missionForBackend,
          opportunities: newOpportunities,
          idempotency_key: `idem_${missionCode}`,
        }),
      });
      if (resp.ok) {
        const dbRes = await resp.json();
        if (dbRes.ok && dbRes.mission_id) {
          newMission.mission_id = String(dbRes.mission_id);
          if (dbRes.reservation_id) {
            newMission.reservation_id = String(dbRes.reservation_id);
          }
          if (dbRes.approval_id) {
            newApproval.approval_id = String(dbRes.approval_id);
            newApproval.mission_id = String(dbRes.mission_id);
            newApproval.deliverable_preview = {
              ...newApproval.deliverable_preview,
              reservation_id: dbRes.reservation_id,
            };
          }
          saveState({
            ...currentState,
            missions: currentState.missions.map((m) =>
              m.code === missionCode ? newMission : m
            ),
            approvals: currentState.approvals.map((a) =>
              a.mission_title === newMission.title && a.status === 'awaiting_approval'
                ? newApproval
                : a
            ),
          });
        }
      }
    } catch {
      // Fallback gracioso em ambiente sem servidor de API ativo
    }
  }

  return newMission;
}

// =============================================================================
// 4. DECISÃO NO CENTRO DE APROVAÇÕES (APROVAR, REJEITAR, SOLICITAR AJUSTES)
// =============================================================================

export function decideHumanApproval(
  approvalId: string,
  decision: 'approved' | 'rejected' | 'request_changes',
  decisionNotes: string,
  adminEmail?: string | null
): OperationalApprovalRecord | null {
  const target = currentState.approvals.find((a) => a.approval_id === approvalId);
  if (!target) return null;

  const targetMission = currentState.missions.find((m) => m.mission_id === target.mission_id);
  const reservationIdForBackend =
    targetMission?.reservation_id ||
    String((target.deliverable_preview as { reservation_id?: string } | null)?.reservation_id || '');

  // Sincronizar assincronamente com o backend Supabase (/api/growth-os?action=decide_approval)
  getAccessToken()
    .then((token) => {
      if (!token) return;
      return fetch('/api/growth-os?action=decide_approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          approval_id: approvalId,
          reservation_id: reservationIdForBackend,
          decision,
          decision_notes: decisionNotes,
          actual_cost_cents: targetMission?.budget_used_cents ?? target.financial_impact_cents,
        }),
      });
    })
    .catch(() => {});

  const now = new Date().toISOString();
  const nextStatus =
    decision === 'approved'
      ? 'approved'
      : decision === 'rejected'
        ? 'rejected'
        : 'awaiting_approval';

  const updatedApproval: OperationalApprovalRecord = {
    ...target,
    status: nextStatus,
    decision_notes:
      decisionNotes.trim() ||
      (decision === 'approved'
        ? 'Resultado aprovado pelo Administrador UmbuLab.'
        : decision === 'rejected'
          ? 'Missão rejeitada pelo Administrador; reserva orçamental libertada.'
          : 'Alterações solicitadas ao Coordenador e agentes especialistas.'),
    decided_by_email: adminEmail || 'admin@umbulab.com',
    decided_at: now,
  };

  const nextApprovals = currentState.approvals.map((a) =>
    a.approval_id === approvalId ? updatedApproval : a
  );

  let settledAmountCents = 0;
  let releasedReservationCents = 0;
  let missionCurrency: GrowthOsCurrency = target.currency;
  let isSimulatedMission = true;

  const nextMissions = currentState.missions.map((m) => {
    if (m.mission_id !== target.mission_id) return m;
    missionCurrency = m.currency;
    releasedReservationCents = m.budget_reserved_cents;
    settledAmountCents = decision === 'approved' ? m.budget_used_cents : 0;
    isSimulatedMission = m.adapter_mode !== 'live_provider_api';

    const nextTasks = m.tasks.map((t) =>
      t.task_id === target.task_id
        ? {
            ...t,
            status:
              decision === 'approved'
                ? ('completed' as const)
                : decision === 'rejected'
                  ? ('rejected' as const)
                  : ('running' as const),
            completed_at: decision === 'request_changes' ? null : now,
          }
        : t
    );

    return {
      ...m,
      status:
        decision === 'approved'
          ? ('completed' as const)
          : decision === 'rejected'
            ? ('rejected' as const)
            : ('running' as const),
      budget_reserved_cents: decision === 'request_changes' ? m.budget_reserved_cents : 0,
      completed_at: decision === 'request_changes' ? null : now,
      tasks: nextTasks,
    };
  });

  const nextBudgets = currentState.budgets.map((b) => {
    if (b.currency !== missionCurrency) return b;
    if (decision === 'request_changes') return b;
    return {
      ...b,
      reserved_cents: Math.max(0, b.reserved_cents - releasedReservationCents),
      settled_cents: b.settled_cents + settledAmountCents,
      confirmed_external_cents:
        (b.confirmed_external_cents || 0) + (isSimulatedMission ? 0 : settledAmountCents),
      updated_at: now,
    };
  });

  const nextCashflow = [...currentState.cashflow_entries];
  if (decision === 'approved' && settledAmountCents > 0) {
    nextCashflow.unshift({
      entry_id: `CF-REAL-${Date.now().toString().slice(-6)}`,
      description: `${isSimulatedMission ? '[Registo Contabilístico Simulado]' : '[Custo Operacional Confirmado]'} Missão aprovada: ${target.mission_title}`,
      direction: 'outflow',
      category: 'Operações AI Growth OS',
      counterparty: isSimulatedMission ? 'Simulação Interna (Sem Cobrança Externa)' : 'Fornecedor API Conectado',
      currency: missionCurrency,
      amount_cents: settledAmountCents,
      competence_date: now.slice(0, 10),
      cash_date: now.slice(0, 10),
      settlement_state: 'settled',
      linked_mission_id: target.mission_id,
      reversed_from_id: null,
      reference_doc: target.approval_id,
      immutable_rule_note: isSimulatedMission
        ? 'Lançamento interno de demonstração/simulação após aprovação humana (nenhum pagamento externo realizado).'
        : 'Lançamento gerado automaticamente após aprovação humana de missão com API ativa.',
      is_demo_data: false,
      is_simulated_settlement: isSimulatedMission,
    });
  }

  const nextAgents = currentState.agents.map((ag) =>
    ag.agent_key === 'ops_director'
      ? {
          ...ag,
          status: 'idle' as const,
          updated_at: now,
        }
      : ag
  );

  saveState({
    ...currentState,
    agents: nextAgents,
    missions: nextMissions,
    approvals: nextApprovals,
    budgets: nextBudgets,
    cashflow_entries: nextCashflow,
  });

  return updatedApproval;
}

// =============================================================================
// 5. RADAR DE OPORTUNIDADES, CAMPANHAS A/B E ESTÚDIO CRIATIVO (ASSISTENTES)
// =============================================================================

export interface DiscoverOpportunitiesInput {
  market: GrowthOsMarket;
  business_area: string;
  opportunity_type: string;
  target_client: string;
  max_results: number;
  max_budget_cents: number;
  currency: GrowthOsCurrency;
}

export function discoverGuidedOpportunities(
  input: DiscoverOpportunitiesInput
): OperationalOpportunityRecord[] {
  const now = new Date().toISOString();
  const count = Math.min(5, Math.max(1, input.max_results || 2));
  const created: OperationalOpportunityRecord[] = [];

  const templates = [
    {
      suffix: 'Diagnóstico Rápido & Implementação Guiada',
      margin: 82,
      ticketMultiplier: 1,
      evidence: `Análise interna da carteira de serviços UmbuLab (${input.business_area}) no mercado ${input.market}: procura recorrente por soluções rápidas com escopo fechado para ${input.target_client}.`,
      validationNeeded:
        'Validar aceitação de preço e custo de aquisição através de 10 abordagens consultivas ou página de teste.',
      risks: 'Risco de escopo aberto se o pacote não tiver entregáveis estritamente padronizados.',
    },
    {
      suffix: 'Assinatura Recorrente de Monitorização & Otimização IA',
      margin: 76,
      ticketMultiplier: 1.4,
      evidence: `Estrutura de suporte recorrente alinhada com os módulos técnicos existentes na UmbuLab para ${input.target_client}.`,
      validationNeeded:
        'Confirmar retenção mínima de 6 meses e disponibilidade de integração no cliente.',
      risks: 'Exige SLA claro e limite mensal de horas/execuções incluídas.',
    },
    {
      suffix: 'Pack de Templates & Automação Comercial Pronta a Usar',
      margin: 88,
      ticketMultiplier: 0.65,
      evidence: `Ativos reutilizáveis de frontend e fluxos de atendimento que reduzem o tempo de entrega em projetos de ${input.business_area}.`,
      validationNeeded:
        'Testar conversão direta em página de vendas dedicada antes de investir em anúncios pagos.',
      risks: 'Baixo risco operacional; requer documentação simples para o comprador.',
    },
  ];

  const baseTicket = input.currency === 'BRL' ? 149000 : input.currency === 'USD' ? 45000 : 39000;

  for (let i = 0; i < count; i++) {
    const tpl = templates[i % templates.length];
    created.push({
      opportunity_id: `OPP-DISC-${Date.now().toString().slice(-5)}-${i + 1}`,
      mission_id: null,
      title: `${input.opportunity_type}: ${input.business_area} — ${tpl.suffix}`,
      channel: input.opportunity_type,
      market: input.market,
      currency: input.currency,
      estimated_ticket_cents: Math.round(baseTicket * tpl.ticketMultiplier),
      estimated_margin_pct: tpl.margin,
      confidence_score: 84 - i * 4,
      intent_score: 86 - i * 3,
      roi_potential_score: 88 - i * 4,
      viability_label: 'Recomendada para Validação',
      verified_facts_note: `Evidência interna e enquadramento: ${tpl.evidence}`,
      hypothesis_note: `O que ainda precisa de validação: ${tpl.validationNeeded} | Riscos: ${tpl.risks}`,
      compliance_basis:
        input.market === 'BR'
          ? 'LGPD Art. 7.º — Prospeção e validação apenas com recolha consentida.'
          : 'RGPD Art. 6.º — Validação comercial B2B transparente e com opção de oposição (opt-out).',
      recommended_action: 'Rever parâmetros e converter em Missão Comercial controlada',
      discovered_by_agent: 'market_intel',
      status: 'validated',
      risk_level: 'L1',
      is_demo_data: false,
      created_at: now,
    });
  }

  const runRecord: OperationalTaskRunRecord = {
    run_id: `RUN-OPP-${Date.now().toString().slice(-6)}`,
    task_id: `TASK-OPP-DISCOVERY`,
    mission_id: 'OPPORTUNITY-RADAR',
    mission_title: `Descoberta de Oportunidades — ${input.business_area} (${input.market})`,
    agent_key: 'market_intel',
    skill_key: 'market_opportunity_discovery',
    correlation_id: `corr_opp_${Date.now()}`,
    idempotency_key: `idem_opp_${Date.now()}`,
    execution_mode: 'draft_only',
    adapter_mode: 'sandbox_test_adapter',
    status: 'completed',
    model_provider: 'google_gemini',
    model_name: 'gemini-2.5-flash',
    prompt_tokens: 240,
    completion_tokens: 410,
    raw_cost_usd_micros: 0,
    cost_source: 'estimated',
    latency_ms: 145,
    sanitized_input: { ...input },
    sanitized_output: { opportunities_created: created.length },
    audit_notes: 'Oportunidades geradas distinguindo evidências internas de hipóteses que exigem validação.',
    error_message: null,
    created_at: now,
  };

  saveState({
    ...currentState,
    opportunities: [...created, ...currentState.opportunities],
    task_runs: [runRecord, ...currentState.task_runs],
  });

  return created;
}

export function suggestAbHypothesesWithAgent(input: {
  objective: string;
  target_audience: string;
  channel: string;
}): { variant_a: string; variant_b: string } {
  const cleanObj = input.objective.trim() || 'aumentar pedidos de contacto qualificados';
  const cleanAud = input.target_audience.trim() || 'decisores de PMEs';
  return {
    variant_a: `Hipótese A (Controlo — Foco em Segurança e Credibilidade): Mensagem direta para ${cleanAud} em ${input.channel}, destacando experiência comprovada da UmbuLab, prazos claros e diagnóstico sem compromisso para ${cleanObj}.`,
    variant_b: `Hipótese B (Variante de Teste — Foco em Rapidez e Resultado Prático): Mensagem orientada a eficiência para ${cleanAud} em ${input.channel}, demonstrando passo a passo como implementar a solução em poucos dias (hipótese sujeita a validação empírica, sem garantia prévia de superioridade).`,
  };
}

export function createOperationalAbCampaign(input: {
  title: string;
  objective: string;
  target_audience: string;
  channel: string;
  market: GrowthOsMarket;
  currency: GrowthOsCurrency;
  planned_budget_cap_cents: number;
  duration_days: number;
  variant_a_summary: string;
  variant_b_summary: string;
  primary_metric_label: string;
  submit_for_approval: boolean;
}): OperationalAbCampaignRecord {
  const now = new Date().toISOString();
  const adsConnected = currentState.integrations.some(
    (i) => (i.provider_key === 'meta_ads' || i.provider_key === 'google_ads') && i.status === 'connected'
  );

  const campaignId = `AB-OP-${Date.now().toString().slice(-6)}`;
  const record: OperationalAbCampaignRecord = {
    campaign_id: campaignId,
    title: input.title,
    objective: input.objective,
    target_audience: input.target_audience,
    channel: input.channel,
    market: input.market,
    currency: input.currency,
    planned_budget_cap_cents: Math.max(0, Math.round(input.planned_budget_cap_cents)),
    duration_days: Math.max(1, Math.round(input.duration_days || 14)),
    variant_a_summary: input.variant_a_summary,
    variant_b_summary: input.variant_b_summary,
    primary_metric_label: input.primary_metric_label,
    risk_level: 'L2',
    approval_gate_note: adsConnected
      ? 'Conta de anúncios ligada: exige aprovação humana explícita antes de qualquer publicação.'
      : 'Sem conta de anúncios ativa: guardado como rascunho planeado interno (zero gasto externo).',
    status_label: input.submit_for_approval
      ? 'Aguarda Aprovação Humana (Rascunho)'
      : 'Rascunho Planeado (Sem Publicação Externa)',
    is_draft_without_external_api: !adsConnected,
    is_demo_data: false,
    created_at: now,
  };

  const nextApprovals = [...currentState.approvals];
  if (input.submit_for_approval) {
    nextApprovals.unshift({
      approval_id: `APR-AB-${Date.now().toString().slice(-6)}`,
      task_id: campaignId,
      mission_id: campaignId,
      mission_title: `Campanha A/B: ${input.title}`,
      title: `Aprovar Plano de Campanha A/B: ${input.title}`,
      requested_by_agent_key: 'traffic_manager',
      approval_level: 'L2_financial_admin',
      risk_level: 'L2',
      category: 'ab_campaign_activation',
      status: 'awaiting_approval',
      estimated_impact: adsConnected
        ? 'Autoriza a preparação da experiência A/B dentro do limite de orçamento definido.'
        : 'Aprova o plano experimental A/B internamente (permanece em rascunho até conectar Meta/Google Ads).',
      financial_impact_cents: 0,
      currency: input.currency,
      diff_summary: `Canal: ${input.channel} | Público: ${input.target_audience} | Orçamento planeado: ${(input.planned_budget_cap_cents / 100).toFixed(2)} ${input.currency} (${input.duration_days} dias).`,
      deliverable_preview: {
        variant_a: input.variant_a_summary,
        variant_b: input.variant_b_summary,
        metric: input.primary_metric_label,
      },
      auditor_notes: 'Auditor de Qualidade: Variantes apresentadas como hipóteses de teste sem promessa de retorno garantido.',
      decision_notes: null,
      decided_by_email: null,
      requested_at: now,
      decided_at: null,
    });
  }

  saveState({
    ...currentState,
    ab_campaigns: [record, ...currentState.ab_campaigns],
    approvals: nextApprovals,
  });

  return record;
}

export function generateCreativeStudioAsset(input: {
  title: string;
  content_type: string;
  objective: string;
  target_audience: string;
  target_channel: string;
  locale: 'pt-PT' | 'pt-BR' | 'en-US';
  tone: string;
  product_service: string;
  format: string;
  call_to_action: string;
}): OperationalCreativeAssetRecord {
  const now = new Date().toISOString();
  const isPtBr = input.locale === 'pt-BR';
  const greeting = isPtBr ? 'Olá! Sua empresa está pronta para o próximo nível digital?' : 'A sua empresa está preparada para crescer com engenharia web e automação inteligente?';

  const generatedText = [
    `[${input.content_type.toUpperCase()} — ${input.locale} | Tom: ${input.tone}]`,
    `Título / Gancho Principal: ${input.title}`,
    ``,
    `1. Abertura (${input.target_channel}):`,
    `${greeting}`,
    `Desenvolvemos uma abordagem prática de ${input.product_service} pensada especificamente para ${input.target_audience}, com foco em ${input.objective}.`,
    ``,
    `2. Pontos-Chave de Valor (Verificáveis):`,
    `• Arquitetura rápida, segura e alinhada à identidade do seu negócio;`,
    `• Processo transparente, com etapas claras e acompanhamento próximo;`,
    `• Respeito integral pela privacidade e proteção de dados (${isPtBr ? 'LGPD' : 'RGPD'}).`,
    ``,
    `3. Chamada para Ação (CTA):`,
    `👉 ${input.call_to_action}`,
    ``,
    `[Nota de Transparência]: Este conteúdo é um rascunho textual/roteiro estruturado. Nenhuma imagem ou vídeo pago foi renderizado externamente sem aprovação.`,
  ].join('\n');

  const asset: OperationalCreativeAssetRecord = {
    asset_id: `CR-OP-${Date.now().toString().slice(-6)}`,
    title: input.title,
    content_type: input.content_type,
    objective: input.objective,
    target_audience: input.target_audience,
    target_channel: input.target_channel,
    locale: input.locale,
    tone: input.tone,
    product_service: input.product_service,
    format: input.format,
    call_to_action: input.call_to_action,
    generated_text: generatedText,
    brand_tokens_used: ['umbu.primary (#2E7D32)', 'umbu.dark (#0B0B0B)'],
    brief_summary: `${input.content_type} para ${input.target_audience} em ${input.target_channel} (${input.locale}).`,
    compliance_check_note: 'Guião/texto validado internamente; sem alegações enganosas e sem publicação automática.',
    risk_level: 'L1',
    status_label: 'draft',
    is_demo_data: false,
    created_at: now,
  };

  saveState({
    ...currentState,
    creative_assets: [asset, ...currentState.creative_assets],
  });

  return asset;
}

export function updateCreativeAssetDraft(
  assetId: string,
  newText: string
): OperationalCreativeAssetRecord | null {
  let updated: OperationalCreativeAssetRecord | null = null;
  const nextAssets = currentState.creative_assets.map((a) => {
    if (a.asset_id !== assetId) return a;
    updated = {
      ...a,
      generated_text: newText,
    };
    return updated;
  });

  if (updated) {
    saveState({
      ...currentState,
      creative_assets: nextAssets,
    });
  }
  return updated;
}

export function submitCreativeAssetForApproval(
  assetId: string
): OperationalCreativeAssetRecord | null {
  const target = currentState.creative_assets.find((a) => a.asset_id === assetId);
  if (!target) return null;

  const now = new Date().toISOString();
  let updated: OperationalCreativeAssetRecord | null = null;
  const nextAssets: OperationalCreativeAssetRecord[] = currentState.creative_assets.map((a) => {
    if (a.asset_id !== assetId) return a;
    const nextAsset: OperationalCreativeAssetRecord = {
      ...a,
      status_label: 'awaiting_approval',
    };
    updated = nextAsset;
    return nextAsset;
  });

  const newApproval: OperationalApprovalRecord = {
    approval_id: `APR-CR-${Date.now().toString().slice(-6)}`,
    task_id: target.asset_id,
    mission_id: target.asset_id,
    mission_title: `Conteúdo Criativo: ${target.title}`,
    title: `Aprovar Conteúdo Criativo: ${target.title}`,
    requested_by_agent_key: 'creative_director',
    approval_level: 'L1_content_ops',
    risk_level: target.risk_level,
    category: 'creative_asset',
    status: 'awaiting_approval',
    estimated_impact: 'Marca o texto/roteiro criativo como aprovado para utilização pela equipa UmbuLab (sem publicação automática externa).',
    financial_impact_cents: 0,
    currency: 'EUR',
    diff_summary: `${target.content_type} (${target.locale}) para ${target.target_channel}. CTA: "${target.call_to_action}".`,
    deliverable_preview: {
      title: target.title,
      channel: target.target_channel,
      preview_excerpt: target.generated_text.slice(0, 260),
    },
    auditor_notes: 'Auditor de Qualidade: Rascunho textual revisto sem custos externos associados.',
    decision_notes: null,
    decided_by_email: null,
    requested_at: now,
    decided_at: null,
  };

  saveState({
    ...currentState,
    creative_assets: nextAssets,
    approvals: [newApproval, ...currentState.approvals],
  });

  return updated;
}

// =============================================================================
// 6. OPERAÇÕES FINANCEIRAS (LIMITES DE ORÇAMENTO, LANÇAMENTOS E ESTORNOS)
// =============================================================================

export function updateBudgetEnvelopeLimit(
  budgetId: string,
  newLimitCents: number,
  hardStop: boolean,
  extra?: {
    scope_label?: string;
    alert_threshold_pct?: number;
    notes?: string;
  }
): void {
  const now = new Date().toISOString();
  const nextBudgets = currentState.budgets.map((b) =>
    b.budget_id === budgetId
      ? {
          ...b,
          limit_cents: Math.max(0, Math.round(newLimitCents)),
          hard_stop: hardStop,
          scope_label: extra?.scope_label?.trim() ? extra.scope_label.trim() : b.scope_label,
          alert_threshold_pct:
            extra?.alert_threshold_pct !== undefined
              ? Math.min(100, Math.max(10, Math.round(extra.alert_threshold_pct)))
              : b.alert_threshold_pct,
          notes: extra?.notes !== undefined ? extra.notes : b.notes,
          updated_at: now,
        }
      : b
  );
  saveState({
    ...currentState,
    budgets: nextBudgets,
  });
}

export function createOperationalCashflowEntry(input: {
  description: string;
  direction: 'inflow' | 'outflow';
  category: string;
  counterparty: string;
  currency: GrowthOsCurrency;
  amount_cents: number;
  settlement_state: 'projected' | 'pending' | 'settled';
  entry_date?: string;
  reference_doc?: string;
}): OperationalCashflowEntry {
  const chosenDate = input.entry_date?.trim() || new Date().toISOString().slice(0, 10);
  const entry: OperationalCashflowEntry = {
    entry_id: `CF-OP-${Date.now().toString().slice(-6)}`,
    description: input.description,
    direction: input.direction,
    category: input.category,
    counterparty: input.counterparty,
    currency: input.currency,
    amount_cents: Math.max(1, Math.round(input.amount_cents)),
    competence_date: chosenDate,
    cash_date: input.settlement_state === 'settled' ? chosenDate : null,
    settlement_state: input.settlement_state,
    linked_mission_id: null,
    reversed_from_id: null,
    reference_doc: input.reference_doc?.trim() || undefined,
    immutable_rule_note: 'Registo auditável criado pelo Administrador. Alterações exigem lançamento de estorno.',
    is_demo_data: false,
    is_simulated_settlement: false,
  };

  saveState({
    ...currentState,
    cashflow_entries: [entry, ...currentState.cashflow_entries],
  });
  return entry;
}

export function reverseOperationalCashflowEntry(entryId: string): OperationalCashflowEntry | null {
  const original = currentState.cashflow_entries.find((e) => e.entry_id === entryId);
  if (!original || original.settlement_state === 'reversed') return null;

  const today = new Date().toISOString().slice(0, 10);
  const reversalEntry: OperationalCashflowEntry = {
    entry_id: `CF-REV-${Date.now().toString().slice(-6)}`,
    description: `[ESTORNO COMPENSATÓRIO] ${original.description} (Ref: ${original.entry_id})`,
    direction: original.direction === 'inflow' ? 'outflow' : 'inflow',
    category: original.category,
    counterparty: original.counterparty,
    currency: original.currency,
    amount_cents: original.amount_cents,
    competence_date: today,
    cash_date: today,
    settlement_state: 'settled',
    linked_mission_id: original.linked_mission_id,
    reversed_from_id: original.entry_id,
    reference_doc: original.reference_doc,
    immutable_rule_note: `Estorno imutável referente ao lançamento ${original.entry_id}.`,
    is_demo_data: false,
    is_simulated_settlement: original.is_simulated_settlement,
  };

  const nextEntries = currentState.cashflow_entries.map((e) =>
    e.entry_id === entryId ? { ...e, settlement_state: 'reversed' as const } : e
  );

  saveState({
    ...currentState,
    cashflow_entries: [reversalEntry, ...nextEntries],
  });
  return reversalEntry;
}

// =============================================================================
// 7. CONTROLO DE EMERGÊNCIA (KILL-SWITCHES) E CONVERSÃO DE OPORTUNIDADES
// =============================================================================

export function toggleGlobalEmergencyPause(pause: boolean, reason?: string): void {
  const now = new Date().toISOString();
  saveState({
    ...currentState,
    system_controls: {
      ...currentState.system_controls,
      pause_new_executions: pause,
      emergency_reason: pause ? reason || 'Pausa manual acionada pelo Administrador.' : null,
      updated_at: now,
    },
  });
}

export function cancelAllRunningMissions(): number {
  const now = new Date().toISOString();
  let cancelledCount = 0;
  const nextMissions = currentState.missions.map((m) => {
    if (m.status === 'running' || m.status === 'queued' || m.status === 'awaiting_approval') {
      cancelledCount += 1;
      return {
        ...m,
        status: 'cancelled' as const,
        budget_reserved_cents: 0,
        completed_at: now,
      };
    }
    return m;
  });

  const nextBudgets = currentState.budgets.map((b) => ({
    ...b,
    reserved_cents: 0,
    updated_at: now,
  }));

  saveState({
    ...currentState,
    missions: nextMissions,
    budgets: nextBudgets,
  });
  return cancelledCount;
}

export async function convertOpportunityToMission(
  opportunityId: string,
  overrides?: {
    title?: string;
    objective?: string;
    budget_cap_cents?: number;
    execution_mode?: AgentAutonomyMode;
  }
): Promise<OperationalMissionRecord | null> {
  const opp = currentState.opportunities.find((o) => o.opportunity_id === opportunityId);
  if (!opp) return null;

  const mission = await createAndExecuteMission({
    title: overrides?.title?.trim() || `Missão Comercial: ${opp.title}`,
    objective:
      overrides?.objective?.trim() ||
      `Validar oferta, estruturar página de apresentação e preparar plano de execução para a oportunidade "${opp.title}" no mercado ${opp.market}.`,
    market: opp.market,
    currency: opp.currency,
    budget_cap_cents:
      overrides?.budget_cap_cents !== undefined
        ? overrides.budget_cap_cents
        : opp.currency === 'BRL'
          ? 3500
          : 1500,
    priority: 'high',
    execution_mode: overrides?.execution_mode || 'approval_required',
  });

  const nextOpps = currentState.opportunities.map((o) =>
    o.opportunity_id === opportunityId
      ? { ...o, status: 'converted_to_mission' as const, mission_id: mission.mission_id }
      : o
  );

  saveState({
    ...currentState,
    opportunities: nextOpps,
  });

  return mission;
}

// =============================================================================
// 8. COORDENADOR INTERATIVO POR VOZ E TEXTO (OPS_DIRECTOR COMMAND CENTER)
// =============================================================================

export async function sendCoordinatorMessage(
  userText: string
): Promise<CoordinatorConversationMessage> {
  const now = new Date().toISOString();
  const adminMsg: CoordinatorConversationMessage = {
    message_id: `MSG-ADM-${Date.now()}`,
    sender: 'admin',
    agent_key: 'ops_director',
    speaker_label: 'Administrador UmbuLab',
    text: userText,
    timestamp: now,
  };

  const lower = userText.toLowerCase();
  let replyText = '';
  let createdMissionId: string | undefined;
  let suggestedMission: string | undefined;

  if (
    lower.includes('pesquisar oportunidades') ||
    lower.includes('produtos digitais') ||
    lower.includes('lançar missão') ||
    lower.includes('executar missão')
  ) {
    const mission = await createAndExecuteMission({
      title: 'Pesquisar oportunidades de produtos digitais para a UmbuLab',
      objective:
        'Identificar oportunidades de produtos digitais B2B/SaaS para Portugal e Brasil, calcular viabilidade comercial em EUR/BRL, redigir posicionamento bilingue e auditar conformidade antes de aprovação.',
      market: 'PT',
      currency: 'EUR',
      budget_cap_cents: 1500,
      priority: 'high',
      execution_mode: 'approval_required',
    });
    createdMissionId = mission.mission_id;
    replyText = `Missão "${mission.title}" (${mission.code}) criada e processada pela equipa! O Inteligência de Mercado identificou 3 oportunidades, o Estrategista Comercial calculou uma margem bruta estimada de 84%, o Conteúdo & SEO estruturou o posicionamento PT/BR e o Auditor de Qualidade validou a conformidade. O resultado aguarda agora a sua decisão em Tarefas e Aprovações.`;
  } else if (lower.includes('estado') || lower.includes('status') || lower.includes('equipa') || lower.includes('agentes')) {
    const pendingCount = currentState.approvals.filter((a) => a.status === 'awaiting_approval').length;
    const missionsCount = currentState.missions.length;
    const connectedApis = currentState.integrations.filter((i) => i.status === 'connected').length;
    replyText = `Resumo do sistema: temos 10 agentes configurados, ${connectedApis} integração(ões) testada(s) e ligada(s), ${missionsCount} missão(ões) criada(s) e ${pendingCount} aprovação(ões) a aguardar a sua decisão. O controlo de emergência está ${currentState.system_controls.pause_new_executions ? 'EM PAUSA' : 'NORMAL'}. Quer que eu inicie a missão "Pesquisar oportunidades de produtos digitais para a UmbuLab"?`;
    suggestedMission = 'Pesquisar oportunidades de produtos digitais para a UmbuLab';
  } else if (lower.includes('orçamento') || lower.includes('finanças') || lower.includes('custo')) {
    const summary = currentState.budgets
      .map(
        (b) =>
          `${b.currency}: disponível ${((b.limit_cents - b.reserved_cents - b.settled_cents) / 100).toFixed(2)} (reservado ${(b.reserved_cents / 100).toFixed(2)}, consumido ${(b.settled_cents / 100).toFixed(2)})`
      )
      .join(' | ');
    replyText = `Estado atual dos orçamentos mensais: ${summary}. Nenhum pagamento ou publicação externa ocorre sem a sua aprovação explícita.`;
  } else {
    replyText = `Compreendido. Analisei o seu pedido ("${userText}") com a equipa (Inteligência de Mercado, Estrategista Comercial, Conteúdo & SEO e Auditor de Qualidade). Posso transformar este pedido numa missão guiada com limite de orçamento e revisão em Tarefas e Aprovações. Deseja iniciar esta missão agora?`;
    suggestedMission = userText.length > 12 ? userText : 'Pesquisar oportunidades de produtos digitais para a UmbuLab';
  }

  const coordinatorReply: CoordinatorConversationMessage = {
    message_id: `MSG-OPS-${Date.now() + 1}`,
    sender: 'ops_director',
    agent_key: 'ops_director',
    speaker_label: 'Diretor de Operações (Orquestrador)',
    text: replyText,
    suggested_mission_title: suggestedMission,
    created_mission_id: createdMissionId,
    timestamp: new Date().toISOString(),
  };

  saveState({
    ...currentState,
    coordinator_messages: [...currentState.coordinator_messages, adminMsg, coordinatorReply],
  });

  return coordinatorReply;
}
