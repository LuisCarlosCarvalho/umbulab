import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, Mic, Rocket } from 'lucide-react';
import {
  GrowthOsCurrency,
  GrowthOsSection,
  isValidGrowthOsSection,
  parseGrowthOsSection,
} from '../../../types/growthOs';
import { GROWTH_OS_SECTIONS_META } from './mockPreviewData';
import { GrowthOsStatusBanner } from './components/GrowthOsStatusBanner';
import { GrowthOsSubNav } from './components/GrowthOsSubNav';
import { VoiceCoordinatorModal } from './components/VoiceCoordinatorModal';
import {
  createAndExecuteMission,
  hydrateGrowthOsFromBackend,
  useGrowthOsRuntime,
} from './services/growthOsRuntime';
import { showToast } from '../../../components/ui/Toast';

const OverviewView = lazy(() => import('./views/OverviewView'));
const AgentsTeamView = lazy(() => import('./views/AgentsTeamView'));
const OpportunityRadarView = lazy(() => import('./views/OpportunityRadarView'));
const AbCampaignsView = lazy(() => import('./views/AbCampaignsView'));
const CreativeStudioView = lazy(() => import('./views/CreativeStudioView'));
const TasksApprovalsView = lazy(() => import('./views/TasksApprovalsView'));
const FinanceLedgerView = lazy(() => import('./views/FinanceLedgerView'));
const ReportsPerformanceView = lazy(() => import('./views/ReportsPerformanceView'));
const IntegrationsSettingsView = lazy(() => import('./views/IntegrationsSettingsView'));

interface GrowthOsShellProps {
  onOpenExistingAdminTab?: (tab: 'financial_intelligence' | 'checkout_config') => void;
  onNavigateAdminTab?: (tab: 'financial_intelligence' | 'checkout_config') => void;
}

const CURRENCY_OPTIONS: GrowthOsCurrency[] = ['EUR', 'BRL', 'USD'];

