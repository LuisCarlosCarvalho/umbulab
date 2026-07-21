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

    const systemPrompt = `You are an expert web developer and designer. Your task is to generate a single-file complete HTML page with embedded CSS for a website prototype based on the user's requirements.

REQUIREMENTS:
- The design must be modern, clean, conversion-focused, and fully responsive.
- It must include:
  1. Header with logo and navigation
  2. Hero section with CTA (Call to Action)
  3. About section
  4. Services section
  5. Contact section
  6. Footer
- The output MUST BE ONLY valid HTML code. 
- Do NOT include markdown blocks (\`\`\`html). Just output the raw HTML string.
- Use embedded CSS (<style>) inside the <head>.
- Do NOT use external CSS frameworks, just plain CSS or a lightweight CDN if absolutely necessary, but prefer writing all styles within the file to ensure it works isolated.
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Failed to fetch from Gemini');
    }

    const data = await response.json();
    let generatedHtml = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Remove markdown code blocks if the model included them despite instructions
    generatedHtml = generatedHtml.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();

    return new Response(JSON.stringify({ html: generatedHtml, prompt: userPrompt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
