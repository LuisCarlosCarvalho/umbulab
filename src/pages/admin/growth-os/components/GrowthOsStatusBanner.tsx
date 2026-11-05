import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const GrowthOsStatusBanner: React.FC = () => {
  return (
    <div
      role="region"
      aria-label="Aviso de modo demonstrativo do AI Growth OS"
      className="rounded-xl border border-amber-300/80 bg-amber-50/90 dark:border-amber-800/70 dark:bg-amber-950/40 p-3.5 sm:p-4 text-amber-950 dark:text-amber-100"
    >
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle size={18} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Modo Demonstrativo • Fase 1B (Pré-Visualização de Interface)
            </p>
            <p className="text-sm mt-1 text-amber-900/90 dark:text-amber-100/90 leading-relaxed">
              Todos os valores, missões, oportunidades e lançamentos exibidos neste módulo são <strong>estritamente fictícios</strong> para validação arquitetónica e visual. Nenhum agente de IA está em execução, nenhuma integração externa está conectada e nenhuma operação financeira ou campanha pode ser disparada nesta fase.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-amber-200 dark:border-amber-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 shrink-0 self-start">
          <ShieldAlert size={14} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
          Backend: Não Configurado
        </div>
      </div>
    </div>
  );
};

