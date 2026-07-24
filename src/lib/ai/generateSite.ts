export interface GenerateSiteParams {
  name: string;
  business_type: string;
  description: string;
  color_palette?: string;
}

export async function generateSiteJson(params: GenerateSiteParams) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não está configurada');
  }

  const systemPrompt = `Você é um especialista em UI/UX, branding e arquitetura de sites.
Sua tarefa é gerar um JSON estruturado para montar um site REALISTA e altamente relevante com base no contexto fornecido.

========================================
⚠️ 1. INTENÇÃO DO PROJETO (CRÍTICO)
========================================
A IA deve interpretar profundamente a descrição do usuário e NÃO criar algo genérico.
- Se for arte/desenho: Deve parecer artístico, impactante, foco 100% visual.
- Se for Micro SaaS: Tech, startup, limpo.
- Se for Landing Page: Conversão bruta, CTAs fortes, copywriting persuasivo.
NÃO use textos corporativos genéricos. O preview tem de causar DESEJO imediato.

========================================
🎨 2. ESTILO VISUAL FORÇADO E TEMA
========================================
- O estilo DEVE refletir o tipo de projeto (ex: "artistic", "tech", "corporate", "minimal").
- O tom ("tone") DEVE refletir a emoção (ex: "premium", "creative", "bold").
- CORES: Defina a cor primária (primaryColor) em HEX. **MUITO IMPORTANTE:** Se o usuário fornecer "Cores Preferidas", a primaryColor DEVE OBRIGATORIAMENTE ser a conversão exata da cor principal solicitada para HEX.
- TEMA: Defina "theme" ("light" ou "dark"). **DICA:** Em 99% das vezes, use "dark" para garantir um aspeto Premium.
- COPYWRITING: Português do Brasil (pt-BR). Os CTAs devem incentivar o contato com a UmbuLab.

========================================
🚀 3. HERO COM EFEITO "WOW" (PRIORIDADE MÁXIMA)
========================================
O Hero precisa vender o projeto sozinho.
- Título forte, direto e extremamente específico (NUNCA genérico).
- Subtítulo que reforça o diferencial brutal da ideia.
- O layout do Hero DEVE ter a propriedade "variant" ("centered", "split", ou "full-image").
Se o Hero for genérico, o projeto falhou.

========================================
📦 4. COMPONENTES DISPONÍVEIS
========================================
Use APENAS: Hero, About, Projects, Gallery, Features, Pricing, Testimonials, Contact, Event

========================================
🖼️ 5. IMAGENS REAIS E IMPACTANTES
========================================
Para componentes como Hero e Projects, gere imagens REAIS e relevantes usando a API do Pollinations.ai.
- Adicione a propriedade "imageUrl" nos "props" desses componentes.
- A URL DEVE seguir este formato exato: "https://image.pollinations.ai/prompt/{termo_em_ingles_bem_descritivo}?width=1200&height=800&nologo=true&enhance=true"
- Exemplo para um retrato hiper-realista: "https://image.pollinations.ai/prompt/hyper%20realistic%20pencil%20drawing%20portrait%20masterpiece?width=1200&height=800&nologo=true&enhance=true"
- NUNCA use URLs aleatórias inventadas (como imgur ou unsplash hashes falsos).

========================================
📤 6. FORMATO DE SAÍDA ESTRUTURADO
========================================
Retorne APENAS JSON válido, sem markdown extra.

ESTRUTURA ESPERADA:
{
  "title": "Nome da Empresa",
  "layout": "split-left-text-right-image",
  "style": "artistic",
  "tone": "premium",
  "primaryColor": "#2563eb",
  "theme": "dark",
  "type": "portfolio",
  "sections": [
    {
      "component": "Hero",
      "props": {
        "title": "Ilustrações hiper-realistas",
        "subtitle": "Transformando ideias em arte viva",
        "cta_text": "Criar Projeto",
        "variant": "split",
        "imageUrl": "https://image.pollinations.ai/prompt/hyper%20realistic%20pencil%20drawing%20portrait?width=1200&height=800&nologo=true"
      }
    },
    {
      "component": "Projects",
      "props": {
        "title": "Trabalhos Recentes",
        "items": [
          { 
            "title": "Retrato Realista", 
            "category": "Ilustração", 
            "description": "Lápis sobre papel.",
            "imageUrl": "https://image.pollinations.ai/prompt/pencil%20sketch%20of%20a%20human%20eye%20macro%20realistic?width=800&height=600&nologo=true"
          }
        ]
      }
    }
  ]
}`;

  const colorInfo = params.color_palette ? `\nCores Preferidas: ${params.color_palette}` : '';

  const userPrompt = `Gere a estrutura JSON do site para a seguinte empresa:
Nome: ${params.name}
Tipo de Negócio: ${params.business_type}${colorInfo}
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
