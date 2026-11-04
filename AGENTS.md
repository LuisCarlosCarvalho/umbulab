# AGENTS.md — Diretrizes Permanentes do Projeto UmbuLab & AI Growth OS

Este documento define as regras permanentes de arquitetura, engenharia de software, segurança aplicacional (AppSec) e governação operacional para o **Antigravity** e quaisquer agentes de codificação que atuem neste repositório. Estas instruções têm precedência máxima no workspace e são de cumprimento obrigatório em todas as interações.

---

## 1. Preservação do Projeto

- **Sistema em produção:** A UmbuLab já é uma plataforma digital ativa e em funcionamento.
- **Integridade funcional e visual:** Preservar integralmente o website público, os painéis de cliente e administração, a identidade visual, as rotas, os serviços, as automações e as funcionalidades existentes.
- **Proibição de reconstrução:** Não reconstruir, reescrever de raiz nem reestruturar globalmente a aplicação.
- **Proteção de componentes existentes:** Não substituir, remover ou alterar o contrato de componentes, contextos, hooks ou endpoints existentes sem autorização expressa.
- **Evolução isolada e incremental:** Implementar novos módulos, agentes e funcionalidades de forma desacoplada, aditiva e incremental, garantindo zero regressões nos fluxos atuais.
- **Proteção de dados de produção:** Não eliminar, truncar ou modificar dados de produção ou buckets de Storage sem aprovação expressa do utilizador. *(Nota operacional: artigos importados via RSS em `blog_posts` nunca devem ser apagados para ocultação; devem apenas passar ao estado `draft`).*

---

## 2. Arquitetura Existente

- **Stack tecnológica oficial:** Respeitar rigorosamente a arquitetura assente em **React 18**, **Vite 7**, **TypeScript 5**, **Tailwind CSS 3**, **Supabase** (PostgreSQL, Auth, Storage, Realtime e Deno Edge Functions em `supabase/functions/`) e **Vercel** (`vercel.json` e funções Serverless/Edge em `api/`), mantendo compatibilidade com o fluxo de build estático em `.github/workflows/deploy.yml` (branch `deploy`).
- **Reutilização e consistência:** Reutilizar componentes (`src/components/`), contextos (`AuthContext`, `ThemeContext`), hooks (`src/hooks/`), utilitários (`src/lib/`, `api/_utils/`) e definições de tipos (`src/types/index.ts`) sempre que apropriado, preservando retrocompatibilidade.
- **Temas e paleta Tailwind:** Preservar integralmente o sistema de temas claro/escuro (`darkMode: 'class'` gerido por `ThemeContext.tsx` e script inicial em `index.html`) e as configurações especiais em `tailwind.config.js` — incluindo os tokens `umbu.*` e o **remapeamento intencional das escalas `blue` e `indigo` para tons de verde UmbuLab e grafite escuro**.
- **Skills existentes no workspace:** Não editar manualmente os diretórios de terceiros controlados por `skills-lock.json` em `.agents/skills/` (`supabase` e `supabase-postgres-best-practices`). Regras e *skills* próprias da UmbuLab devem manter-se isoladas em `AGENTS.md`, `.agents/rules/` ou em *skills* com prefixo dedicado (`umbulab-*`).

---

## 3. UmbuLab AI Growth OS (Roteiro Futuro)

O **UmbuLab AI Growth OS** será desenvolvido futuramente, por fases e de forma modular dentro da dashboard administrativa existente, contemplando os seguintes domínios:

- Equipa de agentes de IA e orquestrador central.
- *Skills* especializadas em marketing digital e *growth*.
- Pesquisa, recolha e classificação de oportunidades de mercado.
- Marketing de afiliados e operações de e-commerce.
- Campanhas A/B e criação assistida de conteúdos.
- Gestão e planeamento de redes sociais.
- Prospecção comercial B2B.
- Relatórios executivos e análise de performance.
- Módulo de gestão financeira criado integralmente de raiz (*from scratch*).

> **Regra de escopo:** Não implementar nem antecipar código destes módulos sem pedido explícito e aprovação prévia do plano da respetiva fase.

---

## 4. Segurança e Controlo (AppSec & Compliance)

