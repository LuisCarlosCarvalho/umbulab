---
name: umbulab-supabase-rls-migration
description: >-
  Guia a criação e revisão de migrações SQL PostgreSQL, funções transacionais
  concorrentes e políticas Row Level Security (RLS) no Supabase para o UmbuLab
  AI Growth OS. Usar antes de escrever qualquer ficheiro em supabase/migrations/
  ou funções RPC do projeto.
---

# UmbuLab Supabase SQL, Concorrência & RLS Migration Guide

Esta *Dev-Time Skill* complementa (sem modificar) as *skills* oficiais `supabase` e `supabase-postgres-best-practices` controladas por `skills-lock.json`, aplicando as regras específicas de segurança e dados da UmbuLab.

> **Bloqueio de Segurança (`AGENTS.md`):** Nunca executar migrações contra a base de dados nem comandos destrutivos (`DROP`, `TRUNCATE`, `DELETE` sem filtro) sem autorização expressa do utilizador. Preparar sempre o ficheiro SQL para revisão prévia.

## 1. Princípios de Schema e Preservação

1. **Tabelas de produção intocadas:** Nunca alterar colunas ou remover políticas existentes em `profiles`, `services`, `projects`, `messages`, `marketing_products`, `quote_requests`, `portfolio`, `blog_posts`, `configuracoes`, `newsletter_leads`, `site_analytics` ou `rate_limits` sem aprovação explícita.
2. **Nomenclatura e Tipos:**
   - Identificadores em `snake_case` minúsculo.
   - Chaves primárias `UUID DEFAULT gen_random_uuid()`.
   - Timestamps sempre `TIMESTAMPTZ NOT NULL DEFAULT now()`.
   - Valores monetários em unidades mínimas inteiras `BIGINT` acompanhados de coluna explícita `currency TEXT NOT NULL CHECK (currency IN ('EUR', 'BRL', 'USD'))`. Nunca usar `FLOAT`/`REAL` para dinheiro.

## 2. Padrão de Autorização RLS (`public.is_admin()`)

1. **Ativar RLS em 100% das novas tabelas `public`:**
   ```sql
   ALTER TABLE public.<nome_tabela> ENABLE ROW LEVEL SECURITY;
   ```
2. **Função auxiliar segura de verificação de Admin:**
   - Usar uma função `public.is_admin()` marcada como `SECURITY DEFINER SET search_path = ''` que consulta `public.profiles` (`WHERE id = (SELECT auth.uid()) AND role = 'admin'`).
   - Revogar execução de `anon` se aplicável e envolver chamadas em subselect `(SELECT public.is_admin())` nas políticas `USING` / `WITH CHECK` para otimização do planeador Postgres (*initPlan caching*).
   - **Proibido** usar `auth.jwt() -> 'user_metadata'` em políticas RLS (editável pelo utilizador final).
3. **Princípio do menor privilégio:**
   - Tabelas do AI Growth OS e do módulo financeiro devem bloquear totalmente o papel `anon` e clientes comuns (`role = 'client'`), permitindo acesso apenas a administradores autenticados (e ao `service_role` em rotinas backend auditadas).
   - Registos de auditoria e livro-razão (`ai_task_runs`, `ai_approvals` decididas, lançamentos liquidados e reservas liquidadas) não devem ter políticas `DELETE` nem `UPDATE` destrutivo para utilizadores — correções ocorrem apenas por inserção de registo compensatório/estorno.

## 3. Controlo de Concorrência, Reservas Atómicas e Anti-Replay em SQL

Para orçamentos, execução de tarefas e mensagens de workers assíncronos, implementar a lógica crítica em funções PL/pgSQL atómicas:

1. **Reserva e Liquidação de Orçamento (`SELECT ... FOR UPDATE`):**
   - Na RPC de reserva (`reserve_ai_budget`), bloquear a linha do orçamento aplicável (`FOR UPDATE`), somar `settled_cents + reserved_cents`, validar contra `limit_cents` e inserir o registo em `ai_budget_reservations` com `idempotency_key UNIQUE` e `expires_at`.
   - Se `idempotency_key` já existir, devolver a reserva existente sem duplicar débito.
   - Na RPC de liquidação (`settle_ai_budget`), transitar a reserva de `'reserved'` para `'settled'` (ou `'released'`), atualizando os acumulados na mesma transação.
2. **Aquisição de Tarefas (*Step Lease Lock*):**
   - Usar `FOR UPDATE SKIP LOCKED` ao selecionar tarefas elegíveis (`status IN ('queued', 'failed_retryable') OR (status = 'running' AND locked_until < now())`) para impedir execução dupla entre workers concorrentes.
3. **Registo Anti-Replay de Workers (QStash):**
   - Criar tabela `processed_worker_messages` (`message_id TEXT PRIMARY KEY`, `idempotency_key TEXT UNIQUE`, `received_at TIMESTAMPTZ`, `expires_at TIMESTAMPTZ`) verificada por `INSERT ... ON CONFLICT DO NOTHING RETURNING message_id`.

## 4. Passos de Validação Pré-Revisão

1. Verificar que todas as tabelas criadas têm `ENABLE ROW LEVEL SECURITY` e políticas explícitas para `SELECT`, `INSERT`, `UPDATE` e `DELETE`.
2. Verificar a existência de índices compostos para todas as chaves estrangeiras (`mission_id`, `task_id`, `account_id`, `category_id`) e filtros frequentes (`status`, `competence_date`, `cash_date`).
3. Confirmar que nenhuma função `SECURITY DEFINER` omite `SET search_path = ''`.

