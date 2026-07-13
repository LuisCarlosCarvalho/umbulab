# Configuração do Vercel

## Variáveis de Ambiente Necessárias

Para que o site funcione corretamente no Vercel, você precisa configurar as seguintes variáveis de ambiente:

### Passo a Passo:

1. **Acesse o Dashboard do Vercel**
   - Vá para: https://vercel.com/dashboard
   - Selecione seu projeto (fslproducao)

2. **Configurar Variáveis de Ambiente**
   - Clique em "Settings" (Configurações)
   - No menu lateral, clique em "Environment Variables"
   - Adicione as seguintes variáveis:

#### Variável 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://nelntzdujdydstvgbzsy.supabase.co
```
- Environment: Production, Preview, Development (marque todas)

#### Variável 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: sb_publishable_evymT7ToR7udpBOWOFsWgw_Zrftq9B-
```
- Environment: Production, Preview, Development (marque todas)

3. **Fazer Redeploy**
   - Após adicionar as variáveis, vá para a aba "Deployments"
   - No último deploy, clique nos três pontinhos (•••)
   - Selecione "Redeploy"
   - Aguarde o deploy finalizar

## Por que isso é necessário?

O Vercel não tem acesso ao arquivo `.env` local. As variáveis de ambiente precisam ser configuradas diretamente no painel do Vercel para que o aplicativo consiga se conectar ao Supabase e carregar os dados do portfólio.

## Verificação

Após o redeploy, acesse:
- https://fslproducao.vercel.app/portfolio

O portfólio deve aparecer com todos os projetos.
