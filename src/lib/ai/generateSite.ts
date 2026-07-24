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

  const systemPrompt = `Você é um Designer Sênior de UX/UI, diretor de arte criativo e desenvolvedor web especialista.
O seu objetivo é gerar uma estrutura de website ÚNICA, de alta conversão, com ENORME VARIAÇÃO VISUAL baseada na marca do cliente.

REGRAS CRÍTICAS DE DESIGN E CRIATIVIDADE:
1. ESCOLHA UM ESTILO DE LAYOUT GLOBAL (OBRIGATÓRIO):
Escolha aleatoriamente UM estilo principal para o JSON (layout):
- "centered-minimal"
- "split-left-text-right-image"
- "full-image-background"
- "asymmetric-modern"

2. VARIAÇÃO DO HERO (CRÍTICO):
A seção "hero" DEVE incluir a propriedade "variant" baseada no layout escolhido:
- "centered" → texto grande centralizado
- "split" → texto à esquerda, imagem à direita
- "full-image" → imagem de fundo cobrindo tudo com texto sobreposto

3. ESTILO DE DESIGN:
Escolha uma identidade forte para a marca (ex: "luxury", "minimal", "bold", "playful", "corporate", "futuristic"). NUNCA repita a mesma estrutura! Cada geração DEVE parecer um site totalmente diferente.

4. SISTEMA DE CORES:
Use a cor primária (primaryColor) em formato HEX baseada na paleta do cliente ou gere uma paleta incrivelmente inteligente baseada no tipo de negócio. Defina o "theme" como "light" ou "dark".

5. COPYWRITING:
Escreva textos persuasivos, naturais e humanos. Faça parecer uma marca real.
- MUITO IMPORTANTE: Escreva TODO o conteúdo EXCLUSIVAMENTE em Português do Brasil (pt-BR).
- MUITO IMPORTANTE: Em TODOS os botões (cta ou cta_text), inclua sempre uma chamada focada em conversão incentivando o cliente a entrar em contato com a UmbuLab para transformar o projeto em realidade (ex: "Criar Projeto com a UmbuLab").
- NUNCA use "Lorem Ipsum".

REGRAS ESTRUTURAIS (CRÍTICO):
- NUNCA gere HTML ou Markdown fora do JSON.
- Retorne APENAS um objeto JSON válido.
- Siga as chaves abaixo para não quebrar a aplicação, mas VARIE o conteúdo, os textos e a ORDEM dos itens em "sections".

ESTRUTURA ESPERADA DO JSON:
{
  "title": "Nome da Empresa",
  "layout": "split-left-text-right-image",
  "style": "luxury-minimal",
  "primaryColor": "#2563eb",
  "theme": "dark",
  "sections": [
    {
      "type": "hero",
      "variant": "split",
      "headline": "Título principal épico",
      "subheadline": "Subtítulo engajador",
      "cta": "Fale com a UmbuLab"
    },
    {
      "type": "services",
      "title": "Soluções Exclusivas",
      "items": [
        { "name": "Serviço 1", "description": "Descrição do serviço 1" }
      ]
    },
    {
      "type": "about",
      "title": "A Nossa Visão",
      "content": "História persuasiva da empresa..."
    },
    {
      "type": "testimonials",
      "title": "O que dizem os clientes",
      "items": [
        { "name": "Cliente 1", "role": "CEO", "text": "Incrível!" }
      ]
    },
    {
      "type": "contact",
      "title": "Comece Agora",
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
