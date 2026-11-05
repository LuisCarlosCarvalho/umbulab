import React from 'react';
import { Palette, Lock, CheckCircle2 } from 'lucide-react';
import { DEMO_CREATIVE_ASSETS } from '../mockPreviewData';
import { DemoDataBadge, RiskGateBadge } from '../components/GrowthOsBadges';

export const CreativeStudioView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Palette size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
            Estúdio Criativo & Diretrizes de Marca UmbuLab
          </h3>
          <DemoDataBadge />
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Pré-visualização do repositório de <em>copies</em>, <em>storyboards</em> e estruturas visuais alinhadas aos tokens cromáticos oficiais da UmbuLab. Nenhuma geração paga nem publicação em redes sociais ocorre nesta fase.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        {DEMO_CREATIVE_ASSETS.map((asset) => (
          <article
            key={asset.asset_id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-umbu-primary/10 text-umbu-primary dark:bg-umbu-primary/20 dark:text-umbu-secondary">
                  {asset.format}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {asset.locale}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-snug">
                {asset.title}
              </h4>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {asset.brief_summary}
              </p>

              <div className="flex flex-wrap gap-2">
                <RiskGateBadge level={asset.risk_level} />
                <DemoDataBadge label={asset.status_label} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Tokens de Identidade Visual
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {asset.brand_tokens_used.map((token) => (
                    <span
                      key={token}
                      className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs font-mono text-zinc-800 dark:text-zinc-200"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-umbu-primary dark:text-umbu-secondary shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{asset.compliance_check_note}</span>
              </div>
            </div>

            <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Canal: <strong className="text-zinc-800 dark:text-zinc-200">{asset.target_channel}</strong>
              </span>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed shrink-0 self-start sm:self-auto"
              >
                <Lock size={13} className="shrink-0" aria-hidden="true" />
                Publicar (Bloqueado)
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CreativeStudioView;

