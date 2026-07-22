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

    const systemPrompt = `You are an expert web developer and designer. Your task is to generate a single-file complete HTML page for a website prototype based on the user's requirements.

CRITICAL REQUIREMENTS:
- You MUST use Tailwind CSS via CDN for styling: <script src="https://cdn.tailwindcss.com"></script>
- You MUST include a modern Google Font (like 'Inter' or 'Roboto') and apply it to the body.
- You MUST include FontAwesome via CDN for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- The design MUST be highly professional, modern, clean, conversion-focused, and fully responsive.
- Do NOT output basic or unstyled HTML. Every element must be styled with Tailwind utility classes (e.g., flex, grid, shadow-lg, rounded-xl, bg-gradient-to-r).
- Use generous spacing (padding/margins), hover effects, and transitions to make it feel like a premium, state-of-the-art website.
- Include the following sections:
  1. Header with logo and navigation
  2. Hero section with an engaging headline, description, and Call to Action (CTA) button
  3. About section
  4. Services/Features section (use a grid layout with cards and icons)
  5. Contact section (with a styled form)
  6. Footer
- The output MUST BE ONLY valid HTML code. Do NOT include markdown blocks (\`\`\`html). Just output the raw HTML string starting with <!DOCTYPE html>.
- The design style should reflect: ${style}.
- The primary colors should be based on: ${colors}.`;

    const userPrompt = `Create a prototype for my business:
- Company Name: ${company_name}
- Logo URL: ${logo_url || 'Use a text-based logo using the company name'}
- Business Type: ${business_type}
- Number of Pages / Sections desired: ${number_of_pages}
- Description: ${description}

Please output ONLY the final HTML code.`;

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

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
