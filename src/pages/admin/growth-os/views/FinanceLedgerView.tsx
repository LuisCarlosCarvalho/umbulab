import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  Lock,
  BookOpen,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  Save,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import type {
  AccountingRegime,
  GrowthOsCurrency,
  LedgerModelView,
} from '../../../../types/growthOs';
import { formatDemoMoneyCents } from '../mockPreviewData';
import { CurrencyCodeBadge, DemoDataBadge } from '../components/GrowthOsBadges';
import {
  createOperationalCashflowEntry,
  reverseOperationalCashflowEntry,
  updateBudgetEnvelopeLimit,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { showToast } from '../../../../components/ui/Toast';
import { FieldLabelWithHelp } from '../components/GrowthOsHelpSystem';

interface FinanceLedgerViewProps {
  selectedCurrency: GrowthOsCurrency;
  onSelectCurrency?: (currency: GrowthOsCurrency) => void;
  onOpenExistingAdminTab?: (tab: 'financial_intelligence' | 'checkout_config') => void;
  onNavigateAdminTab?: (tab: 'financial_intelligence' | 'checkout_config') => void;
}

const CURRENCIES: GrowthOsCurrency[] = ['EUR', 'BRL', 'USD'];

export const FinanceLedgerView: React.FC<FinanceLedgerViewProps> = ({
  selectedCurrency,
  onSelectCurrency,
  onOpenExistingAdminTab,
  onNavigateAdminTab,
}) => {
  const state = useGrowthOsRuntime();
  const [activeCurrency, setActiveCurrency] = useState<GrowthOsCurrency>(selectedCurrency);
  const [regime, setRegime] = useState<AccountingRegime>('cash_basis');
  const [ledgerModel, setLedgerModel] = useState<LedgerModelView>('cashflow_subledger');
  const [showGlossary, setShowGlossary] = useState(true);

  // Edição guiada de Orçamento (Parte 4.8)
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [budgetScopeInput, setBudgetScopeInput] = useState('');
  const [limitInput, setLimitInput] = useState('');
  const [alertPctInput, setAlertPctInput] = useState(80);
  const [hardStopInput, setHardStopInput] = useState(true);
  const [budgetNotesInput, setBudgetNotesInput] = useState('');

  // Formulário Guiado de Novo Lançamento (Parte 4.8)
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [entryDirection, setEntryDirection] = useState<'inflow' | 'outflow'>('inflow');
  const [entryCategory, setEntryCategory] = useState('Produto Digital / Diagnóstico IA');
  const [entryDesc, setEntryDesc] = useState('');
  const [entryAmount, setEntryAmount] = useState('390.00');
  const [entryCurrency, setEntryCurrency] = useState<GrowthOsCurrency>(selectedCurrency);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryStatus, setEntryStatus] = useState<'projected' | 'pending' | 'settled'>('settled');
  const [entryRefDoc, setEntryRefDoc] = useState('FAT-2026-001');
  const [entryCounterparty, setEntryCounterparty] = useState('Cliente B2B UmbuLab');

  const displayCurrency = onSelectCurrency ? selectedCurrency : activeCurrency;

  const handleCurrencyChange = (curr: GrowthOsCurrency) => {
    setActiveCurrency(curr);
    setEntryCurrency(curr);
    onSelectCurrency?.(curr);
  };

  const handleOpenTab = (tab: 'financial_intelligence' | 'checkout_config') => {
    onOpenExistingAdminTab?.(tab);
    onNavigateAdminTab?.(tab);
  };

  const currencyEntries = state.cashflow_entries.filter((entry) => {
    if (entry.currency !== displayCurrency) return false;
    if (regime === 'cash_basis') {
      return entry.cash_date !== null;
    }
    return true;
  });

  const inflowCents = currencyEntries
    .filter((e) => e.direction === 'inflow' && e.settlement_state !== 'reversed')
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const outflowCents = currencyEntries
    .filter((e) => e.direction === 'outflow' && e.settlement_state !== 'reversed')
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const netCents = inflowCents - outflowCents;

  const handleSaveBudget = (budgetId: string) => {
    const cents = Math.max(0, Math.round(parseFloat(limitInput.replace(',', '.')) * 100 || 0));
    updateBudgetEnvelopeLimit(budgetId, cents, hardStopInput, {
      scope_label: budgetScopeInput,
      alert_threshold_pct: alertPctInput,
      notes: budgetNotesInput,
    });
    setEditingBudgetId(null);
    showToast('Orçamento mensal e regras de proteção atualizados com sucesso!', 'success');
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryDesc.trim()) return;
    const cents = Math.max(1, Math.round(parseFloat(entryAmount.replace(',', '.')) * 100 || 100));
    createOperationalCashflowEntry({
      description: entryDesc.trim(),
      direction: entryDirection,
      category: entryCategory.trim(),
      counterparty: entryCounterparty.trim(),
      currency: entryCurrency,
      amount_cents: cents,
      settlement_state: entryStatus,
      entry_date: entryDate,
      reference_doc: entryRefDoc,
    });
    setEntryDesc('');
    setShowNewEntryForm(false);
    showToast('Lançamento registado com sucesso!', 'success');
  };

  const handleReverseEntry = (entryId: string) => {
    const rev = reverseOperationalCashflowEntry(entryId);
    if (rev) {
      showToast(
        `Estorno compensatório (${rev.entry_id}) registado. O histórico original foi preservado para auditoria.`,
        'info'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Atalhos para Módulos Financeiros Existentes */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Wallet size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Gestão Financeira e Controlo de Orçamentos (EUR, BRL, USD)
            </h3>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Proteção Automática de Saldo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
            Acompanhe de forma simples quanto planeou gastar, quanto está guardado para missões em curso e quais os lançamentos confirmados em Euros, Reais e Dólares.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => setShowGlossary((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-umbu-primary/40 bg-umbu-primary/10 text-xs font-extrabold text-umbu-primary dark:text-umbu-neon"
          >
            <HelpCircle size={14} />
            <span>{showGlossary ? 'Ocultar Explicações Financeiras' : 'Ver Explicações dos Termos'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenTab('financial_intelligence')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>Inteligência Financeira Atual</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenTab('checkout_config')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>Configurações de Checkout</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* EXPLICAÇÕES OBRIGATÓRIAS EM LINGUAGEM SIMPLES (PARTE 4.8) */}
      {showGlossary && (
        <section className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 sm:p-5 space-y-3">
          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-950 dark:text-emerald-200">
            Guia Rápido: O que significa cada valor nesta página?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-white dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-white block">1. Orçamento Mensal</strong>
              <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                Valor máximo planeado por si para gastar durante o mês em cada moeda (EUR, BRL ou USD).
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-amber-800 dark:text-amber-300 block">2. Reservado</strong>
              <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                Valor temporariamente guardado para missões em execução ou que aguardam a sua aprovação (se rejeitar a missão, este valor volta ao saldo disponível).
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-white block">3. Consumido (Simulado vs. Confirmado)</strong>
              <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                Valor de missões já aprovadas. O painel separa claramente o que foi <strong>Simulação Contabilística Interna</strong> (0€ cobrados fora) do que foi <strong>Custo Externo Confirmado</strong>.
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-emerald-700 dark:text-emerald-400 block">4. Disponível</strong>
              <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                Valor livre que ainda pode ser utilizado em novas missões (Orçamento Mensal menos Reservado menos Consumido).
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-white block">5. Bloqueio Automático (Hard-Stop)</strong>
              <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                Travão de segurança automático que impede os agentes de iniciarem novas missões se o valor pedido ultrapassar o saldo disponível.
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
              <strong className="text-zinc-900 dark:text-white block">6. Livro-Razão</strong>
              <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                Registo contabilístico detalhado de entradas e saídas. Nenhum registo é apagado: correções são feitas através de um lançamento de estorno.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 1. ORÇAMENTOS MENSAIS E RESERVAS DE MISSÕES */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
        <div>
          <h4 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={17} className="text-umbu-primary dark:text-umbu-secondary" />
            Orçamentos Mensais por Moeda (EUR / BRL / USD)
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Fórmula simples: <strong>Disponível = Orçamento Mensal − Reservado − Consumido</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {state.budgets.map((b) => {
            const availableCents = Math.max(0, b.limit_cents - b.reserved_cents - b.settled_cents);
            const confirmedExternal = b.confirmed_external_cents || 0;
            const simulatedInternal = Math.max(0, b.settled_cents - confirmedExternal);
            const usedPct =
              b.limit_cents > 0
                ? Math.min(100, Math.round(((b.reserved_cents + b.settled_cents) / b.limit_cents) * 100))
                : 0;
            const isEditing = editingBudgetId === b.budget_id;

            return (
              <div
                key={b.budget_id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-zinc-500">{b.code}</span>
                      <h5 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                        {b.scope_label}
                      </h5>
                    </div>
                    <CurrencyCodeBadge currency={b.currency} />
                  </div>

                  {b.notes && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{b.notes}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-200/70 dark:border-zinc-800">
                      <span className="block text-[10px] font-bold uppercase text-zinc-500">
                        Orçamento Mensal
                      </span>
                      <span className="font-mono font-extrabold text-zinc-900 dark:text-white">
                        {formatDemoMoneyCents(b.limit_cents, b.currency)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 border border-emerald-200/70 dark:border-emerald-900/50">
                      <span className="block text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                        Disponível Agora
                      </span>
                      <span className="font-mono font-extrabold text-emerald-800 dark:text-emerald-300">
                        {formatDemoMoneyCents(availableCents, b.currency)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 p-2.5 border border-amber-200/70 dark:border-amber-900/50">
                      <span className="block text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                        Reservado (Em curso)
                      </span>
                      <span className="font-mono font-extrabold text-amber-800 dark:text-amber-300">
                        {formatDemoMoneyCents(b.reserved_cents, b.currency)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-200/70 dark:border-zinc-800">
                      <span className="block text-[10px] font-bold uppercase text-zinc-500">
                        Consumido Total
                      </span>
                      <span className="font-mono font-extrabold text-zinc-900 dark:text-white">
                        {formatDemoMoneyCents(b.settled_cents, b.currency)}
                      </span>
                      <span className="block text-[10px] text-zinc-500 mt-0.5">
                        Real: {formatDemoMoneyCents(confirmedExternal, b.currency)} • Simulado:{' '}
                        {formatDemoMoneyCents(simulatedInternal, b.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Utilização */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span>Utilização: {usedPct}% (Alerta aos {b.alert_threshold_pct}%)</span>
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                        <Lock size={11} />
                        {b.hard_stop ? 'Bloqueio Automático Ativo' : 'Apenas Aviso'}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          usedPct >= b.alert_threshold_pct ? 'bg-amber-500' : 'bg-umbu-primary'
                        }`}
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Formulário Guiado para Ajustar Orçamento (Parte 4.8) */}
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBudgetId(b.budget_id);
                        setBudgetScopeInput(b.scope_label);
                        setLimitInput((b.limit_cents / 100).toFixed(2));
                        setAlertPctInput(b.alert_threshold_pct);
                        setHardStopInput(b.hard_stop);
                        setBudgetNotesInput(b.notes || '');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-umbu-primary dark:text-umbu-secondary hover:underline"
                    >
                      <Sliders size={13} />
                      Ajustar Orçamento ({b.currency})
                    </button>
                  ) : (
                    <div className="space-y-3 pt-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
                      <div>
                        <FieldLabelWithHelp
                          label="Nome do Orçamento"
                          help={{
                            meaning: 'Nome descritivo deste envelope de orçamento.',
                            purpose: 'Identificar facilmente a que área pertence.',
                            howToFill: 'Escreva um título claro.',
                            example: 'Orçamento de Operações Portugal (EUR)',
                            required: true,
                            effect: 'Atualiza o título do cartão.',
                            costOrExternalImpact: 'Sem custo.',
                          }}
                        />
                        <input
                          type="text"
                          value={budgetScopeInput}
                          onChange={(e) => setBudgetScopeInput(e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold mb-1">
                            Limite Mensal ({b.currency})
                          </label>
                          <input
                            type="number"
                            step="10"
                            min="0"
                            value={limitInput}
                            onChange={(e) => setLimitInput(e.target.value)}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 font-mono text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold mb-1">
                            Alerta Percentual (%)
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={alertPctInput}
                            onChange={(e) => setAlertPctInput(Number(e.target.value) || 80)}
                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 font-mono text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold mb-1">Observações</label>
                        <input
                          type="text"
                          value={budgetNotesInput}
                          onChange={(e) => setBudgetNotesInput(e.target.value)}
                          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hardStopInput}
                          onChange={(e) => setHardStopInput(e.target.checked)}
                        />
                        Ativar Bloqueio Automático (Hard-Stop) ao atingir o limite
                      </label>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingBudgetId(null)}
                          className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-bold"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveBudget(b.budget_id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white"
                        >
                          <Save size={12} />
                          Guardar Orçamento
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. MOVIMENTOS FINANCEIROS E FORMULÁRIO GUIADO DE NOVO LANÇAMENTO */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Ver Moeda:</span>
            {CURRENCIES.map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => handleCurrencyChange(curr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                  displayCurrency === curr
                    ? 'bg-umbu-primary text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {curr}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setRegime(regime === 'cash_basis' ? 'accrual_basis' : 'cash_basis')
              }
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold"
            >
              Vista: {regime === 'cash_basis' ? 'Apenas Confirmados (Caixa)' : 'Todos os Planeados e Confirmados'}
            </button>

            <button
              type="button"
              onClick={() =>
                setLedgerModel(
                  ledgerModel === 'cashflow_subledger'
                    ? 'double_entry_preview'
                    : 'cashflow_subledger'
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold"
            >
              <BookOpen size={13} />
              <span>
                {ledgerModel === 'cashflow_subledger'
                  ? 'Abrir Livro-Razão Contabilístico'
                  : 'Voltar à Lista Simples de Movimentos'}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowNewEntryForm(!showNewEntryForm)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-4 py-2 text-xs font-extrabold text-white shadow-sm"
          >
            <PlusCircle size={14} />
            <span>{showNewEntryForm ? 'Fechar Formulário' : 'Novo Lançamento Financeiro'}</span>
          </button>
        </div>

        {/* FORMULÁRIO GUIADO DE NOVO LANÇAMENTO (8 CAMPOS CLAROS — PARTE 4.8) */}
        {showNewEntryForm && (
          <form
            onSubmit={handleCreateEntry}
            className="rounded-2xl border-2 border-umbu-primary/30 bg-white dark:bg-zinc-950 p-4 sm:p-5 space-y-4"
          >
            <h5 className="text-sm font-extrabold text-zinc-900 dark:text-white">
              Registar Novo Lançamento Financeiro
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <FieldLabelWithHelp
                  label="1. Entrada ou Saída"
                  help={{
                    meaning: 'Indica se o dinheiro entrou (receita) ou saiu (despesa).',
                    purpose: 'Calcular corretamente o saldo líquido.',
                    howToFill: 'Escolha Entrada ou Saída.',
                    example: 'Entrada (Receita de Cliente)',
                    required: true,
                    effect: 'Soma ou subtrai no resumo da moeda.',
                    costOrExternalImpact: 'Registo interno no livro financeiro.',
                  }}
                />
                <select
                  value={entryDirection}
                  onChange={(e) => setEntryDirection(e.target.value as 'inflow' | 'outflow')}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-bold"
                >
                  <option value="inflow">Entrada (Receita / Venda)</option>
                  <option value="outflow">Saída (Despesa / Custo Operacional)</option>
                </select>
              </div>

              <div>
                <FieldLabelWithHelp
                  label="2. Categoria"
                  help={{
                    meaning: 'Classificação do lançamento.',
                    purpose: 'Organizar receitas de projetos, produtos digitais ou despesas de ferramentas.',
                    howToFill: 'Escolha ou edite a categoria.',
                    example: 'Produto Digital / Diagnóstico IA',
                    required: true,
                    effect: 'Identifica o tipo de movimento.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="text"
                  required
                  value={entryCategory}
                  onChange={(e) => setEntryCategory(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="3. Valor"
                  help={{
                    meaning: 'Montante do lançamento.',
                    purpose: 'Registar o valor exato na moeda escolhida.',
                    howToFill: 'Digite o valor (ex.: 390.00).',
                    example: '390.00',
                    required: true,
                    effect: 'Registado em cêntimos sem erros de arredondamento.',
                    costOrExternalImpact: 'Sem cobrança externa.',
                  }}
                />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 font-mono text-xs font-bold"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="4. Moeda"
                  help={{
                    meaning: 'Moeda nativa do movimento.',
                    purpose: 'Separar contas em EUR, BRL e USD.',
                    howToFill: 'Escolha EUR, BRL ou USD.',
                    example: 'EUR',
                    required: true,
                    effect: 'Adiciona ao livro da moeda escolhida.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <select
                  value={entryCurrency}
                  onChange={(e) => setEntryCurrency(e.target.value as GrowthOsCurrency)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-bold"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <FieldLabelWithHelp
                  label="5. Descrição Clara"
                  help={{
                    meaning: 'Explicação do motivo deste lançamento.',
                    purpose: 'Saber exatamente a que cliente, missão ou fornecedor se refere.',
                    howToFill: 'Escreva uma frase clara.',
                    example: 'Venda de Diagnóstico Digital B2B — Cliente Porto',
                    required: true,
                    effect: 'Mostrada como título do movimento.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="text"
                  required
                  value={entryDesc}
                  onChange={(e) => setEntryDesc(e.target.value)}
                  placeholder="Ex.: Receita Diagnóstico Web IA — Cliente PT"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="6. Data"
                  help={{
                    meaning: 'Data do movimento financeiro.',
                    purpose: 'Organizar o histórico mensal.',
                    howToFill: 'Selecione a data.',
                    example: '2026-11-10',
                    required: true,
                    effect: 'Define a data de competência/caixa.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <FieldLabelWithHelp
                  label="7. Estado"
                  help={{
                    meaning: 'Indica se o valor já foi efetivamente pago/recebido ou se é apenas planeado.',
                    purpose: 'Distinguir previsões de dinheiro real em caixa.',
                    howToFill: 'Escolha Confirmado, Pendente ou Planeado.',
                    example: 'Confirmado (Liquidado)',
                    required: true,
                    effect: 'Filtra na vista de Caixa vs. Competência.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <select
                  value={entryStatus}
                  onChange={(e) =>
                    setEntryStatus(e.target.value as 'projected' | 'pending' | 'settled')
                  }
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-bold"
                >
                  <option value="settled">Confirmado (Liquidado)</option>
                  <option value="pending">Pendente de Pagamento</option>
                  <option value="projected">Planeado (Previsão)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabelWithHelp
                  label="8. Referência / Número de Documento"
                  help={{
                    meaning: 'Número da fatura, recibo ou código da missão.',
                    purpose: 'Facilitar a conferência com a contabilidade.',
                    howToFill: 'Opcional; indique o código do documento.',
                    example: 'FAT-2026-001',
                    required: false,
                    effect: 'Guardado na ficha do lançamento.',
                    costOrExternalImpact: 'Sem custo.',
                  }}
                />
                <input
                  type="text"
                  value={entryRefDoc}
                  onChange={(e) => setEntryRefDoc(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-1">
                  Entidade (Cliente ou Fornecedor)
                </label>
                <input
                  type="text"
                  value={entryCounterparty}
                  onChange={(e) => setEntryCounterparty(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowNewEntryForm(false)}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-extrabold text-white hover:bg-emerald-700"
              >
                Guardar Lançamento
              </button>
            </div>
          </form>
        )}

        {/* Resumo da Moeda Selecionada */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5">
            <span className="text-xs font-bold text-zinc-500">Total de Entradas ({displayCurrency})</span>
            <p className="mt-1 font-mono text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
              {formatDemoMoneyCents(inflowCents, displayCurrency)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5">
            <span className="text-xs font-bold text-zinc-500">Total de Saídas ({displayCurrency})</span>
            <p className="mt-1 font-mono text-lg font-extrabold text-amber-700 dark:text-amber-400">
              {formatDemoMoneyCents(outflowCents, displayCurrency)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5">
            <span className="text-xs font-bold text-zinc-500">Resultado Líquido ({displayCurrency})</span>
            <p className="mt-1 font-mono text-lg font-extrabold text-zinc-900 dark:text-white">
              {formatDemoMoneyCents(netCents, displayCurrency)}
            </p>
          </div>
        </div>

        {/* Lista de Lançamentos ou Livro-Razão */}
        {ledgerModel === 'cashflow_subledger' ? (
          <div className="space-y-2.5">
            {currencyEntries.map((entry) => (
              <div
                key={entry.entry_id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-zinc-500">{entry.entry_id}</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">
                      {entry.description}
                    </span>
                    {entry.is_demo_data ? (
                      <DemoDataBadge />
                    ) : entry.is_simulated_settlement ? (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                        Simulação Contabilística Interna
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Lançamento Registado
                      </span>
                    )}
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400">
                    Categoria: {entry.category} • Data: {entry.competence_date}
                    {entry.reference_doc ? ` • Doc: ${entry.reference_doc}` : ''} • Estado:{' '}
                    <strong>
                      {entry.settlement_state === 'settled'
                        ? 'Confirmado'
                        : entry.settlement_state === 'reversed'
                          ? 'Estornado'
                          : entry.settlement_state === 'pending'
                            ? 'Pendente'
                            : 'Planeado'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-sm font-extrabold ${
                      entry.direction === 'inflow'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {entry.direction === 'inflow' ? '+' : '-'}
                    {formatDemoMoneyCents(entry.amount_cents, entry.currency)}
                  </span>

                  {entry.settlement_state !== 'reversed' && !entry.reversed_from_id && (
                    <button
                      type="button"
                      onClick={() => handleReverseEntry(entry.entry_id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Anular efeito deste lançamento criando um movimento de estorno"
                    >
                      <RotateCcw size={12} />
                      Estornar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {state.journal_entries.map((je) => (
              <div
                key={je.journal_entry_id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <span>
                    {je.journal_entry_id} — {je.description} ({je.entry_date})
                  </span>
                  <CurrencyCodeBadge currency={je.currency} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {je.lines.map((line) => (
                    <div
                      key={line.line_id}
                      className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-2.5 flex items-center justify-between"
                    >
                      <span>
                        <code>{line.account_code}</code> {line.account_name}
                      </span>
                      <span className="font-mono font-bold">
                        {line.debit_cents > 0
                          ? `Débito: ${formatDemoMoneyCents(line.debit_cents, je.currency)}`
                          : `Crédito: ${formatDemoMoneyCents(line.credit_cents, je.currency)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FinanceLedgerView;
