export const config = {
  runtime: 'edge',
};

import { createClient } from '@supabase/supabase-js';

// Rate limiting simples em memória
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 5;
const ipRequests = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || (now - record.timestamp > RATE_LIMIT_WINDOW)) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Rate Limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests, please try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Extrair Bearer Token e Autenticar
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

    // 3. Payload size check
    const cloneReq = req.clone();
    const rawBody = await cloneReq.text();
    if (rawBody.length > 50000) { // Max 50KB payload
      return new Response(JSON.stringify({ error: 'Payload too large' }), { status: 413 });
    }

    const body: any = await req.json();
    const { company_name, logo_url, business_type, number_of_pages, style, colors, description } = body;

    // Simple schema validation
    if (!company_name || typeof company_name !== 'string' || company_name.length > 200) {
      return new Response(JSON.stringify({ error: 'Invalid company_name' }), { status: 400 });
    }
    if (!description || typeof description !== 'string' || description.length > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid description' }), { status: 400 });
    }

    const fullPrompt = `You are a strict HTML generator.

CRITICAL RULES:
- Output MUST be 100% valid HTML5
- ALL tags must be properly opened and closed
- NEVER output broken attributes (e.g. href without <a>)
- NEVER output partial elements
- ALWAYS validate structure before finishing
- DO NOT INCLUDE ANY SCRIPT TAGS (<script>).
- DO NOT INCLUDE INLINE EVENT HANDLERS (onclick, etc.).
- DO NOT USE javascript: PROTOCOLS.

---

REQUIRED STRUCTURE:

<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Generated Site</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <!-- FULL PAGE CONTENT -->
</body>
</html>

---

PAGE REQUIREMENTS:

- Hero section
- About section
- Services (3+ items)
- Testimonials
- CTA
- Footer

---

STRICT HTML RULES:

- All <a> tags must be complete
- All <div> must be closed
- No orphan attributes
- No text outside tags
- No malformed Tailwind classes

---

OUTPUT RULES:

- Return ONLY HTML
- No markdown
- No explanations
- No comments outside HTML

---

INPUT:
Business Name: ${company_name}
Business Type: ${business_type || 'General'}
Style: ${style || 'Modern'}
Description: ${description}
Number of Pages / Sections desired: ${number_of_pages || 1}
Logo URL: ${logo_url || 'Use a text-based logo using the company name'}
Primary Colors: ${colors || 'Blue and White'}

---

FINAL CHECK:
If the HTML is not valid, DO NOT return it. Fix it before responding.
VERY IMPORTANT: This is a NON-FUNCTIONAL visual mockup. ALL links, buttons, and form submissions MUST be disabled or have href="#".

---

Respond ONLY in Portuguese (Portugal e Brasil).`;

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("Gemini API Error:", err);
      return new Response(JSON.stringify({ error: err.error?.message || 'Failed to fetch from Gemini API' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('API Error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
