import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import {
  decryptIntegrationSecret,
  encryptIntegrationSecret,
  maskSecretKey,
  sanitizePayloadForLogs,
} from './_growth_os/vault.js';
import {
  executeAgentPrompt,
  getProviderCircuitBreakerStatus,
  resetProviderCircuitBreaker,
  testProviderConnection,
} from './_growth_os/providers.js';
import {
  buildOrderMetadataBlock,
  validateCommercialOrderInput,
  verifyTestPaymentWebhookSignature,
} from './_growth_os/commercialOrders.js';

/**
 * Endpoint Consolidado do UmbuLab AI Growth OS (/api/growth-os)
 * Revisão de Segurança Fase 3.1 (Pontos 5.4 e 5.5):
 * 1. Autenticação Admin: JWT Supabase + verificação real de profiles.role = 'admin'.
 * 2. Autenticação Worker QStash: Verificação completa de JWT Upstash-Signature (HS256, iss, exp, nbf,
 *    hash SHA-256 do body e proteção anti-replay em public.processed_worker_messages).
 * 3. Cofre Isolado: Segredos encriptados são guardados em public.ai_integration_secrets
 *    (inacessível ao browser mesmo para administradores) e nunca devolvidos nas respostas.
 */

function getServiceSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function base64UrlDecodeToString(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLen), 'base64').toString('utf8');
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function verifyQStashJwtWithKey(
  jwtToken: string,
  signingKey: string,
  rawBodyString: string,
  expectedSubUrl?: string
): { valid: boolean; jti?: string; sub?: string; error?: string } {
  const parts = jwtToken.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Formato JWT Upstash-Signature inválido.' };
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  let header: { alg?: string; typ?: string };
  let claims: {
    iss?: string;
    sub?: string;
    exp?: number;
    nbf?: number;
    jti?: string;
    body?: string;
  };

  try {
    header = JSON.parse(base64UrlDecodeToString(headerB64));
    claims = JSON.parse(base64UrlDecodeToString(payloadB64));
  } catch {
    return { valid: false, error: 'Falha ao descodificar cabeçalho/claims Upstash-Signature.' };
  }

  if (header.alg !== 'HS256') {
    return { valid: false, error: 'Algoritmo JWT Upstash não suportado (esperado HS256).' };
  }

  const signingInput = `${headerB64}.${payloadB64}`;
  const expectedSigB64 = base64UrlEncode(
    crypto.createHmac('sha256', signingKey).update(signingInput).digest()
  );

  const sigBuf = Buffer.from(signatureB64, 'utf8');
  const expectedBuf = Buffer.from(expectedSigB64, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, error: 'Assinatura criptográfica Upstash-Signature inválida.' };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (claims.iss !== 'Upstash') {
    return { valid: false, error: 'Claim iss obrigatório inválido no token QStash (esperado Upstash).' };
  }

  if (typeof claims.sub !== 'string' || !claims.sub.trim()) {
    return { valid: false, error: 'Claim sub obrigatório ausente no token QStash.' };
  }

  const normalizedSub = claims.sub.trim().replace(/\/+$/, '');
  if (expectedSubUrl) {
    const normalizedExpected = expectedSubUrl.trim().replace(/\/+$/, '');
    if (normalizedSub !== normalizedExpected) {
      return {
        valid: false,
        error: `Claim sub inválido no token QStash (recebido: ${normalizedSub}, esperado: ${normalizedExpected}).`,
      };
    }
  } else if (!/^https?:\/\/[^/]+\/api\/growth-os(\?.*)?$/i.test(normalizedSub)) {
    return {
      valid: false,
      error: 'Claim sub do QStash não aponta para o endpoint /api/growth-os autorizado.',
    };
  }

  if (typeof claims.exp !== 'number') {
    return { valid: false, error: 'Claim exp obrigatório ausente no token QStash.' };
  }
  if (nowSec > claims.exp + 5) {
    return { valid: false, error: 'Token QStash expirado (exp).' };
  }

  if (typeof claims.nbf !== 'number') {
    return { valid: false, error: 'Claim nbf obrigatório ausente no token QStash.' };
  }
  if (nowSec + 5 < claims.nbf) {
    return { valid: false, error: 'Token QStash ainda não é válido (nbf).' };
  }

  if (typeof claims.jti !== 'string' || !claims.jti.trim()) {
    return { valid: false, error: 'Claim jti obrigatório ausente no token QStash.' };
  }

  if (typeof claims.body !== 'string' || !claims.body.trim()) {
    return { valid: false, error: 'Claim body obrigatório ausente no token QStash.' };
  }

  const bodyHashB64Url = base64UrlEncode(
    crypto.createHash('sha256').update(rawBodyString, 'utf8').digest()
  );
  const normalizedClaimBody = claims.body.replace(/=+$/g, '');
  if (bodyHashB64Url !== normalizedClaimBody) {
    return { valid: false, error: 'Hash SHA-256 do corpo não corresponde ao claim body do QStash.' };
  }

  return { valid: true, jti: claims.jti.trim(), sub: normalizedSub };
}

