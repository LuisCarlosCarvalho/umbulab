import React, { useState } from 'react';
import {
  X,
  Bot,
  Settings,
  Wrench,
  Activity,
  FlaskConical,
  CheckCircle2,
  Play,
  Save,
  PauseCircle,
  PlayCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import type {
  AgentAutonomyMode,
  GrowthOsCurrency,
  OperationalAgentConfig,
  OperationalTaskRunRecord,
} from '../../../../types/growthOs';
import {
  runIndividualAgentDiagnosticTest,
  updateAgentConfiguration,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { formatCents } from '../mockPreviewData';
import { showToast } from '../../../../components/ui/Toast';
import {
  ExperienceModeSwitch,
  FieldLabelWithHelp,
  formatFriendlyAdapterMode,
  formatFriendlyAutonomy,
} from './GrowthOsHelpSystem';

interface AgentDetailModalProps {
  agent: OperationalAgentConfig;
  initialTab?: 'overview' | 'config' | 'tools' | 'runs' | 'tests';
  onClose: () => void;
}

const COMPATIBLE_MODELS_BY_PROVIDER: Record<
  string,
  Array<{ id: string; label: string; summary: string }>
> = {
  google_gemini: [
    {
      id: 'gemini-2.5-flash',
      label: 'Gemini 2.5 Flash (Recomendado — Rápido e Económico)',
      summary: 'Ideal para pesquisa, rascunhos de conteúdo, cálculos comerciais e triagem rápida.',
    },
    {
      id: 'gemini-2.5-pro',
      label: 'Gemini 2.5 Pro (Raciocínio Profundo e Auditoria)',
      summary: 'Ideal para planeamento estratégico do Coordenador e revisão rigorosa de qualidade.',
    },
  ],
  openai: [
    {
      id: 'gpt-4o-mini',
      label: 'GPT-4o Mini (Rápido e Económico)',
      summary: 'Modelo leve da OpenAI para tarefas diárias de texto e classificação.',
    },
    {
      id: 'gpt-4o',
      label: 'GPT-4o (Análise Completa e Criatividade)',
      summary: 'Modelo principal da OpenAI para estratégias complexas e copywriting.',
    },
  ],
  anthropic: [
    {
      id: 'claude-3-5-haiku-latest',
      label: 'Claude 3.5 Haiku (Rápido)',
      summary: 'Respostas rápidas para resumos e validações.',
    },
    {
      id: 'claude-3-7-sonnet-latest',
      label: 'Claude 3.7 Sonnet (Redação Editorial e Auditoria)',
      summary: 'Excelente para textos longos em português e verificação de conformidade.',
    },
  ],
};

const AUTONOMY_OPTIONS: Array<{
  mode: AgentAutonomyMode;
  title: string;
  subtitle: string;
  allowed: string;
  forbidden: string;
}> = [
  {
    mode: 'read_only',
    title: 'Apenas analisar',
    subtitle: 'O agente apenas lê dados e responde a perguntas sem criar propostas nem alterar registos.',
    allowed: 'Consultar informações internas, analisar métricas e responder a diagnósticos.',
    forbidden: 'Nunca cria campanhas, nunca altera configurações e nunca executa ações externas.',
  },
  {
    mode: 'approval_required',
    title: 'Criar propostas para aprovação (Recomendado)',
    subtitle: 'O agente prepara o trabalho completo, mas aguarda sempre a sua autorização em Tarefas e Aprovações.',
    allowed: 'Pesquisar oportunidades, redigir textos, planear campanhas A/B e preparar relatórios para revisão.',
    forbidden: 'Nunca publica anúncios, nunca envia mensagens a clientes e nunca gasta orçamento externo sem a sua aprovação.',
  },
  {
    mode: 'draft_only',
    title: 'Guardar apenas como rascunho interno',
    subtitle: 'O agente gera rascunhos de trabalho e guarda-os internamente para consulta.',
    allowed: 'Criar rascunhos de textos, ideias criativas e estudos preliminares.',
    forbidden: 'Nunca executa operações financeiras nem comunica com serviços externos.',
  },
  {
    mode: 'auto_low_risk',
    title: 'Executar ações internas autorizadas',
    subtitle: 'Permite concluir tarefas internas de baixo risco automaticamente dentro do limite diário.',
    allowed: 'Organizar relatórios internos, classificar oportunidades e validar listas de verificação.',
    forbidden: 'Continua proibido de fazer pagamentos, publicar campanhas pagas ou apagar dados de clientes.',
  },
];

const ALL_AVAILABLE_TOOLS = [
  {
    key: 'dag_planner',
    label: 'Planeador de Missões (Divide um objetivo em passos claros para a equipa)',
  },
  {
    key: 'budget_reservation_rpc',
    label: 'Reserva de Orçamento (Catia o valor máximo autorizado antes de iniciar a missão)',
  },
  {
    key: 'approval_gate_router',
    label: 'Encaminhamento para Aprovação (Envia o resultado para revisão do Administrador)',
  },
  {
    key: 'web_market_research',
    label: 'Pesquisa de Mercado (Procura tendências, ofertas e sinais de procura)',
  },
  {
    key: 'competitor_matrix',
    label: 'Comparador de Concorrência (Analisa pontos fortes e fracos do mercado)',
  },
  {
    key: 'opportunity_radar_writer',
    label: 'Registo no Radar de Oportunidades (Guarda oportunidades encontradas na dashboard)',
  },
  {
    key: 'unit_economics_calculator',
    label: 'Calculadora de Margem e Viabilidade (Calcula custos, preços e lucro estimado)',
  },
  {
    key: 'pricing_simulator_multi_currency',
    label: 'Simulador de Preços em EUR, BRL e USD',
  },
  {
    key: 'seo_cluster_builder',
    label: 'Planeador de Temas para Google/SEO (Sugere tópicos de artigos e páginas)',
  },
  {
    key: 'landing_page_copywriter',
    label: 'Redator de Páginas de Venda (Cria textos em português de Portugal e do Brasil)',
  },
  {
    key: 'brand_token_validator',
    label: 'Verificador da Identidade UmbuLab (Garante o estilo visual e tom da marca)',
  },
  {
    key: 'campaign_ab_architect',
    label: 'Criador de Testes A/B (Prepara duas versões de campanha em modo rascunho)',
  },
  {
    key: 'appmax_order_sync_readonly',
    label: 'Leitura Comercial Appmax/Stripe (Consulta vendas apenas para relatório)',
  },
  {
    key: 'b2b_account_profiler',
    label: 'Analisador de Empresas B2B (Prepara abordagens comerciais respeitando RGPD/LGPD)',
  },
  {
    key: 'atomic_budget_ledger',
    label: 'Controlador de Orçamento e Livro-Razão Financeiro',
  },
  {
    key: 'fact_vs_hypothesis_checker',
    label: 'Verificador de Evidências vs. Hipóteses (Evita afirmações sem prova)',
  },
  {
    key: 'rgpd_lgpd_compliance_gate',
    label: 'Filtro de Privacidade RGPD/LGPD e Proteção de Chaves Secretas',
  },
];

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent: initialAgent,
  initialTab = 'config',
  onClose,
}) => {
  const state = useGrowthOsRuntime();
  const liveAgent = state.agents.find((a) => a.agent_key === initialAgent.agent_key) || initialAgent;
  const agentRuns = state.task_runs.filter((r) => r.agent_key === liveAgent.agent_key);

  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'tools' | 'runs' | 'tests'>(initialTab);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [experienceMode, setExperienceMode] = useState<'simple' | 'advanced'>('simple');

  // Campos configuráveis (Etapas 1 a 4 + Modo Avançado)
  const [displayName, setDisplayName] = useState(liveAgent.display_name);
  const [roleTitle, setRoleTitle] = useState(liveAgent.role_title);
  const [responsibilitySummary, setResponsibilitySummary] = useState(liveAgent.responsibility_summary);
  const [provider, setProvider] = useState(liveAgent.preferred_provider);
  const [model, setModel] = useState(liveAgent.preferred_model);
  const [temperature, setTemperature] = useState(liveAgent.temperature);
  const [maxTokens, setMaxTokens] = useState(liveAgent.max_tokens);
  const [dailyBudgetAmount, setDailyBudgetAmount] = useState((liveAgent.daily_budget_cents / 100).toFixed(2));
  const [currency, setCurrency] = useState<GrowthOsCurrency>(liveAgent.currency);
  const [executionMode, setExecutionMode] = useState<AgentAutonomyMode>(liveAgent.execution_mode);
  const [systemPrompt, setSystemPrompt] = useState(liveAgent.system_prompt);
  const [allowedTools, setAllowedTools] = useState<string[]>(liveAgent.allowed_tools);

  // Etapa 5 / Testes
  const [testPrompt, setTestPrompt] = useState(
    `Analisar uma oportunidade de negócio para a UmbuLab na área de ${liveAgent.role_title} e apresentar 3 recomendações práticas.`
  );
  const [testing, setTesting] = useState(false);
  const [lastTestRun, setLastTestRun] = useState<OperationalTaskRunRecord | null>(agentRuns[0] || null);

  const llmIntegrations = state.integrations.filter((i) => i.category === 'ai_llm');
  const selectedProviderIntegration = state.integrations.find((i) => i.provider_key === provider);
  const availableModels =
    COMPATIBLE_MODELS_BY_PROVIDER[provider] || COMPATIBLE_MODELS_BY_PROVIDER.google_gemini;

  const handleProviderChange = (nextProvider: string) => {
    setProvider(nextProvider);
    const models = COMPATIBLE_MODELS_BY_PROVIDER[nextProvider];
    if (models && models.length > 0) {
      setModel(models[0].id);
    }
  };

  const handleSaveConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedCents = Math.max(
      0,
      Math.round(parseFloat(dailyBudgetAmount.replace(',', '.')) * 100 || 0)
    );
    updateAgentConfiguration(liveAgent.agent_key, {
      display_name: displayName.trim() || liveAgent.display_name,
      role_title: roleTitle.trim() || liveAgent.role_title,
      responsibility_summary: responsibilitySummary.trim() || liveAgent.responsibility_summary,
      preferred_provider: provider,
      preferred_model: model,
      temperature: Number(temperature),
      max_tokens: Number(maxTokens),
      daily_budget_cents: parsedCents,
      currency,
      execution_mode: executionMode,
      requires_human_approval: executionMode === 'approval_required',
      system_prompt: systemPrompt,
      allowed_tools: allowedTools,
    });
    showToast(`Configuração de "${displayName}" guardada com sucesso!`, 'success');
  };

  const handleToggleTool = (toolKey: string) => {
    setAllowedTools((prev) =>
      prev.includes(toolKey) ? prev.filter((k) => k !== toolKey) : [...prev, toolKey]
    );
  };

  const handleTogglePause = () => {
    const nextStatus = liveAgent.status === 'paused' ? 'idle' : 'paused';
    updateAgentConfiguration(liveAgent.agent_key, { status: nextStatus });
    showToast(
      nextStatus === 'paused'
        ? `Agente ${liveAgent.display_name} colocado em pausa.`
        : `Agente ${liveAgent.display_name} reativado e disponível.`,
      'info'
    );
  };

  const handleRunTest = async () => {
    if (!testPrompt.trim()) return;
    handleSaveConfig();
    setTesting(true);
    try {
      const result = await runIndividualAgentDiagnosticTest(liveAgent.agent_key, testPrompt);
      setLastTestRun(result);
      showToast(`Teste de ${displayName} concluído com sucesso!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao testar agente';
      showToast(msg, 'error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-modal-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-umbu-primary/15 text-umbu-primary dark:bg-umbu-primary/25 dark:text-umbu-neon">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="agent-modal-title" className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  {liveAgent.display_name}
                </h2>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                    liveAgent.status === 'paused'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      : liveAgent.status === 'awaiting_approval'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {liveAgent.status === 'idle'
                    ? 'Configurado e Disponível'
                    : liveAgent.status === 'running'
                      ? 'Em Execução'
                      : liveAgent.status === 'awaiting_approval'
                        ? 'Aguarda Aprovação'
                        : liveAgent.status === 'paused'
                          ? 'Em Pausa'
                          : 'Com Erro'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {liveAgent.role_title} • Equipa: {liveAgent.department}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ExperienceModeSwitch mode={experienceMode} onChange={setExperienceMode} />
            <button
              type="button"
              onClick={handleTogglePause}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
                liveAgent.status === 'paused'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'
              }`}
            >
              {liveAgent.status === 'paused' ? (
                <>
                  <PlayCircle className="h-4 w-4" />
                  Reativar
                </>
              ) : (
                <>
                  <PauseCircle className="h-4 w-4" />
                  Pausar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              aria-label="Fechar janela do agente"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Barra das 5 Secções */}
        <div className="flex flex-wrap gap-1 border-b border-zinc-200 bg-zinc-100/70 px-5 py-2 dark:border-zinc-800 dark:bg-zinc-950/40">
          {[
            { id: 'config', label: '1. Assistente de Configuração (5 Passos)', icon: Settings },
            { id: 'overview', label: '2. Resumo do Agente', icon: Bot },
            { id: 'tools', label: `3. Permissões e Ferramentas (${allowedTools.length})`, icon: Wrench },
            { id: 'tests', label: '4. Testar Agente', icon: FlaskConical },
            { id: 'runs', label: `5. Histórico (${agentRuns.length})`, icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                  active
                    ? 'bg-umbu-primary text-white shadow-sm'
                    : 'text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Corpo Principal */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* ABA 1: ASSISTENTE GUIADO DE CONFIGURAÇÃO EM 5 ETAPAS */}
          {activeTab === 'config' && (
            <div className="space-y-5">
              {/* Indicador das 5 Etapas */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { step: 1, title: 'Etapa 1', sub: 'Identidade' },
                  { step: 2, title: 'Etapa 2', sub: 'Inteligência Artificial' },
                  { step: 3, title: 'Etapa 3', sub: 'Autonomia e Permissões' },
                  { step: 4, title: 'Etapa 4', sub: 'Orçamento' },
                  { step: 5, title: 'Etapa 5', sub: 'Teste Prático' },
                ].map((item) => {
                  const isCurrent = wizardStep === item.step;
                  const isDone = wizardStep > item.step;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setWizardStep(item.step as 1 | 2 | 3 | 4 | 5)}
                      className={`text-left rounded-xl border p-2.5 transition-all ${
                        isCurrent
                          ? 'border-umbu-primary bg-umbu-primary/10 text-umbu-primary dark:text-umbu-neon font-extrabold'
                          : isDone
                            ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/20 dark:text-emerald-200'
                            : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400'
                      }`}
                    >
                      <div className="text-[11px] font-extrabold uppercase tracking-wider">
                        {item.title}
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* ETAPA 1 — IDENTIDADE */}
              {wizardStep === 1 && (
                <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-4 sm:p-5">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                      Etapa 1 — Identidade e Papel do Agente
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Defina como este especialista é identificado na dashboard e qual é a sua função principal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabelWithHelp
                        label="Nome do Agente"
                        help={{
                          meaning: 'O nome visível deste especialista na sua equipa de IA.',
                          purpose: 'Facilitar a identificação rápida de quem executou cada tarefa ou pediu aprovação.',
                          howToFill: 'Use um nome claro em português.',
                          example: 'Especialista de Inteligência de Mercado',
                          required: true,
                          effect: 'Atualiza o título do cartão deste agente em todos os ecrãs.',
                          costOrExternalImpact: 'Sem qualquer custo ou efeito externo.',
                        }}
                      />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      />
                    </div>

                    <div>
                      <FieldLabelWithHelp
                        label="Função / Especialidade"
                        help={{
                          meaning: 'O cargo ou especialidade prática deste agente.',
                          purpose: 'Explicar em poucas palavras em que tipo de trabalho este agente é especialista.',
                          howToFill: 'Indique a área de atuação principal.',
                          example: 'Pesquisa de Procura, Concorrência e Oportunidades Digitais',
                          required: true,
                          effect: 'Ajuda o Administrador a escolher o agente certo para cada missão.',
                          costOrExternalImpact: 'Sem qualquer custo.',
                        }}
                      />
                      <input
                        type="text"
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabelWithHelp
                      label="Descrição clara do que faz"
                      help={{
                        meaning: 'Resumo em linguagem simples das responsabilidades deste agente.',
                        purpose: 'Documentar o objetivo do agente para qualquer pessoa da equipa entender o que ele entrega.',
                        howToFill: 'Descreva em 1 ou 2 frases o resultado esperado do trabalho dele.',
                        example: 'Procura oportunidades de produtos e serviços digitais em Portugal e no Brasil, separando sempre dados reais de estimativas.',
                        required: true,
                        effect: 'Exibido no cartão do agente na Equipa de Agentes.',
                        costOrExternalImpact: 'Sem custo.',
                      }}
                    />
                    <textarea
                      rows={3}
                      value={responsibilitySummary}
                      onChange={(e) => setResponsibilitySummary(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 2 — INTELIGÊNCIA ARTIFICIAL */}
              {wizardStep === 2 && (
                <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-4 sm:p-5">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                      Etapa 2 — Motor de Inteligência Artificial
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Escolha o fornecedor de IA e um modelo compatível. Se a API ainda não estiver conectada, o agente funcionará em modo de simulação gratuita.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabelWithHelp
                        label="Serviço de Inteligência Artificial (Fornecedor)"
                        help={{
                          meaning: 'A empresa tecnológica que fornece o cérebro de IA ao agente (ex.: Google Gemini, OpenAI ou Anthropic).',
                          purpose: 'Definir qual ligação configurada em "Integrações e APIs" será usada por este agente.',
                          howToFill: 'Escolha na lista. Recomendamos Google Gemini pela excelente relação qualidade/preço.',
                          example: 'Google Gemini API',
                          required: true,
                          effect: 'Atualiza automaticamente a lista de modelos compatíveis ao lado.',
                          costOrExternalImpact: 'Só consome saldo da API quando a chave estiver testada e conectada em Integrações.',
                        }}
                      />
                      <select
                        value={provider}
                        onChange={(e) => handleProviderChange(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      >
                        {llmIntegrations.map((integ) => (
                          <option key={integ.provider_key} value={integ.provider_key}>
                            {integ.display_name} — [
                            {integ.status === 'connected'
                              ? 'Conectado'
                              : integ.has_saved_secret
                                ? 'Pendente de teste'
                                : 'Não configurado (Usa Simulação)'}
                            ]
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FieldLabelWithHelp
                        label="Versão do Modelo Compatível"
                        help={{
                          meaning: 'A versão específica da Inteligência Artificial dentro do fornecedor escolhido.',
                          purpose: 'Modelos "Flash/Mini" são mais rápidos e baratos; modelos "Pro/Sonnet" são mais detalhados para análises complexas.',
                          howToFill: 'Selecione uma das opções compatíveis sugeridas.',
                          example: 'Gemini 2.5 Flash (Recomendado)',
                          required: true,
                          effect: 'Define a velocidade e o estilo de raciocínio do agente.',
                          costOrExternalImpact: 'Modelos rápidos custam frações de cêntimo por missão quando a API está ativa.',
                        }}
                      />
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      >
                        {availableModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Estado honesto da integração selecionada */}
                  <div
                    className={`rounded-xl border p-3.5 text-xs ${
                      selectedProviderIntegration?.status === 'connected'
                        ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                        : 'border-amber-300 bg-amber-50/70 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200'
                    }`}
                  >
                    <strong>Estado atual deste fornecedor:</strong>{' '}
                    {selectedProviderIntegration?.status === 'connected'
                      ? 'Conectado e testado — o agente poderá usar a API real dentro do limite de orçamento.'
                      : 'Ainda não conectado — o agente funcionará em Modo de Simulação Interna (sem gastos externos) até configurar e testar a chave na área "Integrações e APIs".'}
                  </div>

                  {/* Campos adicionais apenas em Modo Avançado */}
                  {experienceMode === 'advanced' && (
                    <div className="space-y-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-neon">
                        Opções Técnicas de IA (Modo Avançado)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FieldLabelWithHelp
                            label={`Nível de Criatividade / Variação (${temperature})`}
                            help={{
                              meaning: 'Controla se as respostas são mais diretas e previsíveis (perto de 0) ou mais criativas (perto de 1).',
                              purpose: 'Agentes financeiros e auditores devem usar valores baixos (0.1 a 0.3); agentes criativos podem usar 0.5 a 0.7.',
                              howToFill: 'Deslize a barra entre 0 e 1.',
                              example: '0.25 para análise comercial; 0.60 para ideias de campanhas.',
                              required: false,
                              effect: 'Ajusta a variação vocabular do modelo de IA.',
                              costOrExternalImpact: 'Sem impacto direto no custo.',
                            }}
                          />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="mt-2 w-full"
                          />
                        </div>

                        <div>
                          <FieldLabelWithHelp
                            label="Tamanho Máximo da Resposta (Limite de Tokens)"
                            help={{
                              meaning: 'Limite máximo do comprimento de cada resposta gerada pelo agente (1.000 tokens equivalem a cerca de 750 palavras).',
                              purpose: 'Evitar respostas excessivamente longas e controlar o consumo por tarefa.',
                              howToFill: 'Mantenha o valor recomendado (2048) salvo se precisar de relatórios muito extensos.',
                              example: '2048',
                              required: false,
                              effect: 'Limita o tamanho máximo do texto gerado num único passo.',
                              costOrExternalImpact: 'Limites mais baixos reduzem o consumo máximo por chamada de API.',
                            }}
                          />
                          <input
                            type="number"
                            min="256"
                            max="16384"
                            step="256"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10) || 2048)}
                            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <FieldLabelWithHelp
                          label="Instruções Detalhadas do Agente (System Prompt)"
                          help={{
                            meaning: 'As regras permanentes de comportamento e qualidade que o agente recebe antes de qualquer tarefa.',
                            purpose: 'Garantir que o agente respeita o posicionamento da UmbuLab, separa factos de hipóteses e cumpre o RGPD/LGPD.',
                            howToFill: 'Escreva instruções diretas em português. Já vem preenchido com uma configuração profissional segura.',
                            example: 'Atua como Especialista de Inteligência de Mercado da UmbuLab...',
                            required: false,
                            effect: 'Orienta todas as respostas futuras deste agente.',
                            costOrExternalImpact: 'Sem custo adicional.',
                          }}
                        />
                        <textarea
                          rows={4}
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 3 — AUTONOMIA E PERMISSÕES */}
              {wizardStep === 3 && (
                <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-4 sm:p-5">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                      Etapa 3 — Autonomia e Permissões de Segurança
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Escolha o nível de liberdade deste agente. Por segurança, nenhum agente pode fazer despesas externas ou publicar anúncios sozinho.
                    </p>
                  </div>

                  <FieldLabelWithHelp
                    label="Como este agente deve trabalhar?"
                    help={{
                      meaning: 'Define se o agente apenas analisa, se prepara propostas para a sua aprovação ou se pode concluir tarefas internas simples.',
                      purpose: 'Garantir que o Administrador mantém controlo total sobre qualquer decisão comercial ou financeira.',
                      howToFill: 'Clique numa das opções abaixo. Recomendamos "Criar propostas para aprovação".',
                      example: 'Criar propostas para aprovação (Recomendado)',
                      required: true,
                      effect: 'Determina se as entregas vão para a fila de Tarefas e Aprovações.',
                      costOrExternalImpact: 'Protege contra qualquer ação externa não autorizada.',
                    }}
                  />

                  <div className="grid grid-cols-1 gap-3">
                    {AUTONOMY_OPTIONS.map((opt) => {
                      const selected = executionMode === opt.mode;
                      return (
                        <button
                          key={opt.mode}
                          type="button"
                          onClick={() => setExecutionMode(opt.mode)}
                          className={`text-left rounded-xl border p-4 transition-all ${
                            selected
                              ? 'border-2 border-umbu-primary bg-umbu-primary/5 dark:bg-umbu-primary/15'
                              : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-extrabold text-zinc-900 dark:text-white">
                              {opt.title}
                            </span>
                            {selected && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-umbu-primary px-2.5 py-0.5 text-[11px] font-bold text-white">
                                <CheckCircle2 size={12} /> Selecionado
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                            {opt.subtitle}
                          </p>
                          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-2 text-emerald-900 dark:text-emerald-200">
                              <strong>O que é permitido:</strong> {opt.allowed}
                            </div>
                            <div className="rounded-lg bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-2 text-red-900 dark:text-red-200">
                              <strong>O que nunca faz sozinho:</strong> {opt.forbidden}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ETAPA 4 — ORÇAMENTO */}
              {wizardStep === 4 && (
                <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-4 sm:p-5">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                      Etapa 4 — Limite de Orçamento do Agente
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Defina o valor máximo diário que este agente pode reservar em missões.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabelWithHelp
                        label="Moeda de Controlo do Agente"
                        help={{
                          meaning: 'A moeda em que o limite diário deste agente é controlado.',
                          purpose: 'Manter os limites alinhados com os envelopes financeiros da UmbuLab (EUR, BRL ou USD).',
                          howToFill: 'Escolha EUR, BRL ou USD.',
                          example: 'EUR',
                          required: true,
                          effect: 'Define a moeda exibida no cartão do agente.',
                          costOrExternalImpact: 'Não realiza câmbio nem cobranças externas.',
                        }}
                      />
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as GrowthOsCurrency)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      >
                        <option value="EUR">EUR (€ — Euro)</option>
                        <option value="BRL">BRL (R$ — Real Brasileiro)</option>
                        <option value="USD">USD ($ — Dólar Americano)</option>
                      </select>
                    </div>

                    <div>
                      <FieldLabelWithHelp
                        label={`Limite Diário Máximo (${currency})`}
                        help={{
                          meaning: 'O valor máximo que este agente está autorizado a consumir por dia.',
                          purpose: 'Garantir previsibilidade total e impedir que qualquer erro técnico gere custos inesperados.',
                          howToFill: 'Introduza um valor numérico (ex.: 12.00).',
                          example: '12.00',
                          required: true,
                          effect: 'Se o agente atingir este limite num dia, novas execuções são bloqueadas automaticamente.',
                          costOrExternalImpact: 'Em modo simulado não há cobrança real; com API ligada funciona como travão de segurança.',
                        }}
                      />
                      <input
                        type="number"
                        step="0.50"
                        min="0"
                        value={dailyBudgetAmount}
                        onChange={(e) => setDailyBudgetAmount(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <strong>Comportamento ao atingir o limite (Hard-Stop Ativo):</strong> Quando o valor reservado ou consumido atingir{' '}
                      <strong>
                        {dailyBudgetAmount} {currency}
                      </strong>
                      , o sistema pausa automaticamente novas tarefas deste agente e avisa o Administrador. Nenhuma despesa extra é permitida.
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 5 — TESTE PRÁTICO */}
              {wizardStep === 5 && (
                <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 p-4 sm:p-5">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
                      Etapa 5 — Testar o Agente na Prática
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      Envie um pedido de exemplo para confirmar que o agente responde como esperado antes de o utilizar em missões.
                    </p>
                  </div>

                  <div>
                    <FieldLabelWithHelp
                      label="Exemplo de pedido para testar o agente"
                      help={{
                        meaning: 'Uma tarefa ou pergunta de teste para verificar o comportamento do agente.',
                        purpose: 'Confirmar que a configuração escolhida nas etapas anteriores funciona corretamente.',
                        howToFill: 'Use o texto sugerido ou escreva uma pergunta simples.',
                        example: 'Sugerir 3 ideias de serviços digitais para empresas em Portugal.',
                        required: true,
                        effect: 'Gera uma resposta de teste imediata abaixo e regista no histórico.',
                        costOrExternalImpact:
                          selectedProviderIntegration?.status === 'connected'
                            ? 'Usa a API ligada (custo estimado inferior a 0,01 €).'
                            : 'Executa em Simulação Interna (100% gratuito).',
                      }}
                    />
                    <textarea
                      rows={3}
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={testing}
                      onClick={handleRunTest}
                      className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
                    >
                      <Play className="h-4 w-4" />
                      {testing ? 'A testar agente...' : 'Guardar e Executar Teste Agora'}
                    </button>
                  </div>

                  {lastTestRun && (
                    <div className="rounded-xl border border-emerald-300/80 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 dark:text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                          Resultado do Teste ({formatFriendlyAdapterMode(lastTestRun.adapter_mode)})
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Tempo de resposta: {lastTestRun.latency_ms} ms
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        {String(
                          (lastTestRun.sanitized_output as Record<string, unknown>)?.response ||
                            JSON.stringify(lastTestRun.sanitized_output, null, 2)
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Rodapé de Navegação do Assistente (Anterior / Seguinte / Guardar) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4 | 5)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <ArrowLeft size={14} />
                      Etapa Anterior
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveConfig()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-umbu-primary/50 bg-umbu-primary/10 px-4 py-2 text-xs font-extrabold text-umbu-primary dark:text-umbu-neon hover:bg-umbu-primary/20"
                  >
                    <Save size={14} />
                    Guardar Alterações
                  </button>

                  {wizardStep < 5 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep((s) => Math.min(5, s + 1) as 1 | 2 | 3 | 4 | 5)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:opacity-95"
                    >
                      <span>Próxima Etapa</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: RESUMO DO AGENTE */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  O que este agente faz pela UmbuLab
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {liveAgent.responsibility_summary}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Motor de IA Escolhido</span>
                  <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-white">
                    {liveAgent.preferred_provider} ({liveAgent.preferred_model})
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Nível de Permissão</span>
                  <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-white">
                    {formatFriendlyAutonomy(liveAgent.execution_mode).label}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Limite Diário de Despesa</span>
                  <p className="mt-1 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {formatCents(liveAgent.daily_budget_cents, liveAgent.currency)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: FERRAMENTAS E PERMISSÕES */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <FieldLabelWithHelp
                  label="Capacidades e Ferramentas Autorizadas para este Agente"
                  help={{
                    meaning: 'Lista de ações internas que este agente pode utilizar quando participa numa missão.',
                    purpose: 'Limitar cada agente apenas às funções da sua área (princípio do menor privilégio).',
                    howToFill: 'Marque ou desmarque as caixas pretendidas e clique em "Guardar Permissões".',
                    example: 'Pesquisa de Mercado + Registo no Radar de Oportunidades',
                    required: false,
                    effect: 'O agente só poderá invocar as ferramentas selecionadas.',
                    costOrExternalImpact: 'Todas as ferramentas listadas respeitam os bloqueios de aprovação humana.',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleSaveConfig()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-3.5 py-2 text-xs font-extrabold text-white hover:opacity-95"
                >
                  <Save className="h-3.5 w-3.5" />
                  Guardar Permissões
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {ALL_AVAILABLE_TOOLS.map((tool) => {
                  const checked = allowedTools.includes(tool.key);
                  return (
                    <label
                      key={tool.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-colors ${
                        checked
                          ? 'border-umbu-primary/50 bg-emerald-50/40 dark:border-umbu-primary/50 dark:bg-emerald-950/20'
                          : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleTool(tool.key)}
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-umbu-primary focus:ring-umbu-primary"
                      />
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white">{tool.label}</div>
                        {experienceMode === 'advanced' && (
                          <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            ID técnico: {tool.key}
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 4: TESTES AO VIVO */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900 dark:text-blue-200">
                  <FlaskConical className="h-4 w-4" />
                  Área de Teste Individual de {liveAgent.display_name}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  Escreva um pedido abaixo para ver como este agente responde. Se a API externa não estiver ligada, o teste corre em modo de simulação gratuita.
                </p>
              </div>

              <div>
                <FieldLabelWithHelp
                  label={`O que pretende pedir a ${liveAgent.display_name} neste teste?`}
                  help={{
                    meaning: 'Mensagem de teste enviada diretamente ao agente.',
                    purpose: 'Validar a clareza da resposta antes de lançar missões completas.',
                    howToFill: 'Escreva uma frase simples com o que deseja analisar.',
                    example: 'Analisar 3 oportunidades de serviços web recorrentes para clínicas.',
                    required: true,
                    effect: 'Executa um teste imediato e mostra o resultado abaixo.',
                    costOrExternalImpact: 'Sem efeitos externos.',
                  }}
                />
                <textarea
                  rows={3}
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                />
              </div>

              <button
                type="button"
                disabled={testing}
                onClick={handleRunTest}
                className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                {testing ? 'A executar teste...' : 'Executar Teste Agora'}
              </button>

              {lastTestRun && (
                <div className="rounded-xl border border-emerald-300/70 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      Resultado do Teste ({formatFriendlyAdapterMode(lastTestRun.adapter_mode)})
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Tempo: {lastTestRun.latency_ms} ms
                    </span>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-zinc-900 p-3.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap">
                    {String(
                      (lastTestRun.sanitized_output as Record<string, unknown>)?.response ||
                        JSON.stringify(lastTestRun.sanitized_output, null, 2)
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 5: HISTÓRICO DE EXECUÇÕES */}
          {activeTab === 'runs' && (
            <div className="space-y-3">
              {agentRuns.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  Ainda não existem tarefas registadas para {liveAgent.display_name}. Utilize a aba "4. Testar Agente" ou crie uma missão para ver os resultados aqui.
                </div>
              ) : (
                agentRuns.map((run) => (
                  <div
                    key={run.run_id}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/50 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                          {run.mission_title}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            run.adapter_mode === 'live_provider_api'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {formatFriendlyAdapterMode(run.adapter_mode)}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Tempo: {run.latency_ms} ms • {new Date(run.created_at).toLocaleTimeString('pt-PT')}
                      </div>
                    </div>

                    {experienceMode === 'simple' ? (
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        {String(
                          (run.sanitized_output as Record<string, unknown>)?.output_summary ||
                            (run.sanitized_output as Record<string, unknown>)?.response ||
                            run.audit_notes
                        )}
                      </p>
                    ) : (
                      <pre className="max-h-40 overflow-auto rounded-lg bg-zinc-900 p-3 font-mono text-[11px] text-zinc-100">
                        {JSON.stringify(run.sanitized_output, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
