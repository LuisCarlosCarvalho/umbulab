import React, { useState } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Save,
  RefreshCw,
  ShieldCheck,
  Sliders,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  X,
  Bot,
} from 'lucide-react';
import type {
  GrowthOsCurrency,
  IntegrationCategoryKey,
  OperationalIntegrationRecord,
} from '../../../../types/growthOs';
import {
  saveIntegrationConfiguration,
  testIntegrationConnectivity,
  useGrowthOsRuntime,
} from '../services/growthOsRuntime';
import { formatCents } from '../mockPreviewData';
import { showToast } from '../../../../components/ui/Toast';
import {
  ExperienceModeSwitch,
  FieldLabelWithHelp,
  formatFriendlyIntegrationStatus,
} from '../components/GrowthOsHelpSystem';

const CATEGORY_FILTERS: Array<{ key: 'all' | IntegrationCategoryKey; label: string }> = [
  { key: 'all', label: 'Todos os Serviços (13)' },
  { key: 'ai_llm', label: '1. Inteligência Artificial (LLMs)' },
  { key: 'search_market', label: '2. Pesquisa de Mercado' },
  { key: 'payments_commerce', label: '3. Pagamentos e Vendas (Appmax / Stripe)' },
  { key: 'ads_social', label: '4. Redes Sociais e Anúncios' },
  { key: 'messaging_email', label: '5. E-mail e WhatsApp' },
  { key: 'automation_infra', label: '6. Base de Dados e Filas' },
];

interface ProviderGuideMeta {
  whatIsIt: string;
  umbulabPurpose: string;
  usedByAgents: string[];
  pricingInfo: string;
  officialDocsUrl: string;
  howToCreateSteps: string[];
  minimumPermissions: string;
  securityTips: string;
}

