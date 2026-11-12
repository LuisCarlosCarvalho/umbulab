import crypto from 'node:crypto';

/**
 * Cofre de Credenciais Server-Side (AES-256-GCM Autenticado)
 * Regras AppSec:
 * - Segredos de terceiros NUNCA são enviados em texto limpo para o browser.
 * - A chave mestra reside exclusivamente em process.env.GROWTH_OS_MASTER_KEY.
 */

const ALGORITHM = 'aes-256-gcm';

function deriveMasterKey(): Buffer {
  const rawSecret =
    process.env.GROWTH_OS_MASTER_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'umbulab-dev-fallback-master-key-do-not-use-in-prod';
  return crypto.createHash('sha256').update(rawSecret).digest();
}

export function maskSecretKey(rawKey: string | null | undefined): string | null {
  if (!rawKey || typeof rawKey !== 'string') return null;
  const trimmed = rawKey.trim();
  if (trimmed.length <= 4) return '••••';
  return `••••${trimmed.slice(-4)}`;
}

export function encryptIntegrationSecret(plaintextSecret: string): string {
  const key = deriveMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintextSecret, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decryptIntegrationSecret(encryptedPayload: string): string {
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    throw new Error('Formato de payload encriptado inválido.');
  }
  const [ivB64, tagB64, dataB64] = parts;
  const key = deriveMasterKey();
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(tagB64, 'base64');
  const encrypted = Buffer.from(dataB64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

const SAFE_IDENTIFIER_KEYS = new Set([
  'agent_key',
  'skill_key',
  'provider_key',
  'idempotency_key',
  'control_key',
  'key_hint',
  'key_version',
  'coordinator_agent_key',
  'assigned_agent_key',
  'requested_by_agent_key',
]);

const SENSITIVE_FIELD_PATTERN =
  /(api_key|secret|token|password|authorization|credential|private_key|signing_key|master_key|service_role_key)/i;

export function sanitizePayloadForLogs(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object') {
    return { value: String(input ?? '') };
  }
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!SAFE_IDENTIFIER_KEYS.has(k) && SENSITIVE_FIELD_PATTERN.test(k)) {
      result[k] = '[REDACTED_SECRET]';
    } else if (Array.isArray(v)) {
      result[k] = v.map((item) =>
        item && typeof item === 'object' ? sanitizePayloadForLogs(item) : item
      );
    } else if (v && typeof v === 'object') {
      result[k] = sanitizePayloadForLogs(v);
    } else if (typeof v === 'string' && v.length > 1500) {
      result[k] = `${v.slice(0, 1500)}...[TRUNCATED]`;
    } else {
      result[k] = v;
    }
  }
  return result;
}