export const GrowthOsShell: React.FC<GrowthOsShellProps> = ({
  onOpenExistingAdminTab,
  onNavigateAdminTab,
}) => {
  const handleAdminTab = (tab: 'financial_intelligence' | 'checkout_config') => {
    onOpenExistingAdminTab?.(tab);
    onNavigateAdminTab?.(tab);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCurrency, setSelectedCurrency] = useState<GrowthOsCurrency>('EUR');
  const [showVoiceCoordinator, setShowVoiceCoordinator] = useState(false);
  const [launchingProof, setLaunchingProof] = useState(false);
  const state = useGrowthOsRuntime();

  const rawSection = searchParams.get('section');
  const activeSection: GrowthOsSection = parseGrowthOsSection(rawSection);

  useEffect(() => {
    void hydrateGrowthOsFromBackend();
  }, []);

  useEffect(() => {
    if (!isValidGrowthOsSection(rawSection)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('tab', 'growth_os');
          next.set('section', 'overview');
          return next;
        },
        { replace: true }
      );
    }
  }, [rawSection, setSearchParams]);

  const handleSelectSection = (nextSection: GrowthOsSection) => {
    if (nextSection === activeSection && rawSection === nextSection) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', 'growth_os');
      next.set('section', nextSection);
      return next;
    });
  };

  const handleQuickLaunchProofMission = async () => {
    if (launchingProof) return;
    setLaunchingProof(true);
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
        `Missão "${mission.code}" concluída pela equipa! Veja o resultado em Tarefas e Aprovações.`,
        'success'
      );
      handleSelectSection('tasks_approvals');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao executar missão';
      showToast(msg, 'error');
    } finally {
      setLaunchingProof(false);
    }
  };

  const currentMeta =
    GROWTH_OS_SECTIONS_META.find((s) => s.key === activeSection) || GROWTH_OS_SECTIONS_META[0];

  const configuredAgentsCount = state.agents.filter((a) => a.status !== 'paused').length;
  const connectedProviderKeys = new Set(
    state.integrations.filter((i) => i.status === 'connected').map((i) => i.provider_key)
  );
  const readyRealAgentsCount = state.agents.filter(
    (a) => a.status !== 'paused' && connectedProviderKeys.has(a.preferred_provider)
  ).length;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-light dark:bg-umbu-dark text-zinc-900 dark:text-zinc-100 p-3 sm:p-5 lg:p-6 space-y-5 sm:space-y-6 transition-colors duration-200">
      {/* Banner Permanente de Transparência Operacional */}
      <GrowthOsStatusBanner />

      {/* Cabeçalho do Módulo com Comandos Claros */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-umbu-primary/15 text-umbu-primary dark:bg-umbu-primary/25 dark:text-umbu-neon">
              <Sparkles size={13} className="shrink-0" aria-hidden="true" />
              UmbuLab AI Growth OS
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-200/80 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {configuredAgentsCount}/10 Agentes Configurados
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                readyRealAgentsCount > 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {readyRealAgentsCount > 0
                ? `${readyRealAgentsCount} Prontos com API Real`
                : 'Modo de Teste Simulado (Ligue uma API para execução externa)'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {currentMeta.title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed">
            {currentMeta.description}
          </p>
        </div>

        {/* Barra de Ações Rápidas + Seletor de Moeda */}
        <div className="flex flex-wrap items-center gap-2.5 self-start xl:self-center shrink-0">
          <button
            type="button"
            onClick={() => setShowVoiceCoordinator(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-blue-700 hover:bg-blue-600/20 dark:border-blue-400/40 dark:bg-blue-500/20 dark:text-blue-200 transition-colors"
          >
            <Mic className="h-4 w-4" />
            <span>Falar com Coordenador (Voz / Chat)</span>
          </button>

          <button
            type="button"
            disabled={launchingProof}
            onClick={handleQuickLaunchProofMission}
            className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-50 transition-all"
          >
            <Rocket className="h-4 w-4" />
            <span>
              {launchingProof
                ? 'A executar missão...'
                : 'Executar Missão de Teste: Oportunidades'}
            </span>
          </button>

          <div className="flex flex-wrap items-center gap-1 bg-umbu-cardLight dark:bg-umbu-cardDark border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 px-2">
              Moeda:
            </span>
            {CURRENCY_OPTIONS.map((curr) => (
              <button
                key={curr}
                type="button"
                aria-pressed={selectedCurrency === curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary ${
                  selectedCurrency === curr
                    ? 'bg-umbu-primary text-white shadow-sm'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Sub-navegação acessível das 9 áreas */}
      <GrowthOsSubNav
        sections={GROWTH_OS_SECTIONS_META}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Painel ativo carregado via React.lazy */}
      <section
        id={`growth-os-panel-${activeSection}`}
        role="tabpanel"
        aria-labelledby={`growth-os-tab-${activeSection}`}
        tabIndex={0}
        className="focus:outline-none min-h-[360px] min-w-0"
      >
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 text-umbu-primary animate-spin mb-3" aria-hidden="true" />
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                A carregar área {currentMeta.short_label}...
              </p>
            </div>
          }
        >
          {activeSection === 'overview' && (
            <OverviewView
              selectedCurrency={selectedCurrency}
              onNavigateSection={handleSelectSection}
            />
          )}
          {activeSection === 'agents' && <AgentsTeamView />}
          {activeSection === 'opportunities' && (
            <OpportunityRadarView onNavigateSection={handleSelectSection} />
          )}
          {activeSection === 'ab_campaigns' && <AbCampaignsView />}
          {activeSection === 'creative_studio' && <CreativeStudioView />}
          {activeSection === 'tasks_approvals' && <TasksApprovalsView />}
          {activeSection === 'finance' && (
            <FinanceLedgerView
              selectedCurrency={selectedCurrency}
              onNavigateAdminTab={handleAdminTab}
            />
          )}
          {activeSection === 'reports' && <ReportsPerformanceView />}
          {activeSection === 'settings' && <IntegrationsSettingsView />}
        </Suspense>
      </section>

      {showVoiceCoordinator && (
        <VoiceCoordinatorModal
          onClose={() => setShowVoiceCoordinator(false)}
          onNavigateSection={handleSelectSection}
        />
      )}
    </div>
  );
};

export default GrowthOsShell;
