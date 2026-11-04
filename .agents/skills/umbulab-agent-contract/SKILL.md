---
name: umbulab-agent-contract
description: >-
  Define e valida contratos tipados, máquinas de estado, modos de execução,
  telemetria de custos e gates de aprovação para agentes e Runtime Skills do
  UmbuLab AI Growth OS. Usar sempre que criar, alterar ou rever especificações
  de agentes, orquestração ou schemas JSON em api/_growth_os/ e src/types/growthOs.ts.
---

# UmbuLab Agent & Runtime Skill Contract

Esta *Dev-Time Skill* orienta o Antigravity na construção padronizada da equipa multiagente em produção (`api/_growth_os/`), distinguindo estritamente *Dev-Time Skills* (`.agents/skills/umbulab-*`) de *Runtime Skills* executadas pelos agentes da aplicação.

## 1. Convenções Obrigatórias de Nomenclatura e Tipagem

1. **Identificadores canónicos (`snake_case`):**
   - `agent_key`: `ops_director`, `market_intel`, `commercial_analyst`, `marketing_seo`, `creative_director`, `traffic_manager`, `affiliate_ecom`, `b2b_prospector`, `finance_analyst`, `quality_auditor`.
   - `skill_key`: `<dominio>.<acao_verbo_substantivo>` em minúsculas (ex.: `commerce.unit_economics`, `audit.compliance_check`).
   - Todos os campos JSON e SQL devem usar **exclusivamente `snake_case` em minúsculas** (ex.: `budget_allowance_cents`, `max_reserved_cents`, `execution_mode`). Nunca misturar `camelCase` ou maiúsculas internas.
2. **Validação em Tempo de Execução (*Runtime Validation*):**
   - Nunca fazer `JSON.parse(raw) as MyType` sem validação estrutural em *runtime*.
   - Validar obrigatoriamente:
     - Entrada da tarefa (`AgentTaskInput`);
     - Resposta bruta do LLM antes de gravar `output_json`;
     - Vereditos do `quality_auditor` e do `finance_analyst`.
   - Se a validação falhar, registar erro estruturado (`SCHEMA_VALIDATION_ERROR`) em `ai_task_runs` e marcar a tentativa como falha sem corromper o estado da missão.

## 2. Envelope Canónico de Entrada e Saída

### Entrada (`AgentTaskInput` — `schema_version: "1.0"`)
Campos obrigatórios:
- `schema_version`: `"1.0"`
- `mission_id` (UUID), `task_id` (UUID), `idempotency_key` (string determinística única)
- `execution_mode`: `'browser_assisted' | 'server_async'` *(nunca classificar `browser_assisted` como autónomo)*
- `agent_key`, `skill_key`
- `locale`: `'pt-PT' | 'pt-BR'`
- `market`: `'PT' | 'BR' | 'GLOBAL'`
- `currency`: `'EUR' | 'BRL' | 'USD'`
- `budget_allowance_cents`: inteiro `>= 0` (na moeda do orçamento de IA reservado)
- `upstream_refs`: array de UUIDs das tarefas precedentes (passar apenas resumos estruturados enxutos, nunca históricos brutos completos)
- `payload`: objeto tipado específico da *Runtime Skill*

### Saída (`AgentTaskOutput` — `schema_version: "1.0"`)
Campos obrigatórios:
- `schema_version`: `"1.0"`
- `task_id` (UUID), `agent_key`, `skill_key`
- `next_status`: `'awaiting_audit' | 'awaiting_approval' | 'completed' | 'failed_retryable' | 'dead_letter'`
- `risk_level`: `'L0' | 'L1' | 'L2'`
- `requires_human_approval`: boolean (`true` obrigatório sempre que `risk_level` for `'L1'` ou `'L2'`)
- `confidence_score`: número em `[0, 1]`
- `summary_pt`: síntese clara em português distinguindo factos verificados de estimativas/hipóteses
- `structured_data`: resultado validado contra o schema da *skill*
- `evidence`: lista de fontes verificáveis (`url`, `calculation`, `db_record`, `assumption`)
- `usage`:
  - `provider`: `'google_gemini' | 'deterministic'`
  - `model`: string exata retornada pela API
  - `prompt_tokens`, `completion_tokens`, `grounding_requests`: inteiros `>= 0`
  - `raw_cost_usd_micros`: inteiro `>= 0`
  - `cost_source`: `'measured' | 'estimated'` *(nunca assumir custo fixo mensal sem medição)*

## 3. Ciclo de Execução Segura de Cada Passo

Ao implementar qualquer *handler* no orquestrador, cumprir esta sequência exata:

1. **Idempotência e Lease Lock:** Adquirir lock atómico da `ai_tasks` (`locked_until`, `attempt_count`) validando `idempotency_key`.
2. **Reserva Atómica de Orçamento:** Chamar RPC transacional para reservar o teto estimado antes de invocar qualquer API paga. Se recusado, transitar para `paused_budget`.
3. **Execução Isolada (< 15s):** Executar a *Runtime Skill* com `AbortSignal.timeout`.
4. **Validação Runtime + Liquidação:** Validar o JSON devolvido e liquidar (`settle`) a reserva financeira pelo custo medido (ou libertar `release` se falhou antes de consumir).
5. **Gates Obrigatórios:**
   - `L1` (rascunhos internos): exigir passagem pelo `quality_auditor` e retenção em `awaiting_approval`.
   - `L2` (ações externas, anúncios, afiliados públicos, B2B ou finanças): exigir vereditos positivos de `quality_auditor` **e** `finance_analyst`, seguidos de aprovação humana explícita em `ai_approvals`.

## 4. Passos de Verificação (Checklist antes de concluir código)

1. Confirmar que nenhum campo nos contratos JSON viola `snake_case`.
2. Confirmar que entradas e saídas passam por validador em *runtime* com testes de payload inválido.
3. Executar `npm run typecheck` e `npm run build` confirmando zero erros de tipos ou de bundle.

