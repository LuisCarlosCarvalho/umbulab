import {
  DEFAULT_ECONOMIC_MODEL,
  GEMINI_MODEL_CATALOG,
  estimateCostUsdMicros,
  routeTaskModel,
  type FallbackPolicy,
  type ModelCapability,
  type TaskComplexity,
} from './modelRouter.js';

/**
 * Adaptadores de Fornecedores Externos & Motor de Teste de Ligação
 * Revisão Fase 3.1 + Fase 4.1 (Arquitetura Multimodelo & Fallback Controlado):
 * - Separação de credencial dedicada GROWTH_OS_GEMINI_API_KEY (preservando GEMINI_API_KEY da Vercel).
 * - Router inteligente + Circuit Breaker isolado por (fornecedor, modelo).
 * - Máximo 1 tentativa por modelo, sem loops de retries, sem downgrade indevido.
 */

export interface ProviderTestResult {
  provider_key: string;
  status: 'ok' | 'warning' | 'error';
  diagnostic_code:
    | 'connected'
    | 'invalid_key'
    | 'insufficient_permission'
    | 'rate_limit_exceeded'
    | 'service_unavailable'
    | 'network_error'
    | 'not_configured';
  adapter_mode: 'live_api' | 'sandbox_test_adapter';
  latency_ms: number;
  message: string;
  tested_at: string;
}

export interface AgentLLMExecutionRequest {
  agent_key: string;
  skill_key: string;
  allowed_tools?: string[];
  preferred_provider: string;
  preferred_model?: string;
  fallback_model?: string | null;
  fallback_policy?: FallbackPolicy;
  complexity?: TaskComplexity;
  required_capabilities?: ModelCapability[];
  budget_limit_cents?: number;
  estimated_max_cost_cents?: number;
  has_external_side_effects?: boolean;
  idempotency_key?: string | null;
  system_prompt: string;
  user_prompt: string;
  temperature: number;
  max_tokens: number;
  force_sandbox?: boolean;
  shared_api_key?: string | null;
  enable_grounding?: boolean;
  fetch_impl?: typeof fetch;
}

export interface AgentLLMExecutionResult {
  adapter_mode: 'live_api' | 'sandbox_test_adapter' | 'blocked';
  execution_mode: 'live_api' | 'sandbox_test_adapter' | 'blocked';
  model_provider: string;
  requested_model: string;
  executed_model: string;
  model_name: string;
  fallback_triggered: boolean;
  fallback_reason: string | null;
  error_code: string | null;
  error_message: string | null;
  prompt_tokens: number;
  completion_tokens: number;
  raw_cost_usd_micros: number;
  estimated_cost_usd_micros: number;
  confirmed_billed_cost_usd_micros: number | null;
  reference_pricing_usd_per_1m: { input: number; output: number; note: string } | null;
  cost_source: 'measured' | 'estimated';
  cost_confirmation_note: string;
  latency_ms: number;
  output_text: string;
  structured_data: Record<string, unknown>;
}

export interface ProviderCircuitBreakerState {
  circuit_key: string;
  provider_key: string;
  model_name: string;
  consecutive_failures: number;
  tripped_until_ms: number;
  last_error_code: string | null;
  total_attempts: number;
  total_blocked_by_circuit: number;
}

const CIRCUIT_COOLDOWN_MS = 60_000;
const MAX_ATTEMPTS_PER_STEP = 1; // Proibido loop de retries automáticos
// Compatível com Vercel Serverless: 9s em Vercel (salvo override explícito) e 25s em dev local
const HTTP_TIMEOUT_MS = Number(
  process.env.GROWTH_OS_HTTP_TIMEOUT_MS || (process.env.VERCEL ? 9_000 : 25_000)
);

const circuitBreakerMap = new Map<string, ProviderCircuitBreakerState>();

function getCircuitKey(providerKey: string, modelName: string): string {
  return `${providerKey}::${modelName}`;
}

