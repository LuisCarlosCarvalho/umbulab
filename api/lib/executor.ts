import { createClient } from '@supabase/supabase-js';

// Types para as Ações Estruturadas
export type ActionType = 'replace_image' | 'update_text' | 'delete_element' | 'add_element';

export interface AgentAction {
  type: ActionType;
  section: string;
  id?: string; // Para identificar arrays (ex: gallery items)
  field?: string; // Para identificar o campo do objeto (ex: title)
  value?: string; // Para texto
  new_url?: string; // Para imagens
  element?: any; // Para add_element
}

// Inicializa o cliente do Supabase no lado do Servidor/Vercel Edge
// Utiliza a chave de Serviço se disponível (para bypass do RLS) ou a chave anónima
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Função principal para executar uma série de ações num JSON de uma página e guardar no Supabase
 * @param pageId ID da página na tabela site_pages
 * @param actions Array de ações extraídas do LLM
 * @returns { success, data, error }
 */
export async function executeAgentActions(pageId: string, actions: AgentAction[]) {
  if (!supabaseUrl || !supabaseKey) {
    return { success: false, error: 'Credenciais Supabase ausentes no servidor.' };
  }

  try {
    // 1. Obter o estado atual do JSON da página
    const { data: pageRecord, error: fetchError } = await supabase
      .from('site_pages')
      .select('content')
      .eq('id', pageId)
      .single();

    if (fetchError || !pageRecord) {
      throw new Error(fetchError?.message || 'Página não encontrada.');
    }

    // Clone profundo para não mutar diretamente a referência original acidentalmente
    let content = JSON.parse(JSON.stringify(pageRecord.content));

    // 2. Processar cada ação sequencialmente
    for (const action of actions) {
      const { type, section, id, field, value, new_url, element } = action;

      // Segurança: Verifica se a seção existe no JSON
      if (!content[section]) {
        content[section] = {}; // Pode criar uma secção vazia ou ignorar. Vamos permitir criar.
      }

      switch (type) {
        case 'update_text':
          if (field) {
            // Ex: atualizar "hero.title"
            if (Array.isArray(content[section])) {
              // Se for array (ex: gallery), precisa do ID
              if (id) {
                const idx = content[section].findIndex((item: any) => item.id === id);
                if (idx !== -1) content[section][idx][field] = value;
              }
            } else {
              content[section][field] = value;
            }
          }
          break;

        case 'replace_image':
          if (new_url) {
            if (Array.isArray(content[section]) && id) {
              const idx = content[section].findIndex((item: any) => item.id === id);
              if (idx !== -1) content[section][idx].url = new_url;
            } else if (!Array.isArray(content[section])) {
              // Se for apenas hero.image, assumimos que o field não foi enviado e o default é "image" ou usar o "field"
              const targetField = field || 'image';
              content[section][targetField] = new_url;
            }
          }
          break;

        case 'delete_element':
          if (Array.isArray(content[section]) && id) {
            content[section] = content[section].filter((item: any) => item.id !== id);
          } else if (field && !Array.isArray(content[section])) {
            delete content[section][field];
          }
          break;

        case 'add_element':
          if (Array.isArray(content[section]) && element) {
            // Adicionar a um array (ex: nova imagem na galeria)
            // Gera um ID simples se não existir
            if (!element.id) element.id = Math.random().toString(36).substr(2, 6);
            content[section].push(element);
          } else if (field && element && !Array.isArray(content[section])) {
            content[section][field] = element;
          }
          break;
          
        default:
          console.warn(`Ação não suportada: ${type}`);
      }
    }

    // 3. Atualizar o Supabase
    const { data: updatedRecord, error: updateError } = await supabase
      .from('site_pages')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', pageId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Erro ao guardar alterações: ${updateError.message}`);
    }

    return { success: true, data: updatedRecord.content, error: null };
  } catch (err: any) {
    console.error('Executor Error:', err.message);
    return { success: false, data: null, error: err.message };
  }
}
