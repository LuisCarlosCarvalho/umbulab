import React from 'react';
import { Sliders, Lock, KeyRound } from 'lucide-react';
import { DEMO_INTEGRATIONS_INVENTORY } from '../mockPreviewData';
import { DemoDataBadge, StandbyAgentBadge } from '../components/GrowthOsBadges';

export const IntegrationsSettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Política AppSec de Isolamento de Segredos */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sliders size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
            Inventário de Integrações & Fronteira de Segurança (Read-Only)
          </h3>
          <DemoDataBadge label="Inventário Arquitetónico" />
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Por diretriz permanente de segurança aplicacional (<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">AGENTS.md</code>), esta interface <strong>jamais solicita nem armazena chaves de API, tokens ou credenciais privilegiadas no navegador</strong>. Todas as integrações futuras serão geridas exclusivamente em variáveis de servidor auditadas.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {DEMO_INTEGRATIONS_INVENTORY.map((item) => (
          <article
            key={item.integration_key}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                    {item.category}
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5 leading-snug">
                    {item.name}
                  </h4>
                </div>
                <StandbyAgentBadge />
              </div>

              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {item.auth_boundary_note}
              </p>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 flex items-start sm:items-center gap-2.5 text-xs">
                <KeyRound size={15} className="text-zinc-500 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <span className="font-mono text-zinc-800 dark:text-zinc-200 break-all">
                  {item.server_env_var_reference}
                </span>
              </div>
            </div>

            <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Previsão: {item.phase_planned}
              </span>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed self-start sm:self-auto"
              >
                <Lock size={13} className="shrink-0" aria-hidden="true" />
                Conexão Desativada
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSettingsView;

