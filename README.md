# UmbuLab Digital Growth Agency

Sistema de gerenciamento para agência digital com funcionalidades de portfólio, serviços, projetos e autenticação.

## Configuração

### 1. Variáveis de Ambiente

Este projeto requer variáveis de ambiente do Supabase. Siga os passos abaixo:

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Preencha as variáveis no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

3. Para obter essas credenciais:
   - Acesse [Supabase Dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto
   - Vá em Settings > API
   - Copie a URL e a chave anon/public

### 2. Instalação

```bash
npm install
```

### 3. Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### 4. Build para Produção

```bash
npm run build
```

Os arquivos de produção estarão na pasta `dist/`

## Deploy

### Configuração na Plataforma de Hospedagem

Quando fazer deploy do projeto, certifique-se de configurar as variáveis de ambiente na sua plataforma de hospedagem:

**Vercel:**
1. Vá em Settings > Environment Variables
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

**Netlify:**
1. Vá em Site settings > Environment variables
2. Adicione as variáveis de ambiente

**Outras plataformas:**
- Configure as variáveis de ambiente conforme a documentação da plataforma

### Banco de Dados

O banco de dados Supabase já está configurado com:
- Tabelas: profiles, services, projects, messages, infoproducts, quote_requests, portfolio
- RLS (Row Level Security) habilitado
- Políticas de segurança configuradas
- Trigger automático para criação de perfis

### Primeiro Acesso Admin

Para criar um usuário admin:
1. Registre-se normalmente pela interface
2. Acesse o Supabase Dashboard
3. Vá em Authentication > Users
4. Encontre seu usuário
5. Vá em Table Editor > profiles
6. Altere o campo `role` de 'client' para 'admin'

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (Auth)
├── lib/           # Configurações (Supabase)
├── pages/         # Páginas da aplicação
└── data/          # Dados estáticos (templates)
```

## Funcionalidades

- Autenticação de usuários (clientes e admin)
- Gestão de projetos
- Portfólio de trabalhos
- Gerenciamento de serviços
- Solicitações de orçamento
- Infoprodutos
- Dashboard admin completo
- Dashboard do cliente

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Backend/Auth/Database)
- Lucide React (Ícones)

## Solução de Problemas

### Tela Branca no Deploy

Se você ver uma tela branca após o deploy, verifique:

1. **Variáveis de ambiente configuradas:** Certifique-se de que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas na plataforma de hospedagem

2. **Console do navegador:** Abra o DevTools (F12) e verifique se há erros no console

3. **Build local:** Execute `npm run build` localmente para verificar se há erros

### Erros de Autenticação

- Verifique se as credenciais do Supabase estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique as políticas RLS no Supabase

## Suporte

Para problemas ou dúvidas, verifique:
- Logs do console do navegador
- Logs do Supabase Dashboard
- Variáveis de ambiente configuradas corretamente

## Automação de Blog (RSS Sync)

O projeto possui um "Robô" (Serverless Function da Vercel) que roda diariamente para puxar artigos de outros blogs (Medium, WordPress, Sapo, etc) via Feed RSS e inserir automaticamente no seu painel.

### Como funciona
- **Leitura Automática**: O sistema tenta ler a URL fornecida e adivinha os caminhos comuns de RSS (como `/feed`, `/rss`) se você inserir uma URL HTML comum.
- **Prevenção de Duplicatas**: O sistema verifica o "slug" (URL amigável) de cada artigo. Se já existir no banco (mesmo que como rascunho), ele não importa de novo.

### Como ocultar artigos indesejados
**NÃO EXCLUA** um artigo indesejado vindo do RSS clicando na Lixeira! 
Se você apagar o artigo do banco de dados, o robô vai achar que é um artigo novo na próxima sincronização e vai importá-lo de novo.
- **A Solução:** Para ocultar o artigo, vá no Painel Admin > Blog e clique no ícone de "Olho" para mudar o status de "Publicado" para **"Rascunho"**. Assim, ele some do site público mas continua no banco, dizendo ao robô "não importe isso de novo".

### Requisitos Obrigatórios na Vercel
Para o robô ter permissão de gravar novos artigos no Supabase ignorando as políticas de RLS, ele precisa da Chave Mestra (Service Role Key). Sem ela, a sincronização dá erro no servidor.
1. Vá no Supabase > Project Settings > API e copie a `service_role` (Secret).
2. Vá na Vercel > Settings > Environments > Environment Variables.
3. Adicione a chave:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: *(sua chave)*
4. Faça um "Redeploy" na Vercel para aplicar a chave.

## Segurança e Manutenção (Atualizações Recentes)

O projeto passou recentemente por um processo de *Hardening* (fortalecimento de segurança):

### Rate Limiting Persistente
As funções Serverless (como geração de sites via IA e Chatbot) agora utilizam Rate Limiting nativo via banco de dados (tabela `rate_limits`). Isso impede abusos e excesso de pedidos, mesmo em ambientes serverless como a Vercel, onde os limites em memória falhariam devido à mudança constante de instâncias.

### Segurança da Tabela de Leads
A tabela `newsletter_leads` possui políticas RLS (Row Level Security) rigorosas:
- **Visitantes Anónimos**: Têm permissão para inserir o seu e-mail (`INSERT`), mas estão totalmente bloqueados de fazer leitura (`SELECT`).
- **Administradores**: Têm acesso total. Isso impede que os dados de leads sejam extraídos publicamente por atacantes.

### Contador de Visitas
O sistema de métricas (`site_analytics`) foi atualizado para utilizar incrementos atómicos (função `increment_site_views`). A tabela foi configurada com RLS permitindo que visitantes anónimos façam a leitura do contador (`total_views`), garantindo que o número correto aparece sempre na página principal.

### Falsos Alertas na Vercel (Branch "deploy")
Se notar falhas de build na Vercel referenciando a branch `deploy` (erro "vite: command not found"), **pode ignorar**. Isso ocorre porque a automação do GitHub (`deploy.yml`) gera uma versão estática na branch `deploy` para outra hospedagem, e a Vercel tenta compilar essa branch sem sucesso por não ter os ficheiros de source. O site em Produção (branch `main`) não é afetado.
Para ocultar estes avisos, vá à Vercel em **Settings > General > Ignored Build Step**, selecione "Command" e insira: `bash -c "[[ $VERCEL_GIT_COMMIT_REF != 'deploy' ]]"`
