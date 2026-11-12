/**
 * Configuração e Proposta Revisada do Primeiro Produto Comercial:
 * Diagnóstico Digital UmbuLab (Fase 4.3).
 *
 * Revisão após auditoria do quality_auditor (Fase 4.2):
 * - Preço de 490 € + IVA mantido apenas como sugestão interna não aprovada pela gestão.
 * - Removidas quaisquer promessas de ROI garantido.
 * - Explícito o uso de IA com supervisão, validação e assinatura humana UmbuLab.
 */

export interface CommercialProductConfig {
  product_key: 'diagnostico_digital_umbulab';
  provisional_name: string;
  publication_status: 'draft_pending_admin_approval' | 'published';
  delivery_sla_business_days: number;
  suggested_price_eur_cents: number;
  price_approved_by_management: boolean;
  price_visibility_note: string;
  currency: 'EUR';
  ai_transparency_notice: string;
  rgpd_notice: string;
  deliverables: Array<{
    title: string;
    description: string;
  }>;
  benefits: string[];
  revised_proposal_markdown: string;
}

export const DIAGNOSTICO_DIGITAL_CONFIG: CommercialProductConfig = {
  product_key: 'diagnostico_digital_umbulab',
  provisional_name: 'Diagnóstico Digital UmbuLab',
  publication_status: 'draft_pending_admin_approval',
  delivery_sla_business_days: 5,
  suggested_price_eur_cents: 49000, // 490,00 EUR + IVA (sugestão interna pendente de aprovação)
  price_approved_by_management: false,
  price_visibility_note:
    'Condições comerciais em definição pela gestão (pré-lançamento). Nesta fase de testes não são efetuadas cobranças reais e cada etapa passa por revisão humana antes da entrega.',
  currency: 'EUR',
  ai_transparency_notice:
    'Este diagnóstico combina ferramentas de Inteligência Artificial para aceleração de análise com supervisão, validação técnica e revisão final por um consultor humano da UmbuLab.',
  rgpd_notice:
    'Conformidade RGPD: nenhum dado pessoal sensível ou de clientes finais da sua empresa é partilhado com modelos de IA externos.',
  deliverables: [
    {
      title: '1. Relatório de Maturidade Digital',
      description:
        'Levantamento objetivo da presença web, captação de leads, processos internos e atendimento digital da empresa.',
    },
    {
      title: '2. Plano de Ação Prioritário (Roadmap)',
      description:
        '3 a 5 recomendações práticas de digitalização e automação priorizadas por esforço e impacto operacional estimado (sem garantia contratual de retorno financeiro).',
    },
    {
      title: '3. Sessão de Debriefing (45 min)',
      description:
        'Reunião por vídeo com um especialista humano da UmbuLab para apresentação do diagnóstico e esclarecimento de dúvidas.',
    },
  ],
  benefits: [
    'Clareza prática sobre prioridades digitais sem jargão técnico.',
    'Entrega estruturada em 5 dias úteis após receção do briefing.',
    'Supervisão humana dedicada e respeito integral pelo RGPD.',
    'Base técnica pronta para evolução incremental no website ou operações.',
  ],
  revised_proposal_markdown: `### Proposta Revisada — Diagnóstico Digital UmbuLab (Pendente de Aprovação Humana)

**1. Enquadramento**
Desenhado para micro e pequenas empresas em Portugal que procuram identificar onde perdem eficiência operacional e como estruturar a sua presença digital com pragmatismo.

**2. Metodologia Híbrida (IA com Supervisão Humana)**
A análise inicial é apoiada por ferramentas de Inteligência Artificial sob supervisão direta de consultores humanos da UmbuLab, que validam todas as recomendações antes da entrega final. Não são partilhados dados pessoais sensíveis de clientes finais com serviços de IA externos (conformidade RGPD).

**3. Entregáveis Incluídos (Prazo: 5 dias úteis)**
- **Relatório de Maturidade Digital:** avaliação da presença online, fluxo comercial e atendimento.
- **Plano de Ação Prioritário:** 3 a 5 iniciativas recomendadas com estimativa qualitativa de impacto e esforço (nota: qualquer estimativa de eficiência ou retorno é indicativa e não constitui garantia contratual de ROI).
- **Sessão de Debriefing (45 min):** validação presencial/vídeo com consultor UmbuLab.

**4. Condições Comerciais (Rascunho Interno)**
- **Sugestão interna de referência (não aprovada):** 490 € + IVA (sujeita a decisão final da gestão antes de publicação comercial).`,
};

