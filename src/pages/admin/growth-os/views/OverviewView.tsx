import React from 'react';
import {
  Bot,
  Radar,
  ClipboardCheck,
  Wallet,
  ArrowRight,
  Monitor,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { GrowthOsCurrency, GrowthOsSection } from '../../../../types/growthOs';
import {
  DEMO_AGENTS_TEAM,
  DEMO_APPROVAL_TASKS,
  DEMO_BUDGET_ENVELOPES,
  DEMO_OPPORTUNITIES,
  GROWTH_OS_SECTIONS_META,
  formatDemoMoneyCents,
} from '../mockPreviewData';
import { DemoMetricCard } from '../components/DemoMetricCard';
import { DemoDataBadge, ExecutionModeBadge, RiskGateBadge, StandbyAgentBadge } from '../components/GrowthOsBadges';

interface OverviewViewProps {
  selectedCurrency: GrowthOsCurrency;
  onNavigateSection: (section: GrowthOsSection) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  selectedCurrency,
  onNavigateSection,
}) => {
  const activeCurrencyBudget =
    DEMO_BUDGET_ENVELOPES.find((b) => b.currency === selectedCurrency) || DEMO_BUDGET_ENVELOPES[0];

  const demoAvailableCents =
    activeCurrencyBudget.limit_cents -
    activeCurrencyBudget.reserved_cents -
    activeCurrencyBudget.settled_cents;

  return (
    <div className="space-y-6">
      {/* Métricas Estruturais Fictícias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <DemoMetricCard
          title="Agentes Registados no Plano"
          demoValue={`0 / ${DEMO_AGENTS_TEAM.length} Ativos`}
          subtitle="Todos os 10 agentes permanecem em Standby até implementação do backend."
          icon={<Bot size={20} aria-hidden="true" />}
        />
        <DemoMetricCard
          title="Exemplos no Radar"
          demoValue={`${DEMO_OPPORTUNITIES.length} Registos Demo`}
          subtitle="Amostra fictícia para validar triagem PT, BR e Global."
          icon={<Radar size={20} aria-hidden="true" />}
        />
        <DemoMetricCard
          title="Gates Humanos (Simulação)"
          demoValue={`${DEMO_APPROVAL_TASKS.filter((t) => t.requires_human_approval).length} Exemplos L1/L2`}
          subtitle="Demonstra retenção obrigatória antes de rascunhos ou ações externas."
          icon={<ClipboardCheck size={20} aria-hidden="true" />}
        />
        <DemoMetricCard
          title={`Saldo Orçamental Demo (${activeCurrencyBudget.currency})`}
          demoValue={formatDemoMoneyCents(demoAvailableCents, activeCurrencyBudget.currency)}
          currency={activeCurrencyBudget.currency}
          subtitle="Exemplo fictício da fórmula Teto - Reservado - Liquidado."
          icon={<Wallet size={20} aria-hidden="true" />}
        />
      </div>

      {/* Arquitetura de Execução & Governação */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Monitor size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Semântica Transparente de Execução
            </h3>
            <StandbyAgentBadge />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            O desenho do AI Growth OS proíbe rotular fluxos dependentes do navegador como autónomos. Quando o backend for implementado em fases futuras, cada tarefa declarará explicitamente o seu modo real:
          </p>
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <ExecutionModeBadge mode="browser_assisted" />
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Passo-a-passo conduzido pela aba ativa do administrador autenticado. Pausa imediatamente se o navegador for fechado.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <ExecutionModeBadge mode="server_async" />
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Processamento assíncrono em fila de servidor assinada criptograficamente com proteção anti-replay (ainda não conectado nesta Fase 1B).
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Níveis de Risco & Gates Humanos (L0 / L1 / L2)
            </h3>
            <DemoDataBadge label="Arquitetura de Controlo" />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Nenhuma despesa, subscrição, publicação pública ou comunicação comercial poderá ocorrer de forma autónoma:
          </p>
          <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div>
                <RiskGateBadge level="L0" />
              </div>
              <p className="leading-relaxed">Pesquisa e classificação interna sem escrita pública nem impacto externo.</p>
            </li>
            <li className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div>
                <RiskGateBadge level="L1" />
              </div>
              <p className="leading-relaxed">Geração de rascunhos internos auditados pelo Auditor de Qualidade + revisão humana.</p>
            </li>
            <li className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div>
                <RiskGateBadge level="L2" />
              </div>
              <p className="leading-relaxed">Campanhas, afiliados, B2B e finanças: exige Qualidade + Finanças + Aprovação Admin.</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Mapa de Navegação Rápida das 8 Áreas Especializadas */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Server size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
            Mapa Modular do AI Growth OS
          </h3>
          <span className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            Selecione uma secção para inspecionar a interface demonstrativa
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {GROWTH_OS_SECTIONS_META.filter((s) => s.key !== 'overview').map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => onNavigateSection(section.key)}
              className="text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 hover:border-umbu-primary dark:hover:border-umbu-secondary hover:bg-umbu-primary/5 dark:hover:bg-umbu-primary/10 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary flex flex-col justify-between gap-3"
            >
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                  Área {section.step_number}
                </span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                  {section.short_label}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed line-clamp-3">
                  {section.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-umbu-primary dark:text-umbu-neon group-hover:translate-x-0.5 transition-transform">
                Abrir vista
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewView;