async function verifyAdminOrWorkerAuth(req: VercelRequest): Promise<{
  authorized: boolean;
  actorType: 'admin' | 'worker' | 'unauthorized';
  userId?: string;
  email?: string;
  error?: string;
}> {
  const upstashSignature = req.headers['upstash-signature'];
  const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (typeof upstashSignature === 'string') {
    if (!currentSigningKey && !nextSigningKey) {
      return {
        authorized: false,
        actorType: 'unauthorized',
        error: 'QSTASH_CURRENT_SIGNING_KEY não configurada no servidor.',
      };
    }

    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
    const host = req.headers.host;
    const expectedSubUrl =
      process.env.QSTASH_EXPECTED_SUB_URL ||
      (host ? `${proto}://${host}/api/growth-os` : undefined);

    const primaryCheck = currentSigningKey
      ? verifyQStashJwtWithKey(upstashSignature, currentSigningKey, rawBody, expectedSubUrl)
      : { valid: false, error: 'Sem chave primária' };

    const finalCheck =
      primaryCheck.valid || !nextSigningKey
        ? primaryCheck
        : verifyQStashJwtWithKey(upstashSignature, nextSigningKey, rawBody, expectedSubUrl);

    if (!finalCheck.valid) {
      return {
        authorized: false,
        actorType: 'unauthorized',
        error: finalCheck.error || 'Assinatura QStash inválida.',
      };
    }

    // Proteção Anti-Replay persistente em public.processed_worker_messages
    const supabase = getServiceSupabase();
    const messageId =
      (req.headers['upstash-message-id'] as string) || finalCheck.jti || `msg_${Date.now()}`;
    const bodyObj = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const idempotencyKey = String(bodyObj.idempotency_key || messageId);
    const bodySha256 = crypto.createHash('sha256').update(rawBody, 'utf8').digest('hex');

    if (supabase) {
      const { error: replayError } = await supabase.from('processed_worker_messages').insert([
        {
          message_id: messageId,
          idempotency_key: idempotencyKey,
          handler_route: String(req.url || '/api/growth-os'),
          body_sha256: bodySha256,
        },
      ]);

      if (replayError && replayError.code === '23505') {
        return {
          authorized: false,
          actorType: 'unauthorized',
          error: 'Mensagem QStash duplicada bloqueada pela proteção anti-replay.',
        };
      }
    }

    return { authorized: true, actorType: 'worker' };
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      actorType: 'unauthorized',
      error: 'Cabeçalho Authorization Bearer ausente.',
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const supabase = getServiceSupabase();
  if (!supabase) {
    return {
      authorized: false,
      actorType: 'unauthorized',
      error: 'Configuração Supabase indisponível no servidor.',
    };
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return {
      authorized: false,
      actorType: 'unauthorized',
      error: 'Sessão JWT inválida ou expirada.',
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== 'admin') {
    return {
      authorized: false,
      actorType: 'unauthorized',
      error: 'Acesso negado: requer perfil role = admin verificado na base de dados.',
    };
  }

  return {
    authorized: true,
    actorType: 'admin',
    userId: userData.user.id,
    email: profile.email || userData.user.email,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Método não permitido.' });
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const action = (req.query.action as string) || (body.action as string) || 'health';

  // Fluxo 1: Pedido comercial público (MVP Diagnóstico Digital UmbuLab — sem cobrança real nem liberação automática)
  if (action === 'create_commercial_order' && req.method === 'POST') {
    const validated = validateCommercialOrderInput(body as Record<string, unknown>);
    if (!validated.ok || !validated.data) {
      return res.status(400).json({ ok: false, error: validated.error || 'Dados inválidos.' });
    }
    const supabase = getServiceSupabase();
    if (!supabase) {
      return res.status(503).json({ ok: false, error: 'Serviço de base de dados indisponível.' });
    }

    const forwarded = req.headers['x-forwarded-for'];
    const clientIp =
      (typeof forwarded === 'string'
        ? forwarded.split(',')[0]
        : Array.isArray(forwarded)
          ? forwarded[0]
          : undefined
      )?.trim() ||
      (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'].trim() : '') ||
      'unknown';

    const { data: rateAllowed, error: rateErr } = await supabase.rpc('check_rate_limit', {
      p_client_ip: clientIp,
      p_action_type: 'create_commercial_order',
      p_max_requests: 5,
      p_window_seconds: 600,
    });
    if (!rateErr && rateAllowed === false) {
      return res.status(429).json({
        ok: false,
        error: 'Limite de pedidos atingido temporariamente. Aguarda alguns minutos antes de tentar novamente.',
      });
    }

    let ownerUserId: string | null = null;
    let identityVerified = false;
    let effectiveEmail = validated.data.customer_email;
    const orderAuthHeader = req.headers.authorization;
    if (orderAuthHeader && orderAuthHeader.startsWith('Bearer ')) {
      const token = orderAuthHeader.replace(/^Bearer\s+/i, '').trim();
      const { data: orderUser, error: orderUserErr } = await supabase.auth.getUser(token);
      if (orderUserErr || !orderUser?.user?.id || !orderUser?.user?.email) {
        return res.status(401).json({
          ok: false,
          error: 'Sessão de cliente inválida ou expirada ao registar pedido.',
        });
      }
      ownerUserId = orderUser.user.id;
      identityVerified = Boolean(orderUser.user.email_confirmed_at);
      effectiveEmail = orderUser.user.email.trim().toLowerCase();
    }

    const orderCode = `DDU-${Date.now().toString().slice(-6)}`;
    const metadataJson = buildOrderMetadataBlock({
      order_code: orderCode,
      product_key: 'diagnostico_digital_umbulab',
      payment_status: 'pending_test_payment',
      owner_user_id: ownerUserId,
      identity_verified: identityVerified,
      customer_name: validated.data.customer_name,
      company_name: validated.data.company_name,
      sector: validated.data.sector,
      main_challenge: validated.data.main_challenge,
    });

    const { data: quoteRow, error: quoteErr } = await supabase
      .from('quote_requests')
      .insert([
        {
          name: validated.data.customer_name,
          email: effectiveEmail,
          company: validated.data.company_name,
          service_type: 'diagnostico_digital_umbulab',
          project_details: metadataJson,
          status: 'pending_test_payment',
        },
      ])
      .select('id, status, created_at')
      .single();

    if (quoteErr || !quoteRow) {
      return res.status(400).json({
        ok: false,
        error: quoteErr?.message || 'Não foi possível registar o pedido comercial.',
      });
    }

    return res.status(201).json({
      ok: true,
      order_id: quoteRow.id,
      order_code: orderCode,
      payment_status: 'pending_test_payment',
      message:
        'Pedido registado com sucesso em ambiente de testes. A missão no Growth OS só é libertada após confirmação autenticada do pagamento.',
    });
  }

  // Fluxo 2: Webhook / Confirmação autenticada de pagamento em testes (bloqueado em produção e com idempotência estrita)
  if (action === 'confirm_test_payment_webhook' && req.method === 'POST') {
    // Bloqueio absoluto quando o ambiente Vercel é explicitamente produção
    if (process.env.VERCEL_ENV === 'production') {
      return res.status(403).json({
        ok: false,
        error: 'TEST_WEBHOOK_BLOCKED_IN_PRODUCTION: Confirmação simulada desativada em produção.',
      });
    }

    // Em ambiente não-Vercel (execução local ou testes), bloqueia se NODE_ENV for explicitamente production
    if (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        ok: false,
        error: 'TEST_WEBHOOK_BLOCKED_IN_PRODUCTION: Confirmação simulada desativada em produção.',
      });
    }

    const rawBodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(body);
    const sigHeader = req.headers['x-umbulab-test-signature'] as string | undefined;
    const hmacOk = verifyTestPaymentWebhookSignature(
      rawBodyStr,
      sigHeader,
      process.env.GROWTH_OS_TEST_WEBHOOK_SECRET
    );
    const adminAuth = hmacOk ? null : await verifyAdminOrWorkerAuth(req);
    if (!hmacOk && (!adminAuth?.authorized || adminAuth.actorType !== 'admin')) {
      return res.status(403).json({
        ok: false,
        error: 'Confirmação de pagamento rejeitada: requer assinatura HMAC válida ou sessão admin autenticada.',
      });
    }

    const supabase = getServiceSupabase();
    if (!supabase) {
      return res.status(503).json({ ok: false, error: 'Supabase service_role não configurado.' });
    }

    const webhookEventId = String(body.webhook_event_id || body.idempotency_key || '').trim();
    const orderId = String(body.order_id || '').trim();
    const paymentStatus = String(body.payment_status || '');
    if (!webhookEventId || !orderId) {
      return res.status(400).json({ ok: false, error: 'webhook_event_id e order_id são obrigatórios.' });
    }

    if (paymentStatus !== 'paid_test_verified') {
      return res.status(400).json({
        ok: false,
        error: 'Pagamento não confirmado (payment_status deve ser paid_test_verified). Missão não libertada.',
      });
    }

    const bodySha256 = crypto.createHash('sha256').update(rawBodyStr, 'utf8').digest('hex');
    const { error: replayErr } = await supabase.from('processed_worker_messages').insert([
      {
        message_id: webhookEventId,
        idempotency_key: webhookEventId,
        handler_route: '/api/growth-os?action=confirm_test_payment_webhook',
        body_sha256: bodySha256,
      },
    ]);
    if (replayErr && replayErr.code === '23505') {
      return res.status(200).json({
        ok: true,
        idempotent_replay: true,
        message: 'Webhook já processado anteriormente; duplicação bloqueada com segurança.',
      });
    }

    const { data: orderRow } = await supabase
      .from('quote_requests')
      .select('id, name, email, company, project_details, status')
      .eq('id', orderId)
      .maybeSingle();

    if (!orderRow) {
      return res.status(404).json({ ok: false, error: 'Pedido comercial não encontrado.' });
    }

    let parsedMeta: Record<string, unknown> = {};
    try {
      parsedMeta = JSON.parse(String(orderRow.project_details || '{}'));
    } catch {
      parsedMeta = {};
    }

    if (orderRow.status === 'paid_test_verified' || parsedMeta.mission_id) {
      return res.status(200).json({
        ok: true,
        idempotent_replay: true,
        order_id: orderId,
        mission_id: parsedMeta.mission_id || null,
        message: 'Pedido já confirmado anteriormente; criação de missão duplicada bloqueada.',
      });
    }

    const isRecoveringInterrupted = orderRow.status === 'processing_test_payment';
    if (!isRecoveringInterrupted) {
      const { data: claimedOrder } = await supabase
        .from('quote_requests')
        .update({ status: 'processing_test_payment' })
        .eq('id', orderId)
        .eq('status', 'pending_test_payment')
        .select('id')
        .maybeSingle();

      if (!claimedOrder) {
        return res.status(200).json({
          ok: true,
          idempotent_replay: true,
          order_id: orderId,
          message: 'Pedido já em processamento ou confirmado; duplicação concorrente bloqueada.',
        });
      }
    }

    const orderCode = String(parsedMeta.order_code || `DDU-${orderId.slice(0, 6)}`);
    const missionCode = `MSN-${orderCode}`;

    // Recuperação idempotente: se a missão já foi criada antes de uma interrupção, reutilizá-la sem duplicar
    const { data: existingMission } = await supabase
      .from('ai_missions')
      .select('id, code')
      .eq('code', missionCode)
      .maybeSingle();

    let createdMission = existingMission;
    if (!createdMission) {
      const { data: insertedMission, error: missionErr } = await supabase
        .from('ai_missions')
        .insert([
          {
            code: missionCode,
            title: `Diagnóstico Digital UmbuLab — ${String(orderRow.company || orderRow.name)}`,
            objective: `Pedido comercial ${orderCode} (${String(orderRow.email)}): ${String(parsedMeta.main_challenge || '')}`,
            coordinator_agent_key: 'ops_director',
            status: 'awaiting_approval',
            priority: 'high',
            execution_mode: 'approval_required',
            adapter_mode: 'live_api',
            budget_cap_cents: 100,
            budget_used_cents: 0,
            currency_code: 'EUR',
            consolidated_summary: `Pedido pago em ambiente de testes (${orderCode}). Encaminhado para execução e revisão humana antes da entrega ao cliente.`,
            started_at: new Date().toISOString(),
          },
        ])
        .select('id, code')
        .single();

      if (missionErr || !insertedMission) {
        await supabase
          .from('quote_requests')
          .update({ status: 'pending_test_payment' })
          .eq('id', orderId);
        return res.status(400).json({
          ok: false,
          error: missionErr?.message || 'Falha ao criar missão do Growth OS após pagamento em testes.',
        });
      }
      createdMission = insertedMission;
    }

    const { data: existingApproval } = await supabase
      .from('ai_approvals')
      .select('id')
      .eq('mission_id', createdMission.id)
      .limit(1)
      .maybeSingle();

    if (!existingApproval) {
      await supabase.from('ai_approvals').insert([
        {
          mission_id: createdMission.id,
          title: `Aprovar Entrega ao Cliente (${orderCode}): ${String(orderRow.company || orderRow.name)}`,
          requested_by_agent_key: 'ops_director',
          approval_level: 'L1_content_ops',
          category: 'mission_deliverable',
          status: 'awaiting_approval',
          estimated_impact: 'Só após aprovação humana o diagnóstico ficará visível na área de cliente.',
          financial_impact_cents: 0,
          currency_code: 'EUR',
          diff_summary: `Pedido ${orderCode} confirmado em testes. Aguarda revisão humana.`,
        },
      ]);
    }

    const updatedMeta = buildOrderMetadataBlock({
      order_code: orderCode,
      product_key: 'diagnostico_digital_umbulab',
      payment_status: 'paid_test_verified',
      mission_id: createdMission.id,
      owner_user_id: parsedMeta.owner_user_id ? String(parsedMeta.owner_user_id) : null,
      identity_verified: Boolean(parsedMeta.identity_verified),
      customer_name: String(orderRow.name || ''),
      company_name: String(orderRow.company || ''),
      sector: String(parsedMeta.sector || 'PME'),
      main_challenge: String(parsedMeta.main_challenge || ''),
    });

    await supabase
      .from('quote_requests')
      .update({ status: 'paid_test_verified', project_details: updatedMeta })
      .eq('id', orderId);

    return res.status(200).json({
      ok: true,
      recovered_from_interruption: isRecoveringInterrupted,
      order_id: orderId,
      order_code: orderCode,
      payment_status: 'paid_test_verified',
      mission_id: createdMission.id,
      mission_code: createdMission.code,
      approval_status: 'awaiting_approval',
    });
  }

  // Fluxo 3: Área de Cliente — leitura segura apenas dos diagnósticos aprovados e associados à identidade verificada do cliente
  if (action === 'get_client_diagnostics' && req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, error: 'Sessão de cliente necessária.' });
    }
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const supabase = getServiceSupabase();
    if (!supabase) {
      return res.status(503).json({ ok: false, error: 'Supabase indisponível.' });
    }
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user?.id || !userData?.user?.email) {
      return res.status(401).json({ ok: false, error: 'Sessão inválida ou expirada.' });
    }
    if (!userData.user.email_confirmed_at) {
      return res.status(403).json({
        ok: false,
        error: 'EMAIL_NOT_VERIFIED: Confirma o teu e-mail antes de consultar diagnósticos.',
      });
    }

    const authenticatedUserId = userData.user.id;
    const normalizedEmail = userData.user.email.trim().toLowerCase();
    const { data: orders } = await supabase
      .from('quote_requests')
      .select('id, company, status, project_details, created_at')
      .eq('email', normalizedEmail)
      .eq('service_type', 'diagnostico_digital_umbulab')
      .order('created_at', { ascending: false });

    const ownedOrders = (orders || []).filter((ord: Record<string, unknown>) => {
      try {
        const meta = JSON.parse(String(ord.project_details || '{}')) as Record<string, unknown>;
        if (meta.owner_user_id) {
          return String(meta.owner_user_id) === authenticatedUserId;
        }
        return Boolean(meta.identity_verified);
      } catch {
        return false;
      }
    });

    const diagnostics = await Promise.all(
      ownedOrders.map(async (ord: Record<string, unknown>) => {
        let meta: Record<string, unknown> = {};
        try {
          meta = JSON.parse(String(ord.project_details || '{}'));
        } catch {
          meta = {};
        }
        const isIdentityBound =
          Boolean(meta.owner_user_id) &&
          String(meta.owner_user_id) === authenticatedUserId &&
          Boolean(meta.identity_verified);

        let approvedSummary: string | null = null;
        if (meta.mission_id && isIdentityBound) {
          const missionId = String(meta.mission_id);
          const [{ data: mission }, { data: approval }] = await Promise.all([
            supabase
              .from('ai_missions')
              .select('status, consolidated_summary')
              .eq('id', missionId)
              .maybeSingle(),
            supabase
              .from('ai_approvals')
              .select('status')
              .eq('mission_id', missionId)
              .eq('status', 'approved')
              .maybeSingle(),
          ]);
          if (mission?.status === 'completed' && approval?.status === 'approved') {
            approvedSummary = String(mission.consolidated_summary || '');
          }
        }
        return {
          order_id: String(ord.id),
          order_code: String(meta.order_code || ''),
          company: String(ord.company || ''),
          payment_status: String(ord.status || 'pending_test_payment'),
          delivery_status: approvedSummary ? 'approved_and_delivered' : 'in_review',
          approved_summary: approvedSummary,
          created_at: String(ord.created_at || ''),
        };
      })
    );

    return res.status(200).json({ ok: true, diagnostics });
  }

  const auth = await verifyAdminOrWorkerAuth(req);
  if (!auth.authorized) {
    return res.status(403).json({ ok: false, error: auth.error || 'Não autorizado.' });
  }

  try {
    if (action === 'health') {
      return res.status(200).json({
        ok: true,
        actor: auth.actorType,
        admin_email: auth.email || null,
        gemini_configured: Boolean(process.env.GEMINI_API_KEY),
        service_role_configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        circuit_breaker: getProviderCircuitBreakerStatus('google_gemini'),
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'reset_circuit_breaker') {
      const providerKey = body.provider_key ? String(body.provider_key) : undefined;
      resetProviderCircuitBreaker(providerKey);
      return res.status(200).json({
        ok: true,
        circuit_breaker: getProviderCircuitBreakerStatus(providerKey || 'google_gemini'),
      });
    }

    if (action === 'test_integration') {
      const providerKey = String(body.provider_key || '');
      let overrideSecret = typeof body.raw_secret === 'string' ? body.raw_secret : undefined;

      // Se não veio chave no pedido, tenta ler do cofre privado server-side (ai_integration_secrets)
      if (!overrideSecret && providerKey) {
        const supabase = getServiceSupabase();
        if (supabase) {
          const { data: secretRow } = await supabase
            .from('ai_integration_secrets')
            .select('encrypted_secret_payload')
            .eq('provider_key', providerKey)
            .maybeSingle();
          if (secretRow?.encrypted_secret_payload) {
            try {
              overrideSecret = decryptIntegrationSecret(secretRow.encrypted_secret_payload);
            } catch {
              // Ignora se a chave mestra mudou
            }
          }
        }
      }

      const testResult = await testProviderConnection(providerKey, overrideSecret);
      return res.status(200).json({
        ok: true,
        result: testResult,
        key_hint: overrideSecret ? maskSecretKey(overrideSecret) : null,
      });
    }

    if (action === 'encrypt_integration_secret') {
      const providerKey = String(body.provider_key || '');
      const rawSecret = String(body.raw_secret || '');
      if (!providerKey || !rawSecret) {
        return res.status(400).json({ ok: false, error: 'provider_key e raw_secret são obrigatórios.' });
      }
      const encryptedPayload = encryptIntegrationSecret(rawSecret);
      const keyHint = maskSecretKey(rawSecret);
      const now = new Date().toISOString();

      const supabase = getServiceSupabase();
      if (supabase) {
        await supabase.from('ai_integration_secrets').upsert({
          provider_key: providerKey,
          encrypted_secret_payload: encryptedPayload,
          updated_by: auth.userId || null,
          updated_at: now,
        });

        await supabase
          .from('ai_integrations')
          .update({
            has_saved_secret: true,
            key_hint: keyHint,
            status: 'pending_test',
            updated_at: now,
          })
          .eq('provider_key', providerKey);
      }

      // Nunca devolve o encryptedPayload nem o rawSecret para o cliente
      return res.status(200).json({
        ok: true,
        provider_key: providerKey,
        has_saved_secret: true,
        key_hint: keyHint,
        updated_at: now,
      });
    }

    if (action === 'execute_agent_step') {
      const preferredProvider = String(body.preferred_provider || 'google_gemini');
      const targetAgentKey = String(body.agent_key || 'ops_director');
      let sharedApiKey: string | null = null;

      // Arquitetura de API principal partilhada pelos 10 agentes:
      // Resolve a credencial encriptada no cofre privado server-side (ai_integration_secrets)
      // mantendo skills, ferramentas permitidas e prompts totalmente independentes por agente.
      const supabase = getServiceSupabase();
      if (supabase) {
        const { data: ctrlRow } = await supabase
          .from('ai_system_controls')
          .select('pause_new_executions, paused_agent_keys')
          .eq('control_key', 'global')
          .maybeSingle();

        if (ctrlRow?.pause_new_executions) {
          return res.status(423).json({
            ok: false,
            error: 'KILL_SWITCH_ACTIVE: Execuções pausadas pelo Controlo de Emergência Global.',
          });
        }
        if (Array.isArray(ctrlRow?.paused_agent_keys) && ctrlRow.paused_agent_keys.includes(targetAgentKey)) {
          return res.status(423).json({
            ok: false,
            error: `AGENT_PAUSED: O agente ${targetAgentKey} está temporariamente pausado.`,
          });
        }

        const { data: secretRow } = await supabase
          .from('ai_integration_secrets')
          .select('encrypted_secret_payload')
          .eq('provider_key', preferredProvider)
          .maybeSingle();

        if (secretRow?.encrypted_secret_payload) {
          try {
            sharedApiKey = decryptIntegrationSecret(secretRow.encrypted_secret_payload);
          } catch {
            sharedApiKey = null;
          }
        }
      }

      const allowedTools = Array.isArray(body.allowed_tools)
        ? body.allowed_tools.map((t: unknown) => String(t))
        : [];

      const executionResult = await executeAgentPrompt({
        agent_key: targetAgentKey,
        skill_key: String(body.skill_key || 'mission_decomposition_dag'),
        allowed_tools: allowedTools,
        preferred_provider: preferredProvider,
        preferred_model: body.preferred_model ? String(body.preferred_model) : undefined,
        fallback_model:
          body.fallback_model === null
            ? null
            : body.fallback_model
              ? String(body.fallback_model)
              : undefined,
        fallback_policy:
          body.fallback_policy === 'on_transient_error_only'
            ? 'on_transient_error_only'
            : 'forbidden',
        complexity:
          body.complexity === 'high' || body.complexity === 'medium' ? body.complexity : 'low',
        required_capabilities: Array.isArray(body.required_capabilities)
          ? (body.required_capabilities.map((c: unknown) => String(c)) as Array<
              | 'text_generation'
              | 'classification'
              | 'summarization'
              | 'structured_json'
              | 'data_organization'
              | 'deep_reasoning'
              | 'complex_orchestration'
              | 'grounding_search'
            >)
          : undefined,
        budget_limit_cents:
          typeof body.budget_limit_cents === 'number' ? body.budget_limit_cents : undefined,
        estimated_max_cost_cents:
          typeof body.estimated_max_cost_cents === 'number'
            ? body.estimated_max_cost_cents
            : undefined,
        has_external_side_effects: Boolean(body.has_external_side_effects),
        idempotency_key: body.idempotency_key ? String(body.idempotency_key) : null,
        system_prompt: String(body.system_prompt || 'Atua como agente especialista da UmbuLab.'),
        user_prompt: String(body.user_prompt || ''),
        temperature: Number(body.temperature ?? 0.3),
        max_tokens: Number(body.max_tokens ?? 1024),
        force_sandbox: Boolean(body.force_sandbox),
        shared_api_key: sharedApiKey,
        enable_grounding: Boolean(body.enable_grounding),
      });

      if (executionResult.execution_mode === 'blocked') {
        const statusCode = executionResult.error_code?.includes('BUDGET') ? 409 : 422;
        return res.status(statusCode).json({
          ok: false,
          blocked: true,
          error: executionResult.error_message || executionResult.error_code || 'EXECUTION_BLOCKED',
          execution: executionResult,
          sanitized_input: sanitizePayloadForLogs({
            agent_key: body.agent_key,
            skill_key: body.skill_key,
            allowed_tools: allowedTools,
            user_prompt: body.user_prompt,
          }),
        });
      }

      return res.status(200).json({
        ok: true,
        execution: executionResult,
        sanitized_input: sanitizePayloadForLogs({
          agent_key: body.agent_key,
          skill_key: body.skill_key,
          allowed_tools: allowedTools,
          user_prompt: body.user_prompt,
        }),
      });
    }

    if (action === 'hydrate_state') {
      const supabase = getServiceSupabase();
      if (!supabase) {
        return res.status(503).json({ ok: false, error: 'Supabase service_role não configurado.' });
      }

      const [
        controlsRes,
        agentsRes,
        integrationsRes,
        missionsRes,
        tasksRes,
        runsRes,
        approvalsRes,
        opportunitiesRes,
        budgetsRes,
        cashflowRes,
      ] = await Promise.all([
        supabase.from('ai_system_controls').select('*').eq('control_key', 'global').maybeSingle(),
        supabase.from('ai_agents').select('*').order('agent_key'),
        supabase.from('ai_integrations').select('*').order('provider_key'),
        supabase.from('ai_missions').select('*').order('created_at', { ascending: false }),
        supabase.from('ai_tasks').select('*').order('step_order', { ascending: true }),
        supabase.from('ai_task_runs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('ai_approvals').select('*').order('requested_at', { ascending: false }),
        supabase.from('ai_opportunities').select('*').order('created_at', { ascending: false }),
        supabase.from('fin_budgets').select('*').order('code'),
        supabase.from('fin_cashflow_entries').select('*').order('created_at', { ascending: false }),
      ]);

      return res.status(200).json({
        ok: true,
        state: {
          system_controls: controlsRes.data || null,
          agents: agentsRes.data || [],
          integrations: integrationsRes.data || [],
          missions: missionsRes.data || [],
          tasks: tasksRes.data || [],
          task_runs: runsRes.data || [],
          approvals: approvalsRes.data || [],
          opportunities: opportunitiesRes.data || [],
          budgets: budgetsRes.data || [],
          cashflow_entries: cashflowRes.data || [],
        },
      });
    }

    if (action === 'persist_mission') {
      const supabase = getServiceSupabase();
      if (!supabase) {
        return res.status(503).json({ ok: false, error: 'Supabase service_role não configurado.' });
      }

      const { data: ctrlRow } = await supabase
        .from('ai_system_controls')
        .select('pause_new_executions')
        .eq('control_key', 'global')
        .maybeSingle();

      if (ctrlRow?.pause_new_executions) {
        return res.status(423).json({
          ok: false,
          error: 'KILL_SWITCH_ACTIVE: Criação e execução de missões bloqueada pelo Controlo de Emergência Global.',
        });
      }

      const missionInput = body.mission || {};
      const budgetCode =
        missionInput.currency === 'BRL'
          ? 'OPERATIONS_BR_BRL'
          : missionInput.currency === 'USD'
            ? 'FINOPS_AI_USD'
            : 'GROWTH_PT_EUR';
      const budgetCapCents = Math.max(1, Number(missionInput.budget_cap_cents || 1500));
      const missionCode = String(missionInput.code || `MSN-${Date.now()}`);
      const idempotencyKey = String(body.idempotency_key || `idem_${missionCode}`);

      // 1. Inserir missão inicialmente para obter o UUID real em public.ai_missions
      const { data: insertedMission, error: missionErr } = await supabase
        .from('ai_missions')
        .insert([
          {
            code: missionCode,
            title: String(missionInput.title || 'Missão Operacional UmbuLab'),
            objective: String(missionInput.objective || ''),
            coordinator_agent_key: 'ops_director',
            status: 'awaiting_approval',
            priority: String(missionInput.priority || 'high'),
            execution_mode: String(missionInput.execution_mode || 'approval_required'),
            adapter_mode:
              missionInput.adapter_mode === 'live_provider_api'
                ? 'live_api'
                : 'sandbox_test_adapter',
            budget_cap_cents: budgetCapCents,
            budget_used_cents: Number(missionInput.budget_used_cents || 0),
            currency_code: String(missionInput.currency || 'EUR'),
            consolidated_summary: String(missionInput.consolidated_summary || ''),
            deliverables_json: Array.isArray(missionInput.deliverables) ? missionInput.deliverables : [],
            created_by: auth.userId || null,
            started_at: new Date().toISOString(),
          },
        ])
        .select('*')
        .single();

      if (missionErr || !insertedMission) {
        return res.status(400).json({
          ok: false,
          error: missionErr?.message || 'Falha ao gravar missão em ai_missions.',
        });
      }

      // 2. Reservar orçamento atomicamente via RPC public.reserve_ai_budget
      const { data: reserveRes, error: reserveErr } = await supabase.rpc('reserve_ai_budget', {
        p_budget_code: budgetCode,
        p_mission_id: insertedMission.id,
        p_task_id: null,
        p_amount_cents: budgetCapCents,
        p_idempotency_key: idempotencyKey,
      });

      if (reserveErr || !reserveRes?.success) {
        // Reverter missão caso o Hard-Stop orçamental bloqueie a reserva
        await supabase.from('ai_missions').delete().eq('id', insertedMission.id);
        return res.status(409).json({
          ok: false,
          error: reserveRes?.error || reserveErr?.message || 'BUDGET_HARD_STOP_EXCEEDED',
          reservation_details: reserveRes || null,
        });
      }

      // 3. Persistir as tarefas delegadas em public.ai_tasks (limite estrito de 6 tarefas por missão)
      const rawTasks = (Array.isArray(missionInput.tasks) ? missionInput.tasks : []).slice(0, 6);
      const tasksPayload = rawTasks.map((t: Record<string, unknown>, idx: number) => ({
        mission_id: insertedMission.id,
        step_order: Number(t.step_order || idx + 1),
        title: String(t.title || `Tarefa ${idx + 1}`),
        assigned_agent_key: String(t.assigned_agent_key || 'market_intel'),
        skill_key: String(t.skill_key || 'general_analysis'),
        status: String(t.status || 'completed'),
        execution_mode: String(t.execution_mode || 'approval_required'),
        requires_approval: Boolean(t.requires_approval),
        approval_level: String(t.approval_level || 'L1_content_ops'),
        estimated_cost_cents: Number(t.estimated_cost_cents || 0),
        actual_cost_cents: Number(t.actual_cost_cents || 0),
        currency_code: String(missionInput.currency || 'EUR'),
        input_payload: sanitizePayloadForLogs({ summary: t.input_summary }),
        output_payload: sanitizePayloadForLogs({
          summary: t.output_summary,
          structured_output: t.structured_output,
        }),
        evidence_summary: `${String(t.auditor_verdict || '')} | ${String(t.finance_verdict || '')}`,
        started_at: new Date().toISOString(),
        completed_at: t.status === 'completed' ? new Date().toISOString() : null,
      }));

      const { data: insertedTasks } = await supabase
        .from('ai_tasks')
        .insert(tasksPayload)
        .select('*');

      const approvalTask =
        (insertedTasks || []).find((t: { requires_approval?: boolean }) => t.requires_approval) ||
        (insertedTasks || [])[(insertedTasks || []).length - 1];

      // 4. Persistir os registos de execução em public.ai_task_runs com modelo real e telemetria completa
      if (insertedTasks && insertedTasks.length > 0) {
        const runsPayload = insertedTasks.map((dbTask: Record<string, unknown>, idx: number) => {
          const sourceTask = (rawTasks[idx] || {}) as Record<string, unknown>;
          const requestedModel = String(
            sourceTask.requested_model || sourceTask.preferred_model || 'gemini-3.5-flash-lite'
          );
          const executedModel = String(
            sourceTask.executed_model || sourceTask.model_name || requestedModel
          );
          const fallbackTriggered = Boolean(sourceTask.fallback_triggered);
          const fallbackReason = sourceTask.fallback_reason ? String(sourceTask.fallback_reason) : null;
          const errorMessage = sourceTask.error_message ? String(sourceTask.error_message) : null;

          return {
            task_id: dbTask.id,
            mission_id: insertedMission.id,
            agent_key: dbTask.assigned_agent_key,
            skill_key: dbTask.skill_key,
            correlation_id: `corr_${missionCode}`,
            idempotency_key: `idem_${missionCode}_step_${idx + 1}`,
            execution_mode: dbTask.execution_mode,
            adapter_mode: insertedMission.adapter_mode,
            status: dbTask.status === 'awaiting_approval' ? 'completed' : dbTask.status,
            model_provider: 'google_gemini',
            model_name: executedModel,
            prompt_tokens: Number(sourceTask.prompt_tokens ?? 0),
            completion_tokens: Number(sourceTask.completion_tokens ?? 0),
            raw_cost_usd_micros: Number(sourceTask.raw_cost_usd_micros ?? 0),
            cost_source: 'estimated',
            latency_ms: Number(sourceTask.latency_ms ?? 0),
            sanitized_input: dbTask.input_payload || {},
            sanitized_output: {
              ...(typeof dbTask.output_payload === 'object' && dbTask.output_payload !== null
                ? (dbTask.output_payload as Record<string, unknown>)
                : {}),
              telemetry: {
                requested_model: requestedModel,
                executed_model: executedModel,
                fallback_triggered: fallbackTriggered,
                fallback_reason: fallbackReason,
                error_message: errorMessage,
              },
            },
            audit_notes: [
              String(dbTask.evidence_summary || ''),
              fallbackTriggered ? `Fallback: ${fallbackReason || 'sim'}` : null,
              errorMessage ? `Erro: ${errorMessage}` : null,
            ]
              .filter(Boolean)
              .join(' | '),
          };
        });
        await supabase.from('ai_task_runs').insert(runsPayload);
      }

      // 5. Persistir o pedido de aprovação humana em public.ai_approvals
      let insertedApproval = null;
      if (approvalTask) {
        const { data: aprData } = await supabase
          .from('ai_approvals')
          .insert([
            {
              task_id: approvalTask.id,
              mission_id: insertedMission.id,
              title: `Aprovar Resultado da Missão: ${insertedMission.title}`,
              requested_by_agent_key: 'ops_director',
              approval_level:
                budgetCapCents >= 10000 ? 'L2_financial_admin' : 'L1_content_ops',
              category: 'mission_deliverable',
              status: 'awaiting_approval',
              estimated_impact:
                insertedMission.adapter_mode === 'live_api'
                  ? 'Consolida os resultados gerados com API real e liquida o valor consumido no orçamento.'
                  : 'Consolida os resultados gerados em modo de simulação interna e regista o lançamento contabilístico interno.',
              financial_impact_cents: Number(missionInput.budget_used_cents || 0),
              currency_code: String(missionInput.currency || 'EUR'),
              diff_summary: `${rawTasks.length} etapas concluídas. Reserva cativa: ${(budgetCapCents / 100).toFixed(2)} ${missionInput.currency || 'EUR'}.`,
              payload_preview: {
                mission_code: missionCode,
                reservation_id: reserveRes.reservation_id,
              },
            },
          ])
          .select('*')
          .single();
        insertedApproval = aprData;
      }

      // 6. Persistir apenas oportunidades reais geradas na missão (NUNCA dados demonstrativos antigos)
      const rawOpportunities = Array.isArray(body.opportunities) ? body.opportunities : [];
      const nonDemoOpportunities = rawOpportunities.filter(
        (o: Record<string, unknown>) => o && o.is_demo_data !== true
      );
      if (nonDemoOpportunities.length > 0) {
        await supabase.from('ai_opportunities').insert(
          nonDemoOpportunities.map((o: Record<string, unknown>) => ({
            mission_id: insertedMission.id,
            title: String(o.title || 'Oportunidade Identificada'),
            segment: String(o.channel || 'Produto Digital / Serviços B2B'),
            source_channel: String(o.channel || 'Radar AI Growth OS'),
            country_market: String(o.market || missionInput.market || 'PT'),
            currency_code: String(o.currency || insertedMission.currency_code || 'EUR'),
            estimated_ticket_cents: Number(o.estimated_ticket_cents || 39000),
            confidence_score: Number(o.confidence_score || 85),
            intent_score: Number(o.intent_score || 85),
            roi_potential_score: Number(o.roi_potential_score || 88),
            recommended_action: String(o.recommended_action || ''),
            discovered_by_agent: 'market_intel',
            status: 'validated',
            rationale: `${String(o.verified_facts_note || '')} | Hipótese: ${String(o.hypothesis_note || '')}`,
            sources_json: [
              {
                source_type: 'umbulab_internal_repository_audit',
                reference: 'Ativos verificados: Gerador de Sites IA (/generate), Segurança RLS Supabase e Gateway WhatsApp (/api/whatsapp/*)',
                verified_fact: String(o.verified_facts_note || ''),
                compliance_basis: String(o.compliance_basis || 'Conformidade RGPD (UE 2016/679) e LGPD.'),
                verified_at: new Date().toISOString(),
              },
            ],
          }))
        );
      }

      return res.status(200).json({
        ok: true,
        mission_id: insertedMission.id,
        mission_code: insertedMission.code,
        reservation_id: reserveRes.reservation_id,
        approval_id: insertedApproval?.id || null,
        reservation: reserveRes,
      });
    }

    if (action === 'decide_approval') {
      const supabase = getServiceSupabase();
      if (!supabase) {
        return res.status(503).json({ ok: false, error: 'Supabase service_role não configurado.' });
      }

      const approvalId = String(body.approval_id || '');
      const reservationId = String(body.reservation_id || '');
      const decision = String(body.decision || 'approved');
      const decisionNotes = String(body.decision_notes || '');
      const actualCostCents = Math.max(0, Number(body.actual_cost_cents ?? 0));
      const now = new Date().toISOString();

      const { data: approvalRow } = await supabase
        .from('ai_approvals')
        .select('*')
        .eq('id', approvalId)
        .maybeSingle();

      if (approvalRow) {
        const nextApprovalStatus =
          decision === 'approved'
            ? 'approved'
            : decision === 'rejected'
              ? 'rejected'
              : 'awaiting_approval';

        await supabase
          .from('ai_approvals')
          .update({
            status: nextApprovalStatus,
            decision_notes: decisionNotes,
            decided_by: auth.userId || null,
            decided_at: now,
          })
          .eq('id', approvalRow.id);

        if (approvalRow.mission_id && decision !== 'request_changes') {
          await supabase
            .from('ai_missions')
            .update({
              status: decision === 'approved' ? 'completed' : 'rejected',
              budget_used_cents: decision === 'approved' ? actualCostCents : 0,
              completed_at: now,
            })
            .eq('id', approvalRow.mission_id);
        }
      }

      let settlementResult = null;
      const effectiveReservationId =
        reservationId ||
        (approvalRow?.payload_preview as { reservation_id?: string } | null)?.reservation_id ||
        '';

      if (effectiveReservationId && decision !== 'request_changes') {
        const { data: settleData } = await supabase.rpc('settle_ai_budget', {
          p_reservation_id: effectiveReservationId,
          p_actual_cost_cents: decision === 'approved' ? actualCostCents : 0,
          p_release_only: decision === 'rejected',
        });
        settlementResult = settleData;
      }

      return res.status(200).json({
        ok: true,
        decision,
        settlement: settlementResult,
      });
    }

    return res.status(400).json({ ok: false, error: `Ação desconhecida: ${action}` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno no motor AI Growth OS';
    return res.status(500).json({ ok: false, error: message });
  }
}
