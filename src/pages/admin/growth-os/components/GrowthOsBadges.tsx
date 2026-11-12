import React from 'react';
import { AlertTriangle, Monitor, Server, Shield, PauseCircle } from 'lucide-react';
import { ExecutionMode, GrowthOsCurrency, GrowthOsMarket, RiskLevel } from '../../../../types/growthOs';

export const DemoDataBadge: React.FC<{ label?: string }> = ({ label = 'Dados Fictícios • Demo' }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-snug bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70">
    <AlertTriangle size={12} className="shrink-0" aria-hidden="true" />
    <span>{label}</span>
  </span>
);

export const StandbyAgentBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-snug bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
    <PauseCircle size={12} className="shrink-0" aria-hidden="true" />
    <span>Inativo • Sem Backend</span>
  </span>
);

export const ExecutionModeBadge: React.FC<{ mode: ExecutionMode }> = ({ mode }) => {
  if (mode === 'browser_assisted') {
    return (
      <span
        title="Modo planeado: conduzido pela sessão aberta do navegador do administrador (não autónomo)."
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold leading-snug bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-200 dark:border-zinc-700"
      >
        <Monitor size={12} className="shrink-0" aria-hidden="true" />
        <span>Assistido no Browser (Aba Aberta)</span>
      </span>
    );
  }

  return (
    <span
      title="Modo planeado para fases futuras: fila/worker assinado no servidor (ainda não implementado)."
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold leading-snug bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/70"
    >
      <Server size={12} className="shrink-0" aria-hidden="true" />
      <span>Servidor Assíncrono (Planeado)</span>
    </span>
  );
};

export const RiskGateBadge: React.FC<{
  level?: RiskLevel;
  risk?: RiskLevel;
  requiresHumanApproval?: boolean;
}> = ({ level, risk }) => {
  const resolvedLevel: RiskLevel = level || risk || 'L1';
  const styles: Record<RiskLevel, { classes: string; text: string }> = {
    L0: {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/70',
      text: 'Gate L0 • Análise Interna',
    },
    L1: {
      classes: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/70',
      text: 'Gate L1 • Rascunho c/ Revisão',
    },
    L2: {
      classes: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/70',
      text: 'Gate L2 • Aprovação Humana Obrigatória',
    },
  };

  const current = styles[resolvedLevel];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-snug border ${current.classes}`}>
      <Shield size={12} className="shrink-0" aria-hidden="true" />
      <span>{current.text}</span>
    </span>
  );
};

export const MarketBadge: React.FC<{ market: GrowthOsMarket }> = ({ market }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold tracking-wide bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700">
    {market}
  </span>
);

export const CurrencyCodeBadge: React.FC<{ currency: GrowthOsCurrency }> = ({ currency }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold tracking-wide bg-umbu-primary/10 text-umbu-primary border border-umbu-primary/25 dark:bg-umbu-secondary/15 dark:text-umbu-secondary dark:border-umbu-secondary/30">
    {currency}
  </span>
);

