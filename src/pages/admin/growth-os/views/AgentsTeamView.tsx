import React, { useState } from 'react';
import {
  Bot,
  ChevronDown,
  Code2,
  FlaskConical,
  Network,
  Settings,
  Wrench,
  Activity,
} from 'lucide-react';
import { DEMO_AGENTS_TEAM, formatCents } from '../mockPreviewData';
import type { DemoAgentSpec, OperationalAgentConfig } from '../../../../types/growthOs';
import { useGrowthOsRuntime } from '../services/growthOsRuntime';
import { AgentDetailModal } from '../components/AgentDetailModal';
import {
  ExperienceModeSwitch,
  formatFriendlyAutonomy,
  formatFriendlyRiskGate,
} from '../components/GrowthOsHelpSystem';

const DEPARTMENTS: Array<'Todos' | DemoAgentSpec['department']> = [
  'Todos',
  'Orquestração',
  'Inteligência & Comercial',
  'Marketing & Criativo',
  'Canais & B2B',
  'Finanças & Governação',
];

function resolveSupervisorDisplayName(reportsTo: DemoAgentSpec['reports_to']): string {
  if (reportsTo === 'human_admin') {
    return 'Administrador UmbuLab (Você)';
  }
  const supervisor = DEMO_AGENTS_TEAM.find((item) => item.agent_key === reportsTo);
  return supervisor ? supervisor.display_name : 'Diretor de Operações de IA';
}

export const AgentsTeamView: React.FC = () => {
  const state = useGrowthOsRuntime();
  const [selectedDept, setSelectedDept] = useState<'Todos' | DemoAgentSpec['department']>('Todos');
  const [experienceMode, setExperienceMode] = useState<'simple' | 'advanced'>('simple');
  const [expandedAgents, setExpandedAgents] = useState<Record<string, boolean>>({});
  const [modalTarget, setModalTarget] = useState<{
    agent: OperationalAgentConfig;
    tab: 'overview' | 'config' | 'tools' | 'runs' | 'tests';
  } | null>(null);

  const connectedProviders = new Set(
    state.integrations.filter((i) => i.status === 'connected').map((i) => i.provider_key)
  );

  const filteredAgents =
    selectedDept === 'Todos'
      ? state.agents
      : state.agents.filter((agent) => agent.department === selectedDept);

  const toggleAgentDetails = (agentKey: string) => {
    setExpandedAgents((prev) => ({
      ...prev,
      [agentKey]: !prev[agentKey],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Equipa de Agentes */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Network size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Equipa de Especialistas de IA (10 Agentes Configuráveis)
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
            Clique em <strong>Configurar em 5 Passos</strong> em qualquer especialista para escolher o motor de IA, definir o que ele pode fazer sozinho, ajustar o limite diário de despesa e testar uma resposta.
          </p>
        </div>

        {/* Filtro por Departamento + Modo Simples/Avançado */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <ExperienceModeSwitch mode={experienceMode} onChange={setExperienceMode} />

          <div className="flex items-center gap-2">
            <label
              htmlFor="agents-dept-filter"
              className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
            >
              Área:
            </label>
            <select
              id="agents-dept-filter"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value as 'Todos' | DemoAgentSpec['department'])}
              className="px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-umbu-primary"
            >
              {DEPARTMENTS.map((dept) => (
                <option
                  key={dept}
                  value={dept}
                  className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                >
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grelha dos Agentes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredAgents.map((agent) => {
          const isExpanded = Boolean(expandedAgents[agent.agent_key]);
          const toggleId = `agent-tech-toggle-${agent.agent_key}`;
          const panelId = `agent-tech-panel-${agent.agent_key}`;
          const supervisorName = resolveSupervisorDisplayName(agent.reports_to);
          const hasLiveApi = connectedProviders.has(agent.preferred_provider);
          const friendlyAutonomy = formatFriendlyAutonomy(agent.execution_mode);
          const friendlyGate = formatFriendlyRiskGate(
            agent.default_risk_level,
            agent.requires_human_approval
          );

          return (
            <article
              key={agent.agent_key}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-umbu-primary/10 text-umbu-primary dark:bg-umbu-primary/20 dark:text-umbu-secondary shrink-0 mt-0.5">
                      <Bot size={22} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {agent.department}
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-snug mt-0.5">
                        {agent.display_name}
                      </h4>
                      <p className="text-sm font-semibold text-umbu-primary dark:text-umbu-secondary mt-0.5 leading-snug">
                        {agent.role_title}
                      </p>
                    </div>
                  </div>

                  {/* Estado honesto do Agente */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                        agent.status === 'paused'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          : agent.status === 'awaiting_approval'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : hasLiveApi
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          agent.status === 'paused'
                            ? 'bg-red-500'
                            : agent.status === 'awaiting_approval'
                              ? 'bg-amber-500 animate-pulse'
                              : hasLiveApi
                                ? 'bg-emerald-500'
                                : 'bg-blue-500'
                        }`}
                      />
                      {agent.status === 'paused'
                        ? 'Em Pausa'
                        : agent.status === 'awaiting_approval'
                          ? 'Aguarda Aprovação'
                          : hasLiveApi
                            ? 'Pronto (API Conectada)'
                            : 'Configurado (Modo Simulado)'}
                    </span>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {agent.responsibility_summary}
                </p>

                {/* Resumo em Linguagem Simples */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-2.5">
                    <span className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      Permissão atual
                    </span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">
                      {friendlyAutonomy.label}
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-2.5">
                    <span className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      Limite diário máximo
                    </span>
                    <span className="font-mono font-extrabold text-zinc-900 dark:text-white">
                      {formatCents(agent.daily_budget_cents, agent.currency)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-2.5">
                    <span className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                      Nível de segurança
                    </span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">
                      {friendlyGate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalTarget({ agent, tab: 'config' })}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-3.5 py-2 text-xs font-extrabold text-white shadow-sm hover:opacity-95 transition-opacity"
                    >
                      <Settings size={13} aria-hidden="true" />
                      Configurar em 5 Passos
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTarget({ agent, tab: 'tests' })}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/50 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors"
                    >
                      <FlaskConical size={13} aria-hidden="true" />
                      Testar Agente
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTarget({ agent, tab: 'tools' })}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Wrench size={13} aria-hidden="true" />
                      Permissões ({agent.allowed_tools.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTarget({ agent, tab: 'runs' })}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Activity size={13} aria-hidden="true" />
                      Histórico ({agent.total_runs_count})
                    </button>
                  </div>

                  {experienceMode === 'advanced' && (
                    <button
                      id={toggleId}
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => toggleAgentDetails(agent.agent_key)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200"
                    >
                      <Code2 size={14} className="text-umbu-primary dark:text-umbu-secondary shrink-0" />
                      <span>{isExpanded ? 'Ocultar ID técnico' : 'Ver ID técnico'}</span>
                      <ChevronDown
                        size={14}
                        className={`text-zinc-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Detalhes Técnicos (Modo Avançado) */}
                {experienceMode === 'advanced' && isExpanded && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={toggleId}
                    className="rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-3.5 space-y-2 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="text-zinc-500 block">ID Técnico:</span>
                        <code className="font-mono font-bold">{agent.agent_key}</code>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Modelo:</span>
                        <code className="font-mono font-bold">{agent.preferred_model}</code>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Reporta a:</span>
                        <span className="font-bold">{supervisorName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {modalTarget && (
        <AgentDetailModal
          agent={modalTarget.agent}
          initialTab={modalTarget.tab}
          onClose={() => setModalTarget(null)}
        />
      )}
    </div>
  );
};

export default AgentsTeamView;
