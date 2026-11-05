import React from 'react';
import { SplitSquareVertical, Lock, ShieldAlert } from 'lucide-react';
import { DEMO_AB_CAMPAIGNS, formatDemoMoneyCents } from '../mockPreviewData';
import {
  CurrencyCodeBadge,
  DemoDataBadge,
  RiskGateBadge,
} from '../components/GrowthOsBadges';

export const AbCampaignsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <SplitSquareVertical size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
            Laboratório Estrutural de Campanhas A/B
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <RiskGateBadge level="L2" />
            <DemoDataBadge />
          </div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Nenhuma conta publicitária externa está conectada e nenhum orçamento pode ser gasto autonomamente. Os planos abaixo ilustram a estrutura comparativa que exigirá aprovação humana explícita.
        </p>
      </div>

      <div className="space-y-4">
        {DEMO_AB_CAMPAIGNS.map((camp) => (
          <article
            key={camp.campaign_id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4"
          >
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Mercado: {camp.market}
                  </span>
                  <CurrencyCodeBadge currency={camp.currency} />
                  <DemoDataBadge label={camp.status_label} />
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-snug">
                  {camp.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {camp.objective}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shrink-0 self-start">
                <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Teto Planeado (Fictício)
                </span>
                <span className="text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5 block">
                  {formatDemoMoneyCents(camp.planned_budget_cap_cents, camp.currency)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                  Hipótese A (Controlo Demo)
                </span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {camp.variant_a_summary}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Hipótese B (Variante Demo)
                </span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {camp.variant_b_summary}
                </p>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm">
              <div className="flex items-start sm:items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <span>
                  <strong>Métrica-alvo:</strong> {camp.primary_metric_label} • {camp.approval_gate_note}
                </span>
              </div>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed shrink-0 self-start xl:self-auto"
              >
                <Lock size={13} className="shrink-0" aria-hidden="true" />
                Publicação Externa Desativada
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AbCampaignsView;

