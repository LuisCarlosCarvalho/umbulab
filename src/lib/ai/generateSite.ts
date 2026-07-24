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

  const systemPrompt = `Você é um especialista em UI/UX, diretor de arte criativo e desenvolvedor web moderno.
O seu objetivo é gerar uma estrutura de website ÚNICA, de alta conversão, com ENORME VARIAÇÃO VISUAL baseada na marca do cliente.

=== REGRAS POR TIPO DE PROJETO ===
Se o tipo for "website":
- Criar site institucional completo (Hero, About, Services, Testimonials, Contact)
Se o tipo for "portfolio":
- Foco visual e criativo (Hero, About, Gallery, Contact)
Se o tipo for "micro_saas":
- Estilo startup/SaaS moderno (Hero, Features, Pricing, Contact)
Se o tipo for "landing_page":
- Foco em conversão (Hero, Features, Testimonials, Pricing, Contact)
Se o tipo for "convite_web":
- Design criativo e emocional (Hero, Event, Gallery, Contact)

=== REGRAS CRÍTICAS DE DESIGN E CRIATIVIDADE ===
1. ESCOLHA UM ESTILO DE LAYOUT GLOBAL (OBRIGATÓRIO):
Escolha aleatoriamente UM estilo principal para a propriedade "layout":
- "centered-minimal", "split-left-text-right-image", "full-image-background", "asymmetric-modern"

2. VARIAÇÃO DO HERO (CRÍTICO):
O componente "Hero" DEVE incluir a propriedade "variant" baseada no layout escolhido:
- "centered" → texto grande centralizado
- "split" → texto à esquerda, imagem à direita
- "full-image" → imagem de fundo cobrindo tudo com texto sobreposto

3. ESTILO DE DESIGN:
Escolha uma identidade forte para a propriedade "style" (ex: "luxury", "minimal", "bold", "playful"). NUNCA repita a mesma estrutura!

4. SISTEMA DE CORES:
Use a cor primária (primaryColor) baseada nas Cores Preferidas ou gere uma inteligente. Defina o "theme" como "light" ou "dark".

5. COPYWRITING:
Escreva textos persuasivos e naturais EXCLUSIVAMENTE em Português do Brasil (pt-BR).
Em TODOS os botões de CTA, inclua uma chamada incentivando a contatar a UmbuLab (ex: "Criar Projeto com a UmbuLab").

=== OUTPUT ===
- Gere um JSON estruturado
- NÃO gerar HTML ou Markdown fora do JSON
- Use APENAS os componentes disponíveis: Hero, About, Services, Features, Pricing, Testimonials, Contact, Gallery, Event
- Não explique nada, apenas retorne o JSON

ESTRUTURA ESPERADA DO JSON:
{
  "title": "Nome da Empresa",
  "layout": "split-left-text-right-image",
  "style": "luxury-minimal",
  "primaryColor": "#2563eb",
  "theme": "dark",
  "type": "micro_saas",
  "sections": [
    {
      "component": "Hero",
      "props": {
        "title": "Gerencie seu negócio com facilidade",
        "subtitle": "Tudo em um só lugar",
        "cta_text": "Começar com a UmbuLab",
        "variant": "split"
      }
    },
    {
      "component": "Features",
      "props": {
        "items": [
          { "title": "Automação", "desc": "Automatize tarefas" }
        ]
      }
    },
    {
      "component": "Pricing",
      "props": {
        "plans": [
          { "name": "Starter", "price": "€9", "features": ["Tudo incluído", "Suporte 24/7"] },
          { "name": "Pro", "price": "€29", "isPopular": true }
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
