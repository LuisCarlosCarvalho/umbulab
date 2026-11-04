---
name: umbulab-appsec-review
description: >-
  Executa auditoria de segurança aplicacional (AppSec), conformidade RGPD/LGPD,
  autenticação dual (Admin vs QStash), anti-replay e verificação de limites de
  deploy Vercel antes de entregar qualquer fase do UmbuLab AI Growth OS.
---

# UmbuLab Application Security, Compliance & Deployment Audit

Esta *Dev-Time Skill* define o protocolo obrigatório de verificação de segurança, privacidade e infraestrutura antes de dar por concluída qualquer implementação de código no projeto UmbuLab.

## 1. Checklist de Autenticação, Autorização e Anti-Replay

1. **Endpoints Administrativos (`api/` e `supabase/functions/`):**
   - Confirmar que o JWT é validado criptograficamente/remotamente via `supabase.auth.getUser(jwt)` no backend.
   - Confirmar que a autorização valida `profiles.role === 'admin'` na base de dados e **nunca** confia em `user_metadata`, parâmetros do corpo do pedido ou *heurísticas* de e-mail do lado do cliente (`src/App.tsx`).
2. **Endpoints de Workers Assíncronos (Upstash QStash / Webhooks):**
   - Confirmar que o canal de worker está segregado do canal humano e exige validação criptográfica de `Upstash-Signature` sobre o *raw request body* com suporte a rotação de chaves (`QSTASH_CURRENT_SIGNING_KEY` / `QSTASH_NEXT_SIGNING_KEY`).
   - Confirmar proteção **anti-replay** e **idempotência**: mensagens repetidas com o mesmo `Upstash-Message-Id` ou `idempotency_key` não podem duplicar chamadas pagas, e-mails, mensagens WhatsApp nem reservas/lançamentos financeiros.
3. **Isolamento de Segredos:**
   - Verificar que nenhuma chave privilegiada (`SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `ZAPI_TOKEN`, `QSTASH_*`, `CRON_SECRET`) aparece em `src/`, logs públicos, respostas de erro HTTP ou variáveis `VITE_*`.
   - Verificar que `api/_utils/supabase.ts` ou novos clientes privilegiados falham de forma explícita (*fail-closed*) em rotas administrativas se `SUPABASE_SERVICE_ROLE_KEY` estiver ausente, em vez de degradar silenciosamente para `anon` onde não deve.

## 2. Proteção contra Abuso de IA, Prompt Injection e Fuga de Dados

1. **Conteúdo Externo Não Confiável:**
   - Páginas de concorrentes, resultados de pesquisa web, feeds RSS e dados de prospects B2B devem ser tratados como **input não confiável** (potencial *indirect prompt injection*).
   - Isolar dados externos em delimitadores claros nos *prompts* e **nunca** permitir que texto externo altere permissões, destinatários de e-mail/WhatsApp, URLs de destino ou parâmetros financeiros.
2. **Sanitização de Saída e Links:**
   - Todo o HTML/Markdown renderizado na UI deve continuar higienizado (ex.: `DOMPurify` já presente no projeto).
   - Links de afiliados e URLs externas geradas por agentes devem validar protocolo (`https:`) e domínio autorizado antes de ficarem elegíveis para aprovação humana.
3. **Gate Humano Obrigatório (L1/L2):**
   - Confirmar no código do servidor (e não apenas no botão da UI) que nenhuma publicação pública, comunicação externa (Resend / Z-API) ou operação financeira executa sem um registo correspondente em `ai_approvals` com `status = 'approved'` assinado por um `admin`.

## 3. Conformidade Legal (RGPD — Portugal/UE & LGPD — Brasil)

1. **Minimização de PII em Prompts de IA:**
   - Nunca enviar `cpf_cnpj`, `nif`, senhas, tokens ou moradas completas de clientes reais da tabela `profiles` para APIs externas de LLM.
2. **Prospecção B2B Responsável:**
   - Recolher e processar apenas dados empresariais públicos legítimos, registando sempre a base legal (`consent_legal_basis`), origem pública do dado e mecanismo imediato de *opt-out* / bloqueio de contacto (`do_not_contact`).
   - Proibir disparos em massa automatizados (*spam*) por e-mail ou WhatsApp.

## 4. Verificação de Infraestrutura, Limites Vercel e Build

1. **Contagem Efetiva de Funções Serverless/Edge:**
   - Listar todos os ficheiros expostos em `api/` (excluindo diretórios com prefixo `_`), inspecionar `vercel.json` (incluindo cabeçalhos CSP se houver novas origens estritamente necessárias no cliente) e validar a compatibilidade com o build local (`npm run build`) e com a pipeline estática `.github/workflows/deploy.yml`.
2. **Validação Técnica Obrigatória Pós-Alteração:**
   - Executar `npm run typecheck`, `npm run lint` (reportando eventuais problemas preexistentes separadamente) e `npm run build`, documentando os outputs reais no relatório técnico final para revisão do utilizador e do ChatGPT.

