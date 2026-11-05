import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, ExternalLink, Lock } from 'lucide-react';
import { DEMO_AGENTS_TEAM, DEMO_APPROVAL_TASKS, formatDemoMoneyCents } from '../mockPreviewData';
import {
  CurrencyCodeBadge,
  DemoDataBadge,
  ExecutionModeBadge,
  RiskGateBadge,
} from '../components/GrowthOsBadges';

const STATE_MACHINE_STEPS = [
  'queued',
  'running',
  'awaiting_audit',
  'awaiting_approval',
  'paused_budget',
  'completed',
  'failed_retryable',
  'dead_letter',
] as const;

export const TasksApprovalsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Separação clara face à página existente /approvals */}
      <div className="rounded-2xl border border-umbu-primary/30 bg-umbu-primary/5 dark:border-umbu-secondary/30 dark:bg-umbu-primary/10 p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
            Fronteira Funcional Preservada
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed">
            Esta fila destina-se apenas aos futuros <strong>Gates Humanos L1/L2 das missões de IA</strong>. A gestão real de cadastros de clientes e redefinições de senha continua intacta na área dedicada de Acessos.
          </p>
        </div>
        <Link
          to="/approvals"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-umbu-primary text-white hover:bg-green-800 transition-colors shrink-0 self-start xl:self-center"
        >
          Abrir Aprovações de Acesso
          <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
        </Link>
      </div>

      {/* Máquina de Estados Canónica */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
            Máquina de Estados Prevista para Tarefas
          </h3>
          <DemoDataBadge label="Contrato de Estados" />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATE_MACHINE_STEPS.map((step) => (
            <span
              key={step}
              className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300"
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Fila Demonstrativa L1/L2 */}
      <div className="space-y-4">
        {DEMO_APPROVAL_TASKS.map((task) => {
          const agentLabel =
            DEMO_AGENTS_TEAM.find((a) => a.agent_key === task.agent_key)?.display_name ??
            task.agent_key;

          return (
            <article
              key={task.task_id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4"
            >
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskGateBadge level={task.risk_level} />
                    <ExecutionModeBadge mode={task.execution_mode} />
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      estado: {task.lifecycle_status}
                    </span>
                    <DemoDataBadge />
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-snug">
                    {task.mission_title}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                    Agente: <strong className="text-zinc-900 dark:text-white">{agentLabel}</strong>{' '}
                    <span className="text-zinc-400">•</span>{' '}
                    <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      {task.skill_key}
                    </code>
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shrink-0 self-start">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Reserva Fictícia
                    </span>
                    <CurrencyCodeBadge currency={task.currency} />
                  </div>
                  <span className="block text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5">
                    {formatDemoMoneyCents(task.budget_allowance_cents, task.currency)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 text-sm">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 mb-1.5">
                    Parecer Qualidade (Demo)
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{task.auditor_verdict_label}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 mb-1.5">
                    Parecer Finanças (Demo)
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{task.finance_verdict_label}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 mb-1.5">
                    Impacto Simulado
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{task.impact_summary}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap justify-end gap-2.5">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed"
                >
                  <Lock size={13} className="shrink-0" aria-hidden="true" />
                  Rejeitar (Demo Inativa)
                </button>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed"
                >
                  <Lock size={13} className="shrink-0" aria-hidden="true" />
                  Aprovar Gate Humano (Demo Inativa)
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default TasksApprovalsView;

