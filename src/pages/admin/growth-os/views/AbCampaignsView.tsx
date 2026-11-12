import React, { useState } from 'react';
import {
  SplitSquareVertical,
  Lock,
  ShieldAlert,
  PlusCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatDemoMoneyCents } from '../mockPreviewData';
import type { GrowthOsCurrency, GrowthOsMarket } from '../../../../types/growthOs';
import { CurrencyCodeBadge, DemoDataBadge } from '../components/GrowthOsBadges';
import {
  createOperationalAbCampaign,
  suggestAbHypothesesWithAgent,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { showToast } from '../../../../components/ui/Toast';
import {
  FieldLabelWithHelp,
  formatFriendlyRiskGate,
} from '../components/GrowthOsHelpSystem';

export const AbCampaignsView: React.FC = () => {
  const state = useGrowthOsRuntime();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Campos do Assistente de Nova Campanha A/B (7 passos/campos claros — Parte 4.6)
  const [title, setTitle] = useState('Teste A/B — Página de Diagnóstico Digital B2B');
  const [objective, setObjective] = useState(
    'Descobrir qual mensagem gera mais pedidos de contacto qualificados de empresas.'
  );
  const [targetAudience, setTargetAudience] = useState(
    'Gerentes e diretores de PMEs em Portugal e no Brasil'
  );
  const [channel, setChannel] = useState('Página de Vendas (Landing Page) + Anúncios Pesquisa');
  const [market, setMarket] = useState<GrowthOsMarket>('PT');
  const [currency, setCurrency] = useState<GrowthOsCurrency>('EUR');
  const [budgetAmount, setBudgetAmount] = useState('150.00');
  const [durationDays, setDurationDays] = useState(14);
  const [variantA, setVariantA] = useState(
    'Versão A (Controlo): Destaque na segurança técnica, velocidade do site e acompanhamento próximo da UmbuLab.'
  );
  const [variantB, setVariantB] = useState(
    'Versão B (Teste): Destaque na poupança de tempo com automação comercial e resposta imediata no WhatsApp.'
  );
  const [primaryMetric, setPrimaryMetric] = useState(
    'Taxa de pedidos de orçamento qualificados (Formulário / WhatsApp)'
  );
  const [submitForApproval, setSubmitForApproval] = useState(true);

  const adsConnected = state.integrations.some(
    (i) => (i.provider_key === 'meta_ads' || i.provider_key === 'google_ads') && i.status === 'connected'
  );

  const handleSuggestWithAi = () => {
    const suggested = suggestAbHypothesesWithAgent({
      objective,
      target_audience: targetAudience,
      channel,
    });
    setVariantA(suggested.variant_a);
    setVariantB(suggested.variant_b);
    showToast(
      'Hipóteses A e B sugeridas pelo Gestor de Tráfego (sujeitas a teste real, sem promessa prévia de superioridade).',
      'info'
    );
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetCents = Math.max(
      0,
      Math.round(parseFloat(budgetAmount.replace(',', '.')) * 100 || 0)
    );
    const created = createOperationalAbCampaign({
      title: title.trim() || 'Nova Campanha A/B',
      objective: objective.trim(),
      target_audience: targetAudience.trim(),
      channel: channel.trim(),
      market,
      currency,
      planned_budget_cap_cents: budgetCents,
      duration_days: durationDays,
      variant_a_summary: variantA.trim(),
      variant_b_summary: variantB.trim(),
      primary_metric_label: primaryMetric.trim(),
      submit_for_approval: submitForApproval,
    });
    setShowCreateForm(false);
    showToast(
      submitForApproval
        ? `Campanha "${created.title}" guardada em rascunho e enviada para o Centro de Aprovações!`
        : `Campanha "${created.title}" guardada como rascunho planeado!`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Botão Principal "Iniciar Nova Campanha A/B" */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <SplitSquareVertical size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Campanhas e Testes A/B (Comparação de Duas Versões)
            </h3>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
              {adsConnected ? 'Contas Ligadas (Requer Aprovação)' : 'Modo Rascunho Seguro (Sem Conta de Anúncios Ativa)'}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Um teste A/B serve para comparar duas ideias diferentes (Versão A vs. Versão B) junto do mesmo público para descobrir qual traz mais clientes. Enquanto não ligar uma conta Google Ads ou Meta Ads, todas as campanhas ficam guardadas como <strong>rascunho planeado</strong> sem gastar dinheiro.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:opacity-95 shrink-0 self-start lg:self-center"
        >
          <PlusCircle size={16} />
          <span>{showCreateForm ? 'Fechar Assistente' : 'Iniciar Nova Campanha A/B'}</span>
        </button>
      </div>

      {/* ASSISTENTE GUIADO PARA INICIAR NOVA CAMPANHA A/B (PARTE 4.6) */}
      {showCreateForm && (
        <section className="rounded-2xl border-2 border-umbu-primary/30 bg-white dark:bg-zinc-950 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h4 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Assistente para Criar Campanha A/B
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Preencha os 7 pontos abaixo. Pode pedir ajuda à IA para sugerir as duas versões de teste.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSuggestWithAi}
              className="inline-flex items-center gap-1.5 rounded-xl border border-umbu-primary/50 bg-umbu-primary/10 px-3.5 py-2 text-xs font-extrabold text-umbu-primary dark:text-umbu-neon hover:bg-umbu-primary/20"
            >
              <Sparkles size={14} />
              <span>Pedir ao Agente para Sugerir Versões A e B</span>
            </button>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabelWithHelp
                  label="Nome da Campanha"
                  help={{
                    meaning: 'Nome para identificar este teste A/B na sua lista.',
                    purpose: 'Organizar facilmente as campanhas por produto ou serviço.',
                    howToFill: 'Escreva um título curto.',
                    example: 'Teste A/B — Página de Diagnóstico Digital B2B',
                    required: true,
                    effect: 'Cria o cartão da campanha abaixo.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-semibold"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="1. Objetivo da Campanha"
                  help={{
                    meaning: 'O que pretende alcançar com este teste.',
                    purpose: 'Definir claramente a pergunta que o teste vai responder.',
                    howToFill: 'Descreva o objetivo numa frase.',
                    example: 'Descobrir qual título gera mais contactos pelo WhatsApp.',
                    required: true,
                    effect: 'Orienta a sugestão das variantes A e B.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="text"
                  required
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FieldLabelWithHelp
                  label="2. Público-Alvo"
                  help={{
                    meaning: 'Quem deve ver esta campanha.',
                    purpose: 'Adequar a linguagem ao perfil do cliente.',
                    howToFill: 'Indique o tipo de cliente e localização.',
                    example: 'PMEs e clínicas em Portugal',
                    required: true,
                    effect: 'Usado pelo agente na criação das mensagens.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="3. Canal Onde Será Usada"
                  help={{
                    meaning: 'Onde pretende testar estas duas versões.',
                    purpose: 'Adaptar o formato ao canal (site, Instagram, Google ou e-mail).',
                    howToFill: 'Escolha na lista.',
                    example: 'Instagram & Facebook Ads',
                    required: true,
                    effect: 'Regista o canal no plano.',
                    costOrExternalImpact: 'Guarda apenas como rascunho se a conta não estiver ligada.',
                  }}
                />
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-bold"
                >
                  <option value="Página de Vendas (Landing Page)">Página de Vendas (Landing Page)</option>
                  <option value="Instagram & Facebook Ads (Meta)">Instagram & Facebook Ads (Meta)</option>
                  <option value="Google Ads (Pesquisa)">Google Ads (Pesquisa)</option>
                  <option value="Abordagem Comercial B2B / E-mail">Abordagem Comercial B2B / E-mail</option>
                </select>
              </div>

              <div>
                <FieldLabelWithHelp
                  label="7. Métrica de Sucesso (Como decidir o vencedor)"
                  help={{
                    meaning: 'O indicador que dirá se a Versão A ou a Versão B ganhou.',
                    purpose: 'Avaliar o resultado com dados objetivos.',
                    howToFill: 'Indique o que vai medir.',
                    example: 'Número de pedidos de orçamento qualificados',
                    required: true,
                    effect: 'Exibido no cartão da campanha.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="text"
                  required
                  value={primaryMetric}
                  onChange={(e) => setPrimaryMetric(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Mercado
                </label>
                <select
                  value={market}
                  onChange={(e) => {
                    const m = e.target.value as GrowthOsMarket;
                    setMarket(m);
                    if (m === 'BR') setCurrency('BRL');
                    else if (m === 'PT') setCurrency('EUR');
                  }}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-bold"
                >
                  <option value="PT">Portugal (PT)</option>
                  <option value="BR">Brasil (BR)</option>
                  <option value="GLOBAL">Global</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Moeda
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as GrowthOsCurrency)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-bold"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div>
                <FieldLabelWithHelp
                  label={`4. Orçamento Planeado (${currency})`}
                  help={{
                    meaning: 'Valor total que planeia investir quando ativar o teste.',
                    purpose: 'Dimensionar o teste dentro do orçamento da UmbuLab.',
                    howToFill: 'Digite o valor planeado (ex.: 150.00).',
                    example: '150.00',
                    required: true,
                    effect: 'Fica registado apenas como valor planeado (não debita o cartão nem a conta de anúncios sozinho).',
                    costOrExternalImpact: 'Zero cobrança automática.',
                  }}
                />
                <input
                  type="number"
                  step="5"
                  min="0"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Período de Teste (Dias)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value) || 14)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 font-mono text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabelWithHelp
                  label="5. Variante A (Versão Principal / Controlo)"
                  help={{
                    meaning: 'A primeira versão da mensagem ou anúncio que quer testar.',
                    purpose: 'Servir de base de comparação.',
                    howToFill: 'Escreva a mensagem A ou clique em "Pedir ao Agente para Sugerir".',
                    example: 'Foco em segurança técnica e entrega rápida.',
                    required: true,
                    effect: 'Guardada como Hipótese A.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <textarea
                  rows={3}
                  required
                  value={variantA}
                  onChange={(e) => setVariantA(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-xs sm:text-sm"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="6. Variante B (Versão Alternativa de Teste)"
                  help={{
                    meaning: 'A segunda versão com um ângulo diferente para comparar com a Versão A.',
                    purpose: 'Testar uma nova hipótese (sem garantia prévia de que será superior à A até testar na prática).',
                    howToFill: 'Escreva a mensagem B ou use a sugestão da IA.',
                    example: 'Foco em atendimento automático 24/7 via WhatsApp.',
                    required: true,
                    effect: 'Guardada como Hipótese B.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <textarea
                  rows={3}
                  required
                  value={variantB}
                  onChange={(e) => setVariantB(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 text-xs sm:text-sm"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
              <input
                type="checkbox"
                checked={submitForApproval}
                onChange={(e) => setSubmitForApproval(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-umbu-primary"
              />
              Enviar também para a fila de Tarefas e Aprovações após guardar
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-5 py-2.5 text-xs font-extrabold text-white shadow-sm"
              >
                <CheckCircle2 size={14} />
                Guardar Campanha A/B (Rascunho Seguro)
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Lista de Campanhas A/B (Criadas + Exemplos Demonstrativos) */}
      <div className="space-y-4">
        {state.ab_campaigns.map((camp) => (
          <article
            key={camp.campaign_id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4"
          >
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    Mercado: {camp.market}
                  </span>
                  <CurrencyCodeBadge currency={camp.currency} />
                  {camp.is_demo_data ? (
                    <DemoDataBadge label={camp.status_label} />
                  ) : (
                    <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {camp.status_label}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-zinc-500">
                    {formatFriendlyRiskGate(camp.risk_level, true)}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white leading-snug">
                  {camp.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Objetivo:</strong> {camp.objective} • <strong>Público:</strong> {camp.target_audience} • <strong>Canal:</strong> {camp.channel}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shrink-0 self-start">
                <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Orçamento Planeado ({camp.duration_days} dias)
                </span>
                <span className="text-lg font-extrabold text-zinc-900 dark:text-white mt-0.5 block">
                  {formatDemoMoneyCents(camp.planned_budget_cap_cents, camp.currency)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                  Variante A (Controlo)
                </span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {camp.variant_a_summary}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Variante B (Hipótese em Teste — Sem superioridade garantida a priori)
                </span>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {camp.variant_b_summary}
                </p>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs sm:text-sm">
              <div className="flex items-start sm:items-center gap-2 text-zinc-600 dark:text-zinc-300">
                <ShieldAlert size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <span>
                  <strong>Como medimos o sucesso:</strong> {camp.primary_metric_label} • {camp.approval_gate_note}
                </span>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shrink-0 self-start xl:self-auto">
                <Lock size={13} className="shrink-0" aria-hidden="true" />
                {camp.is_draft_without_external_api
                  ? 'Guardado em Rascunho (Sem Gasto Externo)'
                  : 'Requer Aprovação Humana'}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AbCampaignsView;
