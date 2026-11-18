/**
 * Catálogo Interno de Skills Especializadas — UmbuLab AI Growth OS
 * Integração de frameworks de excelência (marketing, SEO, prospeção, copywriting e ofertas).
 * Carregado exclusivamente no backend (server-side) sem expor prompts ao cliente.
 */

export interface SkillDefinition {
  skill_key: string;
  name: string;
  version: string;
  source: string;
  assigned_agent_key: string;
  description: string;
  system_instructions: string;
}

export const GROWTH_OS_SKILLS_CATALOG: Record<string, SkillDefinition> = {
  'seo-audit': {
    skill_key: 'seo-audit',
    name: 'Auditoria Técnica e On-Page de SEO',
    version: '1.0.0',
    source: 'github.com/coreyhaines31/marketingskills/seo-audit',
    assigned_agent_key: 'marketing_seo',
    description: 'Auditoria técnica, semântica e de indexação para identificar gargalos de tráfego orgânico.',
    system_instructions: `FRAMEWORK DE AUDITORIA SEO (Skill seo-audit):
- Analisa a estrutura hierárquica (Title, H1 único, H2/H3 coesos, meta descriptions orientadas a clique).
- Avalia conformidade com Core Web Vitals e renderização mobile-first.
- Identifica presença de dados estruturados (Schema.org / JSON-LD para organizações e produtos).
- Separa estritamente fatos técnicos observados de inferências sobre posicionamento.
- Produz 3 recomendações técnicas de impacto imediato priorizadas por esforço vs retorno.`,
  },
  'prospecting': {
    skill_key: 'prospecting',
    name: 'Prospeção e Qualificação B2B (ICP Scorecard)',
    version: '1.0.0',
    source: 'github.com/coreyhaines31/marketingskills/prospecting',
    assigned_agent_key: 'b2b_prospector',
    description: 'Framework de pontuação de perfil ideal de cliente (ICP) e identificação de gatilhos de compra.',
    system_instructions: `FRAMEWORK DE PROSPEÇÃO B2B (Skill prospecting):
- Define e avalia o Perfil de Cliente Ideal (ICP) considerando dimensão, setor em PT/BR e maturidade digital.
- Identifica gatilhos de compra e pontos de fricção específicos do segmento.
- Aplica rigorosa conformidade com RGPD (Portugal/UE) e LGPD (Brasil): foco em canais públicos corporativos B2B.
- Não inventa contactos pessoais ou dados privados; sinaliza claramente hipóteses de abordagem.`,
  },
  'competitor-profiling': {
    skill_key: 'competitor-profiling',
    name: 'Análise Competitiva e Matriz de Diferenciação',
    version: '1.0.0',
    source: 'github.com/coreyhaines31/marketingskills/competitor-profiling',
    assigned_agent_key: 'market_intel',
    description: 'Benchmarking de posicionamento, lacunas de concorrentes e diferenciais exclusivos.',
    system_instructions: `FRAMEWORK DE INTELIGÊNCIA COMPETITIVA (Skill competitor-profiling):
- Mapeia proposta de valor de referências no mercado versus a oferta da UmbuLab/cliente.
- Identifica lacunas na experiência do cliente (atendimento lento, tecnologia obsoleta, falta de transparência em preços).
- Define e isola 2 a 3 vantagens competitivas sustentáveis.
- Mantém neutralidade e baseia observações em atributos comprovados de mercado.`,
  },
  'copywriting': {
    skill_key: 'copywriting',
    name: 'Copywriting de Alta Conversão (PAS & Direct Response)',
    version: '1.0.0',
    source: 'github.com/coreyhaines31/marketingskills/copywriting',
    assigned_agent_key: 'creative_director',
    description: 'Engenharia de mensagens persuasivas para landing pages, anúncios e comunicação comercial.',
    system_instructions: `FRAMEWORK DE COPYWRITING (Skill copywriting):
- Aplica estruturas de resposta direta clássicas: Problema -> Agitação -> Solução (PAS) e Antes -> Depois -> Ponte (BAB).
- Redige títulos claros com foco em benefício principal mensurável (redução de custo, ganho de tempo, segurança).
- Elimina clichês genéricos de IA ('no mundo digital acelerado de hoje', 'revolucionário', 'chave na mão').
- Constrói chamadas para ação (CTAs) orientadas a valor, com quebra ativa das 3 principais objeções do cliente.`,
  },
  'offers': {
    skill_key: 'offers',
    name: 'Arquitetura de Oferta Irresistível e Unit Economics',
    version: '1.0.0',
    source: 'github.com/coreyhaines31/marketingskills/offers',
    assigned_agent_key: 'commercial_analyst',
    description: 'Estruturação de pacotes de valor elevado, inversão de risco, precificação e margem comercial.',
    system_instructions: `FRAMEWORK DE ARQUITETURA DE OFERTAS (Skill offers):
- Modela a oferta em torno do 'Dream Outcome' do cliente corporativo com o menor esforço percebido.
- Estrutura o pacote em: Entregável Central + Elementos Aceleradores + Garantia de Inversão de Risco.
- Calcula margem bruta estimada e ancoragem de preço (comparando com contratação de agência ou equipe interna).
- Toda indicação de preço é formulada como 'sugestão interna pendente de aprovação da gestão da UmbuLab'.`,
  },
};

export function resolveSkillInstructions(skillKey?: string | null): string {
  if (!skillKey) return '';
  const skill = GROWTH_OS_SKILLS_CATALOG[skillKey];
  if (!skill) return '';
  return `\n\n--- INSTRUÇÕES ESPECIALIZADAS DA SKILL [${skill.name} v${skill.version}] ---\n${skill.system_instructions}\n-------------------------------------------------------------`;
}