const PROVIDER_GUIDES: Record<string, ProviderGuideMeta> = {
  google_gemini: {
    whatIsIt: 'Motor oficial de Inteligência Artificial da Google (modelos Gemini 2.5 Flash e Pro).',
    umbulabPurpose: 'É o cérebro principal recomendado para os 10 agentes da UmbuLab analisarem oportunidades, escreverem textos e criarem planos.',
    usedByAgents: ['Coordenador Central', 'Inteligência de Mercado', 'Estrategista Comercial', 'Conteúdo & SEO', 'Auditor de Qualidade'],
    pricingInfo: 'Possui nível gratuito generoso no Google AI Studio e tarifário pago muito económico por utilização.',
    officialDocsUrl: 'https://aistudio.google.com/app/apikey',
    howToCreateSteps: [
      'Aceda ao Google AI Studio com a conta Google da UmbuLab.',
      'Clique no botão "Get API key" (Obter chave de API) no menu esquerdo.',
      'Clique em "Create API key" e copie o código gerado.',
    ],
    minimumPermissions: 'Acesso apenas à API Generative Language (AI Studio).',
    securityTips: 'Defina um limite mensal de consumo no Google Cloud e nunca partilhe esta chave por e-mail ou WhatsApp.',
  },
  openai: {
    whatIsIt: 'Plataforma de Inteligência Artificial criadora do ChatGPT (modelos GPT-4o e GPT-4o Mini).',
    umbulabPurpose: 'Fornecedor alternativo opcional para redação criativa e análise comercial.',
    usedByAgents: ['Diretor Criativo', 'Conteúdo & SEO', 'Estrategista Comercial'],
    pricingInfo: 'Serviço pré-pago por utilização (requer carregamento mínimo na plataforma OpenAI).',
    officialDocsUrl: 'https://platform.openai.com/api-keys',
    howToCreateSteps: [
      'Aceda a platform.openai.com e entre na sua conta.',
      'No menu lateral, clique em "API keys" e depois em "Create new secret key".',
      'Escolha um nome (ex.: UmbuLab Growth OS) e copie a chave iniciada por "sk-".',
    ],
    minimumPermissions: 'Permissão apenas para chamadas de modelos (/v1/chat/completions).',
    securityTips: 'Configure um limite máximo mensal (Hard Limit) em Settings > Limits na OpenAI.',
  },
  anthropic: {
    whatIsIt: 'Plataforma de IA criadora do modelo Claude (muito forte em escrita natural em português e revisão).',
    umbulabPurpose: 'Opcional para revisão editorial longa e verificação de qualidade.',
    usedByAgents: ['Auditor de Qualidade', 'Conteúdo & SEO'],
    pricingInfo: 'Serviço pago por consumo (créditos pré-pagos na consola Anthropic).',
    officialDocsUrl: 'https://console.anthropic.com/settings/keys',
    howToCreateSteps: [
      'Aceda a console.anthropic.com.',
      'Abra a área "API Keys" e clique em "Create Key".',
      'Copie a chave gerada e cole no Passo 3 deste assistente.',
    ],
    minimumPermissions: 'Permissão padrão de inferência de mensagens.',
    securityTips: 'Mantenha um limite mensal baixo na consola da Anthropic.',
  },
  perplexity: {
    whatIsIt: 'Motor de pesquisa web com Inteligência Artificial que devolve respostas com fontes e links verificáveis.',
    umbulabPurpose: 'Permite ao agente de Inteligência de Mercado pesquisar tendências e preços reais na internet.',
    usedByAgents: ['Inteligência de Mercado', 'Prospetor B2B'],
    pricingInfo: 'Serviço pago por pesquisa realizada.',
    officialDocsUrl: 'https://www.perplexity.ai/settings/api',
    howToCreateSteps: [
      'Entre na sua conta Perplexity e abra as Definições > API.',
      'Gere uma nova chave de API na secção "API Keys".',
    ],
    minimumPermissions: 'Acesso apenas a pesquisa Sonar.',
    securityTips: 'Use apenas para missões de pesquisa aprovadas.',
  },
  serpapi: {
    whatIsIt: 'Serviço que consulta resultados reais de pesquisa Google e Google Trends.',
    umbulabPurpose: 'Descobrir o que as empresas em Portugal e no Brasil estão a procurar no Google.',
    usedByAgents: ['Inteligência de Mercado', 'Conteúdo & SEO'],
    pricingInfo: 'Possui plano gratuito limitado (100 pesquisas/mês) e planos pagos.',
    officialDocsUrl: 'https://serpapi.com/manage-api-key',
    howToCreateSteps: [
      'Crie conta em serpapi.com.',
      'No painel principal, copie a sua "Private API Key".',
    ],
    minimumPermissions: 'Apenas leitura de resultados de pesquisa.',
    securityTips: 'Não partilhe a chave privada.',
  },
  appmax: {
    whatIsIt: 'Plataforma brasileira de pagamentos e processamento de vendas digitais (PIX, cartão e boleto).',
    umbulabPurpose: 'Consultar vendas, pedidos e estornos no Brasil para atualizar os relatórios financeiros em Reais (BRL).',
    usedByAgents: ['Especialista de Afiliados & E-commerce', 'Analista Financeiro'],
    pricingInfo: 'Sem custo mensal fixo para leitura de API; taxas aplicam-se apenas sobre vendas realizadas.',
    officialDocsUrl: 'https://docs.appmax.com.br/',
    howToCreateSteps: [
      'Aceda ao painel administrativo da Appmax.',
      'Vá a Configurações > Integrações / API Token.',
      'Copie o Token de acesso e cole no Passo 3.',
    ],
    minimumPermissions: 'Permissão de leitura de pedidos e produtos (nenhum reembolso é feito sem aprovação humana).',
    securityTips: 'Guarde o token apenas neste cofre; o sistema valida webhooks de forma segura.',
  },
  stripe: {
    whatIsIt: 'Plataforma internacional de pagamentos online em Euros (EUR) e Dólares (USD).',
    umbulabPurpose: 'Consultar faturas e pagamentos de clientes na Europa e mercado global.',
    usedByAgents: ['Analista Financeiro', 'Especialista de Afiliados & E-commerce'],
    pricingInfo: 'Sem mensalidade; comissão apenas por transação recebida.',
    officialDocsUrl: 'https://dashboard.stripe.com/apikeys',
    howToCreateSteps: [
      'Abra o Dashboard da Stripe.',
      'Vá a Developers > API keys e crie uma "Restricted Key" (Chave Restrita) apenas com permissão de leitura (Read).',
    ],
    minimumPermissions: 'Recomendamos usar uma chave restrita apenas de leitura (Read-Only) para máxima segurança.',
    securityTips: 'Nunca use a chave no código público do site; este painel guarda-a de forma isolada no servidor.',
  },
  meta_ads: {
    whatIsIt: 'Plataforma oficial de anúncios do Instagram e Facebook (Meta Marketing API).',
    umbulabPurpose: 'Ler métricas de campanhas e preparar rascunhos de testes A/B (nunca publica anúncios pagos sem a sua aprovação).',
    usedByAgents: ['Gestor de Tráfego & Campanhas A/B', 'Diretor Criativo'],
    pricingInfo: 'O acesso à API é gratuito; qualquer orçamento de anúncio exige aprovação humana explícita.',
    officialDocsUrl: 'https://developers.facebook.com/docs/marketing-apis/',
    howToCreateSteps: [
      'Aceda ao Meta Business Suite > Configurações do Negócio.',
      'Em Utilizadores do Sistema, gere um Token de acesso com permissão ads_read.',
    ],
    minimumPermissions: 'Inicialmente apenas leitura de anúncios (ads_read).',
    securityTips: 'Qualquer ativação de campanha real está bloqueada pelo nível de aprovação financeira.',
  },
  google_ads: {
    whatIsIt: 'Plataforma de anúncios de pesquisa do Google e YouTube.',
    umbulabPurpose: 'Analisar custo por clique e desempenho de palavras-chave.',
    usedByAgents: ['Gestor de Tráfego & Campanhas A/B', 'Conteúdo & SEO'],
    pricingInfo: 'API gratuita; gastos em anúncios só ocorrem na conta Google Ads mediante aprovação.',
    officialDocsUrl: 'https://developers.google.com/google-ads/api/docs/start',
    howToCreateSteps: [
      'Na sua conta de gestor do Google Ads, aceda a Ferramentas e Definições > Centro de API.',
      'Copie o Developer Token autorizado.',
    ],
    minimumPermissions: 'Acesso de leitura a relatórios de campanhas.',
    securityTips: 'Mantenha o estado de rascunho ativo nas missões de tráfego.',
  },
  resend: {
    whatIsIt: 'Serviço moderno de envio de e-mails profissionais e notificações.',
    umbulabPurpose: 'Enviar alertas ao Administrador e comunicações aprovadas.',
    usedByAgents: ['Coordenador Central', 'Prospetor B2B'],
    pricingInfo: 'Plano gratuito até 3.000 e-mails/mês.',
    officialDocsUrl: 'https://resend.com/api-keys',
    howToCreateSteps: [
      'Aceda a resend.com/api-keys.',
      'Clique em "Create API Key" com permissão de envio apenas para o domínio verificado da UmbuLab.',
    ],
    minimumPermissions: 'Sending access (Envio de e-mail).',
    securityTips: 'Envios comerciais a clientes exigem sempre revisão e aprovação humana.',
  },
  zapi_whatsapp: {
    whatIsIt: 'Serviço de integração com WhatsApp utilizado pela UmbuLab.',
    umbulabPurpose: 'Enviar avisos importantes ao Administrador (completamente isolado do atendimento automático do site).',
    usedByAgents: ['Coordenador Central', 'Prospetor B2B'],
    pricingInfo: 'Subscrição mensal Z-API já conhecida pela UmbuLab.',
    officialDocsUrl: 'https://developer.z-api.io/',
    howToCreateSteps: [
      'Aceda ao painel da Z-API.',
      'Copie o Token da instância e o Client-Token de segurança.',
    ],
    minimumPermissions: 'Envio de mensagens de texto.',
    securityTips: 'O Growth OS nunca dispara mensagens em massa sem aprovação humana.',
  },
  supabase_core: {
    whatIsIt: 'Base de dados oficial PostgreSQL, sistema de login e cofre de segurança da UmbuLab.',
    umbulabPurpose: 'Guardar missões, aprovações, orçamentos e proteger os dados com regras de segurança (RLS).',
    usedByAgents: ['Todos os 10 agentes (através do servidor seguro)'],
    pricingInfo: 'Incluído no projeto Supabase atual da UmbuLab.',
    officialDocsUrl: 'https://supabase.com/dashboard/project/qzjzlpilmptoojuguqas/settings/api',
    howToCreateSteps: [
      'Esta ligação utiliza a configuração já existente no servidor da UmbuLab.',
      'Basta clicar em "Testar Ligação" no Passo 4 para confirmar o estado.',
    ],
    minimumPermissions: 'Gerido automaticamente no backend com isolamento de segurança.',
    securityTips: 'A chave de serviço nunca é exposta no navegador.',
  },
  upstash_qstash: {
    whatIsIt: 'Fila de tarefas em segundo plano para missões mais demoradas.',
    umbulabPurpose: 'Garantir que tarefas longas não falham por tempo limite e verificar assinaturas de segurança.',
    usedByAgents: ['Coordenador Central'],
    pricingInfo: 'Possui plano gratuito diário (500 mensagens/dia).',
    officialDocsUrl: 'https://console.upstash.com/qstash',
    howToCreateSteps: [
      'Aceda a console.upstash.com/qstash.',
      'Copie o QSTASH_TOKEN e as chaves de assinatura (Current/Next Signing Key).',
    ],
    minimumPermissions: 'Publicação e validação de fila.',
    securityTips: 'O servidor valida criptograficamente cada mensagem recebida.',
  },
};