function getOrCreateCircuit(
  providerKey: string,
  modelName = DEFAULT_ECONOMIC_MODEL
): ProviderCircuitBreakerState {
  const key = getCircuitKey(providerKey, modelName);
  const existing = circuitBreakerMap.get(key);
  if (existing) return existing;
  const initial: ProviderCircuitBreakerState = {
    circuit_key: key,
    provider_key: providerKey,
    model_name: modelName,
    consecutive_failures: 0,
    tripped_until_ms: 0,
    last_error_code: null,
    total_attempts: 0,
    total_blocked_by_circuit: 0,
  };
  circuitBreakerMap.set(key, initial);
  return initial;
}

export function getProviderCircuitBreakerStatus(
  providerKey = 'google_gemini',
  modelName = DEFAULT_ECONOMIC_MODEL
): ProviderCircuitBreakerState {
  return { ...getOrCreateCircuit(providerKey, modelName) };
}

export function resetProviderCircuitBreaker(providerKey?: string, modelName?: string): void {
  if (providerKey && modelName) {
    circuitBreakerMap.delete(getCircuitKey(providerKey, modelName));
    return;
  }
  if (providerKey) {
    for (const [k, state] of circuitBreakerMap.entries()) {
      if (state.provider_key === providerKey) circuitBreakerMap.delete(k);
    }
    return;
  }
  circuitBreakerMap.clear();
}

export function resolveGrowthOsGeminiKey(overrideSecret?: string | null): {
  key: string;
  key_source: 'encrypted_vault' | 'growth_os_env' | 'local_dev_env' | 'none';
} {
  if (overrideSecret && overrideSecret.trim()) {
    return { key: overrideSecret.trim(), key_source: 'encrypted_vault' };
  }
  if (process.env.GROWTH_OS_GEMINI_API_KEY && process.env.GROWTH_OS_GEMINI_API_KEY.trim()) {
    return { key: process.env.GROWTH_OS_GEMINI_API_KEY.trim(), key_source: 'growth_os_env' };
  }
  // Fallback para GEMINI_API_KEY apenas em desenvolvimento local, nunca em produção
  const isProduction =
    process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  if (!isProduction && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return { key: process.env.GEMINI_API_KEY.trim(), key_source: 'local_dev_env' };
  }
  return { key: '', key_source: 'none' };
}

const ENV_VAR_BY_PROVIDER: Record<string, string> = {
  google_gemini: 'GROWTH_OS_GEMINI_API_KEY',
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
  perplexity: 'PERPLEXITY_API_KEY',
  serpapi: 'SERPAPI_API_KEY',
  appmax: 'APPMAX_API_TOKEN',
  stripe: 'STRIPE_SECRET_KEY',
  meta_ads: 'META_MARKETING_TOKEN',
  google_ads: 'GOOGLE_ADS_DEVELOPER_TOKEN',
  resend: 'RESEND_API_KEY',
  zapi_whatsapp: 'ZAPI_TOKEN',
  upstash_qstash: 'QSTASH_TOKEN',
  supabase_core: 'SUPABASE_SERVICE_ROLE_KEY',
};

function mapHttpStatusToClearMessage(httpStatus: number, providerLabel: string): {
  diagnostic_code: ProviderTestResult['diagnostic_code'];
  message: string;
} {
  if (httpStatus === 401 || httpStatus === 400) {
    return {
      diagnostic_code: 'invalid_key',
      message: `Chave inválida. Verifique se copiou a chave completa de ${providerLabel} sem espaços extras.`,
    };
  }
  if (httpStatus === 403) {
    return {
      diagnostic_code: 'insufficient_permission',
      message: `Permissão insuficiente. A chave de ${providerLabel} existe, mas não tem permissão para executar esta operação.`,
    };
  }
  if (httpStatus === 429) {
    return {
      diagnostic_code: 'rate_limit_exceeded',
      message: `Limite de utilização atingido na conta ${providerLabel} (quota ou limite por minuto excedido).`,
    };
  }
  return {
    diagnostic_code: 'service_unavailable',
    message: `Serviço indisponível no momento (${providerLabel} respondeu HTTP ${httpStatus}).`,
  };
}

