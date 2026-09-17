import { executeAgentActions, AgentAction } from './lib/executor.js';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from './_utils/rate-limit.js';

export const maxDuration = 60;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  // 10 requests per 60 seconds
  const isAllowed = await checkRateLimit(ip, 'agent-action', 10, 60);
  
  if (!isAllowed) {
    return new Response(JSON.stringify({ error: 'Too many requests, please try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Extrair Bearer Token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];

    // 3. Obter utilizador atual via token para validação de Auth
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseAnonKey) {
       return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 4. Ler Payload e validar limite
    const cloneReq = req.clone();
    const rawBody = await cloneReq.text();
    if (rawBody.length > 100000) { // Max 100KB payload
      return new Response(JSON.stringify({ error: 'Payload too large' }), { status: 413 });
    }

    const body: any = await req.json();
    const { instruction, page_id } = body;

    if (!instruction || typeof instruction !== 'string' || instruction.length > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid or missing instruction' }), { status: 400 });
    }
    
    if (!page_id || typeof page_id !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid page_id' }), { status: 400 });
    }

    // 5. Validar explicitamente Ownership do page_id antes da IA e da execução
    // Tentamos buscar a página com o cliente autenticado que respeita RLS
    // Se a página não retornar, significa que o RLS bloqueou (não tem permissões) ou não existe.
    const { data: pageRecord, error: pageError } = await supabase
      .from('site_pages')
      .select('id')
      .eq('id', page_id)
      .maybeSingle();
      
    if (pageError || !pageRecord) {
      return new Response(JSON.stringify({ error: 'Page not found or you do not have permission to edit it.' }), { status: 403 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), { status: 500 });
    }

    // Contexto de Sistema
    const systemPrompt = `You are an AI editor for a JSON-structured website.
Your job is to interpret the user's natural language instruction and convert it into a strictly formatted JSON array of actions.

ALLOWED ACTION TYPES:
- replace_image: Requires 'section', 'new_url', and optionally 'id' or 'field'.
- update_text: Requires 'section', 'field', 'value', and optionally 'id'.
- delete_element: Requires 'section' and ('id' or 'field').
- add_element: Requires 'section' and 'element' (an object).

RULES:
- ONLY output a valid JSON object matching this schema exactly. DO NOT invent action types.
{
  "actions": [
    {
      "type": "...", 
      "section": "...",
      "id": "...", 
      "field": "...", 
      "value": "...", 
      "new_url": "...", 
      "element": {} 
    }
  ]
}
- Do NOT include markdown blocks (\`\`\`json). Output RAW JSON.
- Infer the section and field based on common sense if the user is slightly vague.`;

    const fullPrompt = `${systemPrompt}\n\nUSER INSTRUCTION:\n${instruction}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        }),
      }
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'AI generation failed' }), { status: 500 });
    }

    const data: any = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    let parsedData: { actions: AgentAction[] };
    try {
      parsedData = JSON.parse(rawContent.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (parseError) {
      return new Response(JSON.stringify({ error: 'AI returned invalid structured output' }), { status: 500 });
    }

    if (!parsedData.actions || !Array.isArray(parsedData.actions)) {
      return new Response(JSON.stringify({ error: 'AI output missing actions array' }), { status: 500 });
    }

    // 6. Validar Ações do Schema
    const allowedActions = ['replace_image', 'update_text', 'delete_element', 'add_element'];
    for (const action of parsedData.actions) {
       if (!allowedActions.includes(action.type)) {
           return new Response(JSON.stringify({ error: `Invalid action type returned by AI: ${action.type}` }), { status: 500 });
       }
       if (!action.section || typeof action.section !== 'string') {
           return new Response(JSON.stringify({ error: 'Invalid or missing section in AI output' }), { status: 500 });
       }
    }

    // 7. Execution Layer - Pass the auth header to the executor
    const executionResult = await executeAgentActions(page_id, parsedData.actions, authHeader);

    if (!executionResult.success) {
      return new Response(JSON.stringify({ 
        parsed_actions: parsedData.actions, 
        error: executionResult.error 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      parsed_actions: parsedData.actions, 
      status: 'success',
      updated_data: executionResult.data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Agent Action API Error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
