---
trigger: model_decision
description: "Aplicar sempre ao ler, criar, rever ou editar ficheiros em src/**/*.tsx, src/**/*.ts, src/index.css ou tailwind.config.js. Define regras de interface, preservação integral da dashboard existente, paleta Tailwind remapeada (blue/indigo para verde UmbuLab), temas claro/escuro e transparência operacional no frontend da UmbuLab."
---

# Regras de Frontend, UI & Temas — UmbuLab & AI Growth OS

Estas regras aplicam-se sempre que o Antigravity criar ou editar componentes React, hooks, páginas ou estilos em `src/` e `tailwind.config.js`.

## 1. Isolamento Aditivo e Preservação Integral

- **Zero regressões no site e dashboards atuais:** Não remover, substituir nem alterar o comportamento das rotas públicas em `src/App.tsx`, da `ClientDashboard.tsx` ou das abas existentes em `src/pages/AdminDashboard.tsx` sem autorização expressa.
- **Acoplamento modular por Lazy Loading:** Novos módulos do AI Growth OS devem viver isolados em `src/pages/admin/growth-os/` (e tipos em `src/types/growthOs.ts`), integrados apenas por carregamento diferido (`React.lazy` + `<Suspense>`) para não aumentar o bundle inicial do website público.

## 2. Sistema de Temas e Paleta Tailwind Específica da UmbuLab

- **Suporte obrigatório Claro/Escuro (`darkMode: 'class'`):** Todos os novos componentes devem suportar simultaneamente tema claro e tema escuro usando classes explícitas coerentes com `ThemeContext.tsx` (ex.: `bg-umbu-cardLight dark:bg-umbu-cardDark`, `text-zinc-900 dark:text-white`), evitando cores fixas ilegíveis num dos modos.
- **Atenção ao remapeamento em `tailwind.config.js`:**
  - As escalas `blue-*` e `indigo-*` estão **intencionalmente remapeadas** para tons de verde UmbuLab (`#2E7D32`, `#66BB6A`, etc.) e grafite escuro (`#121212`).
  - Nunca alterar este remapeamento global. Para novos componentes do Growth OS, preferir tokens semânticos explícitos (`umbu.primary`, `umbu.neon`, `umbu.accent`, `umbu.dark`, `umbu.light`, `emerald-*`, `amber-*`, `red-*`, `zinc-*`) para que a intenção cromática no código seja inequívoca.

## 3. Segurança no Cliente e Transparência Operacional

- **Zero segredos no Frontend:** Nunca referenciar chaves privadas ou `service_role` em código `src/` nem criar variáveis `VITE_*` para credenciais de IA, e-mail, WhatsApp ou QStash.
- **Rotulagem honesta do modo de execução:**
  - Quando uma missão estiver a correr em modo conduzido pela sessão do browser (`browser_assisted`), a interface deve informar claramente que a execução requer a aba aberta e **não** apresentá-la como processamento autónomo em segundo plano.
  - Apenas tarefas processadas por worker assíncrono no servidor (`server_async`) podem exibir estado de execução independente de sessão ativa.
- **Visibilidade de Custos, Moedas e Aprovações:**
  - Exibir valores monetários sempre acompanhados da respetiva moeda explícita (`EUR`, `BRL` ou `USD`) e indicar se uma métrica é **medida/liquidada** ou **estimada/projetada**.
  - Ações de nível L1 (publicação de rascunhos) e L2 (operações externas, campanhas, links de afiliados ou movimentações financeiras) devem exigir confirmação explícita do administrador com resumo claro do impacto antes de chamar o backend.

