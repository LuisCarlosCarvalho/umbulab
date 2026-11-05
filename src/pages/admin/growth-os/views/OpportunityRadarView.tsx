import React, { useState } from 'react';
import { Radar, Lock, Scale } from 'lucide-react';
import { GrowthOsMarket } from '../../../../types/growthOs';
import { DEMO_OPPORTUNITIES, formatDemoMoneyCents } from '../mockPreviewData';
import {
  CurrencyCodeBadge,
  DemoDataBadge,
  RiskGateBadge,
} from '../components/GrowthOsBadges';

export const OpportunityRadarView: React.FC = () => {
  const [marketFilter, setMarketFilter] = useState<'ALL' | GrowthOsMarket>('ALL');

  const items =
    marketFilter === 'ALL'
      ? DEMO_OPPORTUNITIES
      : DEMO_OPPORTUNITIES.filter((opp) => opp.market === marketFilter);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Radar size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Radar de Oportunidades Comerciais & Conteúdo
            </h3>
            <DemoDataBadge />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Exemplos estritamente fictícios com separação explícita entre evidências, hipóteses e base legal RGPD/LGPD.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <label
            htmlFor="opp-market-filter"
            className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
          >
            Mercado:
          </label>
          <select
            id="opp-market-filter"
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value as 'ALL' | GrowthOsMarket)}
            className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-umbu-primary"
          >
            <option value="ALL" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              Todos (PT / BR / Global)
            </option>
            <option value="PT" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              Portugal (EUR)
            </option>
            <option value="BR" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              Brasil (BRL)
            </option>
            <option value="GLOBAL" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              Global (USD)
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((opp) => (
          <article
            key={opp.opportunity_id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4"
          >
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-umbu-primary/10 text-umbu-primary dark:bg-umbu-primary/20 dark:text-umbu-secondary">
                    {opp.channel}
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Mercado: {opp.market}
                  </span>
                  <CurrencyCodeBadge currency={opp.currency} />
                  <RiskGateBadge level={opp.risk_level} />
                  <DemoDataBadge label={opp.viability_label} />
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-snug">
                  {opp.title}
                </h4>
              </div>

              <div className="flex xl:items-end flex-col shrink-0 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Ticket Ilustrativo (Fictício)
                </span>
                <span className="text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5">
                  {formatDemoMoneyCents(opp.estimated_ticket_cents, opp.currency)}
                </span>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Margem simulada: {opp.estimated_margin_pct}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 text-sm">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 mb-1.5">
                  Campo de Evidência Verificada
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {opp.verified_facts_note}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 mb-1.5">
                  Campo de Hipótese Comercial
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {opp.hypothesis_note}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 mb-1.5 flex items-center gap-1.5">
                  <Scale size={14} className="shrink-0" aria-hidden="true" />
                  Conformidade RGPD / LGPD
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {opp.compliance_basis}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed"
              >
                <Lock size={13} className="shrink-0" aria-hidden="true" />
                Converter em Missão (Indisponível na Fase 1B)
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OpportunityRadarView;

