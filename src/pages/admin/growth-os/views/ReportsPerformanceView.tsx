import React from 'react';
import { BarChart2, Info } from 'lucide-react';
import { DEMO_PERFORMANCE_CHANNELS, formatDemoMoneyCents } from '../mockPreviewData';
import { CurrencyCodeBadge, DemoDataBadge } from '../components/GrowthOsBadges';

export const ReportsPerformanceView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart2 size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
            Relatórios Executivos & Telemetria FinOps (Estrutura Demonstrativa)
          </h3>
          <DemoDataBadge />
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Esta vista valida a apresentação de indicadores por mercado sem misturar moedas distintas e sem assumir tetos fixos mensais de infraestrutura antes de existir instrumentação real de tokens e chamadas no backend.
        </p>
      </div>

      {/* Visualização Leve e Acessível (Zero Peso de Biblioteca de Gráficos no Bundle) */}
      <figure className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
        <figcaption className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-base font-extrabold text-zinc-900 dark:text-white">
            Distribuição Ilustrativa por Canal e Moeda Nativa (Valores Fictícios)
          </span>
          <DemoDataBadge label="Amostra Fictícia • Não Medida" />
        </figcaption>

        <div className="space-y-4">
          {DEMO_PERFORMANCE_CHANNELS.map((row) => (
            <div
              key={row.channel_id}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                    {row.channel_label}
                  </span>
                  <CurrencyCodeBadge currency={row.native_currency} />
                </div>
                <span className="text-xs sm:text-sm font-mono font-semibold text-zinc-600 dark:text-zinc-400">
                  Índice Demo: {row.demo_share_pct}%
                </span>
              </div>

              <div
                role="progressbar"
                aria-valuenow={row.demo_share_pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Índice ilustrativo ${row.channel_label}`}
                className="w-full h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
              >
                <div
                  style={{ width: `${row.demo_share_pct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-umbu-primary to-umbu-secondary"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 text-sm pt-1">
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-0.5">
                    Receita Fictícia ({row.native_currency}):
                  </span>
                  <strong className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {formatDemoMoneyCents(row.demo_attributed_revenue_cents, row.native_currency)}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-0.5">
                    Custo Direto Fictício ({row.native_currency}):
                  </span>
                  <strong className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {formatDemoMoneyCents(row.demo_direct_cost_cents, row.native_currency)}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-0.5">
                    Custo Simulado API IA (USD):
                  </span>
                  <strong className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {formatDemoMoneyCents(row.demo_ai_cost_usd_cents, 'USD')}
                  </strong>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 flex items-start sm:items-center gap-1.5">
                <Info size={14} className="shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <span>{row.note}</span>
              </p>
            </div>
          ))}
        </div>
      </figure>
    </div>
  );
};

export default ReportsPerformanceView;