export const IntegrationsSettingsView: React.FC = () => {
  const state = useGrowthOsRuntime();
  const [selectedCategory, setSelectedCategory] = useState<'all' | IntegrationCategoryKey>('all');
  const [experienceMode, setExperienceMode] = useState<'simple' | 'advanced'>('simple');
  const [testingKey, setTestingKey] = useState<string | null>(null);

  // Estado do Assistente Passo a Passo (5 Passos)
  const [wizardTargetKey, setWizardTargetKey] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Campos de configuração no Passo 3
  const [secretInput, setSecretInput] = useState('');
  const [baseUrlInput, setBaseUrlInput] = useState('');
  const [webhookInput, setWebhookInput] = useState('');
  const [rateLimitInput, setRateLimitInput] = useState(60);
  const [monthlyCapInput, setMonthlyCapInput] = useState('50.00');
  const [currencyInput, setCurrencyInput] = useState<GrowthOsCurrency>('USD');
  const [isActiveInput, setIsActiveInput] = useState(true);

  const filteredIntegrations =
    selectedCategory === 'all'
      ? state.integrations
      : state.integrations.filter((i) => i.category === selectedCategory);

  const wizardItem = state.integrations.find((i) => i.provider_key === wizardTargetKey) || null;
  const wizardGuide = wizardItem ? PROVIDER_GUIDES[wizardItem.provider_key] || PROVIDER_GUIDES.google_gemini : null;

  const handleOpenWizard = (item: OperationalIntegrationRecord, initialStep: 1 | 2 | 3 | 4 | 5 = 1) => {
    setWizardTargetKey(item.provider_key);
    setWizardStep(initialStep);
    setSecretInput('');
    setBaseUrlInput(item.base_url);
    setWebhookInput(item.webhook_url);
    setRateLimitInput(item.rate_limit_per_min);
    setMonthlyCapInput((item.monthly_cap_cents / 100).toFixed(2));
    setCurrencyInput(item.currency);
    setIsActiveInput(item.is_active);
  };

  const handleSaveStep3 = async () => {
    if (!wizardItem) return;
    const capCents = Math.max(0, Math.round(parseFloat(monthlyCapInput.replace(',', '.')) * 100 || 0));
    await saveIntegrationConfiguration(wizardItem.provider_key, {
      raw_secret: secretInput.trim() || undefined,
      base_url: baseUrlInput.trim(),
      webhook_url: webhookInput.trim(),
      rate_limit_per_min: Number(rateLimitInput) || 60,
      monthly_cap_cents: capCents,
      currency: currencyInput,
      is_active: isActiveInput,
    });
    setSecretInput('');
    showToast('Credencial e limites guardados com segurança! Avance para o Passo 4 para testar a ligação.', 'success');
    setWizardStep(4);
  };

  const handleTestConnection = async (providerKey: string) => {
    setTestingKey(providerKey);
    try {
      const updated = await testIntegrationConnectivity(providerKey);
      if (updated?.last_test_status === 'ok') {
        showToast(`Conexão estabelecida: ${updated.display_name}`, 'success');
      } else if (updated?.last_test_status === 'warning') {
        showToast(updated.last_test_message || 'Pendente de configuração da chave.', 'info');
      } else {
        showToast(updated?.last_test_message || 'Erro de ligação.', 'error');
      }
    } finally {
      setTestingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho Explicativo Simples (Largura Total Sem Compressão Lateral) */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <KeyRound size={18} className="text-umbu-primary dark:text-umbu-secondary shrink-0" aria-hidden="true" />
              <span>Integrações e Chaves de API (Assistente Passo a Passo)</span>
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <ShieldCheck size={13} className="shrink-0" />
              <span>Cofre Encriptado (As chaves nunca ficam visíveis após guardar)</span>
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
            Clique em <strong>Configurar Passo a Passo (5 Etapas)</strong> em qualquer serviço abaixo para ver para que serve, onde obter a chave oficial, definir o limite mensal de gasto e testar a ligação. Enquanto um serviço estiver <strong>Não configurado</strong>, o sistema utiliza automaticamente o modo de simulação gratuita sem custos.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <ExperienceModeSwitch mode={experienceMode} onChange={setExperienceMode} />

          <div className="flex items-center gap-2">
            <label htmlFor="integration-cat-select" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
              Filtrar por tipo:
            </label>
            <select
              id="integration-cat-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as 'all' | IntegrationCategoryKey)}
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100"
            >
              {CATEGORY_FILTERS.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grelha de Serviços */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredIntegrations.map((item) => {
          const isTesting = testingKey === item.provider_key;
          const statusMeta = formatFriendlyIntegrationStatus(item.status, item.has_saved_secret);
          const guide = PROVIDER_GUIDES[item.provider_key];

          return (
            <article
              key={item.provider_key}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-umbu-cardLight dark:bg-umbu-cardDark p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-secondary">
                      {item.category_label}
                    </span>
                    <h4 className="text-base font-extrabold text-zinc-900 dark:text-white mt-0.5">
                      {item.display_name}
                    </h4>
                  </div>

                  {/* Estado Honesto e Claro (Parte 4.3) */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                      statusMeta.tone === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : statusMeta.tone === 'amber'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : statusMeta.tone === 'red'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                            : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {statusMeta.tone === 'emerald' && <CheckCircle2 size={13} />}
                    {statusMeta.tone === 'amber' && <AlertTriangle size={13} />}
                    {statusMeta.tone === 'red' && <XCircle size={13} />}
                    {statusMeta.label}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {guide ? guide.umbulabPurpose : item.documentation_note}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-2.5">
                    <span className="block text-[10px] font-bold uppercase text-zinc-500">Estado da Chave</span>
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {item.has_saved_secret ? `Guardada (${item.key_hint || '••••'})` : 'Não configurada'}
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-2.5">
                    <span className="block text-[10px] font-bold uppercase text-zinc-500">Limite Mensal</span>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">
                      {formatCents(item.monthly_cap_cents, item.currency)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-2.5 col-span-2 sm:col-span-1">
                    <span className="block text-[10px] font-bold uppercase text-zinc-500">
                      {experienceMode === 'advanced' ? 'Variável Server-Side' : 'Custo do Serviço'}
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-white truncate block">
                      {experienceMode === 'advanced' ? item.env_var_name : 'Controlado por limite'}
                    </span>
                  </div>
                </div>

                {item.last_test_message && (
                  <div
                    className={`rounded-xl border p-3 text-xs ${
                      item.last_test_status === 'ok'
                        ? 'border-emerald-300/70 bg-emerald-50/60 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                        : item.last_test_status === 'error'
                          ? 'border-red-300/70 bg-red-50/60 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    <div className="font-bold">
                      Diagnóstico de ligação
                      {item.last_tested_at
                        ? ` (${new Date(item.last_tested_at).toLocaleTimeString('pt-PT')})`
                        : ''}
                      :
                    </div>
                    <div className="mt-0.5">{item.last_test_message}</div>
                  </div>
                )}
              </div>

              {/* Botões Principais */}
              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenWizard(item, 1)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-3.5 py-2 text-xs font-extrabold text-white shadow-sm hover:opacity-95"
                  >
                    <Sliders size={13} />
                    <span>Configurar Passo a Passo (5 Etapas)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={() => handleTestConnection(item.provider_key)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={isTesting ? 'animate-spin' : ''} />
                    <span>{isTesting ? 'A testar...' : 'Testar Ligação'}</span>
                  </button>
                </div>

                {guide && (
                  <a
                    href={guide.officialDocsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-umbu-primary dark:text-umbu-neon hover:underline"
                  >
                    <span>Site Oficial</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* MODAL DO ASSISTENTE DE INTEGRAÇÃO EM 5 PASSOS */}
      {wizardItem && wizardGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="integration-wizard-title"
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-umbu-primary dark:text-umbu-neon">
                  Assistente de Ligação Guiado • Passo {wizardStep} de 5
                </span>
                <h3 id="integration-wizard-title" className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white">
                  {wizardItem.display_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWizardTargetKey(null)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
                aria-label="Fechar assistente"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Barra dos 5 Passos */}
            <div className="grid grid-cols-5 gap-1.5 border-b border-zinc-200 bg-zinc-100/70 px-5 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/40">
              {[
                { s: 1, label: '1. Sobre o serviço' },
                { s: 2, label: '2. Obter chave' },
                { s: 3, label: '3. Configurar' },
                { s: 4, label: '4. Testar ligação' },
                { s: 5, label: '5. Concluir' },
              ].map((st) => (
                <button
                  key={st.s}
                  type="button"
                  onClick={() => setWizardStep(st.s as 1 | 2 | 3 | 4 | 5)}
                  className={`rounded-lg px-2 py-1.5 text-center text-[11px] font-extrabold transition-colors ${
                    wizardStep === st.s
                      ? 'bg-umbu-primary text-white'
                      : wizardStep > st.s
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
                        : 'bg-white text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Conteúdo do Passo */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* PASSO 1 — SOBRE O SERVIÇO */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 p-4 space-y-3 text-xs sm:text-sm">
                    <div>
                      <strong className="text-zinc-900 dark:text-white block">O que é este serviço:</strong>
                      <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">{wizardGuide.whatIsIt}</p>
                    </div>
                    <div>
                      <strong className="text-zinc-900 dark:text-white block">Para que serve na UmbuLab:</strong>
                      <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">{wizardGuide.umbulabPurpose}</p>
                    </div>
                    <div>
                      <strong className="text-zinc-900 dark:text-white block">É gratuito ou pago?</strong>
                      <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">{wizardGuide.pricingInfo}</p>
                    </div>
                    <div>
                      <strong className="text-zinc-900 dark:text-white block mb-1.5">
                        Agentes que utilizam esta ligação:
                      </strong>
                      <div className="flex flex-wrap gap-1.5">
                        {wizardGuide.usedByAgents.map((ag) => (
                          <span
                            key={ag}
                            className="inline-flex items-center gap-1 rounded-lg bg-umbu-primary/10 px-2.5 py-1 text-xs font-bold text-umbu-primary dark:text-umbu-neon"
                          >
                            <Bot size={12} />
                            {ag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASSO 2 — OBTER A CREDENCIAL */}
              {wizardStep === 2 && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-zinc-900 dark:text-white">
                        Onde criar ou copiar a sua chave oficial:
                      </strong>
                      <a
                        href={wizardGuide.officialDocsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-3 py-1.5 text-xs font-extrabold text-white hover:opacity-95"
                      >
                        <span>Abrir Página Oficial de Chaves</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>

                    <ol className="list-decimal list-inside space-y-1.5 text-zinc-700 dark:text-zinc-200">
                      {wizardGuide.howToCreateSteps.map((stepText, idx) => (
                        <li key={idx}>{stepText}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5">
                      <strong className="text-zinc-900 dark:text-white block text-xs">
                        Permissões mínimas necessárias:
                      </strong>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                        {wizardGuide.minimumPermissions}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5">
                      <strong className="text-emerald-950 dark:text-emerald-200 block text-xs">
                        Cuidados de segurança:
                      </strong>
                      <p className="text-xs text-emerald-900 dark:text-emerald-300 mt-1">
                        {wizardGuide.securityTips}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PASSO 3 — CONFIGURAR */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <FieldLabelWithHelp
                      label="Chave Secreta / Token da API"
                      help={{
                        meaning: 'O código secreto que autoriza a UmbuLab a comunicar com este serviço.',
                        purpose: 'Ligar a conta da UmbuLab de forma segura.',
                        howToFill: 'Cole aqui a chave que copiou no Passo 2. Se já guardou antes e não quer mudar, deixe em branco.',
                        example: 'AIzaSy... ou sk-...',
                        required: !wizardItem.has_saved_secret,
                        effect: 'A chave é encriptada no servidor e nunca mais volta a ser mostrada em texto aberto (verá apenas os últimos 4 caracteres).',
                        costOrExternalImpact: 'Guardar a chave não gera qualquer cobrança.',
                      }}
                    />
                    <input
                      type="password"
                      value={secretInput}
                      onChange={(e) => setSecretInput(e.target.value)}
                      placeholder={
                        wizardItem.has_saved_secret
                          ? `Chave atual guardada (${wizardItem.key_hint || '••••'}). Escreva apenas se quiser substituir.`
                          : 'Cole aqui a sua chave secreta...'
                      }
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 font-mono text-xs sm:text-sm text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabelWithHelp
                        label="Limite Mensal Máximo Autorizado"
                        help={{
                          meaning: 'Teto máximo mensal planeado para este serviço.',
                          purpose: 'Controlar os custos mensais da plataforma.',
                          howToFill: 'Digite o valor máximo mensal permitido.',
                          example: '50.00',
                          required: true,
                          effect: 'Regista o limite mensal na ficha desta integração.',
                          costOrExternalImpact: 'Funciona como referência de segurança financeira.',
                        }}
                      />
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={monthlyCapInput}
                        onChange={(e) => setMonthlyCapInput(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 font-mono text-sm text-zinc-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <FieldLabelWithHelp
                        label="Moeda do Limite"
                        help={{
                          meaning: 'Moeda em que este serviço fatura ou controla o teto.',
                          purpose: 'Manter consistência com a faturação do fornecedor (ex.: USD para OpenAI/Gemini, BRL para Appmax, EUR para Stripe).',
                          howToFill: 'Selecione EUR, BRL ou USD.',
                          example: 'USD',
                          required: true,
                          effect: 'Atualiza a moeda do limite mensal.',
                          costOrExternalImpact: 'Sem impacto externo.',
                        }}
                      />
                      <select
                        value={currencyInput}
                        onChange={(e) => setCurrencyInput(e.target.value as GrowthOsCurrency)}
                        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 text-sm font-semibold text-zinc-900 dark:text-white"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="BRL">BRL (R$)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <FieldLabelWithHelp
                      label="Endereço Base do Serviço (Já pré-preenchido)"
                      help={{
                        meaning: 'O endereço oficial de internet por onde o servidor da UmbuLab comunica com este fornecedor.',
                        purpose: 'Saber para onde enviar os pedidos técnicos.',
                        howToFill: 'Não precisa de alterar; já está preenchido com o endereço oficial.',
                        example: wizardItem.base_url,
                        required: true,
                        effect: 'Define o destino técnico da ligação.',
                        costOrExternalImpact: 'Sem custo.',
                      }}
                    />
                    <input
                      type="text"
                      value={baseUrlInput}
                      onChange={(e) => setBaseUrlInput(e.target.value)}
                      className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2 font-mono text-xs text-zinc-700 dark:text-zinc-300"
                    />
                  </div>

                  {experienceMode === 'advanced' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <div>
                        <FieldLabelWithHelp
                          label="Limite de Pedidos por Minuto (Rate Limit)"
                          help={{
                            meaning: 'Número máximo de chamadas técnicas permitidas por minuto.',
                            purpose: 'Evitar bloqueios por excesso de velocidade.',
                            howToFill: 'Mantenha o valor recomendado (ex.: 60).',
                            example: '60',
                            required: false,
                            effect: 'Controla a cadência máxima.',
                            costOrExternalImpact: 'Protege contra picos acidentais.',
                          }}
                        />
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={rateLimitInput}
                          onChange={(e) => setRateLimitInput(Number(e.target.value) || 60)}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 font-mono text-xs text-zinc-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <FieldLabelWithHelp
                          label="Endereço de Receção de Avisos (Webhook)"
                          help={{
                            meaning: 'Rota interna que recebe notificações automáticas do serviço (quando aplicável).',
                            purpose: 'Sincronizar eventos como confirmação de pagamento ou fila.',
                            howToFill: 'Opcional; já preenchido nos serviços que usam webhook.',
                            example: '/api/growth-os?action=webhook_appmax',
                            required: false,
                            effect: 'Informativo para configuração no painel externo.',
                            costOrExternalImpact: 'Sem custo.',
                          }}
                        />
                        <input
                          type="text"
                          value={webhookInput}
                          onChange={(e) => setWebhookInput(e.target.value)}
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2 font-mono text-xs text-zinc-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  <label className="inline-flex items-center gap-2.5 pt-1 text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActiveInput}
                      onChange={(e) => setIsActiveInput(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-umbu-primary"
                    />
                    Manter esta integração ativa para uso pelos agentes autorizados
                  </label>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSaveStep3}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <Save size={14} />
                      Guardar Configuração e Avançar para o Teste
                    </button>
                  </div>
                </div>
              )}

              {/* PASSO 4 — TESTAR LIGAÇÃO */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 p-4 space-y-2 text-xs sm:text-sm">
                    <strong className="text-zinc-900 dark:text-white block">
                      Passo 4 — Verificar se a ligação está a funcionar
                    </strong>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Clique no botão abaixo para o servidor da UmbuLab verificar a chave e devolver um diagnóstico claro (sem gastar saldo).
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={testingKey === wizardItem.provider_key}
                    onClick={() => handleTestConnection(wizardItem.provider_key)}
                    className="inline-flex items-center gap-2 rounded-xl bg-umbu-primary px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
                  >
                    <RefreshCw
                      size={15}
                      className={testingKey === wizardItem.provider_key ? 'animate-spin' : ''}
                    />
                    <span>
                      {testingKey === wizardItem.provider_key
                        ? 'A verificar ligação com o serviço...'
                        : 'Testar Ligação Agora'}
                    </span>
                  </button>

                  {wizardItem.last_test_message && (
                    <div
                      className={`rounded-xl border p-4 text-xs sm:text-sm ${
                        wizardItem.last_test_status === 'ok'
                          ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100'
                          : wizardItem.last_test_status === 'error'
                            ? 'border-red-300 bg-red-50/70 text-red-950 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100'
                            : 'border-amber-300 bg-amber-50/70 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100'
                      }`}
                    >
                      <div className="font-extrabold">Resultado do Teste:</div>
                      <p className="mt-1">{wizardItem.last_test_message}</p>
                    </div>
                  )}
                </div>
              )}

              {/* PASSO 5 — CONCLUIR */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 dark:border-emerald-800/60 dark:bg-emerald-950/20 p-4 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-extrabold text-emerald-900 dark:text-emerald-200">
                      <CheckCircle2 size={18} />
                      <span>Configuração de {wizardItem.display_name} revista!</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300">
                      Estado atual:{' '}
                      <strong>
                        {formatFriendlyIntegrationStatus(wizardItem.status, wizardItem.has_saved_secret).label}
                      </strong>
                      . Os especialistas abaixo já podem utilizar esta configuração nas próximas missões:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {wizardGuide.usedByAgents.map((ag) => (
                        <span
                          key={ag}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200"
                        >
                          <Bot size={13} className="text-umbu-primary" />
                          {ag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Assistente */}
            <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-950/60">
              <div>
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4 | 5)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200"
                  >
                    <ArrowLeft size={14} />
                    Passo Anterior
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {wizardStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((s) => Math.min(5, s + 1) as 1 | 2 | 3 | 4 | 5)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-4 py-2 text-xs font-extrabold text-white"
                  >
                    <span>Próximo Passo</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setWizardTargetKey(null)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-umbu-primary px-4 py-2 text-xs font-extrabold text-white"
                  >
                    <CheckCircle2 size={14} />
                    <span>Concluir e Fechar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsSettingsView;
