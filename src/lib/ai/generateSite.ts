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

  const systemPrompt = `Você é um Designer Sênior de UX/UI, especialista em branding e desenvolvedor web.
Sua tarefa é gerar uma estrutura JSON estrita e altamente conversiva baseada nos dados do usuário.

REGRAS CRÍTICAS DE DESIGN E CRIATIVIDADE:
1. ANÁLISE DE MARCA & ESTILO:
- Escolha uma "primaryColor" (HEX) e um "theme" ("light" ou "dark") baseados no tipo de negócio.
- O estilo e tom de voz DEVEM ser ÚNICOS e adequados ao negócio (ex: Arquitetura = elegante/neutro, Fitness = enérgico/ousado, Tech = futurista/limpo).
- NUNCA repita a mesma estrutura ou ordem exata para sites diferentes. Varie a ordem das seções no JSON (ex: Hero -> Services -> Testimonials -> About -> Contact).

2. COPYWRITING:
- Escreva textos persuasivos, humanos e naturais. Evite frases genéricas e faça parecer uma marca real.
- MUITO IMPORTANTE: Escreva TODO o conteúdo EXCLUSIVAMENTE em Português do Brasil (pt-BR). Não misture idiomas, nem use palavras em inglês ou espanhol a menos que sejam nomes próprios.
- MUITO IMPORTANTE: Em TODOS os botões (cta_text) e descrições da seção de contato, inclua SEMPRE uma forte chamada incentivando o cliente a entrar em contato com a UmbuLab para transformar o projeto em realidade (ex: "Fale com a equipe UmbuLab e crie este projeto!").
- NUNCA use placeholders como "Lorem Ipsum".

REGRAS ESTRUTURAIS (CRÍTICO):
- NUNCA gere HTML ou Markdown fora do JSON.
- A resposta DEVE ser APENAS um objeto JSON válido.
- Você DEVE seguir estritamente as chaves abaixo para não quebrar a aplicação, mas você PODE variar o conteúdo, os textos e a ORDEM dos itens dentro de "sections":

ESTRUTURA ESPERADA DO JSON:
{
  "title": "Nome da Empresa",
  "primaryColor": "#2563eb",
  "theme": "dark",
  "sections": [
    {
      "type": "hero",
      "title": "Título principal forte",
      "subtitle": "Subtítulo atrativo",
      "cta_text": "Texto do botão"
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
      "type": "about",
      "title": "Sobre nós",
      "content": "História ou descrição persuasiva da empresa..."
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
      "type": "gallery",
      "title": "Portfólio / Galeria",
      "images": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200"
      ]
    },
    {
      "type": "contact",
      "title": "Fale Conosco",
      "email": "contato@empresa.com"
    }
  ]
}`;

  const userPrompt = `Gere a estrutura JSON do site para a seguinte empresa:
Nome: ${params.name}
Tipo de Negócio: ${params.business_type}
Descrição: ${params.description}`;

  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite'
  ];

  let lastResponse: Response | null = null;
  let allErrors: string[] = [];

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: { response_mime_type: "application/json" }
          }),
        }
      );

      if (response.ok) {
        lastResponse = response;
        break; // Sucesso! Sai do loop.
      } else {
        const errData = await response.json().catch(() => ({}));
        const errorMsg = errData.error?.message || response.statusText;
        allErrors.push(`${modelName}: ${errorMsg}`);
        console.warn(`${modelName} falhou:`, errorMsg);
      }
    } catch (e: any) {
      allErrors.push(`${modelName} Exception: ${e.message}`);
      console.warn(`${modelName} falhou com excepção:`, e.message);
    }
  }

  if (!lastResponse || !lastResponse.ok) {
    // Todos falharam. Buscar os modelos disponíveis para ajudar no debug
    let availableModels = 'Desconhecido';
    try {
      const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const modelsData = await modelsRes.json();
      availableModels = modelsData.models?.map((m: any) => m.name).join(', ') || 'Nenhum';
    } catch (e) {}
    
    throw new Error(`Falha Gemini em TODOS os modelos testados. Erros: ${allErrors.join(' | ')}. O seu plano pode estar sem quota ou a chave não é válida. Modelos: ${availableModels}`);
  }

  try {
    const data: any = await lastResponse.json();
    let rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Limpar o JSON
    rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedJson = JSON.parse(rawContent);
    return {
      siteData: parsedJson,
      prompt: `${systemPrompt}\n\n${userPrompt}`
    };
  } catch (error: any) {
    console.error("Failed to parse Gemini JSON:", error);
    throw new Error('A IA não retornou um formato de dados válido.');
  }
}
