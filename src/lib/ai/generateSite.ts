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
⚠️ REGRA PRINCIPAL (CRÍTICA)
========================================
O conteúdo VISUAL e TEXTUAL deve refletir EXATAMENTE o que foi descrito pelo usuário.
- Se o usuário menciona "arte detalhada", o design DEVE parecer artístico e focar em portfólio.
- Adapte a linguagem ao nicho. NÃO USE linguagem corporativa genérica se for um portfólio.

========================================
🧠 INTERPRETAÇÃO INTELIGENTE
========================================
1. Identifique o nicho e o estilo (artístico, corporativo, tech, minimalista).
2. Adapte TODAS as seções. O HERO é a parte MAIS importante e deve refletir fielmente o nicho.
3. Para "portfolio", o Hero DEVE ter linguagem visual/emocional e DEVE existir a seção "Projects".

========================================
🎨 REGRAS DE ESTRUTURA VISUAL (OBRIGATÓRIO)
========================================
1. ESCOLHA UM LAYOUT GLOBAL: "centered-minimal", "split-left-text-right-image", "full-image-background", ou "asymmetric-modern".
2. VARIAÇÃO DO HERO: O "Hero" DEVE ter a propriedade "variant" ("centered", "split", ou "full-image") de acordo com o layout.
3. CORES: Defina a cor primária (primaryColor) em HEX e o "theme" ("light" ou "dark").
4. COPYWRITING: Português do Brasil (pt-BR). Os CTAs devem incentivar o contato com a UmbuLab.

========================================
📦 COMPONENTES DISPONÍVEIS
========================================
Use apenas: Hero, About, Projects, Gallery, Features, Pricing, Testimonials, Contact, Event

========================================
📤 FORMATO DE SAÍDA
========================================
Retorne APENAS JSON válido, sem markdown extra.

ESTRUTURA ESPERADA:
{
  "title": "Nome da Empresa",
  "layout": "split-left-text-right-image",
  "style": "artistic",
  "primaryColor": "#2563eb",
  "theme": "dark",
  "type": "portfolio",
  "sections": [
    {
      "component": "Hero",
      "props": {
        "title": "Ilustrações hiper-realistas com precisão nos detalhes",
        "subtitle": "Transformando ideias em arte viva",
        "cta_text": "Criar Projeto com a UmbuLab",
        "variant": "full-image"
      }
    },
    {
      "component": "Projects",
      "props": {
        "title": "Trabalhos Recentes",
        "items": [
          { "title": "Retrato Realista", "category": "Ilustração", "description": "Lápis sobre papel." }
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
