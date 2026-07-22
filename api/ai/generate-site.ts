import { createClient } from '@supabase/supabase-js';
import { generateSiteJson } from '../src/lib/ai/generateSite';

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

    // Initialize Supabase (Edge-compatible)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qzjzlpilmptoojuguqas.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6anpscGlsbXB0b29qdWd1cWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNDQ2NjIsImV4cCI6MjA4MjkyMDY2Mn0.z2Mv4Nzvyel0xEZrcCxmoqBwpYHmoTPTRLlJ6Ja_ujI';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Verificar limite de emails
    const { count, error: countError } = await supabase
      .from('ai_generation_logs')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    if (countError) {
      console.error("Supabase Count Error:", countError);
      return new Response(JSON.stringify({ success: false, error: 'Erro ao verificar limite de gerações' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (count !== null && count >= 2) {
      return new Response(JSON.stringify({ success: false, error: 'Limite de gerações atingido para este email' }), {
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

    // 3. Salvar Log (sem os dados do site)
    const { error: insertError } = await supabase
      .from('ai_generation_logs')
      .insert([{ email }]);

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
