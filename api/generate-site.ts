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
    const body: any = await req.json();
    const { company_name, logo_url, business_type, number_of_pages, style, colors, description } = body;

    const fullPrompt = `You are a professional AI website builder.

CRITICAL RULES:
- You MUST generate a COMPLETE and VALID HTML document
- The output MUST start with <!DOCTYPE html>
- The output MUST include <html>, <head>, and <body>
- You MUST include Tailwind via CDN in the <head>
- You MUST NOT return broken or partial HTML
- You MUST NOT return plain text

---

GOAL:
Generate a full landing page preview for a business.

---

INPUT:
Business Name: ${company_name}
Business Type: ${business_type}
Style: ${style}
Description: ${description}

---

REQUIREMENTS:

1. STRUCTURE:
- Hero section
- About section
- Services section (3–6 items)
- Testimonials
- CTA section
- Footer

---

2. DESIGN:
- Use TailwindCSS
- Make it modern and clean
- Proper spacing and layout
- Responsive layout

---

3. HTML RULES:

- Start with:
<!DOCTYPE html>

- Include in <head>:
<script src="https://cdn.tailwindcss.com"></script>

- Wrap everything properly inside <body>

---

4. OUTPUT RULES:

- Return ONLY HTML
- No explanations
- No markdown
- No broken tags
- No escaped code

---

5. IMPORTANT:

If the HTML is not complete and valid, the task is considered FAILED.

---

FINAL INSTRUCTION:
Respond ONLY in Portuguese (Portugal).`;

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
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
