import crypto from 'node:crypto';

/**
 * Módulo privado de Pedidos Comerciais & Pagamento em Testes (Fase 4.3).
 * Reside em api/_growth_os/ para não gerar Serverless Functions adicionais na Vercel.
 * Reutiliza public.quote_requests, public.processed_worker_messages, public.ai_missions e public.ai_approvals.
 */

export interface CommercialOrderInput {
  customer_name: string;
  customer_email: string;
  company_name: string;
  sector: string;
  main_challenge: string;
  rgpd_consent: boolean;
}

export function validateCommercialOrderInput(raw: Record<string, unknown>): {
  ok: boolean;
  error?: string;
  data?: CommercialOrderInput;
} {
  const customer_name = String(raw.customer_name || '').trim();
  const customer_email = String(raw.customer_email || '').trim().toLowerCase();
  const company_name = String(raw.company_name || '').trim();
  const sector = String(raw.sector || '').trim();
  const main_challenge = String(raw.main_challenge || '').trim();
  const rgpd_consent = Boolean(raw.rgpd_consent);

  if (!customer_name || customer_name.length < 2) {
    return { ok: false, error: 'Nome completo é obrigatório.' };
  }
  if (!customer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    return { ok: false, error: 'E-mail profissional válido é obrigatório.' };
  }
  if (!company_name || company_name.length < 2) {
    return { ok: false, error: 'Nome da empresa é obrigatório.' };
  }
  if (!main_challenge || main_challenge.length < 10) {
    return { ok: false, error: 'Descreva brevemente o desafio digital (mínimo 10 caracteres).' };
  }
  if (!rgpd_consent) {
    return { ok: false, error: 'É necessário aceitar o tratamento de dados (RGPD) para continuar.' };
  }

  return {
    ok: true,
    data: {
      customer_name: customer_name.slice(0, 120),
      customer_email: customer_email.slice(0, 160),
      company_name: company_name.slice(0, 140),
      sector: sector.slice(0, 100) || 'PME / Serviços',
      main_challenge: main_challenge.slice(0, 1200),
      rgpd_consent,
    },
  };
}

export function verifyTestPaymentWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string | undefined
): boolean {
  if (!signatureHeader || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = signatureHeader.replace(/^sha256=/i, '').trim();
  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export function buildOrderMetadataBlock(params: {
  order_code: string;
  product_key: 'diagnostico_digital_umbulab';
  payment_status: 'pending_test_payment' | 'paid_test_verified';
  mission_id?: string | null;
  owner_user_id?: string | null;
  identity_verified?: boolean;
  customer_name: string;
  company_name: string;
  sector: string;
  main_challenge: string;
}): string {
  return JSON.stringify({
    kind: 'DIAGNOSTICO_DIGITAL_MVP',
    order_code: params.order_code,
    product_key: params.product_key,
    payment_status: params.payment_status,
    mission_id: params.mission_id || null,
    owner_user_id: params.owner_user_id || null,
    identity_verified: Boolean(params.identity_verified),
    customer_name: params.customer_name,
    company_name: params.company_name,
    sector: params.sector,
    main_challenge: params.main_challenge,
  });
}