- **Proteção de segredos:** Nunca revelar, imprimir em logs, colocar em código-fonte (*hardcode*) ou publicar credenciais, chaves de API, tokens ou variáveis sensíveis (`.env*` nunca deve ser versionado).
- **Isolamento de chaves privilegiadas:** Nunca utilizar nem expor `SUPABASE_SERVICE_ROLE_KEY` ou segredos de backend (`GEMINI_API_KEY`, `RESEND_API_KEY`, `ZAPI_TOKEN`, `QSTASH_TOKEN`, `CRON_SECRET`, etc.) no código de frontend (`src/`) ou em variáveis com prefixo `VITE_`.
- **Autenticação e autorização no backend:** Exigir verificação real de identidade (JWT/sessão Supabase) e autorização explícita de perfil (`role = 'admin'`) em todos os endpoints administrativos ou sensíveis no backend (`api/` e `supabase/functions/`). Nunca depender apenas de guardas de rota no cliente nem de `user_metadata` editável pelo utilizador.
- **Row Level Security (RLS) e proteção de APIs:** Validar sempre políticas RLS em todas as tabelas do schema `public`, garantindo o princípio do menor privilégio para os papéis `anon` e `authenticated`, preservando *rate limiting* persistente (`rate_limits` / `check_rate_limit`) e cabeçalhos de segurança (`vercel.json`).
- **Operações críticas bloqueadas por defeito:** Não executar migrações SQL, alterações de schema, comandos destrutivos ou *deploys* sem autorização expressa.
- **Controlo financeiro e externo:** Nunca autorizar autonomamente despesas, subscrições de serviços, consumo pago em escala, campanhas pagas ou publicações externas em nome da UmbuLab ou de clientes.
- **Conformidade legal e plataformas:** Respeitar estritamente o **RGPD** (Portugal/UE), a **LGPD** (Brasil) — minimização, finalidade e proteção de dados pessoais como `cpf_cnpj`, `nif`, e-mails, telefones e leads — e os Termos de Serviço e políticas anti-abuso das plataformas externas integradas.

---

## 5. Método de Trabalho

- **Execução faseada:** Trabalhar sempre por fases bem delimitadas e verificáveis.
- **Gestão de branches:** Utilizar *branches* dedicadas separadas da `main` para o desenvolvimento de novas funcionalidades ou correções estruturais (e nunca trabalhar diretamente na branch automática `deploy`).
- **Antes de implementar:** Apresentar plano técnico objetivo, lista exata de ficheiros afetados e avaliação de riscos/impactos para validação.
- **Depois de implementar:** Apresentar relatório detalhado das alterações efetuadas e evidências dos testes/validações executados (`npm run typecheck`, `npm run lint`, `npm run build`, entre outros aplicáveis).
- **Controlo de repositório e produção:** Não efetuar `git push`, `merge` nem `deploy` sem autorização expressa do utilizador.
- **Sustentabilidade técnica e económica:** Privilegiar soluções económicas, modulares, fáceis de manter e eficientes em custos de infraestrutura, base de dados e consumo de tokens/APIs de IA.
- **Idioma:** Comunicar sempre em **português**.
- **Rigor analítico:** Fundamentar diagnósticos e decisões em evidências concretas do código ou de logs, distinguindo sempre de forma explícita **factos verificados** de **hipóteses**.

---

## 6. Integração com o ChatGPT (Arquitetura & Revisão)

- **Papéis definidos:**
  - **ChatGPT:** Parceiro externo de arquitetura de software, planeamento faseado e revisão técnica/segurança.
  - **Antigravity:** Agente de engenharia responsável pela análise local do código, execução técnica das tarefas aprovadas, validação e elaboração de relatórios técnicos.
- **Sem comunicação automática:** Não presumir qualquer ligação direta ou partilha automática de estado entre o Antigravity e o ChatGPT; toda a sincronização ocorre por intermédio do utilizador.
- **Formato obrigatório de entrega técnica:** Ao concluir qualquer tarefa ou fase aprovada, o Antigravity deve produzir um relatório estruturado (pronto para revisão pelo utilizador e pelo ChatGPT) contendo:
  1. **Objetivo**
  2. **Ficheiros alterados**
  3. **Decisões arquitetónicas**
  4. **Testes executados e resultados**
  5. **Riscos identificados**
  6. **Próximos passos**

