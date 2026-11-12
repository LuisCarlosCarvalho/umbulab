import React from 'react';
import { ShieldCheck, AlertTriangle, Activity, CheckCircle2, Plug } from 'lucide-react';
import { useGrowthOsRuntime } from '../services/growthOsRuntime';

export const GrowthOsStatusBanner: React.FC = () => {
  const state = useGrowthOsRuntime();
  const isPaused = state.system_controls.pause_new_executions;
  const pendingApprovals = state.approvals.filter((a) => a.status === 'awaiting_approval').length;
  const simulatedMissions = state.missions.filter((m) => m.adapter_mode !== 'live_provider_api').length;
  const liveMissions = state.missions.filter((m) => m.adapter_mode === 'live_provider_api').length;
  const connectedIntegrations = state.integrations.filter((i) => i.status === 'connected').length;

  return (
    <div
      role="region"
      aria-label="Estado Operacional do AI Growth OS"
      className={`rounded-xl border p-3.5 sm:p-4 transition-colors ${
        isPaused
          ? 'border-red-300/80 bg-red-50/90 text-red-950 dark:border-red-800/70 dark:bg-red-950/40 dark:text-red-100'
          : 'border-emerald-300/80 bg-emerald-50/80 text-emerald-950 dark:border-emerald-800/70 dark:bg-emerald-950/30 dark:text-emerald-100'
      }`}
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
              isPaused
                ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
            }`}
          >
            {isPaused ? (
              <AlertTriangle size={18} aria-hidden="true" />
            ) : (
              <ShieldCheck size={18} aria-hidden="true" />
            )}
          </div>
          <div>
            <p
              className={`text-xs font-extrabold uppercase tracking-wider ${
                isPaused
                  ? 'text-red-800 dark:text-red-300'
                  : 'text-emerald-800 dark:text-emerald-300'
              }`}
            >
              {isPaused
                ? 'CONTROLO DE EMERGÊNCIA ATIVO • NOVAS MISSÕES PAUSADAS'
                : 'Painel de Gestão de IA • Controlo Humano e Orçamento Protegidos'}
            </p>
            <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">
              {isPaused ? (
                <>
                  Motivo da pausa: <strong>{state.system_controls.emergency_reason}</strong>. Pode reativar o sistema na secção <strong>Relatórios e Monitorização</strong>.
                </>
              ) : (
                <>
                  Como funciona: <strong>1. Define o objetivo ou escolhe um assistente → 2. A equipa de IA prepara a proposta → 3. O sistema aguarda a sua aprovação antes de concluir</strong>. Os exemplos demonstrativos estão identificados e nenhuma despesa ou publicação externa ocorre sozinha.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start xl:self-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Activity size={14} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>
              Missões: {liveMissions} com API Real • {simulatedMissions} Simuladas
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <CheckCircle2 size={14} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span>Aprovações Pendentes: {pendingApprovals}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Plug size={14} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>APIs Testadas e Conectadas: {connectedIntegrations}/13</span>
          </div>
        </div>
      </div>
    </div>
  );
};
