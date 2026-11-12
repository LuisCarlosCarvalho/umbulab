/**
 * Router Inteligente Multimodelo do UmbuLab AI Growth OS (Fase 4.1).
 * Centraliza capacidades, seleção por complexidade, bloqueio de downgrade indevido,
 * controlo orçamental prévio e política estrita de fallback sem retries em loop.
 */

export type ModelCapability =
  | 'text_generation'
  | 'classification'
  | 'summarization'
  | 'structured_json'
  | 'data_organization'
  | 'deep_reasoning'
  | 'complex_orchestration'
  | 'grounding_search';

export type TaskComplexity = 'low' | 'medium' | 'high';

export type FallbackPolicy = 'forbidden' | 'on_transient_error_only';

export type ModelOperationalStatus = 'validated_live' | 'candidate_unverified';

export interface GeminiModelSpec {
  model_name: string;
  provider_key: 'google_gemini';
  tier: 'economic' | 'advanced';
  operational_status: ModelOperationalStatus;
  supported_complexities: TaskComplexity[];
  capabilities: ModelCapability[];
  pricing_usd_per_1m_input: number;
  pricing_usd_per_1m_output: number;
  reference_pricing_note: string;
}

export const DEFAULT_ECONOMIC_MODEL = 'gemini-3.5-flash-lite';
export const DEFAULT_ADVANCED_CANDIDATE_MODEL = 'gemini-3.8-flash';

export const GEMINI_MODEL_CATALOG: Record<string, GeminiModelSpec> = {
  'gemini-3.5-flash-lite': {
    model_name: 'gemini-3.5-flash-lite',
    provider_key: 'google_gemini',
    tier: 'economic',
    operational_status: 'validated_live',
    supported_complexities: ['low', 'medium'],
    capabilities: [
      'text_generation',
      'classification',
      'summarization',
      'structured_json',
      'data_organization',
    ],
    pricing_usd_per_1m_input: 0.3,
    pricing_usd_per_1m_output: 2.5,
    reference_pricing_note:
      'Tarifa oficial API paga Google Gemini ($0.30/1M input, $2.50/1M output incl. thinking). No Free Tier, não há cobrança por pedido dentro da quota.',
  },
  'gemini-3.8-flash': {
    model_name: 'gemini-3.8-flash',
    provider_key: 'google_gemini',
    tier: 'advanced',
    operational_status: 'candidate_unverified',
    supported_complexities: ['low', 'medium', 'high'],
    capabilities: [
      'text_generation',
      'classification',
      'summarization',
      'structured_json',
      'data_organization',
      'deep_reasoning',
      'complex_orchestration',
      'grounding_search',
    ],
    pricing_usd_per_1m_input: 0.75,
    pricing_usd_per_1m_output: 3.75,
    reference_pricing_note:
      'Tarifa introdutória API paga até 31/12/2026 ($0.75/1M input, $3.75/1M output; padrão $1.50/$7.50 a partir de 01/01/2027).',
  },
  'gemini-3.7-flash': {
    model_name: 'gemini-3.7-flash',
    provider_key: 'google_gemini',
    tier: 'advanced',
    operational_status: 'candidate_unverified',
    supported_complexities: ['low', 'medium', 'high'],
    capabilities: [
      'text_generation',
      'classification',
      'summarization',
      'structured_json',
      'data_organization',
      'deep_reasoning',
      'complex_orchestration',
      'grounding_search',
    ],
    pricing_usd_per_1m_input: 0.75,
    pricing_usd_per_1m_output: 3.75,
    reference_pricing_note: 'Tarifa de referência API paga ($0.75/1M input, $3.75/1M output).',
  },
};

export interface ModelRoutingTaskSpec {
  agent_key: string;
  skill_key: string;
  complexity: TaskComplexity;
  required_capabilities?: ModelCapability[];
  allowed_tools?: string[];
  preferred_model?: string;
  fallback_model?: string | null;
  fallback_policy?: FallbackPolicy;
  budget_limit_cents?: number;
  estimated_max_cost_cents?: number;
  has_external_side_effects?: boolean;
  idempotency_key?: string | null;
  enable_grounding?: boolean;
}

