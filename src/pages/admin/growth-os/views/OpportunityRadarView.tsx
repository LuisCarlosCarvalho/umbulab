import React, { useState } from 'react';
import {
  Radar,
  CheckCircle2,
  HelpCircle,
  Scale,
  Rocket,
  Sparkles,
  X,
  AlertTriangle,
} from 'lucide-react';
import { formatCents } from '../mockPreviewData';
import type {
  GrowthOsCurrency,
  GrowthOsMarket,
  GrowthOsSection,
  OperationalOpportunityRecord,
} from '../../../../types/growthOs';
import { DemoDataBadge, MarketBadge } from '../components/GrowthOsBadges';
import {
  convertOpportunityToMission,
  discoverGuidedOpportunities,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { showToast } from '../../../../components/ui/Toast';
import {
  FieldLabelWithHelp,
  formatFriendlyRiskGate,
} from '../components/GrowthOsHelpSystem';

interface OpportunityRadarViewProps {
  onNavigateSection?: (section: GrowthOsSection) => void;
}

export const OpportunityRadarView: React.FC<OpportunityRadarViewProps> = ({
  onNavigateSection,
}) => {
  const state = useGrowthOsRuntime();
  const [selectedMarket, setSelectedMarket] = useState<'ALL' | GrowthOsMarket>('ALL');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'operational' | 'demo'>('all');

  // Modal Guiado: Descobrir Novas Oportunidades (IA)
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [discMarket, setDiscMarket] = useState<GrowthOsMarket>('PT');
  const [discArea, setDiscArea] = useState('Websites de Alta Conversão & Automação IA');
  const [discType, setDiscType] = useState('Produto Digital');
  const [discClient, setDiscClient] = useState('PMEs, Clínicas e Empresas de Serviços');
  const [discCount, setDiscCount] = useState(2);
  const [discBudget, setDiscBudget] = useState('10.00');
  const [discCurrency, setDiscCurrency] = useState<GrowthOsCurrency>('EUR');

  // Modal de Revisão antes de Converter em Missão Comercial
  const [convertTarget, setConvertTarget] = useState<OperationalOpportunityRecord | null>(null);
  const [convertTitle, setConvertTitle] = useState('');
  const [convertObjective, setConvertObjective] = useState('');
  const [convertBudget, setConvertBudget] = useState('15.00');
  const [converting, setConverting] = useState(false);

  const filteredOpportunities = state.opportunities.filter((item) => {
    if (selectedMarket !== 'ALL' && item.market !== selectedMarket) return false;
    if (sourceFilter === 'operational' && item.is_demo_data) return false;
    if (sourceFilter === 'demo' && !item.is_demo_data) return false;
    return true;
  });

  const handleRunGuidedDiscovery = (e: React.FormEvent) => {
    e.preventDefault();
    const maxBudgetCents = Math.max(
      100,
      Math.round(parseFloat(discBudget.replace(',', '.')) * 100 || 1000)
    );
    const created = discoverGuidedOpportunities({
      market: discMarket,
      business_area: discArea.trim() || 'Serviços Digitais UmbuLab',
      opportunity_type: discType,
      target_client: discClient.trim() || 'Empresas B2B',
      max_results: discCount,
      max_budget_cents: maxBudgetCents,
      currency: discCurrency,
    });
    setShowDiscoveryModal(false);
    setSourceFilter('operational');
    showToast(
      `${created.length} oportunidade(s) descobertas e adicionadas ao Radar para sua análise!`,
      'success'
    );
  };

  const handleOpenConvertModal = (opp: OperationalOpportunityRecord) => {
    setConvertTarget(opp);
    setConvertTitle(`Missão Comercial: ${opp.title.replace('[FICTÍCIO] ', '')}`);
    setConvertObjective(
      `Validar viabilidade comercial, preparar oferta estruturada e definir próximos passos para "${opp.title.replace('[FICTÍCIO] ', '')}" no mercado ${opp.market}.`
    );
    setConvertBudget(opp.currency === 'BRL' ? '35.00' : '15.00');
  };

  const handleConfirmConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertTarget || converting) return;
    setConverting(true);
    try {
      const budgetCents = Math.max(
        10,
        Math.round(parseFloat(convertBudget.replace(',', '.')) * 100 || 1500)
      );
      const mission = await convertOpportunityToMission(convertTarget.opportunity_id, {
        title: convertTitle,
        objective: convertObjective,
        budget_cap_cents: budgetCents,
        execution_mode: 'approval_required',
      });
      setConvertTarget(null);
      if (mission) {
        showToast(
          `Oportunidade convertida na Missão "${mission.code}"! Reveja o resultado em Tarefas e Aprovações.`,
          'success'
        );
        onNavigateSection?.('tasks_approvals');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao converter oportunidade';
      showToast(msg, 'error');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Radar size={18} className="text-umbu-primary dark:text-umbu-secondary" aria-hidden="true" />
              Radar de Oportunidades de Negócio
            </h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Evidências Separadas de Estimativas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 max-w-4xl">
            Use o botão <strong>Descobrir Novas Oportunidades (IA)</strong> para pesquisar novas ideias de produtos ou serviços digitais. Quando encontrar uma oportunidade interessante, clique em <strong>Converter em Missão Comercial</strong> para a equipa preparar o plano completo.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => setShowDiscoveryModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:opacity-95"
          >
            <Sparkles size={14} />
            <span>Descobrir Novas Oportunidades (IA)</span>
          </button>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as typeof sourceFilter)}
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold"
          >
            <option value="all">Todas ({state.opportunities.length})</option>
            <option value="operational">Criadas por Si / Missões</option>
            <option value="demo">Exemplos Demonstrativos</option>
          </select>

          {(['ALL', 'PT', 'BR', 'GLOBAL'] as const).map((mkt) => (
            <button
              key={mkt}
              type="button"
              aria-pressed={selectedMarket === mkt}
              onClick={() => setSelectedMarket(mkt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                selectedMarket === mkt
                  ? 'bg-umbu-primary text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {mkt === 'ALL' ? 'Todos' : mkt}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Oportunidades com os 8 Campos Claros (Parte 4.5) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredOpportunities.map((item) => (
          <article
            key={item.opportunity_id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-5 flex flex-col justify-between gap-4 shadow-sm"
          >
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-umbu-primary/10 text-umbu-primary dark:bg-umbu-primary/20 dark:text-umbu-secondary text-xs font-extrabold">
                    {item.channel}
                  </span>
                  <MarketBadge market={item.market} />
                  {item.is_demo_data ? (
                    <DemoDataBadge />
                  ) : (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Gerada por Pesquisa IA
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-zinc-500">
                  {formatFriendlyRiskGate(item.risk_level, item.risk_level !== 'L0')}
                </span>
              </div>

              {/* 1. Oportunidade encontrada */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                  Oportunidade Encontrada
                </span>
                <h4 className="text-base font-extrabold text-zinc-900 dark:text-white leading-snug mt-0.5">
                  {item.title}
                </h4>
              </div>

              {/* 5 & 6. Preço estimado, Margem estimada e Viabilidade */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800">
                  <span className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                    Preço Estimado
                  </span>
                  <span className="text-sm font-extrabold font-mono text-zinc-900 dark:text-white">
                    {formatCents(item.estimated_ticket_cents, item.currency)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800">
                  <span className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                    Margem Estimada
                  </span>
                  <span className="text-sm font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                    {item.estimated_margin_pct}%
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800">
                  <span className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400">
                    Interesse / Viabilidade
                  </span>
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
                    {item.viability_label}
                  </span>
                </div>
              </div>

              {/* 2 & 3. Por que pode ser interessante + Evidências e fontes */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 dark:text-emerald-300 mb-1">
                    <CheckCircle2 size={14} aria-hidden="true" />
                    Por que pode ser interessante & Evidências / Fontes:
                  </div>
                  <p className="text-xs text-emerald-950/90 dark:text-emerald-100/90 leading-relaxed">
                    {item.verified_facts_note}
                  </p>
                </div>

                {/* 4 & 7. O que ainda precisa de validação + Riscos */}
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 dark:text-amber-300 mb-1">
                    <HelpCircle size={14} aria-hidden="true" />
                    O que ainda precisa de validação & Riscos a acautelar:
                  </div>
                  <p className="text-xs text-amber-950/90 dark:text-amber-100/90 leading-relaxed">
                    {item.hypothesis_note}
                  </p>
                </div>
              </div>
            </div>

            {/* 8. Próxima ação recomendada + Botão de Conversão com Revisão */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>
                  <strong>Próxima ação:</strong> {item.recommended_action}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Scale size={14} className="text-umbu-primary dark:text-umbu-secondary shrink-0" />
                  <span>{item.compliance_basis}</span>
                </div>

                <button
                  type="button"
                  disabled={item.status === 'converted_to_mission'}
                  onClick={() => handleOpenConvertModal(item)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-3.5 py-2 text-xs font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
                >
                  <Rocket size={13} />
                  <span>
                    {item.status === 'converted_to_mission'
                      ? 'Já Convertida em Missão'
                      : 'Converter em Missão Comercial'}
                  </span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MODAL GUIADO 1: DESCOBRIR NOVAS OPORTUNIDADES (IA) */}
      {showDiscoveryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="discover-opp-title"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 px-5 py-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-neon">
                  Assistente de Pesquisa de Mercado
                </span>
                <h3 id="discover-opp-title" className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
                  Descobrir Novas Oportunidades (IA)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDiscoveryModal(false)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/60"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRunGuidedDiscovery} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabelWithHelp
                    label="País / Mercado"
                    help={{
                      meaning: 'O mercado onde pretende procurar novas oportunidades.',
                      purpose: 'Ajustar preços estimados, moeda e enquadramento legal.',
                      howToFill: 'Escolha Portugal, Brasil ou Global.',
                      example: 'Portugal (PT)',
                      required: true,
                      effect: 'Filtra a pesquisa para a região escolhida.',
                      costOrExternalImpact: 'Sem custo externo em modo simulado.',
                    }}
                  />
                  <select
                    value={discMarket}
                    onChange={(e) => {
                      const m = e.target.value as GrowthOsMarket;
                      setDiscMarket(m);
                      setDiscCurrency(m === 'BR' ? 'BRL' : m === 'GLOBAL' ? 'USD' : 'EUR');
                    }}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm font-bold"
                  >
                    <option value="PT">Portugal (PT)</option>
                    <option value="BR">Brasil (BR)</option>
                    <option value="GLOBAL">Global / Internacional</option>
                  </select>
                </div>

                <div>
                  <FieldLabelWithHelp
                    label="Tipo de Oportunidade"
                    help={{
                      meaning: 'O modelo de negócio que pretende explorar.',
                      purpose: 'Orientar o agente sobre se deve procurar produtos digitais, serviços recorrentes, parcerias de afiliados ou B2B.',
                      howToFill: 'Escolha uma das 4 opções.',
                      example: 'Produto Digital',
                      required: true,
                      effect: 'Define o canal e a margem típica da oportunidade.',
                      costOrExternalImpact: 'Sem custo.',
                    }}
                  />
                  <select
                    value={discType}
                    onChange={(e) => setDiscType(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm font-bold"
                  >
                    <option value="Produto Digital">Produto Digital (Templates, Diagnósticos, SaaS)</option>
                    <option value="Serviço UmbuLab">Serviço de Engenharia / Marketing UmbuLab</option>
                    <option value="Prospeção B2B">Prospeção Comercial B2B</option>
                    <option value="Afiliado Autorizado">Marketing de Afiliados Autorizado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabelWithHelp
                    label="Área de Negócio / Tema"
                    help={{
                      meaning: 'A especialidade ou setor onde quer encontrar oportunidades.',
                      purpose: 'Focar a pesquisa nos pontos fortes da UmbuLab.',
                      howToFill: 'Escreva o tema que deseja explorar.',
                      example: 'Websites de Alta Conversão & Automação WhatsApp',
                      required: true,
                      effect: 'Personaliza as oportunidades geradas.',
                      costOrExternalImpact: 'Sem custo.',
                    }}
                  />
                  <input
                    type="text"
                    required
                    value={discArea}
                    onChange={(e) => setDiscArea(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm"
                  />
                </div>

                <div>
                  <FieldLabelWithHelp
                    label="Cliente Pretendido"
                    help={{
                      meaning: 'Quem será o comprador ideal desta oportunidade.',
                      purpose: 'Ajustar o preço estimado e a abordagem comercial.',
                      howToFill: 'Indique o perfil de cliente.',
                      example: 'PMEs, Clínicas e Escritórios de Serviços',
                      required: true,
                      effect: 'Incluído na análise de viabilidade.',
                      costOrExternalImpact: 'Sem custo.',
                    }}
                  />
                  <input
                    type="text"
                    required
                    value={discClient}
                    onChange={(e) => setDiscClient(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabelWithHelp
                    label="Número de oportunidades a gerar"
                    help={{
                      meaning: 'Quantas ideias estruturadas pretende receber agora.',
                      purpose: 'Manter a lista focada nas melhores opções.',
                      howToFill: 'Escolha entre 1 e 3 oportunidades.',
                      example: '2 oportunidades',
                      required: true,
                      effect: 'Adiciona este número de cartões ao Radar.',
                      costOrExternalImpact: 'Sem custo adicional.',
                    }}
                  />
                  <select
                    value={discCount}
                    onChange={(e) => setDiscCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm font-bold"
                  >
                    <option value={1}>1 oportunidade detalhada</option>
                    <option value={2}>2 oportunidades comparáveis (Recomendado)</option>
                    <option value={3}>3 oportunidades</option>
                  </select>
                </div>

                <div>
                  <FieldLabelWithHelp
                    label={`Orçamento máximo da pesquisa (${discCurrency})`}
                    help={{
                      meaning: 'Limite máximo para a tarefa de pesquisa.',
                      purpose: 'Controlar o orçamento dedicado a descoberta.',
                      howToFill: 'Introduza um valor baixo (ex.: 10.00).',
                      example: '10.00',
                      required: true,
                      effect: 'Regista o teto na execução.',
                      costOrExternalImpact: 'Em modo simulado não há cobrança externa.',
                    }}
                  />
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={discBudget}
                    onChange={(e) => setDiscBudget(e.target.value)}
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowDiscoveryModal(false)}
                  className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-5 py-2 text-xs font-extrabold text-white"
                >
                  <Sparkles size={14} />
                  Gerar Oportunidades Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GUIADO 2: REVER ANTES DE CONVERTER EM MISSÃO COMERCIAL */}
      {convertTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="convert-opp-title"
        >
          <div className="w-full max-w-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 px-5 py-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-neon">
                  Revisão Antes de Iniciar Missão
                </span>
                <h3 id="convert-opp-title" className="text-base font-extrabold text-zinc-900 dark:text-white">
                  Converter em Missão Comercial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConvertTarget(null)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/60"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmConvert} className="p-5 space-y-4">
              <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Confirme ou ajuste os dados abaixo. A missão será preparada pela equipa de agentes e ficará a aguardar a sua aprovação final em <strong>Tarefas e Aprovações</strong>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Título da Missão Comercial
                </label>
                <input
                  type="text"
                  required
                  value={convertTitle}
                  onChange={(e) => setConvertTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  O que a equipa vai preparar nesta missão
                </label>
                <textarea
                  rows={3}
                  required
                  value={convertObjective}
                  onChange={(e) => setConvertObjective(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Limite de Orçamento a Reservar ({convertTarget.currency})
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={convertBudget}
                  onChange={(e) => setConvertBudget(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 font-mono text-sm font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setConvertTarget(null)}
                  className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-5 py-2 text-xs font-extrabold text-white"
                >
                  <Rocket size={14} />
                  {converting ? 'A criar missão...' : 'Confirmar e Iniciar Missão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityRadarView;
