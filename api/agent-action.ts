import { executeAgentActions, AgentAction } from './lib/executor';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { instruction, page_id } = body;

    if (!instruction || !page_id) {
      return new Response(JSON.stringify({ error: 'Missing instruction or page_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Contexto de Sistema para garantir validação e saída estruturada no Gemini
    const systemPrompt = `You are an AI editor for a JSON-structured website.
Your job is to interpret the user's natural language instruction and convert it into a strictly formatted JSON array of actions.

ALLOWED ACTION TYPES:
- replace_image: Requires 'section', 'new_url', and optionally 'id' or 'field'.
- update_text: Requires 'section', 'field', 'value', and optionally 'id'.
- delete_element: Requires 'section' and ('id' or 'field').
- add_element: Requires 'section' and 'element' (an object).

RULES:
- ONLY output a valid JSON object matching this schema:
{
  "actions": [
    {
      "type": "...", 
      "section": "...",
      "id": "...", // optional
      "field": "...", // optional
      "value": "...", // optional
      "new_url": "...", // optional
      "element": {} // optional
    }
  ]
}
- Do NOT include markdown blocks (\`\`\`json). Output RAW JSON.
- Infer the section and field based on common sense if the user is slightly vague (e.g. "change the main title" -> section: "hero", field: "title").`;

    const fullPrompt = `${systemPrompt}\n\nUSER INSTRUCTION:\n${instruction}`;

    // Chamada à API Gemini para converter a instrução em JSON estruturado
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Gemini API Error:", err);
      throw new Error(err.error?.message || 'Failed to fetch from Gemini');
    }

    const data = await response.json();
    let rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Parse the JSON
    let parsedData: { actions: AgentAction[] };
    try {
      parsedData = JSON.parse(rawContent);
    } catch (parseError) {
      throw new Error('AI returned invalid JSON: ' + rawContent);
    }

    if (!parsedData.actions || !Array.isArray(parsedData.actions)) {
      throw new Error('AI did not return an actions array');
    }

    // 2. Execution Layer - Aplicar as ações validadas no banco de dados JSON
    const executionResult = await executeAgentActions(page_id, parsedData.actions);

    if (!executionResult.success) {
      return new Response(JSON.stringify({ 
        parsed_actions: parsedData.actions, 
        error: executionResult.error 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Return final result
    return new Response(JSON.stringify({ 
      parsed_actions: parsedData.actions, 
      status: 'success',
      updated_data: executionResult.data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Agent Action API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
