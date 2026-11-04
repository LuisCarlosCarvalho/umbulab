---
trigger: model_decision
description: "Aplicar sempre ao ler, criar, rever ou editar ficheiros em api/**/*.ts, supabase/**/*.sql, supabase/functions/**/*.ts ou src/types/growthOs.ts. Define regras de arquitetura backend, limite efetivo de funções Vercel, autenticação dual (Admin vs Worker QStash com anti-replay), reservas atómicas de orçamento sob concorrência, telemetria de custos e contratos tipados do UmbuLab AI Growth OS."
---

# Regras de Backend & Segurança — UmbuLab AI Growth OS

Estas regras aplicam-se sempre que o Antigravity criar, rever ou alterar código de backend (`api/`, `supabase/`) ou contratos partilhados (`src/types/growthOs.ts`).

## 1. Limite Efetivo de Funções Vercel (Baseado em Evidência)

- **Não depender de estimativas:** Antes de adicionar qualquer ficheiro em `api/` fora de diretórios prefixados com `_`, verificar o inventário exato de funções existentes, a configuração em `vercel.json` e o resultado real do build/deploy.
- **Consolidação obrigatória:** Módulos internos, agentes, *skills* de produção, *schemas* e utilitários devem residir em diretórios privados com prefixo `_` (ex.: `api/_growth_os/`, `api/_utils/`) para não gerarem Serverless/Edge Functions avulsas sem necessidade comprovada.

## 2. Separação Estrita de Autenticação: Admin vs. Worker QStash

Nunca misturar autenticação de sessões humanas com callbacks de workers assíncronos no mesmo validador genérico:

1. **Canal Administrador (`admin_session`):**
   - Exigir `Authorization: Bearer <access_token>`.
   - Validar o token no servidor via `supabase.auth.getUser(token)` e confirmar na tabela `public.profiles` (via cliente `service_role`) que `role = 'admin'`.
   - **Proibido** confiar em claims de `user_metadata`, cabeçalhos enviados pelo cliente ou *fast-paths* baseados em padrões de e-mail (ex.: `email.includes('admin@')`).
2. **Canal Worker Assíncrono (`qstash_worker`):**
   - Exigir verificação criptográfica da assinatura `Upstash-Signature` usando `QSTASH_CURRENT_SIGNING_KEY` e `QSTASH_NEXT_SIGNING_KEY` (validação de `iss`, URL de destino/`sub`, `exp`, `nbf` e hash SHA-256 do *raw body*).
   - **Proteção Anti-Replay:** Registar atomicamente o identificador único da mensagem (`Upstash-Message-Id` + `idempotency_key` de negócio) em base de dados antes de executar efeitos secundários; rejeitar ou responder de forma idempotente a entregas repetidas.

## 3. Semântica Honesta de Execução (Browser vs. Server-Side)

- **Proibido classificar fluxos dependentes do navegador como autónomos:** Qualquer avanço passo-a-passo disparado pela aba aberta do administrador deve ser tipado e exposto explicitamente como `execution_mode = 'browser_assisted'`.
- Apenas fluxos conduzidos integralmente no servidor por fila/worker assinado e independente de sessão de browser aberta podem ser classificados como `execution_mode = 'server_async'` (ainda assim sujeitos aos *gates* de aprovação humana L1/L2).

## 4. Concorrência, Reservas Atómicas de Orçamento e Idempotência

- **Proibido padrão `SELECT` + `INSERT` não atómico para orçamento:** Nunca validar limites financeiros lendo o saldo em TypeScript e gravando depois sem bloqueio transacional.
- **Padrão obrigatório `Reserve -> Execute -> Settle/Release`:**
  1. Executar RPC PostgreSQL transacional que bloqueia a linha de orçamento/missão (`SELECT ... FOR UPDATE`), verifica o saldo disponível (`limit_cents - settled_cents - reserved_cents >= max_estimated_cents`) e cria uma reserva com `idempotency_key` `UNIQUE`.
  2. Executar a chamada externa/LLM apenas se a reserva for concedida.
  3. Liquidar (`settle`) pelo custo medido real ou libertar (`release`) a reserva em caso de erro/timeout, incluindo rotina de expiração segura para reservas órfãs com *lease* vencido (`locked_until < now()`).

## 5. Contratos Tipados, Nomenclatura Canónica e Custos Medidos

- **Nomenclatura estrita:** Todos os campos de contratos JSON e colunas SQL devem usar `snake_case` consistente em minúsculas (ex.: `budget_allowance_cents`, nunca misturar maiúsculas como `budget_Allowance_cents`).
- **Validação em *runtime*:** Todo o input de API, payload de worker e resposta JSON do LLM deve ser validado em tempo de execução contra um schema estrito antes de persistir dados ou transitar estados.
- **Custos baseados em medição real:** Nunca assumir tetos fixos mensais (ex.: `< 5 €/mês`) sem instrumentação. Registar sempre modelo exato, `prompt_tokens`, `completion_tokens`, invocações de ferramentas (*grounding*/search), moeda (`USD` na origem da API + conversão rastreável para `EUR`/`BRL`) e distinguir `cost_source: 'measured' | 'estimated'`.
- **Aprovação humana inegociável:** Operações com impacto financeiro, ativação de campanhas/links ou comunicações externas exigem aprovação humana persistida e verificada no backend antes de qualquer execução.