export interface ModelRoutingDecision {
  allowed: boolean;
  requested_model: string;
  selected_model: string;
  fallback_model: string | null;
  fallback_eligible: boolean;
  block_reason: string | null;
  downgrade_blocked_reason: string | null;
  routing_notes: string;
}

function modelSupportsTask(
  spec: GeminiModelSpec,
  complexity: TaskComplexity,
  requiredCapabilities: ModelCapability[]
): { ok: boolean; reason: string | null } {
  if (!spec.supported_complexities.includes(complexity)) {
    return {
      ok: false,
      reason: `COMPLEXITY_UNSUPPORTED:${spec.model_name}_does_not_support_${complexity}`,
    };
  }
  const missingCaps = requiredCapabilities.filter((cap) => !spec.capabilities.includes(cap));
  if (missingCaps.length > 0) {
    return {
      ok: false,
      reason: `CAPABILITY_MISMATCH:${spec.model_name}_missing_${missingCaps.join(',')}`,
    };
  }
  return { ok: true, reason: null };
}

export function estimateCostUsdMicros(
  modelName: string,
  promptTokens: number,
  completionTokens: number
): number {
  const spec = GEMINI_MODEL_CATALOG[modelName] || GEMINI_MODEL_CATALOG[DEFAULT_ECONOMIC_MODEL];
  const inputUsd = (promptTokens / 1_000_000) * spec.pricing_usd_per_1m_input;
  const outputUsd = (completionTokens / 1_000_000) * spec.pricing_usd_per_1m_output;
  return Math.max(0, Math.round((inputUsd + outputUsd) * 1_000_000));
}

