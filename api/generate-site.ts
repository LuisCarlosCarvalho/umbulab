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
    const { company_name, logo_url, business_type, number_of_pages, style, colors, description } = body;

    const fullPrompt = `You are an AI Website Builder similar to Lovable, Framer AI, or Webflow AI.

IMPORTANT:
- You MUST generate a complete, visually structured landing page in HTML
- The output MUST be clean HTML (no explanations)
- The design must look modern, premium, and ready for a real business
- Use sections, spacing, colors, and hierarchy like a professional designer

---

GOAL:
Generate a full landing page preview based on the user input.

---

INPUT DATA:
Business Name: ${company_name}
Business Type: ${business_type}
Style: ${style}
Description: ${description}
Number of Pages / Sections desired: ${number_of_pages}
Logo URL: ${logo_url || 'Use a text-based logo using the company name'}
Primary Colors: ${colors}

---

INSTRUCTIONS:

1. Build a COMPLETE landing page including:

- Hero section (title, subtitle, CTA button)
- About section
- Services or Products section (3–6 items)
- Testimonials section (fake but realistic)
- Call to Action section
- Footer

---

2. DESIGN RULES:

- Use modern UI/UX design
- Use TailwindCSS classes for styling (include <script src="https://cdn.tailwindcss.com"></script>)
- Add FontAwesome for icons (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">)
- Include a modern Google Font (like 'Inter' or 'Roboto')
- Add spacing, padding, and good typography
- Use a clean color palette based on the business type
- Make it visually appealing like a real startup website
- VERY IMPORTANT: This is a NON-FUNCTIONAL visual mockup. ALL links, buttons, and form submissions MUST be disabled or have href="#".

---

3. CONTENT RULES:

- Generate realistic and persuasive text
- Adapt tone based on business type (e.g. corporate, creative, tech)
- DO NOT use placeholders like "lorem ipsum"

---

4. OUTPUT FORMAT:

- Return ONLY HTML
- Do NOT explain anything
- Do NOT use markdown
- Do NOT wrap in \`\`\`html

---

5. EXTRA:

- Add hover effects on buttons
- Add simple animations (optional Tailwind)
- Make it feel like a real product demo

---

FINAL RULE:
The result must impress a client visually.`;

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
