import React, { useState } from 'react';
import { Wallet, ArrowUpRight, Lock, BookOpen, ShieldCheck } from 'lucide-react';
import {
  AccountingRegime,
  GrowthOsCurrency,
  LedgerModelView,
} from '../../../../types/growthOs';
import {
  DEMO_BUDGET_ENVELOPES,
  DEMO_CASHFLOW_ENTRIES,
  DEMO_DOUBLE_ENTRY_JOURNALS,
  formatDemoMoneyCents,
} from '../mockPreviewData';
import {
  CurrencyCodeBadge,
  DemoDataBadge,
} from '../components/GrowthOsBadges';

interface FinanceLedgerViewProps {
  selectedCurrency: GrowthOsCurrency;
  onSelectCurrency: (currency: GrowthOsCurrency) => void;
  onOpenExistingAdminTab: (tab: 'financial_intelligence' | 'checkout_config') => void;
}

const CURRENCIES: GrowthOsCurrency[] = ['EUR', 'BRL', 'USD'];

export const FinanceLedgerView: React.FC<FinanceLedgerViewProps> = ({
  selectedCurrency,
  onSelectCurrency,
  onOpenExistingAdminTab,
}) => {
  const [regime, setRegime] = useState<AccountingRegime>('cash_basis');
  const [ledgerModel, setLedgerModel] = useState<LedgerModelView>('cashflow_subledger');

  const currencyEntries = DEMO_CASHFLOW_ENTRIES.filter((entry) => {
    if (entry.currency !== selectedCurrency) return false;
    if (regime === 'cash_basis') {
      return entry.cash_date !== null;
    }
    return true;
  });

  const demoInflowCents = currencyEntries
    .filter((e) => e.direction === 'inflow')
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const demoOutflowCents = currencyEntries
    .filter((e) => e.direction === 'outflow')
    .reduce((acc, e) => acc + e.amount_cents, 0);

  const demoNetCents = demoInflowCents - demoOutflowCents;

  return (
    <div className="space-y-6">
      {/* Ponte de Coexistência com os Módulos Financeiros Atuais */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Wallet size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Coexistência Não Duplicada da Gestão Financeira
            </h3>
            <DemoDataBadge label="Interface Criada de Raiz (Demo)" />
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Os módulos atuais <strong>Controladoria Analítica</strong> e <strong>Pagamentos</strong> permanecem 100% preservados. Esta vista apresenta o desenho do futuro núcleo financeiro multi-moeda (<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">EUR</code>, <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">BRL</code>, <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">USD</code>), sem criar tabelas nem processar pagamentos nesta fase.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenExistingAdminTab('financial_intelligence')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-umbu-primary transition-colors"
          >
            Controladoria Analítica
            <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onOpenExistingAdminTab('checkout_config')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-umbu-primary transition-colors"
          >
            Configuração de Pagamentos
            <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Controlos de Moeda, Regime e Modelo Contabilístico */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div>
          <span className="block text-xs font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
            1. Moeda Isolada (Sem Soma Implícita)
          </span>
          <div className="inline-flex rounded-xl p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full">
            {CURRENCIES.map((curr) => (
              <button
                key={curr}
                type="button"
                aria-pressed={selectedCurrency === curr}
                onClick={() => onSelectCurrency(curr)}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-extrabold transition-colors ${
                  selectedCurrency === curr
                    ? 'bg-umbu-primary text-white shadow-sm'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-xs font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
            2. Regime de Apuramento
          </span>
          <div className="inline-flex rounded-xl p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full">
            <button
              type="button"
              aria-pressed={regime === 'cash_basis'}
              onClick={() => setRegime('cash_basis')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                regime === 'cash_basis'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-700'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Regime de Caixa
            </button>
            <button
              type="button"
              aria-pressed={regime === 'accrual_basis'}
              onClick={() => setRegime('accrual_basis')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                regime === 'accrual_basis'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-700'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Competência
            </button>
          </div>
        </div>

        <div>
          <span className="block text-xs font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
            3. Vista Estrutural
          </span>
          <div className="inline-flex rounded-xl p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full">
            <button
              type="button"
              aria-pressed={ledgerModel === 'cashflow_subledger'}
              onClick={() => setLedgerModel('cashflow_subledger')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                ledgerModel === 'cashflow_subledger'
                  ? 'bg-umbu-primary text-white'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Fluxo de Caixa
            </button>
            <button
              type="button"
              aria-pressed={ledgerModel === 'double_entry_preview'}
              onClick={() => setLedgerModel('double_entry_preview')}
              className={`flex-1 py-2 px-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                ledgerModel === 'double_entry_preview'
                  ? 'bg-umbu-primary text-white'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Partidas Dobradas
            </button>
          </div>
        </div>
      </div>

      {/* Resumo Fictício na Moeda Selecionada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Entradas Fictícias ({selectedCurrency})
            </span>
            <CurrencyCodeBadge currency={selectedCurrency} />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatDemoMoneyCents(demoInflowCents, selectedCurrency)}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed">
            Exemplo demonstrativo ({regime === 'cash_basis' ? 'apenas liquidados em caixa' : 'inclui competência não liquidada'}).
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Saídas Fictícias ({selectedCurrency})
            </span>
            <CurrencyCodeBadge currency={selectedCurrency} />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-red-700 dark:text-red-400">
            {formatDemoMoneyCents(demoOutflowCents, selectedCurrency)}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed">
            Exemplo demonstrativo na moeda nativa {selectedCurrency}.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Saldo Líquido Demo ({selectedCurrency})
            </span>
            <DemoDataBadge label="Fictício" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
            {formatDemoMoneyCents(demoNetCents, selectedCurrency)}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed">
            Nunca soma EUR, BRL e USD sem taxa cambial explícita.
          </p>
        </div>
      </div>

      {/* Subledger vs Partidas Dobradas */}
      {ledgerModel === 'cashflow_subledger' ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
                Subledger Operacional de Fluxo de Caixa ({selectedCurrency})
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                Separação explícita entre <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">competence_date</code> e <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs">cash_date</code>.
              </p>
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 cursor-not-allowed self-start shrink-0"
            >
              <Lock size={13} className="shrink-0" aria-hidden="true" />
              Novo Lançamento (Indisponível na Fase 1B)
            </button>
          </div>

          {currencyEntries.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 py-6 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              Sem registos fictícios em {selectedCurrency} para o filtro de regime selecionado. Alterne para Competência ou outra moeda para inspecionar os exemplos.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 pr-4 font-bold">Descrição Fictícia</th>
                    <th className="py-3 px-4 font-bold">Competência</th>
                    <th className="py-3 px-4 font-bold">Data Caixa</th>
                    <th className="py-3 px-4 font-bold">Estado</th>
                    <th className="py-3 pl-4 font-bold text-right">Montante</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {currencyEntries.map((entry) => (
                    <tr key={entry.entry_id}>
                      <td className="py-3.5 pr-4">
                        <p className="font-bold text-zinc-900 dark:text-white">{entry.description}</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{entry.immutable_rule_note}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                        {entry.competence_date}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                        {entry.cash_date ?? 'Pendente (null)'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {entry.settlement_state === 'settled_demo' ? 'Liquidado (Demo)' : 'Planeado (Demo)'}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 pl-4 font-extrabold text-right whitespace-nowrap ${
                          entry.direction === 'inflow'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-700 dark:text-red-400'
                        }`}
                      >
                        {entry.direction === 'inflow' ? '+' : '-'}
                        {formatDemoMoneyCents(entry.amount_cents, entry.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <BookOpen size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              Pré-Visualização de Diário em Partidas Dobradas (Débito = Crédito)
            </h4>
            <DemoDataBadge label="Modelo Contabilístico Fictício" />
          </div>

          <div className="space-y-4">
            {DEMO_DOUBLE_ENTRY_JOURNALS.map((journal) => {
              const totalDebit = journal.lines.reduce((s, l) => s + l.debit_cents, 0);
              const totalCredit = journal.lines.reduce((s, l) => s + l.credit_cents, 0);

              return (
                <div
                  key={journal.journal_entry_id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                        {journal.description}
                      </p>
                      <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-0.5">
                        Data: {journal.entry_date} • ID: {journal.journal_entry_id}
                      </p>
                    </div>
                    <CurrencyCodeBadge currency={journal.currency} />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm text-left">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                          <th className="py-2.5 pr-3">Conta</th>
                          <th className="py-2.5 px-3 text-right">Débito</th>
                          <th className="py-2.5 pl-3 text-right">Crédito</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800">
                        {journal.lines.map((line) => (
                          <tr key={line.line_id}>
                            <td className="py-2.5 pr-3 font-medium text-zinc-800 dark:text-zinc-200">
                              <code className="mr-2 text-xs text-umbu-primary dark:text-umbu-secondary font-mono">
                                {line.account_code}
                              </code>
                              {line.account_name}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                              {line.debit_cents > 0 ? formatDemoMoneyCents(line.debit_cents, journal.currency) : '—'}
                            </td>
                            <td className="py-2.5 pl-3 text-right font-mono text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                              {line.credit_cents > 0 ? formatDemoMoneyCents(line.credit_cents, journal.currency) : '—'}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-extrabold text-zinc-900 dark:text-white bg-zinc-100/80 dark:bg-zinc-800/60">
                          <td className="py-2.5 px-2">Equilíbrio Validado (Débito = Crédito)</td>
                          <td className="py-2.5 px-3 text-right font-mono whitespace-nowrap">
                            {formatDemoMoneyCents(totalDebit, journal.currency)}
                          </td>
                          <td className="py-2.5 pl-3 pr-2 text-right font-mono whitespace-nowrap">
                            {formatDemoMoneyCents(totalCredit, journal.currency)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Envelopes de Orçamento & FinOps IA */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
            Envelopes de Orçamento & Reservas Concorrentes (Simulação)
          </h4>
          <DemoDataBadge />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {DEMO_BUDGET_ENVELOPES.map((env) => {
            const available = env.limit_cents - env.reserved_cents - env.settled_cents;
            const usedPct = Math.min(
              100,
              Math.round(((env.reserved_cents + env.settled_cents) / env.limit_cents) * 100)
            );

            return (
              <div
                key={env.budget_id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CurrencyCodeBadge currency={env.currency} />
                  <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    hard_stop: {String(env.hard_stop)}
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                  {env.scope_label}
                </p>

                <div
                  role="progressbar"
                  aria-valuenow={usedPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Utilização simulada ${env.scope_label}`}
                  className="w-full h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
                >
                  <div
                    style={{ width: `${usedPct}%` }}
                    className="h-full bg-umbu-primary dark:bg-umbu-secondary"
                  />
                </div>

                <dl className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Teto (Demo):</dt>
                    <dd className="font-bold text-zinc-900 dark:text-white mt-0.5">
                      {formatDemoMoneyCents(env.limit_cents, env.currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Disponível:</dt>
                    <dd className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {formatDemoMoneyCents(available, env.currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Reservado:</dt>
                    <dd className="font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                      {formatDemoMoneyCents(env.reserved_cents, env.currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">Liquidado:</dt>
                    <dd className="font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                      {formatDemoMoneyCents(env.settled_cents, env.currency)}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinanceLedgerView;

