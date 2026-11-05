import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  GrowthOsCurrency,
  GrowthOsSection,
  isValidGrowthOsSection,
  parseGrowthOsSection,
} from '../../../types/growthOs';
import { GROWTH_OS_SECTIONS_META } from './mockPreviewData';
import { GrowthOsStatusBanner } from './components/GrowthOsStatusBanner';
import { GrowthOsSubNav } from './components/GrowthOsSubNav';
import { StandbyAgentBadge } from './components/GrowthOsBadges';

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
  onNavigateAdminTab: (tab: 'financial_intelligence' | 'checkout_config') => void;
}

const CURRENCY_OPTIONS: GrowthOsCurrency[] = ['EUR', 'BRL', 'USD'];

export const GrowthOsShell: React.FC<GrowthOsShellProps> = ({ onNavigateAdminTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCurrency, setSelectedCurrency] = useState<GrowthOsCurrency>('EUR');

  const rawSection = searchParams.get('section');
  const activeSection: GrowthOsSection = parseGrowthOsSection(rawSection);

  // Normaliza URL caso o parâmetro section esteja ausente ou seja inválido, preservando parâmetros alheios
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

  const currentMeta =
    GROWTH_OS_SECTIONS_META.find((s) => s.key === activeSection) || GROWTH_OS_SECTIONS_META[0];

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-light dark:bg-umbu-dark text-zinc-900 dark:text-zinc-100 p-3 sm:p-5 lg:p-6 space-y-5 sm:space-y-6 transition-colors duration-200">
      {/* Banner Permanente de Transparência Operacional */}
      <GrowthOsStatusBanner />

      {/* Cabeçalho do Módulo */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-umbu-primary/15 text-umbu-primary dark:bg-umbu-primary/25 dark:text-umbu-neon">
              <Sparkles size={13} className="shrink-0" aria-hidden="true" />
              UmbuLab AI Growth OS
            </span>
            <StandbyAgentBadge />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {currentMeta.title}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed">
            {currentMeta.description}
          </p>
        </div>

        {/* Seletor Visual de Moeda de Referência */}
        <div className="flex flex-wrap items-center gap-1.5 self-start xl:self-center bg-umbu-cardLight dark:bg-umbu-cardDark border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 shrink-0">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 px-2">
            Moeda Demo:
          </span>
          {CURRENCY_OPTIONS.map((curr) => (
            <button
              key={curr}
              type="button"
              aria-pressed={selectedCurrency === curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary ${
                selectedCurrency === curr
                  ? 'bg-umbu-primary text-white shadow-sm'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {curr}
            </button>
          ))}
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
          {activeSection === 'opportunities' && <OpportunityRadarView />}
          {activeSection === 'ab_campaigns' && <AbCampaignsView />}
          {activeSection === 'creative_studio' && <CreativeStudioView />}
          {activeSection === 'tasks_approvals' && <TasksApprovalsView />}
          {activeSection === 'finance' && (
            <FinanceLedgerView
              selectedCurrency={selectedCurrency}
              onSelectCurrency={setSelectedCurrency}
              onOpenExistingAdminTab={onNavigateAdminTab}
            />
          )}
          {activeSection === 'reports' && <ReportsPerformanceView />}
          {activeSection === 'settings' && <IntegrationsSettingsView />}
        </Suspense>
      </section>
    </div>
  );
};

export default GrowthOsShell;

