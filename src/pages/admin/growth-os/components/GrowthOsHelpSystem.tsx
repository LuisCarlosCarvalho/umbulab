import React, { useState, useId } from 'react';
import {
  HelpCircle,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type {
  AdapterMode,
  AgentAutonomyMode,
  IntegrationConnectionStatus,
  RiskLevel,
} from '../../../../types/growthOs';

/**
 * SISTEMA GLOBAL DE AJUDA E SIMPLIFICAÇÃO (FASE 3.1 — PARTE 2 & PARTE 4)
 * - Suporte completo para teclado, dispositivos móveis (toque) e leitores de ecrã (sem depender de hover).
 * - Alternância padronizada entre Modo Simples (Predefinido) e Modo Avançado.
 * - Tradução consistente de termos técnicos para linguagem executiva clara.
 */

export interface FieldHelpDetails {
  meaning: string;
  purpose?: string;
  howToFill?: string;
  example?: string;
  required?: boolean;
  effect?: string;
  costOrExternalImpact?: string;
}

export interface FieldHelpProps {
  id?: string;
  label: string;
  shortHint?: string;
  required?: boolean;
  meaning?: string;
  howToFill?: string;
  example?: string;
  effectAndCost?: string;
  help?: FieldHelpDetails;
}

export const FieldLabelWithHelp: React.FC<FieldHelpProps> = ({
  id,
  label,
  shortHint,
  required,
  meaning,
  howToFill,
  example,
  effectAndCost,
  help,
}) => {
  const [open, setOpen] = useState(false);
  const autoId = useId();
  const helpPanelId = `field-help-panel-${autoId}`;

  const isRequired = help?.required ?? required ?? false;
  const resolvedMeaning = help?.meaning ?? meaning ?? '';
  const resolvedPurpose = help?.purpose;
  const resolvedHowToFill = help?.howToFill ?? howToFill;
  const resolvedExample = help?.example ?? example;
  const resolvedEffect = help?.effect;
  const resolvedCost = help?.costOrExternalImpact ?? effectAndCost;

  return (
    <div className="mb-1.5 space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <label
            htmlFor={id}
            className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100"
          >
            {label}
          </label>
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              isRequired
                ? 'bg-umbu-primary/15 text-umbu-primary dark:bg-umbu-primary/25 dark:text-umbu-neon'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {isRequired ? 'Obrigatório' : 'Opcional'}
          </span>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={helpPanelId}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:border-umbu-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary"
        >
          <HelpCircle size={12} className="text-umbu-primary dark:text-umbu-secondary shrink-0" />
          <span>{open ? 'Ocultar ajuda' : 'Como preencher?'}</span>
        </button>
      </div>

      {shortHint && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{shortHint}</p>
      )}

      {open && (
        <div
          id={helpPanelId}
          role="region"
          aria-label={`Ajuda para o campo ${label}`}
          className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-3 text-xs text-zinc-800 dark:text-zinc-200 space-y-1.5"
        >
          {resolvedMeaning && (
            <div>
              <strong className="text-zinc-900 dark:text-white">O que significa:</strong>{' '}
              {resolvedMeaning}
            </div>
          )}
          {resolvedPurpose && (
            <div>
              <strong className="text-zinc-900 dark:text-white">Para que serve:</strong>{' '}
              {resolvedPurpose}
            </div>
          )}
          {resolvedHowToFill && (
            <div>
              <strong className="text-zinc-900 dark:text-white">O que preencher:</strong>{' '}
              {resolvedHowToFill}
            </div>
          )}
          {resolvedExample && (
            <div className="rounded-lg bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 px-2.5 py-1.5">
              <strong className="text-umbu-primary dark:text-umbu-secondary">Exemplo prático:</strong>{' '}
              <span className="italic">"{resolvedExample}"</span>
            </div>
          )}
          {resolvedEffect && (
            <div className="text-[11px] text-zinc-700 dark:text-zinc-300">
              <strong>Efeito da escolha:</strong> {resolvedEffect}
            </div>
          )}
          {resolvedCost && (
            <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
              <strong>Impacto em custos ou plataformas externas:</strong> {resolvedCost}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export interface ExperienceModeSwitchProps {
  mode: 'simple' | 'advanced';
  onChange: (nextMode: 'simple' | 'advanced') => void;
  simpleLabel?: string;
  advancedLabel?: string;
}

export const ExperienceModeSwitch: React.FC<ExperienceModeSwitchProps> = ({
  mode,
  onChange,
  simpleLabel = 'Modo Simples (Recomendado)',
  advancedLabel = 'Modo Avançado (Parâmetros Técnicos)',
}) => {
  return (
    <div
      role="group"
      aria-label="Selecionar nível de detalhe do formulário"
      className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/90 p-1"
    >
      <button
        type="button"
        aria-pressed={mode === 'simple'}
        onClick={() => onChange('simple')}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary ${
          mode === 'simple'
            ? 'bg-umbu-primary text-white shadow-sm'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-white/60 dark:hover:bg-zinc-800'
        }`}
      >
        <Sparkles size={13} />
        <span>{simpleLabel}</span>
      </button>

      <button
        type="button"
        aria-pressed={mode === 'advanced'}
        onClick={() => onChange('advanced')}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary ${
          mode === 'advanced'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-white/60 dark:hover:bg-zinc-800'
        }`}
      >
        <Sliders size={13} />
        <span>{advancedLabel}</span>
      </button>
    </div>
  );
};

export interface ActionConfirmationModalProps {
  title: string;
  description?: string;
  whatWillHappen?: string;
  amountLabel?: string;
  nature?: string;
  whereRecorded?: string;
  effectsSummary?: string[];
  financialNotice?: string;
  confirmLabel: string;
  confirmTone?: 'primary' | 'danger' | 'warning';
  variant?: 'approve' | 'danger' | 'warning' | 'emerald' | 'amber' | 'red';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
  title,
  description,
  whatWillHappen,
  amountLabel,
  nature,
  whereRecorded,
  effectsSummary,
  financialNotice,
  confirmLabel,
  confirmTone,
  variant,
  onConfirm,
  onCancel,
}) => {
  const resolvedTone =
    confirmTone ??
    (variant === 'danger' || variant === 'red'
      ? 'danger'
      : variant === 'warning' || variant === 'amber'
        ? 'warning'
        : 'primary');

  const resolvedDescription = description ?? whatWillHappen ?? '';
  const resolvedItems: string[] = effectsSummary
    ? effectsSummary
    : [
        ...(amountLabel ? [`Valor envolvido: ${amountLabel}`] : []),
        ...(nature ? [`Natureza da operação: ${nature}`] : []),
        ...(whereRecorded ? [`Onde ficará registado: ${whereRecorded}`] : []),
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-action-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {resolvedTone === 'danger' ? (
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
            ) : (
              <ShieldCheck className="h-6 w-6 text-umbu-primary dark:text-umbu-secondary shrink-0" />
            )}
            <h3 id="confirm-action-title" className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Fechar confirmação"
          >
            <X size={18} />
          </button>
        </div>

        {resolvedDescription && (
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{resolvedDescription}</p>
        )}

        {resolvedItems.length > 0 && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3.5 space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-zinc-500">
              Resumo claro da operação:
            </div>
            <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              {resolvedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-umbu-primary dark:text-umbu-secondary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {financialNotice && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-3 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
            <Info size={15} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>{financialNotice}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
          >
            Voltar sem alterar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold text-white shadow-sm ${
              resolvedTone === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : resolvedTone === 'warning'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-umbu-primary hover:opacity-95'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// TRADUTORES DE LINGUAGEM SIMPLES (PARTE 4)
// =============================================================================

export function formatFriendlyAutonomy(mode: AgentAutonomyMode): {
  label: string;
  description: string;
  allowedExample: string;
  forbiddenExample: string;
} {
  switch (mode) {
    case 'read_only':
      return {
        label: 'Apenas analisar',
        description: 'O agente apenas lê dados e responde a perguntas, sem alterar registos nem criar propostas.',
        allowedExample: 'Ler oportunidades existentes, consultar métricas e responder a dúvidas.',
        forbiddenExample: 'Criar campanhas, publicar conteúdos, enviar e-mails ou gastar orçamento.',
      };
    case 'draft_only':
    case 'approval_required':
      return {
        label: 'Criar propostas para minha aprovação',
        description: 'O agente prepara análises, textos e planos em rascunho, mas aguarda sempre a sua autorização antes de qualquer ação final.',
        allowedExample: 'Pesquisar oportunidades, redigir rascunhos de anúncios e preparar relatórios.',
        forbiddenExample: 'Publicar anúncios pagos, enviar mensagens a clientes ou efetuar despesas sem a sua aprovação.',
      };
    case 'auto_low_risk':
      return {
        label: 'Executar tarefas internas permitidas',
        description: 'O agente pode guardar rascunhos e atualizar classificações internas de baixo risco, mantendo bloqueadas despesas e publicações externas.',
        allowedExample: 'Classificar oportunidades no radar interno e organizar tarefas da equipa.',
        forbiddenExample: 'Contratar serviços, ativar campanhas pagas ou publicar em redes sociais.',
      };
  }
}

export function formatFriendlyAdapterMode(mode: AdapterMode): string {
  if (mode === 'live_api' || mode === 'live_provider_api') {
    return 'Execução com API Real';
  }
  return 'Ambiente de testes (Simulado)';
}

export function formatFriendlyIntegrationStatus(
  status: IntegrationConnectionStatus,
  hasSavedSecret: boolean,
  lastTestStatus?: 'ok' | 'warning' | 'error' | null
): {
  label: string;
  badgeClass: string;
  tone: 'emerald' | 'amber' | 'red' | 'blue' | 'zinc';
} {
  if (status === 'disabled') {
    return {
      label: 'Desativado',
      badgeClass: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
      tone: 'zinc',
    };
  }
  if (status === 'error' || lastTestStatus === 'error') {
    return {
      label: 'Erro de ligação',
      badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
      tone: 'red',
    };
  }
  if (status === 'connected' && (!lastTestStatus || lastTestStatus === 'ok')) {
    return {
      label: 'Conectado',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      tone: 'emerald',
    };
  }
  if (hasSavedSecret && status === 'configured_pending_test') {
    return {
      label: 'Pendente de teste',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
      tone: 'amber',
    };
  }
  if (hasSavedSecret) {
    return {
      label: 'Credencial guardada',
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
      tone: 'blue',
    };
  }
  return {
    label: 'Não configurado',
    badgeClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    tone: 'zinc',
  };
}

export function formatFriendlyRiskGate(level: RiskLevel, requiresApproval?: boolean): string {
  if (level === 'L0' && !requiresApproval) return 'Análise interna (Sem risco externo)';
  if (level === 'L1') return 'Revisão necessária antes de publicar';
  return 'Aprovação obrigatória (Envolve orçamento ou canal externo)';
}