export function routeTaskModel(task: ModelRoutingTaskSpec): ModelRoutingDecision {
  const requiredCaps: ModelCapability[] = Array.isArray(task.required_capabilities)
    ? [...task.required_capabilities]
    : ['text_generation'];

  if (task.enable_grounding && !requiredCaps.includes('grounding_search')) {
    requiredCaps.push('grounding_search');
  }

  // Inferir complexidade e capacidades mínimas para tarefas simples caso não especificadas
  const complexity: TaskComplexity = task.complexity || 'low';
  const defaultPreferred =
    complexity === 'high' ? DEFAULT_ADVANCED_CANDIDATE_MODEL : DEFAULT_ECONOMIC_MODEL;
  const requestedModel = (task.preferred_model || defaultPreferred).trim();

  // 1. Verificação estrita de orçamento antes de qualquer seleção/chamada externa
  if (typeof task.budget_limit_cents === 'number') {
    if (task.budget_limit_cents <= 0) {
      return {
        allowed: false,
        requested_model: requestedModel,
        selected_model: requestedModel,
        fallback_model: null,
        fallback_eligible: false,
        block_reason: 'BUDGET_LIMIT_REACHED',
        downgrade_blocked_reason: null,
        routing_notes: 'Execução bloqueada: limite financeiro da tarefa/missão é <= 0.',
      };
    }
    if (
      typeof task.estimated_max_cost_cents === 'number' &&
      task.estimated_max_cost_cents > task.budget_limit_cents
    ) {
      return {
        allowed: false,
        requested_model: requestedModel,
        selected_model: requestedModel,
        fallback_model: null,
        fallback_eligible: false,
        block_reason: 'ESTIMATED_COST_EXCEEDS_BUDGET',
        downgrade_blocked_reason: null,
        routing_notes: `Execução bloqueada: custo máximo estimado (${task.estimated_max_cost_cents} cêntimos) excede o teto (${task.budget_limit_cents} cêntimos).`,
      };
    }
  }

  const primarySpec = GEMINI_MODEL_CATALOG[requestedModel];
  if (!primarySpec) {
    return {
      allowed: false,
      requested_model: requestedModel,
      selected_model: requestedModel,
      fallback_model: null,
      fallback_eligible: false,
      block_reason: `UNSUPPORTED_MODEL:${requestedModel}`,
      downgrade_blocked_reason: null,
      routing_notes: `Modelo "${requestedModel}" não consta no catálogo autorizado do Growth OS.`,
    };
  }

  const primaryCheck = modelSupportsTask(primarySpec, complexity, requiredCaps);
  if (!primaryCheck.ok) {
    return {
      allowed: false,
      requested_model: requestedModel,
      selected_model: requestedModel,
      fallback_model: null,
      fallback_eligible: false,
      block_reason: primaryCheck.reason,
      downgrade_blocked_reason: primaryCheck.reason,
      routing_notes: `Modelo solicitado "${requestedModel}" incompatível com a tarefa (${primaryCheck.reason}).`,
    };
  }

  // 2. Avaliar política de fallback sem nunca rebaixar tarefas complexas para modelo incapaz
  const policy: FallbackPolicy = task.fallback_policy || 'forbidden';
  const candidateFallback =
    task.fallback_model === undefined
      ? policy === 'on_transient_error_only' && requestedModel !== DEFAULT_ECONOMIC_MODEL
        ? DEFAULT_ECONOMIC_MODEL
        : null
      : task.fallback_model;

  if (policy === 'forbidden' || !candidateFallback) {
    return {
      allowed: true,
      requested_model: requestedModel,
      selected_model: requestedModel,
      fallback_model: null,
      fallback_eligible: false,
      block_reason: null,
      downgrade_blocked_reason: policy === 'forbidden' ? 'FALLBACK_POLICY_FORBIDDEN' : null,
      routing_notes: `Modelo "${requestedModel}" selecionado sem fallback autorizado.`,
    };
  }

  if (task.has_external_side_effects && !task.idempotency_key) {
    return {
      allowed: true,
      requested_model: requestedModel,
      selected_model: requestedModel,
      fallback_model: null,
      fallback_eligible: false,
      block_reason: null,
      downgrade_blocked_reason: 'MISSING_IDEMPOTENCY_FOR_EXTERNAL_EFFECT',
      routing_notes:
        'Fallback bloqueado: tarefa com efeitos externos requer idempotency_key antes de permitir alternativa.',
    };
  }

  const fallbackSpec = GEMINI_MODEL_CATALOG[candidateFallback];
  if (!fallbackSpec) {
    return {
      allowed: true,
      requested_model: requestedModel,
      selected_model: requestedModel,
      fallback_model: null,
      fallback_eligible: false,
      block_reason: null,
      downgrade_blocked_reason: `FALLBACK_MODEL_NOT_IN_CATALOG:${candidateFallback}`,
      routing_notes: `Fallback "${candidateFallback}" ignorado por não existir no catálogo.`,
    };
  }

  const fallbackCheck = modelSupportsTask(fallbackSpec, complexity, requiredCaps);
  if (!fallbackCheck.ok) {
    return {
      allowed: true,
      requested_model: requestedModel,
      selected_model: requestedModel,
      fallback_model: null,
      fallback_eligible: false,
      block_reason: null,
      downgrade_blocked_reason: fallbackCheck.reason,
      routing_notes: `Fallback para "${candidateFallback}" bloqueado: tarefa exige capacidade/complexidade ausente no modelo económico (${fallbackCheck.reason}).`,
    };
  }

  return {
    allowed: true,
    requested_model: requestedModel,
    selected_model: requestedModel,
    fallback_model: candidateFallback,
    fallback_eligible: true,
    block_reason: null,
    downgrade_blocked_reason: null,
    routing_notes: `Modelo "${requestedModel}" selecionado; alternativa "${candidateFallback}" autorizada apenas para falha transitória.`,
  };
}