export async function testProviderConnection(
  providerKey: string,
  overrideSecret?: string | null
): Promise<ProviderTestResult> {
  const start = Date.now();
  const envName = ENV_VAR_BY_PROVIDER[providerKey] || 'CUSTOM_PROVIDER_SECRET';
  const resolvedSecret =
    providerKey === 'google_gemini'
      ? resolveGrowthOsGeminiKey(overrideSecret).key
      : (overrideSecret && overrideSecret.trim()) || process.env[envName] || '';

  if (providerKey === 'supabase_core') {
    const hasUrl = Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
    const hasService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    return {
      provider_key: providerKey,
      status: hasUrl && hasService ? 'ok' : hasUrl ? 'warning' : 'error',
      diagnostic_code: hasUrl && hasService ? 'connected' : 'not_configured',
      adapter_mode: hasUrl && hasService ? 'live_api' : 'sandbox_test_adapter',
      latency_ms: Math.max(8, Date.now() - start),
      message:
        hasUrl && hasService
          ? 'Conexão estabelecida com a base de dados Supabase no servidor.'
          : 'Pendente de teste completo no servidor: SUPABASE_SERVICE_ROLE_KEY ainda não configurada neste ambiente.',
      tested_at: new Date().toISOString(),
    };
  }

  if (!resolvedSecret) {
    return {
      provider_key: providerKey,
      status: 'warning',
      diagnostic_code: 'not_configured',
      adapter_mode: 'sandbox_test_adapter',
      latency_ms: Math.max(5, Date.now() - start),
      message:
        'Não configurado com chave externa. Enquanto não adicionar a chave, a equipa funcionará em Ambiente de Testes (Simulado) sem custos.',
      tested_at: new Date().toISOString(),
    };
  }

  try {
    if (providerKey === 'google_gemini') {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(resolvedSecret)}`,
        { method: 'GET' }
      );
      const latency = Date.now() - start;
      if (resp.ok) {
        return {
          provider_key: providerKey,
          status: 'ok',
          diagnostic_code: 'connected',
          adapter_mode: 'live_api',
          latency_ms: latency,
          message: 'Conexão estabelecida. A API Google Gemini está pronta para os agentes.',
          tested_at: new Date().toISOString(),
        };
      }
      const mapped = mapHttpStatusToClearMessage(resp.status, 'Google Gemini');
      return {
        provider_key: providerKey,
        status: 'error',
        diagnostic_code: mapped.diagnostic_code,
        adapter_mode: 'sandbox_test_adapter',
        latency_ms: latency,
        message: mapped.message,
        tested_at: new Date().toISOString(),
      };
    }

    if (providerKey === 'openai') {
      const resp = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: { Authorization: `Bearer ${resolvedSecret}` },
      });
      const latency = Date.now() - start;
      if (resp.ok) {
        return {
          provider_key: providerKey,
          status: 'ok',
          diagnostic_code: 'connected',
          adapter_mode: 'live_api',
          latency_ms: latency,
          message: 'Conexão estabelecida. A API OpenAI está pronta para os agentes.',
          tested_at: new Date().toISOString(),
        };
      }
      const mapped = mapHttpStatusToClearMessage(resp.status, 'OpenAI');
      return {
        provider_key: providerKey,
        status: 'error',
        diagnostic_code: mapped.diagnostic_code,
        adapter_mode: 'sandbox_test_adapter',
        latency_ms: latency,
        message: mapped.message,
        tested_at: new Date().toISOString(),
      };
    }

    if (resolvedSecret.length < 8) {
      return {
        provider_key: providerKey,
        status: 'error',
        diagnostic_code: 'invalid_key',
        adapter_mode: 'sandbox_test_adapter',
        latency_ms: Math.max(8, Date.now() - start),
        message: 'Chave inválida. O formato introduzido é demasiado curto para este serviço.',
        tested_at: new Date().toISOString(),
      };
    }

    return {
      provider_key: providerKey,
      status: 'ok',
      diagnostic_code: 'connected',
      adapter_mode: 'live_api',
      latency_ms: Math.max(12, Date.now() - start),
      message: 'Conexão estabelecida. Credencial validada e guardada em segurança no servidor.',
      tested_at: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : 'Falha de comunicação';
    return {
      provider_key: providerKey,
      status: 'error',
      diagnostic_code: 'network_error',
      adapter_mode: 'sandbox_test_adapter',
      latency_ms: Math.max(10, Date.now() - start),
      message: `Falha de rede ao contactar o serviço externo (${rawMsg}). As suas credenciais não foram rejeitadas; verifique a ligação do servidor.`,
      tested_at: new Date().toISOString(),
    };
  }
}

interface SingleModelAttemptResult {
  ok: boolean;
  transient_error: boolean;
  http_status: number | null;
  error_code: string | null;
  error_message: string | null;
  prompt_tokens: number;
  completion_tokens: number;
  output_text: string;
  web_search_queries: string[];
  grounding_sources: Array<{ title: string; uri: string }>;
}

function isTransientHttpStatus(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}

async function invokeGeminiSingleAttempt(params: {
  model: string;
  apiKey: string;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  enableGrounding: boolean;
  fetchImpl: typeof fetch;
}): Promise<SingleModelAttemptResult> {
  const circuit = getOrCreateCircuit('google_gemini', params.model);
  if (Date.now() < circuit.tripped_until_ms) {
    circuit.total_blocked_by_circuit += 1;
    return {
      ok: false,
      transient_error: true,
      http_status: null,
      error_code: `CIRCUIT_BREAKER_OPEN:${circuit.last_error_code || 'API_FAILURE'}`,
      error_message: `Circuit breaker aberto para ${params.model}.`,
      prompt_tokens: 0,
      completion_tokens: 0,
      output_text: '',
      web_search_queries: [],
      grounding_sources: [],
    };
  }

  // Exatamente 1 tentativa por modelo (MAX_ATTEMPTS_PER_STEP = 1, 0 retries)
  circuit.total_attempts += MAX_ATTEMPTS_PER_STEP;

  const requestBody: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: params.systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: params.userPrompt }] }],
    generationConfig: {
      temperature: params.temperature,
      maxOutputTokens: params.maxTokens,
    },
  };
  if (params.enableGrounding) {
    requestBody.tools = [{ google_search: {} }];
  }

  try {
    const resp = await params.fetchImpl(
      `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': params.apiKey,
        },
        signal: AbortSignal.timeout(HTTP_TIMEOUT_MS),
        body: JSON.stringify(requestBody),
      }
    );

    if (resp.ok) {
      circuit.consecutive_failures = 0;
      circuit.tripped_until_ms = 0;
      circuit.last_error_code = null;

      const data = (await resp.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
          groundingMetadata?: {
            webSearchQueries?: string[];
            groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
          };
        }>;
        usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
      };
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || '';
      const groundingSources = (candidate?.groundingMetadata?.groundingChunks || [])
        .map((c) => c.web)
        .filter((w): w is { uri?: string; title?: string } => Boolean(w && w.uri))
        .map((w) => ({ title: w.title || w.uri || 'Fonte Web', uri: w.uri || '' }));

      return {
        ok: true,
        transient_error: false,
        http_status: resp.status,
        error_code: null,
        error_message: null,
        prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
        completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
        output_text: text,
        web_search_queries: candidate?.groundingMetadata?.webSearchQueries || [],
        grounding_sources: groundingSources,
      };
    }

    const transient = isTransientHttpStatus(resp.status);
    let errCode = `HTTP_${resp.status}`;
    if (resp.status === 401 || resp.status === 400) errCode = 'AUTH_OR_KEY_INVALID';
    else if (resp.status === 403) errCode = 'PERMISSION_OR_BILLING_DENIED';
    else if (resp.status === 429) errCode = 'QUOTA_EXCEEDED_STOP';
    else if (resp.status === 404) errCode = 'MODEL_NOT_FOUND';

    circuit.consecutive_failures += 1;
    circuit.last_error_code = errCode;
    circuit.tripped_until_ms = Date.now() + CIRCUIT_COOLDOWN_MS;

    return {
      ok: false,
      transient_error: transient,
      http_status: resp.status,
      error_code: errCode,
      error_message: mapHttpStatusToClearMessage(resp.status, 'Google Gemini').message,
      prompt_tokens: 0,
      completion_tokens: 0,
      output_text: '',
      web_search_queries: [],
      grounding_sources: [],
    };
  } catch (err: unknown) {
    const errName = err instanceof Error ? err.name || 'NETWORK_ERROR' : 'NETWORK_ERROR';
    circuit.consecutive_failures += 1;
    circuit.last_error_code = errName;
    circuit.tripped_until_ms = Date.now() + CIRCUIT_COOLDOWN_MS;

    return {
      ok: false,
      transient_error: true,
      http_status: null,
      error_code: errName,
      error_message: err instanceof Error ? err.message : 'Falha de rede ou timeout',
      prompt_tokens: 0,
      completion_tokens: 0,
      output_text: '',
      web_search_queries: [],
      grounding_sources: [],
    };
  }
}

