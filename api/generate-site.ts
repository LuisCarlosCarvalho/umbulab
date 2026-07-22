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

    const fullPrompt = `You are a strict HTML generator.

CRITICAL RULES:
- Output MUST be 100% valid HTML5
- ALL tags must be properly opened and closed
- NEVER output broken attributes (e.g. href without <a>)
- NEVER output partial elements
- ALWAYS validate structure before finishing

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
Business Type: ${business_type}
Style: ${style}
Description: ${description}
Number of Pages / Sections desired: ${number_of_pages}
Logo URL: ${logo_url || 'Use a text-based logo using the company name'}
Primary Colors: ${colors}

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
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
