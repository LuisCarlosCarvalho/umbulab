import React, { useState } from 'react';
import { Bot, ChevronDown, Code2, Lock, Network } from 'lucide-react';
import { DEMO_AGENTS_TEAM } from '../mockPreviewData';
import { DemoAgentSpec } from '../../../../types/growthOs';
import {
  DemoDataBadge,
  ExecutionModeBadge,
  RiskGateBadge,
  StandbyAgentBadge,
} from '../components/GrowthOsBadges';

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
    return 'Administrador Humano';
  }
  const supervisor = DEMO_AGENTS_TEAM.find((item) => item.agent_key === reportsTo);
  return supervisor ? supervisor.display_name : 'Diretor de Operações de IA';
}

export const AgentsTeamView: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<'Todos' | DemoAgentSpec['department']>('Todos');
  const [expandedAgents, setExpandedAgents] = useState<Record<string, boolean>>({});

  const filteredAgents =
    selectedDept === 'Todos'
      ? DEMO_AGENTS_TEAM
      : DEMO_AGENTS_TEAM.filter((agent) => agent.department === selectedDept);

  const toggleAgentDetails = (agentKey: string) => {
    setExpandedAgents((prev) => ({
      ...prev,
      [agentKey]: !prev[agentKey],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Organograma */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Network size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Organograma Multiagente Planeado (10 Especialistas)
            </h3>
            <StandbyAgentBadge />
            <DemoDataBadge label="Especificação Fictícia" />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Nenhum agente possui execução ativa nesta fase. Cada cartão apresenta o resumo executivo imediato e permite expandir as especificações técnicas quando necessário.
          </p>
        </div>

        {/* Filtro por Departamento */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <label
            htmlFor="agents-dept-filter"
            className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
          >
            Departamento:
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

      {/* Grelha dos Agentes — 1 coluna até 1280px, 2 colunas em xl+ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredAgents.map((agent) => {
          const isExpanded = Boolean(expandedAgents[agent.agent_key]);
          const toggleId = `agent-tech-toggle-${agent.agent_key}`;
          const panelId = `agent-tech-panel-${agent.agent_key}`;
          const supervisorName = resolveSupervisorDisplayName(agent.reports_to);

          return (
            <article
              key={agent.agent_key}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              {/* Nível 1: Informação Executiva à Primeira Vista */}
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
                  <StandbyAgentBadge />
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {agent.responsibility_summary}
                </p>

                {/* Autonomia e Nível de Aprovação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="space-y-1.5">
                    <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Autonomia Planeada
                    </span>
                    <ExecutionModeBadge mode={agent.planned_execution_mode} />
                  </div>
                  <div className="space-y-1.5">
                    <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Nível de Aprovação
                    </span>
                    <RiskGateBadge level={agent.default_risk_level} />
                  </div>
                </div>

                {/* Controlo Acessível para Nível 2 (Detalhes Técnicos Expansíveis) */}
                <div>
                  <button
                    type="button"
                    id={toggleId}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleAgentDetails(agent.agent_key)}
                    className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-umbu-primary"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Code2 size={15} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
                      <span>
                        {isExpanded
                          ? 'Ocultar especificações técnicas'
                          : `Ver especificações técnicas (${agent.planned_runtime_skills.length} Runtime Skills)`}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      aria-hidden="true"
                      className={`shrink-0 text-zinc-500 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Nível 2: Painel Técnico Expansível */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={toggleId}
                    hidden={!isExpanded}
                    className={
                      isExpanded
                        ? 'mt-2.5 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 space-y-3'
                        : 'hidden'
                    }
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <span className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                          Identificador Técnico (agent_key)
                        </span>
                        <code className="inline-block px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200">
                          {agent.agent_key}
                        </code>
                      </div>
                      <div>
                        <span className="block font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                          Contrato Hierárquico (reports_to)
                        </span>
                        <code className="inline-block px-2.5 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200">
                          {agent.reports_to}
                        </code>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
                        Runtime Skills Planeadas (Não Implementadas)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.planned_runtime_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé Executivo Legível */}
              <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Reporta a:{' '}
                  <strong className="font-bold text-zinc-900 dark:text-zinc-100">
                    {supervisorName}
                  </strong>
                </span>
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title="Desativado na Fase 1B: execução de agentes aguarda implementação do backend."
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed shrink-0"
                >
                  <Lock size={13} className="shrink-0" aria-hidden="true" />
                  Execução Bloqueada (Fase 1B)
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AgentsTeamView;

