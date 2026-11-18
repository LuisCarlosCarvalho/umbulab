import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  FileText,
  ChevronDown,
  DollarSign,
  History,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Bot,
  Users,
} from 'lucide-react';
import type {
  AgentAutonomyMode,
  GrowthOsCurrency,
  GrowthOsMarket,
  OperationalApprovalRecord,
} from '../../../../types/growthOs';
import {
  createAndExecuteMission,
  decideHumanApproval,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { DEMO_APPROVAL_TASKS, formatCents, getAgentDisplayName } from '../mockPreviewData';
import { DemoDataBadge } from '../components/GrowthOsBadges';
import { showToast } from '../../../../components/ui/Toast';
import {
  ActionConfirmationModal,
  ExperienceModeSwitch,
  FieldLabelWithHelp,
  formatFriendlyAdapterMode,
  formatFriendlyAutonomy,
  formatFriendlyRiskGate,
} from '../components/GrowthOsHelpSystem';

export const TasksApprovalsView: React.FC = () => {
  const state = useGrowthOsRuntime();
  const [experienceMode, setExperienceMode] = useState<'simple' | 'advanced'>('simple');
  const [missionStep, setMissionStep] = useState<1 | 2 | 3>(1);

  // Assistente de Criação de Missão em 3 Passos
  const [title, setTitle] = useState('Pesquisar oportunidades de produtos digitais para a UmbuLab');
  const [objective, setObjective] = useState(
    'Encontrar 3 oportunidades de produtos ou serviços digitais, comparar custos e margens em EUR e BRL, avaliar riscos e apresentar uma recomendação pronta a rever.'
  );
  const [market, setMarket] = useState<GrowthOsMarket>('PT');
  const [currency, setCurrency] = useState<GrowthOsCurrency>('EUR');
  const [budgetAmount, setBudgetAmount] = useState('0.10');
  const [targetAgentScope, setTargetAgentScope] = useState<'commercial_analyst' | 'all'>('commercial_analyst');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [executionMode, setExecutionMode] = useState<AgentAutonomyMode>('approval_required');
  const [submitting, setSubmitting] = useState(false);

  // Controlos do Centro de Aprovações
  const [decisionNotesById, setDecisionNotesById] = useState<Record<string, string>>({});
  const [expandedApprovalIds, setExpandedApprovalIds] = useState<Record<string, boolean>>({});
  const [expandedMissionIds, setExpandedMissionIds] = useState<Record<string, boolean>>({});
  const [showDemoReference, setShowDemoReference] = useState(false);

  // Modal de Confirmação Antes de Ação Sensível
  const [pendingConfirmAction, setPendingConfirmAction] = useState<{
    approval: OperationalApprovalRecord;
    decision: 'approved' | 'rejected' | 'request_changes';
  } | null>(null);

  const geminiConnected = state.integrations.some(
    (i) => i.provider_key === 'google_gemini' && i.status === 'connected'
  );

  const handleSuggestCriteria = () => {
    setObjective(
      'Encontrar 3 oportunidades alinhadas com a UmbuLab, calcular preço sugerido e margem estimada, separar dados confirmados de estimativas e entregar uma proposta pronta para aprovação.'
    );
    showToast('Critérios de sucesso sugeridos automaticamente!', 'info');
  };

  const handleLaunchMission = async () => {
    if (!title.trim() || !objective.trim() || submitting) return;
    setSubmitting(true);
    try {
      const budgetCents = Math.max(
        10,
        Math.round(parseFloat(budgetAmount.replace(',', '.')) * 100 || 1500)
      );
      const created = await createAndExecuteMission({
        title: title.trim(),
        objective: objective.trim(),
        market,
        currency,
        budget_cap_cents: budgetCents,
        priority,
        execution_mode: executionMode,
        target_agent_key: targetAgentScope === 'all' ? undefined : targetAgentScope,
      });
      setExpandedMissionIds((prev) => ({ ...prev, [created.mission_id]: true }));
      setMissionStep(1);
      showToast(
        `Missão ${created.code} concluída pela equipa! Reveja e aprove o resultado no Centro de Aprovações abaixo.`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao executar missão';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDecision = () => {
    if (!pendingConfirmAction) return;
    const { approval, decision } = pendingConfirmAction;
    const notes = decisionNotesById[approval.approval_id] || '';
    const updated = decideHumanApproval(approval.approval_id, decision, notes);
    setPendingConfirmAction(null);
    if (!updated) return;

    if (decision === 'approved') {
      showToast(
        'Resultado aprovado com sucesso! O registo foi atualizado na secção Gestão Financeira.',
        'success'
      );
    } else if (decision === 'rejected') {
      showToast('Missão rejeitada. O valor reservado voltou para o saldo disponível.', 'info');
    } else {
      showToast('Pedido de alterações registado e enviado ao Coordenador.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. ASSISTENTE GUIADO DE CRIAÇÃO DE MISSÃO EM 3 ETAPAS (PARTE 4.4) */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col gap-3.5 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Rocket size={19} className="text-umbu-primary dark:text-umbu-secondary shrink-0" />
                Criar uma Missão de IA (Assistente em 3 Passos)
              </h3>
              <span className="rounded-full bg-umbu-primary/15 px-2.5 py-0.5 text-xs font-extrabold text-umbu-primary dark:text-umbu-neon">
                Passo {missionStep} de 3
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 max-w-4xl">
              Descreva o que precisa com palavras simples. A IA prepara o trabalho e aguarda sempre a sua autorização antes de qualquer ação sensível.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
            <ExperienceModeSwitch mode={experienceMode} onChange={setExperienceMode} />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTitle('Diagnóstico Digital e Estratégia Comercial — PME');
                  setObjective(
                    'Identificar 2 pontos fortes, 2 lacunas digitais, 1 oportunidade de receita e plano de ação em 3 passos.'
                  );
                  setMarket('PT');
                  setCurrency('EUR');
                  setBudgetAmount('0.10');
                  setTargetAgentScope('commercial_analyst');
                  setMissionStep(1);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20"
              >
                <Sparkles size={13} />
                Exemplo: Diagnóstico Real (€0,10)
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle('Pesquisar oportunidades de produtos digitais para a UmbuLab');
                  setObjective(
                    'Encontrar 3 oportunidades de produtos digitais, comparar custos, avaliar riscos e apresentar uma recomendação.'
                  );
                  setMarket('PT');
                  setCurrency('EUR');
                  setBudgetAmount('15.00');
                  setTargetAgentScope('all');
                  setMissionStep(1);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/50 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20"
              >
                <Users size={13} />
                Exemplo: Multiagente (€15,00)
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Progresso dos 3 Passos */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { s: 1, title: 'Passo 1 de 3', sub: 'O que pretende fazer?' },
            { s: 2, title: 'Passo 2 de 3', sub: 'Orçamento e Limites' },
            { s: 3, title: 'Passo 3 de 3', sub: 'Rever e Iniciar' },
          ].map((item) => (
            <button
              key={item.s}
              type="button"
              onClick={() => setMissionStep(item.s as 1 | 2 | 3)}
              className={`rounded-xl border p-3 text-left transition-all ${
                missionStep === item.s
                  ? 'border-umbu-primary bg-umbu-primary/10 text-umbu-primary dark:text-umbu-neon font-extrabold'
                  : missionStep > item.s
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/20 dark:text-emerald-200'
                    : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
              }`}
            >
              <div className="text-[11px] font-extrabold uppercase tracking-wider">{item.title}</div>
              <div className="text-xs sm:text-sm font-bold truncate mt-0.5">{item.sub}</div>
            </button>
          ))}
        </div>

        {/* ETAPA 1 — O QUE PRETENDE FAZER? */}
        {missionStep === 1 && (
          <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8">
                <FieldLabelWithHelp
                  label="O que pretende que a equipa de IA faça?"
                  help={{
                    meaning: 'O nome ou pedido principal da missão.',
                    purpose: 'Orientar o Coordenador Central sobre qual é o tema do trabalho.',
                    howToFill: 'Descreva a tarefa com palavras simples, como se estivesse a pedir a um colega.',
                    example: 'Encontrar oportunidades de produtos digitais para a UmbuLab',
                    required: true,
                    effect: 'Cria a missão e escolhe os especialistas certos da equipa.',
                    costOrExternalImpact: 'Sem efeitos externos sem aprovação.',
                  }}
                />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Encontrar oportunidades de produtos digitais"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Descreva a tarefa com palavras simples, como se estivesse a pedir a um colega.
                </p>
              </div>

              <div className="lg:col-span-4">
                <FieldLabelWithHelp
                  label="Mercado onde pesquisar"
                  help={{
                    meaning: 'O país ou região foco desta missão.',
                    purpose: 'Adaptar o idioma (pt-PT ou pt-BR), exemplos de preços e regras legais (RGPD ou LGPD).',
                    howToFill: 'Escolha Portugal, Brasil ou Global.',
                    example: 'Portugal',
                    required: true,
                    effect: 'Ajusta a pesquisa e os textos ao mercado escolhido.',
                    costOrExternalImpact: 'Sem custo adicional.',
                  }}
                />
                <select
                  value={market}
                  onChange={(e) => {
                    const nextM = e.target.value as GrowthOsMarket;
                    setMarket(nextM);
                    if (nextM === 'BR') setCurrency('BRL');
                    else if (nextM === 'PT') setCurrency('EUR');
                  }}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-bold text-zinc-900 dark:text-white"
                >
                  <option value="PT">Portugal</option>
                  <option value="BR">Brasil</option>
                  <option value="GLOBAL">Global / Internacional</option>
                </select>
              </div>

              <div className="lg:col-span-12">
                <FieldLabelWithHelp
                  label="Modalidade de Execução e Especialistas"
                  help={{
                    meaning: 'Escolha se a tarefa será executada por 1 especialista focado ou pela equipa completa de 5 agentes.',
                    purpose: 'Permitir missões rápidas e económicas com apenas 1 agente, ou planos coordenados com vários agentes.',
                    howToFill: 'Escolha "Apenas Estrategista Comercial" para o Diagnóstico Digital de €0,10.',
                    example: 'Apenas Estrategista Comercial (1 chamada Gemini)',
                    required: true,
                    effect: 'Define se é feita 1 chamada pontual ou se a missão coordena vários agentes.',
                    costOrExternalImpact: targetAgentScope === 'commercial_analyst' ? 'Apenas 1 chamada Gemini (~€0,0002).' : 'Múltiplas chamadas distribuídas.',
                  }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetAgentScope('commercial_analyst');
                      if (parseFloat(budgetAmount) > 1) setBudgetAmount('0.10');
                    }}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      targetAgentScope === 'commercial_analyst'
                        ? 'border-umbu-primary bg-umbu-primary/10 text-zinc-900 dark:text-white'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                      <Bot size={15} className="text-umbu-primary shrink-0" />
                      <span>Estrategista Comercial (Execução Individual)</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Apenas 1 especialista e 1 única chamada Gemini. Ideal para o Diagnóstico Digital (€0,10).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetAgentScope('all');
                      if (parseFloat(budgetAmount) < 1) setBudgetAmount('15.00');
                    }}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      targetAgentScope === 'all'
                        ? 'border-umbu-primary bg-umbu-primary/10 text-zinc-900 dark:text-white'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                      <Users size={15} className="text-blue-500 shrink-0" />
                      <span>Equipa Completa (5 Especialistas Coordenados)</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Pesquisa, modelação comercial, redação de conteúdo e auditoria de qualidade em conjunto.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <FieldLabelWithHelp
                  label="Como saberemos se a missão foi bem-sucedida? (Resultado esperado)"
                  help={{
                    meaning: 'O que espera receber no final desta missão.',
                    purpose: 'Ajudar o Auditor de Qualidade a verificar se a resposta dos agentes está completa.',
                    howToFill: 'Escreva o que pretende ver no relatório final ou clique em "Sugerir critérios automaticamente".',
                    example: 'Encontrar 3 oportunidades, comparar custos, avaliar riscos e apresentar uma recomendação.',
                    required: true,
                    effect: 'Define a lista de entregáveis da missão.',
                    costOrExternalImpact: 'Sem impacto externo.',
                  }}
                />
                <button
                  type="button"
                  onClick={handleSuggestCriteria}
                  className="text-xs font-bold text-umbu-primary dark:text-umbu-neon hover:underline"
                >
                  + Sugerir critérios automaticamente
                </button>
              </div>
              <textarea
                rows={3}
                required
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-sm text-zinc-900 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Lock size={14} />
                <span>Ações externas e despesas exigem sempre a sua aprovação.</span>
              </div>

              <button
                type="button"
                onClick={() => setMissionStep(2)}
                className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:opacity-95"
              >
                <span>Continuar para Limites</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2 — LIMITES */}
        {missionStep === 2 && (
          <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <FieldLabelWithHelp
                  label="Moeda do Orçamento"
                  help={{
                    meaning: 'A moeda em que o limite desta missão será cativado.',
                    purpose: 'Controlar o saldo na moeda certa (EUR, BRL ou USD) sem conversões confusas.',
                    howToFill: 'Escolha EUR, BRL ou USD.',
                    example: 'EUR (€)',
                    required: true,
                    effect: 'Reserva o valor no envelope dessa moeda em Gestão Financeira.',
                    costOrExternalImpact: 'Reserva interna.',
                  }}
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as GrowthOsCurrency)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-bold text-zinc-900 dark:text-white"
                >
                  <option value="EUR">EUR (€ — Euro)</option>
                  <option value="BRL">BRL (R$ — Real Brasileiro)</option>
                  <option value="USD">USD ($ — Dólar Americano)</option>
                </select>
              </div>

              <div>
                <FieldLabelWithHelp
                  label={`Limite máximo de custo (${currency})`}
                  help={{
                    meaning: 'O valor máximo que autoriza reservar para esta missão.',
                    purpose: 'Garantir que a missão nunca ultrapassa o valor definido por si.',
                    howToFill: 'Digite o valor máximo (ex.: 0.10 ou 5.00).',
                    example: '0.10',
                    required: true,
                    effect: 'Catia preventivamente este valor no orçamento disponível enquanto a missão decorre.',
                    costOrExternalImpact: geminiConnected
                      ? 'Trava o consumo da API se atingir este valor.'
                      : 'Simulação interna no orçamento (nenhum dinheiro real é cobrado).',
                  }}
                />
                <input
                  type="number"
                  step="0.05"
                  min="0.10"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 font-mono text-sm font-bold text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="Como deve concluir o trabalho?"
                  help={{
                    meaning: 'Define se a missão pede a sua aprovação final ou se guarda apenas rascunho.',
                    purpose: 'Manter você no controlo de todas as entregas da equipa de IA.',
                    howToFill: 'Mantenha a opção recomendada ("Preparar trabalho e pedir a minha aprovação").',
                    example: 'Preparar trabalho e pedir a minha aprovação',
                    required: true,
                    effect: 'Envia o resultado final para o Centro de Aprovações abaixo.',
                    costOrExternalImpact: 'Nenhuma ação externa ocorre sem a sua autorização.',
                  }}
                />
                <select
                  value={executionMode}
                  onChange={(e) => setExecutionMode(e.target.value as AgentAutonomyMode)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm font-bold text-zinc-900 dark:text-white"
                >
                  <option value="approval_required">
                    Preparar trabalho e pedir a minha aprovação (Recomendado)
                  </option>
                  <option value="draft_only">Guardar apenas como rascunho interno</option>
                  <option value="read_only">Apenas analisar sem criar alterações</option>
                </select>
              </div>
            </div>

            {experienceMode === 'advanced' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <FieldLabelWithHelp
                    label="Prioridade na Fila de Execução"
                    help={{
                      meaning: 'Ordem de prioridade da missão quando existem várias tarefas.',
                      purpose: 'Dar preferência a missões urgentes.',
                      howToFill: 'Escolha Baixa, Média, Alta ou Crítica.',
                      example: 'Alta',
                      required: false,
                      effect: 'Regista a prioridade na missão.',
                      costOrExternalImpact: 'Sem custo.',
                    }}
                  />
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as typeof priority)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-900 dark:text-white"
                  >
                    <option value="high">Alta Prioridade</option>
                    <option value="critical">Prioridade Crítica</option>
                    <option value="medium">Prioridade Média</option>
                    <option value="low">Baixa Prioridade</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                    Código técnico equivalente: <code className="font-mono font-bold">{executionMode}</code>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setMissionStep(1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200"
              >
                <ArrowLeft size={14} />
                Voltar ao Passo 1
              </button>

              <button
                type="button"
                onClick={() => setMissionStep(3)}
                className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:opacity-95"
              >
                <span>Continuar para Revisão</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3 — REVER E INICIAR */}
        {missionStep === 3 && (
          <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white">
              Passo 3 — Confirme os dados antes de iniciar a missão
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3.5 space-y-1.5">
                <div>
                  <span className="text-zinc-500 block text-xs">O que será feito:</span>
                  <strong className="text-zinc-900 dark:text-white">{title}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs">Mercado e Limite Reservado:</span>
                  <strong className="text-zinc-900 dark:text-white">
                    {market} • Máximo {budgetAmount} {currency}
                  </strong>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs">Modo de Segurança:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    {formatFriendlyAutonomy(executionMode).label}
                  </strong>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3.5 space-y-2">
                <span className="text-zinc-500 block text-xs font-bold">
                  {targetAgentScope === 'commercial_analyst'
                    ? 'Especialista responsável pela execução:'
                    : 'Especialistas que vão trabalhar nesta missão:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(targetAgentScope === 'commercial_analyst'
                    ? ['Estrategista Comercial (commercial_analyst)']
                    : [
                        'Diretor de Operações (Coordenador)',
                        'Inteligência de Mercado',
                        'Estrategista Comercial',
                        'Conteúdo & SEO',
                        'Auditor de Qualidade',
                      ]
                  ).map((ag) => (
                    <span
                      key={ag}
                      className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 text-xs font-bold text-zinc-800 dark:text-zinc-200"
                    >
                      <Bot size={12} className="text-umbu-primary" />
                      {ag}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 pt-1">
                  <strong>O que acontecerá a seguir:</strong>{' '}
                  {targetAgentScope === 'commercial_analyst'
                    ? `O valor de ${budgetAmount} ${currency} ficará cativo como "Reservado" no orçamento, o Estrategista Comercial executará exatamente 1 única chamada Gemini (sem Grounding e sem retries) e o resultado ficará retido no Centro de Aprovações abaixo para a sua decisão humana.`
                    : `O valor de ${budgetAmount} ${currency} ficará cativo como "Reservado" no orçamento, os 5 especialistas produzirão os resultados coordenados e o pedido ficará a aguardar a sua decisão no Centro de Aprovações abaixo.`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMissionStep(2)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200"
              >
                <ArrowLeft size={14} />
                Alterar Limites
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleLaunchMission}
                className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
              >
                <PlusCircle size={16} />
                <span>
                  {submitting
                    ? 'A executar missão com a equipa...'
                    : 'Iniciar Missão Agora'}
                </span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. CENTRO DE APROVAÇÕES HUMANAS (BOTÕES CLAROS E EXPLICAÇÃO DE CUSTO REAL VS SIMULADO) */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={19} className="text-umbu-primary dark:text-umbu-secondary shrink-0" />
              Centro de Aprovações (Decisões do Administrador)
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">
              Reveja o trabalho preparado pela equipa de IA. Nada é publicado nem dado como concluído sem a sua confirmação.
            </p>
          </div>
          <span className="rounded-xl bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
            A aguardar decisão: {state.approvals.filter((a) => a.status === 'awaiting_approval').length}
          </span>
        </div>

        {state.approvals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Não existem pedidos a aguardar aprovação neste momento.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Use o assistente <strong>"Criar uma Missão de IA"</strong> acima para pedir um estudo à equipa e testar a aprovação.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.approvals.map((apr) => {
              const isExpanded = Boolean(expandedApprovalIds[apr.approval_id]);
              const isPending = apr.status === 'awaiting_approval';

              return (
                <article
                  key={apr.approval_id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {formatFriendlyRiskGate(apr.risk_level, true)}
                        </span>
                        <span
                          className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${
                            apr.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : apr.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {apr.status === 'approved'
                            ? 'Resultado Aprovado'
                            : apr.status === 'rejected'
                              ? 'Missão Rejeitada (Orçamento Libertado)'
                              : 'Aguarda a Sua Decisão'}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">
                        {apr.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">
                        Preparado por: <strong>{getAgentDisplayName(apr.requested_by_agent_key)}</strong> • Valor calculado da missão:{' '}
                        <strong className="font-mono">
                          {formatCents(apr.financial_impact_cents, apr.currency)}
                        </strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedApprovalIds((prev) => ({
                          ...prev,
                          [apr.approval_id]: !prev[apr.approval_id],
                        }))
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <FileText size={13} />
                      <span>Consultar custos e histórico</span>
                      <ChevronDown
                        size={13}
                        className={isExpanded ? 'rotate-180 transition-transform' : 'transition-transform'}
                      />
                    </button>
                  </div>

                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-3.5 text-xs space-y-1.5">
                    <div>
                      <strong>O que esta aprovação faz:</strong> {apr.estimated_impact}
                    </div>
                    <div>
                      <strong>Resumo do trabalho realizado:</strong> {apr.diff_summary}
                    </div>
                    <div>
                      <strong>Verificação de Qualidade:</strong> {apr.auditor_notes}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-zinc-900 dark:text-white">
                        <span className="flex items-center gap-1.5">
                          <DollarSign size={14} className="text-umbu-primary" />
                          Custo calculado: {formatCents(apr.financial_impact_cents, apr.currency)} (
                          {String(
                            (apr.deliverable_preview as Record<string, unknown>)?.execution_environment ||
                              'Simulação Interna'
                          )}
                          )
                        </span>
                        <span className="flex items-center gap-1.5 text-zinc-500">
                          <History size={14} />
                          Criado em: {new Date(apr.requested_at).toLocaleString('pt-PT')}
                        </span>
                      </div>

                      {experienceMode === 'simple' ? (
                        <div className="rounded-lg bg-white dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                          <strong>Recomendação Principal:</strong>{' '}
                          {String(
                            (apr.deliverable_preview as Record<string, unknown>)
                              ?.primary_recommendation ||
                              (apr.deliverable_preview as Record<string, unknown>)
                                ?.preview_excerpt ||
                              'Consulte os detalhes da missão na lista abaixo.'
                          )}
                        </div>
                      ) : (
                        <pre className="overflow-auto rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-200">
                          {JSON.stringify(apr.deliverable_preview, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}

                  {isPending ? (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                      <input
                        type="text"
                        value={decisionNotesById[apr.approval_id] || ''}
                        onChange={(e) =>
                          setDecisionNotesById((prev) => ({
                            ...prev,
                            [apr.approval_id]: e.target.value,
                          }))
                        }
                        placeholder="Observação opcional sobre a sua decisão..."
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-white"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirmAction({ approval: apr, decision: 'approved' })
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={14} />
                          Aprovar resultado
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirmAction({ approval: apr, decision: 'request_changes' })
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 text-xs font-extrabold text-amber-800 dark:text-amber-300 hover:bg-amber-100"
                        >
                          <RotateCcw size={14} />
                          Pedir alterações
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingConfirmAction({ approval: apr, decision: 'rejected' })
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 px-3.5 py-2 text-xs font-extrabold text-red-700 dark:text-red-300 hover:bg-red-100"
                        >
                          <XCircle size={14} />
                          Rejeitar missão
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                      <strong>Decisão registada ({apr.decided_by_email}):</strong> {apr.decision_notes} em{' '}
                      {apr.decided_at ? new Date(apr.decided_at).toLocaleString('pt-PT') : ''}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. MISSÕES EXECUTADAS & ENTREGÁVEIS CONSOLIDADOS */}
      {state.missions.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-6 shadow-sm space-y-4">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
            Resultados e Relatórios das Missões ({state.missions.length})
          </h3>

          <div className="space-y-4">
            {state.missions.map((mission) => {
              const isOpen = expandedMissionIds[mission.mission_id] ?? true;
              return (
                <article
                  key={mission.mission_id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-extrabold text-umbu-primary dark:text-umbu-secondary">
                          {mission.code}
                        </span>
                        <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-bold">
                          {mission.status === 'completed'
                            ? 'Concluída e Aprovada'
                            : mission.status === 'rejected'
                              ? 'Rejeitada'
                              : mission.status === 'awaiting_approval'
                                ? 'Aguarda Aprovação'
                                : 'Em Execução'}
                        </span>
                        <span className="rounded-lg bg-amber-100/80 dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 dark:text-amber-300">
                          {formatFriendlyAdapterMode(mission.adapter_mode)}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white mt-1">
                        {mission.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5">
                        Orçamento Cativo: {formatCents(mission.budget_reserved_cents, mission.currency)} • Valor Calculado:{' '}
                        {formatCents(mission.budget_used_cents, mission.currency)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMissionIds((prev) => ({
                          ...prev,
                          [mission.mission_id]: !isOpen,
                        }))
                      }
                      className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-bold"
                    >
                      {isOpen ? 'Recolher Relatório' : 'Ver Relatório Completo'}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <div>
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Trabalho Realizado pelos Especialistas (4 Etapas)
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {mission.tasks.map((task) => (
                            <div
                              key={task.task_id}
                              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-3 text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                                <span>
                                  Etapa {task.step_order}: {getAgentDisplayName(task.assigned_agent_key)}
                                </span>
                                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                                  {task.status === 'completed' ? 'Concluído' : 'Aguarda revisão'}
                                </span>
                              </div>
                              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{task.title}</p>
                              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                {task.output_summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Resultados Entregues (Dados Confirmados vs. Hipóteses a Validar)
                        </h5>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          {mission.deliverables.map((deliv) => (
                            <div
                              key={deliv.deliverable_id}
                              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 text-xs space-y-2"
                            >
                              <div className="font-extrabold text-zinc-900 dark:text-white">
                                {deliv.title}
                              </div>
                              <p className="text-zinc-600 dark:text-zinc-300">{deliv.summary}</p>
                              <div>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                  Evidências e Base Atual:
                                </span>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-zinc-700 dark:text-zinc-300">
                                  {deliv.verified_facts.map((f, i) => (
                                    <li key={i}>{f}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <span className="font-bold text-amber-700 dark:text-amber-400">
                                  O que precisa de validação:
                                </span>
                                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-zinc-700 dark:text-zinc-300">
                                  {deliv.hypotheses.map((h, i) => (
                                    <li key={i}>{h}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. EXEMPLOS DEMONSTRATIVOS ISOLADOS */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
              Exemplos Demonstrativos ({DEMO_APPROVAL_TASKS.length} itens de referência)
            </span>
            <DemoDataBadge />
          </div>
          <button
            type="button"
            onClick={() => setShowDemoReference(!showDemoReference)}
            className="text-xs font-bold text-umbu-primary dark:text-umbu-secondary hover:underline"
          >
            {showDemoReference ? 'Ocultar Exemplos' : 'Ver Exemplos Demonstrativos'}
          </button>
        </div>

        {showDemoReference && (
          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-3">
            {DEMO_APPROVAL_TASKS.map((demo) => (
              <div
                key={demo.task_id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/60 p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{demo.mission_title}</span>
                  <DemoDataBadge />
                </div>
                <p className="text-zinc-600 dark:text-zinc-400">{demo.impact_summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO ANTES DE APROVAR / REJEITAR (PARTE 4.4) */}
      {pendingConfirmAction && (
        <ActionConfirmationModal
          title={
            pendingConfirmAction.decision === 'approved'
              ? 'Confirmar Aprovação do Resultado'
              : pendingConfirmAction.decision === 'rejected'
                ? 'Confirmar Rejeição da Missão'
                : 'Confirmar Pedido de Alterações'
          }
          whatWillHappen={
            pendingConfirmAction.decision === 'approved'
              ? `A missão "${pendingConfirmAction.approval.mission_title}" será marcada como Aprovada e o excedente da reserva orçamental será libertado.`
              : pendingConfirmAction.decision === 'rejected'
                ? `A missão "${pendingConfirmAction.approval.mission_title}" será rejeitada e 100% do orçamento reservado voltará para o saldo disponível.`
                : `A missão "${pendingConfirmAction.approval.mission_title}" permanecerá aberta para ajustes pela equipa de agentes.`
          }
          amountLabel={formatCents(
            pendingConfirmAction.approval.financial_impact_cents,
            pendingConfirmAction.approval.currency
          )}
          nature={
            geminiConnected ? 'real_external_operation' : 'simulated_internal'
          }
          whereRecorded="Ficará registado no Histórico de Aprovações e no Livro de Movimentos da Gestão Financeira."
          confirmLabel={
            pendingConfirmAction.decision === 'approved'
              ? 'Sim, Aprovar Resultado'
              : pendingConfirmAction.decision === 'rejected'
                ? 'Sim, Rejeitar e Libertar Saldo'
                : 'Sim, Pedir Alterações'
          }
          variant={
            pendingConfirmAction.decision === 'approved'
              ? 'emerald'
              : pendingConfirmAction.decision === 'rejected'
                ? 'red'
                : 'amber'
          }
          onCancel={() => setPendingConfirmAction(null)}
          onConfirm={handleConfirmDecision}
        />
      )}
    </div>
  );
};

export default TasksApprovalsView;
