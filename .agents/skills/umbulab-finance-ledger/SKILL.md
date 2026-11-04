---
name: umbulab-finance-ledger
description: >-
  Rege a arquitetura do módulo financeiro criado de raiz do UmbuLab AI Growth OS,
  incluindo suporte multi-moeda (EUR, BRL, USD), separação entre fluxo de caixa
  e contabilidade de partidas dobradas, reservas atómicas de orçamento e FinOps.
  Usar ao modelar tabelas financeiras, cálculos comerciais ou vistas financeiras.
---

# UmbuLab Financial Architecture & Multi-Currency Ledger Guide

Esta *Dev-Time Skill* define as regras de engenharia financeira para construir o módulo financeiro da UmbuLab **do zero**, sem depender dos dados estáticos (*mocks*) presentes no componente legado `src/pages/admin/FinancialIntelligence.tsx`.

## 1. Distinção Obrigatória: Fluxo de Caixa vs. Partidas Dobradas

Nunca confundir nem rotular incorretamente os modelos contabilísticos no código, na base de dados ou na UI:

1. **Gestão de Fluxo de Caixa e Controladoria Operacional (*Cash Flow & Operational Subledger*):**
   - Regista entradas (`inflow`) e saídas (`outflow`) operacionais numa conta/carteira real, distinguindo explicitamente:
     - `competence_date` (data de competência / facto gerador económico);
     - `cash_date` (data efetiva de liquidação/caixa — `NULL` enquanto `'planned'` ou `'pending'`).
   - Alimenta previsibilidade de caixa, *burn rate*, contas a pagar/receber e rentabilidade por projeto/campanha/afiliado.
2. **Contabilidade de Partidas Dobradas (*Double-Entry General Ledger*):**
   - Só pode ser designada como *partidas dobradas* se implementada através de cabeçalhos de diário (`fin_journal_entries`) + linhas de lançamento (`fin_journal_lines` / *postings*) com contas de ativo, passivo, capital próprio, réditos e gastos, onde para cada `journal_entry_id` e `currency`:
     - Pelo menos 2 linhas;
     - $\sum \text{debit\_cents} = \sum \text{credit\_cents}$ garantido por validação transacional (`DEFERRABLE INITIALLY DEFERRED` constraint trigger ou RPC exclusiva de escrita).
3. **Regra de Evolução Incremental:**
   - Se uma fase implementar primeiro o *Subledger Operacional de Fluxo de Caixa/Competência*, nomear as tabelas e vistas honestamente (ex.: `fin_cashflow_entries`) ou estruturar desde logo `fin_journal_entries` + `fin_journal_lines` com geração assistida das contrapartidas para o utilizador.
   - Em ambos os modelos, lançamentos liquidados (`settled` / `posted`) são **imutáveis**: correções exigem registo explícito de estorno (`reversal_of_id`) preservando o rasto de auditoria.

## 2. Suporte Nativo Tri-Moeda (`EUR`, `BRL`, `USD`)

A operação da UmbuLab fatura em **EUR** (Portugal/UE) e **BRL** (Brasil), enquanto fornecedores de IA, cloud, ferramentas SaaS e redes globais tarifam frequentemente em **USD**.

1. **Representação Monetária Exata:**
   - Guardar todos os montantes em unidades mínimas inteiras (`BIGINT` — cêntimos/centavos; ou `micros` `10^-6` exclusivamente na telemetria granular de tokens LLM, convertendo de forma determinística e documentada ao consolidar).
   - Código ISO obrigatório em cada registo: `'EUR' | 'BRL' | 'USD'`.
2. **Câmbio Explícito e Auditável (Sem Conversão Implícita):**
   - Nunca somar diretamente `amount_cents` de moedas distintas em queries SQL ou gráficos React.
   - Ao consolidar relatórios numa moeda de apresentação selecionada pelo admin (`EUR`, `BRL` ou `USD`), usar:
     - A taxa histórica gravada no momento da liquidação (`fx_rate`, `fx_base_currency`, `fx_quote_currency`, `fx_source`, `fx_at`) para valores realizados;
     - Uma taxa de referência datada e visível na UI para valores projetados/planeados, sinalizando claramente a taxa aplicada.

## 3. Orçamentos, Reservas Concorrentes e FinOps de IA

1. **Reservas Atómicas sob Concorrência:**
   - Todo o consumo de orçamento (seja teto de APIs de IA ou verba aprovada para campanha) deve usar bloqueio transacional em PostgreSQL (`SELECT ... FOR UPDATE`), mantendo três contadores coerentes por período/escopo:
     - `limit_cents` (teto aprovado pelo humano);
     - `reserved_cents` (operações em voo ainda não liquidadas);
     - `settled_cents` (custo efetivamente incorrido).
   - Saldo disponível real = `limit_cents - reserved_cents - settled_cents`.
2. **Telemetria Real vs. Hipóteses de Custo:**
   - **Proibido** codificar pressupostos fixos não medidos (como assumir que a infraestrutura custará sempre `< 5 €/mês`).
   - Manter tabela/configuração versionada de preços por modelo e serviço (`USD` por 1M input/output tokens e por chamada de *grounding*/pesquisa) e calcular métricas reais de custo acumulado, custo médio por missão e ROI líquido (`receita atribuída liquidada - custos diretos - ad spend - custo IA`).
3. **Aprovação Humana Financeira:**
   - Alterações de tetos de orçamento (`fin_budgets`), liquidação de despesas, aprovação de verbas de tráfego e estornos exigem sempre ação autenticada de um administrador humano.

## 4. Checklist de Validação Financeira

1. Confirmar ausência total de aritmética `number` de vírgula flutuante para somas de saldos sem arredondamento inteiro controlado em cêntimos.
2. Testar cenários de chamadas concorrentes ao mesmo orçamento garantindo que `reserved_cents + settled_cents` nunca ultrapassa `limit_cents` quando `hard_stop = true`.
3. Verificar que todo o relatório indica explicitamente a moeda (`EUR`, `BRL` ou `USD`) e o regime (`Caixa` vs. `Competência`).

