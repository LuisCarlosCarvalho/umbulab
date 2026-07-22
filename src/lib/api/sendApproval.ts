import { supabase } from '../supabase';

export interface ApprovalData {
  email: string;
  name: string;
  business_type: string;
  data: any; // O JSON gerado
}

export async function sendApproval({ email, name, business_type, data }: ApprovalData) {
  if (!email || !name || !data) {
    throw new Error('Faltam dados obrigatórios para enviar a aprovação.');
  }

  // 1. Prevenir duplicados (Verificar se o email já enviou uma aprovação recente)
  const { count, error: countError } = await supabase
    .from('aprovacoes_usuario')
    .select('*', { count: 'exact', head: true })
    .eq('email', email);

  if (countError) {
    console.error('Erro ao verificar duplicações:', countError);
    throw new Error('Erro ao processar sua solicitação. Tente novamente.');
  }

  if (count !== null && count > 0) {
    throw new Error('Você já enviou uma solicitação');
  }

  // 2. Inserir a aprovação (Lead)
  const { error: insertError } = await supabase
    .from('aprovacoes_usuario')
    .insert([{
      email,
      name,
      business_type,
      data,
      status: 'novo',
    }]);

  if (insertError) {
    console.error('Erro ao gravar aprovação:', insertError);
    throw new Error('Não foi possível gravar a sua solicitação no momento.');
  }

  // 3. Opcional (Bónus): Inserir na tabela de mensagens
  const { error: msgError } = await supabase
    .from('mensagens')
    .insert([{
      conteudo: 'Novo lead gerado via IA',
      tipo: 'lead',
      email, // Associar o email para fácil identificação
    }]);

  if (msgError) {
    // Apenas logamos o erro, não falhamos a transação principal por causa disto
    console.warn('Não foi possível gravar na tabela mensagens (opcional):', msgError);
  }

  return { success: true };
}
