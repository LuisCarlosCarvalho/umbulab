import { supabaseAdmin } from './supabase.js';

export async function checkRateLimit(ip: string, actionType: string, maxRequests: number, windowSeconds: number): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
      p_client_ip: ip,
      p_action_type: actionType,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds
    });

    if (error) {
      console.error('Rate limit RPC error:', error);
      // Se falhar o RPC, permitir temporariamente para no bloquear trfego legtimo por erro de DB
      return true;
    }

    return data === true;
  } catch (err) {
    console.error('Rate limit exception:', err);
    return true;
  }
}
