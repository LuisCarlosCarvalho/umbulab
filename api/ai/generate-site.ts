import { createClient } from '@supabase/supabase-js';
import { generateSiteJson } from '../../src/lib/ai/generateSite.js';

export const config = {
  runtime: 'edge', // or nodej depending on requirements, edge is faster
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { name, email, business_type, description } = body;

    if (!name || !email || !description) {
      return new Response(JSON.stringify({ success: false, error: 'Faltam campos obrigatórios (name, email, description)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extrair o IP real do cliente (Edge-compatible)
    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';

    // Initialize Supabase (Edge-compatible, prefers server-side service role key)
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ success: false, error: 'Configuração Supabase ausente no servidor' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Verificar limite de abusos via RPC seguro (com fallback compatível)
    let isQuotaAllowed = true;
    const { data: quotaData, error: quotaRpcError } = await supabase.rpc('check_ai_generation_log_quota', {
      p_email: email,
      p_ip: ip_address,
    });

    if (!quotaRpcError && quotaData && typeof quotaData === 'object' && 'allowed' in quotaData) {
      isQuotaAllowed = Boolean((quotaData as { allowed?: boolean }).allowed);
    } else {
      const [emailRes, ipRes] = await Promise.all([
        supabase.from('ai_generation_logs').select('*', { count: 'exact', head: true }).eq('email', email),
        ip_address !== 'unknown'
          ? supabase.from('ai_generation_logs').select('*', { count: 'exact', head: true }).eq('ip_address', ip_address)
          : Promise.resolve({ count: 0, error: null }),
      ]);

      if (emailRes.error || ipRes.error) {
        console.error('Supabase Check Error:', emailRes.error || ipRes.error);
        return new Response(JSON.stringify({ success: false, error: 'Erro ao verificar limite de gerações' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if ((emailRes.count !== null && emailRes.count >= 1) || (ipRes.count !== null && ipRes.count >= 1)) {
        isQuotaAllowed = false;
      }
    }

    if (!isQuotaAllowed) {
      return new Response(JSON.stringify({ success: false, error: 'Lamentamos, mas só é possível gerar 1 projeto gratuito por cliente (IP ou Email bloqueado).' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Gerar JSON usando a Inteligência Artificial
    const result = await generateSiteJson({
      name,
      business_type: business_type || 'service',
      description,
    });

    // 3. Salvar Log (com Email e IP_ADDRESS)
    const { error: insertError } = await supabase
      .from('ai_generation_logs')
      .insert([{ email, ip_address }]);

    if (insertError) {
      console.error("Supabase Insert Log Error:", insertError);
      // Não bloqueamos o utilizador se apenas a gravação do log falhar
    }

    // 4. Retornar Sucesso
    return new Response(JSON.stringify({ 
      success: true, 
      site: result.siteData,
      prompt: result.prompt
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Erro interno no servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
