export interface GenerateSiteParams {
  name: string;
  business_type: string;
  description: string;
}

export async function generateSiteJson(params: GenerateSiteParams) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não está configurada');
  }

  const systemPrompt = `Você é um Arquiteto e Desenvolvedor de Software Especialista. 
Sua tarefa é gerar uma estrutura JSON estrita representando um website.

REGRAS CRÍTICAS:
- NUNCA gere HTML.
- NUNCA gere Markdown fora do JSON.
- A resposta DEVE ser APENAS um objeto JSON válido.
- O JSON deve usar a estrutura de seções pedida.

ESTRUTURA ESPERADA DO JSON:
{
  "title": "Nome da Empresa",
  "sections": [
    {
      "type": "hero",
      "title": "Título principal forte",
      "subtitle": "Subtítulo atrativo",
      "cta_text": "Texto do botão"
    },
    {
      "type": "about",
      "title": "Sobre nós",
      "content": "História ou descrição da empresa..."
    },
    {
      "type": "services",
      "title": "Nossos Serviços",
      "items": [
        { "name": "Serviço 1", "description": "Descrição do serviço" },
        { "name": "Serviço 2", "description": "Descrição do serviço" },
        { "name": "Serviço 3", "description": "Descrição do serviço" }
      ]
    },
    {
      "type": "gallery",
      "title": "Portfólio / Galeria",
      "images": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200"
      ]
    },
    {
      "type": "testimonials",
      "title": "O que dizem sobre nós",
      "items": [
        { "name": "Cliente 1", "role": "CEO", "text": "Muito bom!" },
        { "name": "Cliente 2", "role": "Gerente", "text": "Excelente serviço." }
      ]
    },
    {
      "type": "contact",
      "title": "Fale Conosco",
      "email": "contato@empresa.com"
    }
  ]
}

Seja criativo e persuasivo nos textos.
Crie textos realistas baseados nos dados fornecidos. 
NÃO use placeholders como "Lorem Ipsum".`;

  const userPrompt = `Gere a estrutura JSON do site para a seguinte empresa:
Nome: ${params.name}
Tipo de Negócio: ${params.business_type}
Descrição: ${params.description}

Responda APENAS com o JSON final, sem formatação markdown extra.`;

  try {
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
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            response_mime_type: "application/json",
          }
        }),
      }
    );

    if (!response.ok) {
      const err: any = await response.json();
      console.error("Gemini API Error:", err);
      throw new Error(`Falha Gemini: ${err.error?.message || response.statusText || 'Erro desconhecido'}`);
    }

    const data: any = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    try {
      const parsedJson = JSON.parse(rawContent);
      return {
        siteData: parsedJson,
        prompt: `${systemPrompt}\n\n${userPrompt}`
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", rawContent);
      throw new Error('A IA não retornou um formato de dados válido.');
    }
  } catch (apiError: any) {
    console.error("Gemini API Error:", apiError);
    console.log("Debug: If this fails continuously, check if your API key has access to 'gemini-1.5-flash' via Google AI Studio.");
    throw new Error(`Falha Gemini: ${apiError.message || 'Erro desconhecido'}`);
  }
}