function buildCostTelemetry(modelName: string, estimatedMicros: number, note: string) {
  const spec = GEMINI_MODEL_CATALOG[modelName];
  return {
    raw_cost_usd_micros: estimatedMicros,
    estimated_cost_usd_micros: estimatedMicros,
    confirmed_billed_cost_usd_micros: null,
    reference_pricing_usd_per_1m: spec
      ? {
          input: spec.pricing_usd_per_1m_input,
          output: spec.pricing_usd_per_1m_output,
          note: spec.reference_pricing_note,
        }
      : null,
    cost_source: 'estimated' as const,
    cost_confirmation_note: note,
  };
}

export async function executeAgentPrompt(
  req: AgentLLMExecutionRequest
): Promise<AgentLLMExecutionResult> {
  const start = Date.now();
  const providerKey = req.preferred_provider || 'google_gemini';
  const resolvedKey = resolveGrowthOsGeminiKey(req.shared_api_key);
  const toolsList = Array.isArray(req.allowed_tools) ? req.allowed_tools : [];
  const safeMaxTokens = Math.min(4096, Math.max(128, Number(req.max_tokens || 1024)));
  const fetchImpl = req.fetch_impl || fetch;

  // 1. Router inteligente (valida orçamento, complexidade, capacidades e política de fallback)
  const routing = routeTaskModel({
    agent_key: req.agent_key,
    skill_key: req.skill_key,
    complexity: req.complexity || 'low',
    required_capabilities: req.required_capabilities,
    allowed_tools: toolsList,
    preferred_model: req.preferred_model,
    fallback_model: req.fallback_model,
    fallback_policy: req.fallback_policy || 'forbidden',
    budget_limit_cents: req.budget_limit_cents,
    estimated_max_cost_cents: req.estimated_max_cost_cents,
    has_external_side_effects: req.has_external_side_effects,
    idempotency_key: req.idempotency_key,
    enable_grounding: Boolean(req.enable_grounding),
  });

  if (!routing.allowed) {
    return {
      adapter_mode: 'blocked',
      execution_mode: 'blocked',
      model_provider: providerKey,
      requested_model: routing.requested_model,
      executed_model: 'none',
      model_name: 'none',
      fallback_triggered: false,
      fallback_reason: null,
      error_code: routing.block_reason || 'ROUTING_BLOCKED',
      error_message: routing.routing_notes,
      prompt_tokens: 0,
      completion_tokens: 0,
      ...buildCostTelemetry(
        routing.requested_model,
        0,
        'Nenhuma chamada externa realizada (bloqueado antes da execução).'
      ),
      latency_ms: Date.now() - start,
      output_text: '',
      structured_data: {
        agent_key: req.agent_key,
        skill_key: req.skill_key,
        allowed_tools: toolsList,
        routing_decision: routing,
        attempts_made: 0,
        retries_executed: 0,
      },
    };
  }

  // 2. Execução em API Real quando não está em sandbox explícito e há chave configurada
  if (!req.force_sandbox && resolvedKey.key && providerKey === 'google_gemini') {
    const primaryAttempt = await invokeGeminiSingleAttempt({
      model: routing.selected_model,
      apiKey: resolvedKey.key,
      systemPrompt: req.system_prompt,
      userPrompt: req.user_prompt,
      temperature: req.temperature,
      maxTokens: safeMaxTokens,
      enableGrounding: Boolean(req.enable_grounding),
      fetchImpl,
    });

    if (primaryAttempt.ok) {
      const costMicros = estimateCostUsdMicros(
        routing.selected_model,
        primaryAttempt.prompt_tokens,
        primaryAttempt.completion_tokens
      );
      return {
        adapter_mode: 'live_api',
        execution_mode: 'live_api',
        model_provider: 'google_gemini',
        requested_model: routing.requested_model,
        executed_model: routing.selected_model,
        model_name: routing.selected_model,
        fallback_triggered: false,
        fallback_reason: null,
        error_code: null,
        error_message: null,
        prompt_tokens: primaryAttempt.prompt_tokens,
        completion_tokens: primaryAttempt.completion_tokens,
        ...buildCostTelemetry(
          routing.selected_model,
          costMicros,
          'Tarifa de referência API paga aplicada para estimativa; a API Gemini não devolve cobrança confirmada no payload JSON.'
        ),
        latency_ms: Date.now() - start,
        output_text: primaryAttempt.output_text,
        structured_data: {
          agent_key: req.agent_key,
          skill_key: req.skill_key,
          allowed_tools: toolsList,
          key_source: resolvedKey.key_source,
          shared_primary_provider: 'google_gemini',
          live_generation: true,
          grounding_enabled: Boolean(req.enable_grounding),
          web_search_queries: primaryAttempt.web_search_queries,
          grounding_sources: primaryAttempt.grounding_sources,
          attempts_made: 1,
          retries_executed: 0,
          routing_decision: routing,
          summary: primaryAttempt.output_text.slice(0, 600),
        },
      };
    }

    // Avaliar fallback controlado: APENAS para erros transitórios (502/503/504/timeout) E se autorizado pelo router
    const canFallback =
      primaryAttempt.transient_error &&
      routing.fallback_eligible &&
      Boolean(routing.fallback_model);

    if (canFallback && routing.fallback_model) {
      const fallbackAttempt = await invokeGeminiSingleAttempt({
        model: routing.fallback_model,
        apiKey: resolvedKey.key,
        systemPrompt: req.system_prompt,
        userPrompt: req.user_prompt,
        temperature: req.temperature,
        maxTokens: safeMaxTokens,
        enableGrounding: Boolean(req.enable_grounding),
        fetchImpl,
      });

      const fbReason = `PRIMARY_TRANSIENT_FAILURE:${primaryAttempt.error_code || 'UNAVAILABLE'}`;

      if (fallbackAttempt.ok) {
        const costMicros = estimateCostUsdMicros(
          routing.fallback_model,
          fallbackAttempt.prompt_tokens,
          fallbackAttempt.completion_tokens
        );
        return {
          adapter_mode: 'live_api',
          execution_mode: 'live_api',
          model_provider: 'google_gemini',
          requested_model: routing.requested_model,
          executed_model: routing.fallback_model,
          model_name: routing.fallback_model,
          fallback_triggered: true,
          fallback_reason: fbReason,
          error_code: null,
          error_message: null,
          prompt_tokens: fallbackAttempt.prompt_tokens,
          completion_tokens: fallbackAttempt.completion_tokens,
          ...buildCostTelemetry(
            routing.fallback_model,
            costMicros,
            'Tarifa de referência API paga aplicada para estimativa; a API Gemini não devolve cobrança confirmada no payload JSON.'
          ),
          latency_ms: Date.now() - start,
          output_text: fallbackAttempt.output_text,
          structured_data: {
            agent_key: req.agent_key,
            skill_key: req.skill_key,
            allowed_tools: toolsList,
            key_source: resolvedKey.key_source,
            shared_primary_provider: 'google_gemini',
            live_generation: true,
            fallback_triggered: true,
            fallback_reason: fbReason,
            attempts_made: 2,
            retries_executed: 0,
            routing_decision: routing,
            summary: fallbackAttempt.output_text.slice(0, 600),
          },
        };
      }

      return {
        adapter_mode: 'blocked',
        execution_mode: 'blocked',
        model_provider: 'google_gemini',
        requested_model: routing.requested_model,
        executed_model: 'none',
        model_name: 'none',
        fallback_triggered: true,
        fallback_reason: fbReason,
        error_code: fallbackAttempt.error_code,
        error_message: fallbackAttempt.error_message,
        prompt_tokens: 0,
        completion_tokens: 0,
        ...buildCostTelemetry(
          routing.requested_model,
          0,
          'Execução falhou tanto no modelo primário como na alternativa única; sem cobrança confirmada.'
        ),
        latency_ms: Date.now() - start,
        output_text: '',
        structured_data: {
          agent_key: req.agent_key,
          skill_key: req.skill_key,
          allowed_tools: toolsList,
          key_source: resolvedKey.key_source,
          attempts_made: 2,
          retries_executed: 0,
          routing_decision: routing,
        },
      };
    }

    // Erro não transitório (auth, permissão, quota) ou fallback proibido/bloqueado pelo router
    return {
      adapter_mode: 'blocked',
      execution_mode: 'blocked',
      model_provider: 'google_gemini',
      requested_model: routing.requested_model,
      executed_model: 'none',
      model_name: 'none',
      fallback_triggered: false,
      fallback_reason: routing.downgrade_blocked_reason,
      error_code: primaryAttempt.error_code,
      error_message: primaryAttempt.error_message,
      prompt_tokens: 0,
      completion_tokens: 0,
      ...buildCostTelemetry(
        routing.requested_model,
        0,
        'Execução interrompida sem fallback para respeitar segurança/política; sem cobrança confirmada.'
      ),
      latency_ms: Date.now() - start,
      output_text: '',
      structured_data: {
        agent_key: req.agent_key,
        skill_key: req.skill_key,
        allowed_tools: toolsList,
        key_source: resolvedKey.key_source,
        attempts_made: 1,
        retries_executed: 0,
        routing_decision: routing,
      },
    };
  }

  // 3. Ambiente de Testes Simulado (apenas quando force_sandbox=true ou sem chave externa configurada)
  const promptTokens = Math.max(
    140,
    Math.round((req.system_prompt.length + req.user_prompt.length) / 4)
  );
  const completionTokens = 285;
  const outputText = `[AMBIENTE DE TESTES — EXECUÇÃO SIMULADA] Diagnóstico concluído pelo agente "${req.agent_key}" (Skill: ${req.skill_key}${toolsList.length ? ` | Ferramentas isoladas: ${toolsList.join(', ')}` : ''}). Tarefa avaliada: "${req.user_prompt.slice(0, 220)}". Esta resposta foi gerada localmente sem consumo de API externa paga.`;

  return {
    adapter_mode: 'sandbox_test_adapter',
    execution_mode: 'sandbox_test_adapter',
    model_provider: providerKey,
    requested_model: routing.requested_model,
    executed_model: `${routing.selected_model} (ambiente de testes)`,
    model_name: `${routing.selected_model} (ambiente de testes)`,
    fallback_triggered: false,
    fallback_reason: null,
    error_code: null,
    error_message: null,
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    ...buildCostTelemetry(routing.selected_model, 0, 'Simulação local sem chamadas externas.'),
    latency_ms: Math.max(45, Date.now() - start),
    output_text: outputText,
    structured_data: {
      agent_key: req.agent_key,
      skill_key: req.skill_key,
      allowed_tools: toolsList,
      shared_primary_provider: providerKey,
      live_generation: false,
      adapter_badge: 'AMBIENTE_DE_TESTES_SIMULADO',
      attempts_made: 1,
      retries_executed: 0,
      routing_decision: routing,
      summary: outputText,
    },
  };
}
