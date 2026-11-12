import React, { useState } from 'react';
import {
  Bot,
  ClipboardCheck,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Search,
  Target,
  FileEdit,
  Megaphone,
  BarChart2,
  UserCheck,
  Network,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plug,
  EyeOff,
} from 'lucide-react';
import type { GrowthOsCurrency, GrowthOsSection } from '../../../../types/growthOs';
import {
  GROWTH_OS_SECTIONS_META,
  formatDemoMoneyCents,
} from '../mockPreviewData';
import {
  createAndExecuteMission,
  setOnboardingDismissed,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { showToast } from '../../../../components/ui/Toast';

interface OverviewViewProps {
  selectedCurrency: GrowthOsCurrency;
  onNavigateSection: (section: GrowthOsSection) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  selectedCurrency,
  onNavigateSection,
}) => {
  const state = useGrowthOsRuntime();
  const [launching, setLaunching] = useState(false);
  const [guideCollapsed, setGuideCollapsed] = useState(false);

  const activeCurrencyBudget =
    state.budgets.find((b) => b.currency === selectedCurrency) || state.budgets[0];

  const availableCents = Math.max(
    0,
    activeCurrencyBudget.limit_cents -
      activeCurrencyBudget.reserved_cents -
      activeCurrencyBudget.settled_cents
  );

  // Indicadores rigorosos e honestos (Parte 4.1)
  const registeredAgentsCount = state.agents.length;
  const configuredAgentsCount = state.agents.filter((a) => a.status !== 'paused').length;
  const connectedIntegrations = state.integrations.filter((i) => i.status === 'connected');
  const connectedProviderKeys = new Set(connectedIntegrations.map((i) => i.provider_key));
  const readyRealAgentsCount = state.agents.filter(
    (a) => a.status !== 'paused' && connectedProviderKeys.has(a.preferred_provider)
  ).length;
  const runningAgentsCount = state.agents.filter((a) => a.status === 'running').length;

  const simulatedMissionsCount = state.missions.filter(
    (m) => m.adapter_mode !== 'live_provider_api'
  ).length;
  const realApiMissionsCount = state.missions.filter(
    (m) => m.adapter_mode === 'live_provider_api'
  ).length;

  const pendingApprovalsCount = state.approvals.filter(
    (a) => a.status === 'awaiting_approval'
  ).length;
  const operationalOppsCount = state.opportunities.filter((o) => !o.is_demo_data).length;
  const demoOppsCount = state.opportunities.filter((o) => o.is_demo_data).length;

  const step1Done = connectedIntegrations.length > 0;
  const step2Done = state.agents.some((a) => a.total_runs_count > 0);
  const step3Done = state.missions.length > 0;

  const handleRunProofMission = async () => {
    if (launching) return;
    setLaunching(true);
    try {
      const mission = await createAndExecuteMission({
        title: 'Pesquisar oportunidades de produtos digitais para a UmbuLab',
        objective:
          'Pesquisar e selecionar 3 oportunidades de produtos digitais B2B/SaaS para Portugal e Brasil, calcular viabilidade comercial e margem em EUR/BRL, redigir proposta de valor bilingue e submeter a revisão de qualidade.',
        market: selectedCurrency === 'BRL' ? 'BR' : 'PT',
        currency: selectedCurrency,
        budget_cap_cents: selectedCurrency === 'BRL' ? 4500 : 1500,
        priority: 'high',
        execution_mode: 'approval_required',
      });
      showToast(
        `Missão "${mission.code}" concluída pelos agentes! Reveja o resultado em Tarefas e Aprovações.`,
        'success'
      );
      onNavigateSection('tasks_approvals');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao executar missão';
      showToast(msg, 'error');
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. BLOCO GUIADO: COMEÇAR A UTILIZAR O AI GROWTH OS (COLAPSÁVEL E DISPENSÁVEL) */}
      {!state.onboarding_dismissed ? (
        <section className="rounded-2xl border-2 border-umbu-primary/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-umbu-primary text-white shrink-0">
                <Compass size={20} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
                    Começar a utilizar o AI Growth OS (Guia Rápido em 3 Passos)
                  </h3>
                  <span className="rounded-full bg-umbu-primary/15 px-2.5 py-0.5 text-[11px] font-extrabold text-umbu-primary dark:text-umbu-neon">
                    Recomendado para começar
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">
                  Siga estes 3 passos simples para configurar as suas chaves, rever a equipa e testar a sua primeira missão sem conhecimentos técnicos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setGuideCollapsed((v) => !v)}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50"
              >
                {guideCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                <span>{guideCollapsed ? 'Expandir guia' : 'Recolher'}</span>
              </button>
              <button
                type="button"
                onClick={() => setOnboardingDismissed(true)}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 px-2.5 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                title="Ocultar guia inicial"
              >
                <EyeOff size={13} />
                <span>Ocultar</span>
              </button>
            </div>
          </div>

          {!guideCollapsed && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              {/* Passo 1 */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                      Passo 1 de 3
                    </span>
                    {step1Done ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} /> Concluído
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                        Opcional para simulação
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    1. Configurar a primeira API
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Ligue o motor de Inteligência Artificial (ex.: Google Gemini) ou teste a ligação ao Supabase através de um assistente passo a passo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateSection('settings')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-umbu-primary/40 bg-umbu-primary/10 px-3.5 py-2 text-xs font-extrabold text-umbu-primary dark:text-umbu-neon hover:bg-umbu-primary/20 transition-colors"
                >
                  <Plug size={14} />
                  <span>Abrir Assistente de Integrações</span>
                </button>
              </div>

              {/* Passo 2 */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                      Passo 2 de 3
                    </span>
                    {step2Done && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} /> Testado
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    2. Preparar o primeiro agente
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Escolha um especialista da equipa, defina o que ele pode fazer em linguagem simples, ajuste o limite diário de despesa e faça um teste rápido.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateSection('agents')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-umbu-primary/40 bg-umbu-primary/10 px-3.5 py-2 text-xs font-extrabold text-umbu-primary dark:text-umbu-neon hover:bg-umbu-primary/20 transition-colors"
                >
                  <Bot size={14} />
                  <span>Configurar Equipa de Agentes</span>
                </button>
              </div>

              {/* Passo 3 */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                      Passo 3 de 3
                    </span>
                    {step3Done && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} /> Concluído
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                    3. Executar uma missão de teste
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Peça à equipa de IA para pesquisar oportunidades de negócio e veja como o resultado chega organizado para a sua aprovação.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={launching}
                  onClick={handleRunProofMission}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-umbu-primary px-3.5 py-2 text-xs font-extrabold text-white hover:opacity-95 disabled:opacity-50 transition-all"
                >
                  <Rocket size={14} />
                  <span>{launching ? 'A criar missão...' : 'Executar Missão de Teste Agora'}</span>
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOnboardingDismissed(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-umbu-primary dark:text-umbu-neon hover:underline"
          >
            <Compass size={14} />
            <span>Mostrar novamente o guia "Começar a utilizar o AI Growth OS"</span>
          </button>
        </div>
      )}

      {/* 1. INDICADORES TRANSPARENTES E SEPARADOS (PARTE 4.1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        {/* Card 1: Estado Real dos Agentes */}
        <div
          onClick={() => onNavigateSection('agents')}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 hover:border-umbu-primary/50 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              Equipa de Agentes
            </span>
            <Bot size={18} className="text-umbu-primary dark:text-umbu-secondary" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {configuredAgentsCount} Configurados • {readyRealAgentsCount} com API Real
          </p>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div>Cadastrados: <strong>{registeredAgentsCount}</strong></div>
            <div>Configurados: <strong>{configuredAgentsCount}</strong></div>
            <div>Prontos (API Real): <strong>{readyRealAgentsCount}</strong></div>
            <div>Em execução agora: <strong>{runningAgentsCount}</strong></div>
          </div>
        </div>

        {/* Card 2: Integrações e Missões (Simuladas vs Reais) */}
        <div
          onClick={() => onNavigateSection('settings')}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 hover:border-umbu-primary/50 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              Integrações & Missões
            </span>
            <Plug size={18} className="text-umbu-primary dark:text-umbu-secondary" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {connectedIntegrations.length} APIs Testadas • {state.missions.length} Missões
          </p>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div>APIs conectadas: <strong>{connectedIntegrations.length}/13</strong></div>
            <div>Missões c/ API real: <strong>{realApiMissionsCount}</strong></div>
            <div>Missões simuladas: <strong>{simulatedMissionsCount}</strong></div>
            <div>Testes técnicos: <strong>{state.task_runs.length}</strong></div>
          </div>
        </div>

        {/* Card 3: Tarefas, Aprovações e Oportunidades */}
        <div
          onClick={() => onNavigateSection('tasks_approvals')}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 hover:border-umbu-primary/50 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              Aprovações & Oportunidades
            </span>
            <ClipboardCheck size={18} className="text-umbu-primary dark:text-umbu-secondary" />
          </div>
          <p className="text-xl font-extrabold text-zinc-900 dark:text-white">
            {pendingApprovalsCount} Aprovações Pendentes
          </p>
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
            <div>Oportunidades criadas: <strong>{operationalOppsCount}</strong></div>
            <div>Exemplos demo: <strong>{demoOppsCount}</strong></div>
            <div className="col-span-2">Controlo humano obrigatório antes de aprovar.</div>
          </div>
        </div>

        {/* Card 4: Orçamento Disponível */}
        <div
          onClick={() => onNavigateSection('finance')}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 hover:border-umbu-primary/50 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              Orçamento Disponível ({selectedCurrency})
            </span>
            <Wallet size={18} className="text-umbu-primary dark:text-umbu-secondary" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatDemoMoneyCents(availableCents, selectedCurrency)}
          </p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            Reservado: <strong>{formatDemoMoneyCents(activeCurrencyBudget.reserved_cents, selectedCurrency)}</strong> • Consumido (interno/real):{' '}
            <strong>{formatDemoMoneyCents(activeCurrencyBudget.settled_cents, selectedCurrency)}</strong>
          </p>
        </div>
      </div>

      {/* 2. COMO FUNCIONA NA PRÁTICA (DIAGRAMA CLARO E ACESSÍVEL) */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
              Como funciona o trabalho da sua equipa de Inteligência Artificial
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-0.5">
              Clique em qualquer etapa abaixo para abrir diretamente a área correspondente.
            </p>
          </div>

          <button
            type="button"
            disabled={launching}
            onClick={handleRunProofMission}
            className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-50 self-start lg:self-center"
          >
            <Rocket size={16} />
            <span>
              {launching
                ? 'A executar missão de demonstração...'
                : 'Testar Fluxo Completo: Pesquisar Oportunidades Digitais'}
            </span>
          </button>
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-6">
          {/* Nível 1: Administrador */}
          <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 text-center">
            <UserCheck size={20} className="mx-auto text-umbu-primary dark:text-umbu-secondary mb-1" />
            <div className="text-sm font-extrabold text-zinc-900 dark:text-white">
              Administrador UmbuLab (Você)
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Cria missões, liga APIs quando desejar, define o limite de orçamento e aprova os resultados
            </p>
          </div>

          <div className="text-center text-xs font-bold text-zinc-400">↓</div>

          {/* Nível 2: Orquestrador */}
          <div
            onClick={() => onNavigateSection('agents')}
            className="mx-auto max-w-xl cursor-pointer rounded-xl border border-blue-300/70 dark:border-blue-800/70 bg-blue-50/50 dark:bg-blue-950/30 p-4 text-center hover:border-blue-500 transition-colors"
          >
            <Network size={20} className="mx-auto text-blue-600 dark:text-blue-400 mb-1" />
            <div className="text-sm font-extrabold text-zinc-900 dark:text-white">
              Coordenador de Operações (Orquestrador de Agentes)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Reserva o orçamento máximo permitido, divide o trabalho pelos especialistas e junta o relatório final
            </p>
          </div>

          <div className="text-center text-xs font-bold text-zinc-400">↓</div>

          {/* Nível 3: 6 Domínios Especialistas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Search, label: 'Pesquisa de Mercado', target: 'opportunities' as GrowthOsSection },
              { icon: Target, label: 'Estratégia e Preços', target: 'agents' as GrowthOsSection },
              { icon: FileEdit, label: 'Conteúdo e Textos', target: 'creative_studio' as GrowthOsSection },
              { icon: Megaphone, label: 'Campanhas A/B', target: 'ab_campaigns' as GrowthOsSection },
              { icon: BarChart2, label: 'Controlo Financeiro', target: 'finance' as GrowthOsSection },
              { icon: ShieldCheck, label: 'Revisão de Qualidade', target: 'reports' as GrowthOsSection },
            ].map((node) => {
              const Icon = node.icon;
              return (
                <button
                  key={node.label}
                  type="button"
                  onClick={() => onNavigateSection(node.target)}
                  className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-center hover:border-umbu-primary transition-colors"
                >
                  <Icon size={16} className="text-umbu-primary dark:text-umbu-secondary mb-1" />
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center text-xs font-bold text-zinc-400">↓</div>

          {/* Nível 4: Centro de Aprovações e Execução */}
          <div
            onClick={() => onNavigateSection('tasks_approvals')}
            className="mx-auto max-w-2xl cursor-pointer rounded-xl border border-emerald-300/80 dark:border-emerald-800/70 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 text-center hover:border-emerald-500 transition-colors"
          >
            <ClipboardCheck size={20} className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
            <div className="text-sm font-extrabold text-zinc-900 dark:text-white">
              Centro de Aprovações e Resultados
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Onde revê as propostas geradas, consulta o custo e decide se aprova, pede alterações ou rejeita
            </p>
          </div>
        </div>
      </section>

      {/* 3. MAPA DAS 9 ÁREAS DO MÓDULO */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
          Todas as Áreas do AI Growth OS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {GROWTH_OS_SECTIONS_META.map((sec) => (
            <button
              key={sec.key}
              type="button"
              onClick={() => onNavigateSection(sec.key)}
              className="text-left rounded-xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark hover:border-umbu-primary/50 p-4 transition-all flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                    Área 0{sec.step_number}
                  </span>
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="text-zinc-400 group-hover:text-umbu-primary dark:group-hover:text-umbu-secondary group-hover:translate-x-0.5 transition-all"
                  />
                </div>
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                  {sec.title}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {sec.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
