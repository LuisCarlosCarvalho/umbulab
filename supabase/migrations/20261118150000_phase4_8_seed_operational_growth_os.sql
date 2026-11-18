-- =============================================================================
-- UMBULAB AI GROWTH OS — FASE 4.8: SEED DE ATIVAÇÃO OPERACIONAL E FINOPS
-- Ficheiro: supabase/migrations/20261118150000_phase4_8_seed_operational_growth_os.sql
--
-- OBJETIVO:
--   1. Inicialização idempotente dos 10 agentes canónicos em public.ai_agents.
--   2. Configuração do envelope FinOps inicial (€5/dia = 500 cents).
--   3. Ativação do Kill-Switch de segurança em public.ai_system_controls.
--   4. Registo do catálogo de integração do Google Gemini em public.ai_integrations.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. KILL-SWITCH DE SEGURANÇA (ATIVADO POR DEFEITO NA ATIVAÇÃO INICIAL)
-- -----------------------------------------------------------------------------
INSERT INTO public.ai_system_controls (
  control_key, pause_new_executions, paused_agent_keys, default_adapter_mode, emergency_reason, updated_at
)
VALUES (
  'global',
  true,
  '{}'::text[],
  'auto',
  'Ativação inicial controlada Fase 4.8 — Supervisão manual humana obrigatória',
  now()
)
ON CONFLICT (control_key) DO UPDATE SET
  pause_new_executions = true,
  emergency_reason = 'Ativação inicial controlada Fase 4.8 — Supervisão manual humana obrigatória',
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 2. INICIALIZAÇÃO DOS 10 AGENTES OPERACIONAIS CANÓNICOS
-- -----------------------------------------------------------------------------
INSERT INTO public.ai_agents (
  agent_key, display_name, role_title, summary, status, autonomy_level,
  requires_approval_for, skills, reports_to, preferred_provider, preferred_model,
  temperature, max_tokens, daily_budget_cents, currency_code, allowed_tools, system_prompt
) VALUES
(
  'ops_director',
  'Diretor de Operações de IA',
  'Orquestrador Central & Distribuição de Missões',
  'Decompõe objetivos estratégicos em passos atómicos, valida dependências e submete planos ao administrador humano.',
  'idle',
  'supervised',
  ARRAY['budget_allocation', 'mission_approval', 'external_actions'],
  ARRAY['ops.decompose_mission', 'ops.route_step', 'ops.consolidate_brief'],
  'human_admin',
  'google_gemini',
  'gemini-2.5-flash',
  0.25,
  2048,
  100,
  'EUR',
  ARRAY['dag_planner', 'budget_reservation_rpc', 'approval_gate_router', 'agent_dispatcher'],
  'Atua como Diretor de Operações e Orquestrador Central da UmbuLab. Decompõe objetivos de negócio em planos DAG auditáveis, reserva orçamento antes de executar e exige validação do Auditor de Qualidade.'
),
(
  'market_intel',
  'Inteligência de Mercado',
  'Pesquisa de Tendências, Produtos & Concorrência',
  'Recolhe sinais públicos de procura em Portugal e no Brasil, isolando fontes externas não confiáveis contra prompt injection.',
  'idle',
  'supervised',
  ARRAY['external_actions'],
  ARRAY['research.market_scan', 'research.competitor_matrix', 'research.serp_intent'],
  'ops_director',
  'google_gemini',
  'gemini-2.5-flash',
  0.20,
  2048,
  50,
  'EUR',
  ARRAY['web_market_research', 'competitor_matrix', 'demand_signal_analyzer', 'opportunity_radar_writer'],
  'Atua como Especialista de Inteligência de Mercado (PT/BR/Global). Identifica oportunidades reais de produtos digitais, SaaS e serviços B2B distinguindo sempre factos verificados de hipóteses.'
),
(
  'commercial_analyst',
  'Analista Comercial',
  'Viabilidade, Unit Economics, Margem & Comissão',
  'Classifica oportunidades segundo margem líquida, ticket estimado e esforço operacional em EUR, BRL ou USD.',
  'idle',
  'supervised',
  ARRAY['external_actions'],
  ARRAY['commerce.unit_economics', 'commerce.score_opportunity'],
  'ops_director',
  'google_gemini',
  'gemini-2.5-flash',
  0.20,
  2048,
  50,
  'EUR',
  ARRAY['unit_economics_calculator', 'pricing_simulator_multi_currency', 'offer_scorecard'],
  'Atua como Estrategista Comercial. Avalia unit economics, ticket médio, LTV/CAC, margens em EUR/BRL e viabilidade de ofertas para a UmbuLab.'
),
(
  'marketing_seo',
  'Marketing e SEO',
  'Copywriting, Keywords & Estrutura de Landing Pages',
  'Prepara rascunhos otimizados em pt-PT e pt-BR retidos obrigatoriamente em rascunho até revisão humana L1.',
  'idle',
  'supervised',
  ARRAY['public_content_publish'],
  ARRAY['seo.keyword_cluster', 'marketing.landing_copy', 'marketing.blog_draft'],
  'ops_director',
  'google_gemini',
  'gemini-2.5-flash',
  0.30,
  2048,
  50,
  'EUR',
  ARRAY['seo_cluster_builder', 'landing_page_copywriter', 'locale_adapter_pt_br'],
  'Atua como Especialista de Conteúdo, SEO e Posicionamento. Estrutura páginas de venda, clusters semânticos e copy em pt-PT e pt-BR sem promessas enganosas.'
),
(
  'creative_director',
  'Diretor Criativo',
  'Direção Visual, Storyboards & Prompts Multimédia',
  'Gera guiões visuais e especificações criativas alinhadas à paleta verde/grafite/âmbar da UmbuLab.',
  'idle',
  'supervised',
  ARRAY['brand_asset_publish'],
  ARRAY['creative.ad_angles', 'creative.video_storyboard', 'creative.image_prompt'],
  'ops_director',
  'google_gemini',
  'gemini-2.5-flash',
  0.50,
  2048,
  50,
  'EUR',
  ARRAY['brand_token_validator', 'ad_creative_storyboard', 'ab_visual_brief'],
  'Atua como Diretor Criativo. Desenha conceitos visuais, storyboards e criativos respeitando a paleta verde UmbuLab e grafite.'
),
(
  'traffic_manager',
  'Gestor de Tráfego',
  'Desenho de Testes A/B & Alocação de Verba',
  'Estrutura matrizes de teste A/B; nunca ativa anúncios nem consome orçamento externo sem aprovação humana L2.',
  'idle',
  'supervised',
  ARRAY['ad_spend_activation', 'campaign_launch'],
  ARRAY['traffic.ab_experiment_plan', 'traffic.roas_diagnostics'],
  'ops_director',
  'google_gemini',
  'gemini-2.5-flash',
  0.20,
  2048,
  50,
  'EUR',
  ARRAY['campaign_ab_architect', 'roas_simulator', 'ad_spend_guard'],
  'Atua como Gestor de Tráfego Pago e Experimentação A/B. Planeia campanhas Meta/Google Ads sempre bloqueadas até aprovação L2.'
),
(
  'affiliate_ecom',
  'Afiliados e E-commerce',
  'Curadoria de Programas, Fornecedores & Links HTTPS',
  'Valida termos de plataformas, comissões e domínios HTTPS autorizados antes de qualquer publicação pública.',
  'idle',
  'supervised',
  ARRAY['affiliate_link_publish', 'checkout_integration'],
  ARRAY['affiliate.program_vetting', 'affiliate.link_compliance'],
  'ops_director',
  'google_gemini',
  'gemini-2.5-flash',
  0.20,
  2048,
  50,
  'EUR',
  ARRAY['digital_product_catalog', 'checkout_funnel_mapper', 'appmax_order_sync_readonly'],
  'Atua como Especialista de Afiliados, Produtos Digitais e E-commerce. Analisa ofertas, comissões e integrações comerciais (ex.: Appmax/Stripe).'
),
(
  'b2b_prospector',
  'Prospecção B2B',
  'Oportunidades Consultivas & Propostas UmbuLab',
  'Prepara abordagens B2B personalizadas 1-a-1 com base legal RGPD/LGPD registada e zero envios em massa.',
  'idle',
  'supervised',
  ARRAY['direct_outreach_send', 'contract_generation'],
  ARRAY['b2b.account_research', 'b2b.custom_proposal_draft'],
  'ops_director',
  'google_gemini',
  'gemini-2.5-flash',
  0.25,
  2048,
  50,
  'EUR',
  ARRAY['b2b_account_profiler', 'consultative_cadence_drafter', 'gdpr_lgpd_optout_checker'],
  'Atua como Especialista de Prospeção B2B Consultiva. Prepara abordagens personalizadas em estrita conformidade com RGPD e LGPD.'
),
(
  'finance_analyst',
  'Analista Financeiro',
  'Orçamentos, Liquidação Multi-Moeda & Rentabilidade',
  'Audita tetos de orçamento, exposição cambial (EUR/BRL/USD) e viabilidade financeira antes de gates L2.',
  'idle',
  'supervised',
  ARRAY['budget_increase', 'payout_authorization'],
  ARRAY['finance.budget_guard', 'finance.fx_reconciliation', 'finance.margin_audit'],
  'human_admin',
  'google_gemini',
  'gemini-2.5-flash',
  0.15,
  2048,
  50,
  'EUR',
  ARRAY['atomic_budget_ledger', 'double_entry_validator', 'finops_token_auditor'],
  'Atua como Controller Financeiro e FinOps. Supervisiona envelopes de orçamento multi-moeda (EUR, BRL, USD), reservas atómicas e partidas dobradas.'
),
(
  'quality_auditor',
  'Auditor de Qualidade & AppSec',
  'Conformidade Legal, Brand Safety & Revisão Técnica',
  'Inspeciona rascunhos quanto a RGPD/LGPD, políticas de plataformas e distinção entre factos e estimativas.',
  'idle',
  'supervised',
  ARRAY['final_compliance_signoff'],
  ARRAY['audit.compliance_check', 'audit.rgpd_lgpd_guard', 'audit.hallucination_check'],
  'human_admin',
  'google_gemini',
  'gemini-2.5-flash',
  0.15,
  2048,
  50,
  'EUR',
  ARRAY['fact_vs_hypothesis_checker', 'rgpd_lgpd_compliance_gate', 'secret_leak_scanner'],
  'Atua como Auditor de Qualidade, Brand Safety e AppSec. Inspeciona todas as entregas dos agentes antes de qualquer aprovação humana.'
)
ON CONFLICT (agent_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  role_title = EXCLUDED.role_title,
  summary = EXCLUDED.summary,
  autonomy_level = EXCLUDED.autonomy_level,
  requires_approval_for = EXCLUDED.requires_approval_for,
  skills = EXCLUDED.skills,
  reports_to = EXCLUDED.reports_to,
  preferred_provider = EXCLUDED.preferred_provider,
  preferred_model = EXCLUDED.preferred_model,
  temperature = EXCLUDED.temperature,
  max_tokens = EXCLUDED.max_tokens,
  daily_budget_cents = EXCLUDED.daily_budget_cents,
  allowed_tools = EXCLUDED.allowed_tools,
  system_prompt = EXCLUDED.system_prompt,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- 3. CONFIGURAÇÃO DO ORÇAMENTO GLOBAL FINOPS (€5/DIA = 500 CENTS)
-- -----------------------------------------------------------------------------
-- Remover eventuais orçamentos de teste prévios para garantir o limite estrito
DELETE FROM public.fin_budgets WHERE scope_type = 'global' AND scope_id = 'agency_total';

INSERT INTO public.fin_budgets (
  scope_type, scope_id, allocated_amount_cents, spent_amount_cents, reserved_amount_cents,
  currency_code, period_start, period_end, is_active
) VALUES (
  'global',
  'agency_total',
  500, -- Exatamente €5.00
  0,
  0,
  'EUR',
  CURRENT_DATE,
  CURRENT_DATE + interval '30 days',
  true
);

-- -----------------------------------------------------------------------------
-- 4. CATÁLOGO INICIAL DE INTEGRAÇÕES (GOOGLE GEMINI)
-- -----------------------------------------------------------------------------
INSERT INTO public.ai_integrations (
  provider_key, display_name, category, status, auth_mode, env_var_name,
  has_saved_secret, base_url, rate_limit_per_min, monthly_cap_cents, currency_code, is_active
) VALUES (
  'google_gemini',
  'Google Gemini API (Vertex / AI Studio)',
  'ai_llm',
  'not_configured',
  'api_key',
  'GROWTH_OS_GEMINI_API_KEY',
  false,
  'https://generativelanguage.googleapis.com/v1beta',
  60,
  15000, -- €150.00 / mês teto de segurança
  'EUR',
  true
)
ON CONFLICT (provider_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  env_var_name = EXCLUDED.env_var_name,
  base_url = EXCLUDED.base_url,
  rate_limit_per_min = EXCLUDED.rate_limit_per_min,
  is_active = true,
  updated_at = now();

COMMIT;
