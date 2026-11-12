import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  PauseCircle,
  PlayCircle,
  Ban,
  Filter,
  BarChart3,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import {
  DEMO_PERFORMANCE_CHANNELS,
  formatCents,
  formatDemoMoneyCents,
  getAgentDisplayName,
} from '../mockPreviewData';
import { DemoDataBadge, MarketBadge } from '../components/GrowthOsBadges';
import {
  cancelAllRunningMissions,
  toggleGlobalEmergencyPause,
  updateAgentConfiguration,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { showToast } from '../../../../components/ui/Toast';
import {
  ActionConfirmationModal,
  ExperienceModeSwitch,
  formatFriendlyAdapterMode,
} from '../components/GrowthOsHelpSystem';

export const ReportsPerformanceView: React.FC = () => {
  const state = useGrowthOsRuntime();
  const [experienceMode, setExperienceMode] = useState<'simple' | 'advanced'>('simple');
  const [filterAgent, setFilterAgent] = useState<string>('ALL');
  const [filterAdapter, setFilterAdapter] = useState<'ALL' | 'live_provider_api' | 'sandbox_test_adapter'>('ALL');
  const [emergencyReason, setEmergencyReason] = useState(
    'Pausa preventiva acionada pelo Administrador.'
  );
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  const isGlobalPaused = state.system_controls.pause_new_executions;

  const filteredRuns = state.task_runs.filter((run) => {
    if (filterAgent !== 'ALL' && run.agent_key !== filterAgent) return false;
    if (filterAdapter !== 'ALL' && run.adapter_mode !== filterAdapter) return false;
    return true;
  });

  // Indicadores da Visão Simples (Parte 4.9)
  const completedMissionsCount = state.missions.filter((m) => m.status === 'completed').length;
  const runningMissionsCount = state.missions.filter(
    (m) => m.status === 'running' || m.status === 'queued' || m.status === 'awaiting_approval'
  ).length;
  const failedMissionsCount = state.missions.filter((m) => m.status === 'failed').length;
  const usedAgentsCount = new Set(state.task_runs.map((r) => r.agent_key)).size;

  const estimatedCostEurCents = state.missions
    .filter((m) => m.currency === 'EUR' && m.adapter_mode !== 'live_provider_api')
    .reduce((acc, m) => acc + m.budget_used_cents, 0);

  const confirmedCostEurCents = state.missions
    .filter((m) => m.currency === 'EUR' && m.adapter_mode === 'live_provider_api')
    .reduce((acc, m) => acc + m.budget_used_cents, 0);

  const totalTokens = filteredRuns.reduce(
    (acc, r) => acc + r.prompt_tokens + r.completion_tokens,
    0
  );
  const avgLatencyMs =
    filteredRuns.length > 0
      ? Math.round(filteredRuns.reduce((acc, r) => acc + r.latency_ms, 0) / filteredRuns.length)
      : 0;

  const handleToggleEmergencyPause = () => {
    const nextPause = !isGlobalPaused;
    toggleGlobalEmergencyPause(nextPause, emergencyReason);
    showToast(
      nextPause
        ? 'Pausa de Emergência Ativada: Nenhuma nova tarefa ou missão será iniciada.'
        : 'Sistema Reativado: Os agentes voltaram ao funcionamento normal.',
      nextPause ? 'error' : 'success'
    );
  };

  const handleConfirmCancelMissions = () => {
    const count = cancelAllRunningMissions();
    setShowCancelConfirmModal(false);
    showToast(
      count > 0
        ? `${count} missão(ões) cancelada(s) e orçamento reservado devolvido ao saldo disponível.`
        : 'Não existiam missões em curso para cancelar.',
      'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO COM ALTERNADOR VISÃO SIMPLES / VISÃO AVANÇADA (PARTE 4.9) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col gap-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Activity size={19} className="text-umbu-primary dark:text-umbu-secondary shrink-0" />
            Relatórios de Execução e Monitorização da Equipa
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-0.5 max-w-4xl">
            Na <strong>Visão Simples</strong> vê os resultados, o tempo e os custos em linguagem clara. Na <strong>Visão Avançada</strong> pode inspecionar tokens, latência e registos técnicos JSON.
          </p>
        </div>

        <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <ExperienceModeSwitch mode={experienceMode} onChange={setExperienceMode} />
        </div>
      </div>

      {/* 1. INDICADORES COMPREENSÍVEIS (VISÃO SIMPLES SEMPRE VISÍVEL — PARTE 4.9) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Missões Realizadas (Aprovadas)</span>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {completedMissionsCount}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Em Execução / Aguardam Decisão</span>
          <p className="mt-1 text-2xl font-extrabold text-amber-700 dark:text-amber-400">
            {runningMissionsCount}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Missões com Erro</span>
          <p className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-white">
            {failedMissionsCount}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Agentes Utilizados</span>
          <p className="mt-1 text-2xl font-extrabold text-umbu-primary dark:text-umbu-secondary">
            {usedAgentsCount} / 10
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Custo Estimado (Simulação EUR)</span>
          <p className="mt-1 font-mono text-xl font-extrabold text-zinc-900 dark:text-white">
            {formatCents(estimatedCostEurCents, 'EUR')}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Custo Confirmado (API Real EUR)</span>
          <p className="mt-1 font-mono text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatCents(confirmedCostEurCents, 'EUR')}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Tempo Médio de Resposta</span>
          <p className="mt-1 font-mono text-xl font-extrabold text-zinc-900 dark:text-white">
            {avgLatencyMs > 0 ? `${(avgLatencyMs / 1000).toFixed(2)} s` : '0,00 s'}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4">
          <span className="text-xs font-bold text-zinc-500">Passos Registados</span>
          <p className="mt-1 font-mono text-xl font-extrabold text-zinc-900 dark:text-white">
            {filteredRuns.length}
          </p>
        </div>
      </section>

      {/* 2. PRINCIPAIS RESULTADOS E HISTÓRICO DE ATIVIDADE */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">
              {experienceMode === 'simple'
                ? 'Principais Resultados Entregues pelos Agentes'
                : 'Registo Técnico de Execuções (JSON, Tokens, Latência e IDs)'}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Filter size={14} className="text-zinc-500" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold"
            >
              <option value="ALL">Todos os Agentes (10)</option>
              {state.agents.map((a) => (
                <option key={a.agent_key} value={a.agent_key}>
                  {a.display_name}
                </option>
              ))}
            </select>

            <select
              value={filterAdapter}
              onChange={(e) => setFilterAdapter(e.target.value as typeof filterAdapter)}
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold"
            >
              <option value="ALL">Todos os Ambientes</option>
              <option value="live_provider_api">Apenas API Externa Conectada</option>
              <option value="sandbox_test_adapter">Apenas Simulação Interna</option>
            </select>
          </div>
        </div>

        {experienceMode === 'advanced' && (
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 text-xs font-mono flex flex-wrap gap-4">
            <span>Total Tokens: <strong>{totalTokens.toLocaleString('pt-PT')}</strong></span>
            <span>Latência Média: <strong>{avgLatencyMs} ms</strong></span>
            <span>Driver: <strong>{state.system_controls.persistence_driver}</strong></span>
          </div>
        )}

        {filteredRuns.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-xs sm:text-sm text-zinc-500">
            Ainda não existem tarefas registadas para este filtro. Inicie uma missão em "Tarefas e Aprovações" ou faça um teste em "Equipa de Agentes".
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRuns.map((run) => (
              <div
                key={run.run_id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-md bg-umbu-primary/10 px-2.5 py-0.5 font-extrabold text-umbu-primary dark:text-umbu-secondary">
                      <CheckCircle2 size={12} />
                      {getAgentDisplayName(run.agent_key)}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {run.mission_title}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 font-bold ${
                        run.adapter_mode === 'live_provider_api'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {formatFriendlyAdapterMode(run.adapter_mode)}
                    </span>
                  </div>

                  <div className="text-zinc-500">
                    Tempo: {run.latency_ms} ms • {new Date(run.created_at).toLocaleTimeString('pt-PT')}
                  </div>
                </div>

                {/* Visão Simples vs Visão Avançada */}
                {experienceMode === 'simple' ? (
                  <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 text-zinc-700 dark:text-zinc-200 leading-relaxed">
                    <strong>Resultado entregue:</strong>{' '}
                    {String(
                      (run.sanitized_output as Record<string, unknown>)?.output_summary ||
                        (run.sanitized_output as Record<string, unknown>)?.response ||
                        run.audit_notes
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="font-mono text-[11px] text-zinc-500 flex flex-wrap gap-3">
                      <span>ID: {run.run_id}</span>
                      <span>Skill: {run.skill_key}</span>
                      <span>
                        Provedor/Modelo: <Cpu size={11} className="inline" /> {run.model_provider} / {run.model_name}
                      </span>
                      <span>Tokens: {run.prompt_tokens + run.completion_tokens}</span>
                      <span>Modo: {run.execution_mode}</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      <pre className="max-h-40 overflow-auto rounded-lg bg-zinc-900 p-2.5 font-mono text-[11px] text-zinc-200">
                        {JSON.stringify(run.sanitized_input, null, 2)}
                      </pre>
                      <pre className="max-h-40 overflow-auto rounded-lg bg-zinc-900 p-2.5 font-mono text-[11px] text-emerald-200">
                        {JSON.stringify(run.sanitized_output, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. REFERÊNCIA DE CANAIS (ISOLADA) */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={16} className="text-umbu-primary dark:text-umbu-secondary" />
            Comparativo de Canais Digitais (Referência Demonstrativa Isolada)
          </h4>
          <DemoDataBadge />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DEMO_PERFORMANCE_CHANNELS.map((row) => (
            <div
              key={row.channel_id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-zinc-900 dark:text-white">{row.channel_label}</span>
                <MarketBadge market={row.market} />
              </div>
              <div className="font-mono text-zinc-600 dark:text-zinc-300">
                Receita Exemplo: {formatDemoMoneyCents(row.demo_attributed_revenue_cents, row.native_currency)} • Custo Exemplo:{' '}
                {formatDemoMoneyCents(row.demo_direct_cost_cents, row.native_currency)}
              </div>
              <p className="text-zinc-500">{row.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CONTROLO DE EMERGÊNCIA (VISUALMENTE SEPARADO NO FINAL — PARTE 4.9) */}
      <section className="rounded-2xl border-2 border-red-300 dark:border-red-900/70 bg-red-50/40 dark:bg-red-950/20 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 dark:text-red-300">
              Zona de Segurança Administrativa
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <AlertOctagon size={20} className="text-red-600 dark:text-red-400 shrink-0" />
              Controlo de Emergência
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-red-900 dark:text-red-200">
              Utilize apenas se quiser interromper imediatamente todas as execuções da IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleEmergencyPause}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors ${
                isGlobalPaused
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isGlobalPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
              <span>
                {isGlobalPaused
                  ? 'Reativar Funcionamento da IA'
                  : 'Pausar Todas as Novas Execuções'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowCancelConfirmModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-400 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-xs font-extrabold text-red-700 dark:text-red-300 hover:bg-red-50"
            >
              <Ban size={15} />
              <span>Cancelar Missões em Curso</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Motivo da Pausa (fica registado no histórico)
            </label>
            <input
              type="text"
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <span className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Pausar ou Reativar um Agente Individual:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {state.agents.map((ag) => {
                const paused = ag.status === 'paused';
                return (
                  <button
                    key={ag.agent_key}
                    type="button"
                    onClick={() =>
                      updateAgentConfiguration(ag.agent_key, {
                        status: paused ? 'idle' : 'paused',
                      })
                    }
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      paused
                        ? 'border-red-400 bg-red-100 text-red-900 dark:bg-red-950/70 dark:text-red-200'
                        : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {ag.display_name}: {paused ? 'PAUSADO' : 'ATIVO'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE CONFIRMAÇÃO ANTES DE CANCELAR MISSÕES EM CURSO (PARTE 4.9) */}
      {showCancelConfirmModal && (
        <ActionConfirmationModal
          title="Confirmar Cancelamento de Missões em Curso"
          whatWillHappen={`Todas as missões em execução ou pendentes (${runningMissionsCount}) serão canceladas imediatamente e os valores reservados voltarão para o saldo disponível.`}
          amountLabel={`${runningMissionsCount} missão(ões) ativa(s)`}
          nature="simulated_internal"
          whereRecorded="O cancelamento e a devolução das reservas ficarão registados em Tarefas e Aprovações e na Gestão Financeira."
          confirmLabel="Sim, Cancelar Missões em Curso"
          variant="red"
          onCancel={() => setShowCancelConfirmModal(false)}
          onConfirm={handleConfirmCancelMissions}
        />
      )}
    </div>
  );
};

export default ReportsPerformanceView;
