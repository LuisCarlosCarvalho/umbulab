import { supabase } from '../supabase';

export interface ApprovalData {
  email: string;
  name: string;
  business_type: string;
  data: any; // O JSON gerado
  prompt: string;
  pdfBlob: Blob;
}

export async function sendApproval({ email, name, business_type, data, prompt, pdfBlob }: ApprovalData) {
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

  // 2. Fazer Upload do PDF para Storage
  const fileName = `${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('projetos')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true
    });
    
  if (uploadError) {
    console.error('Erro ao fazer upload do PDF:', uploadError);
    // Podemos falhar ou apenas logar e continuar sem o PDF
  }
  
  let pdfUrl = null;
  if (uploadData?.path) {
    const { data: publicUrlData } = supabase.storage
      .from('projetos')
      .getPublicUrl(uploadData.path);
    pdfUrl = publicUrlData?.publicUrl;
  }

  // 3. Inserir a aprovação (Lead)
  const { error: insertError } = await supabase
    .from('aprovacoes_usuario')
    .insert([{
      email,
      name,
      business_type,
      data,
      status: 'novo',
      prompt,
      pdf_url: pdfUrl
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

  // 4. Notificar via E-mail
  try {
    await fetch('/api/emails/notify-lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        business_type,
        description: data?.description || '',
        pdf_url: pdfUrl
      })
    });
  } catch (emailError) {
    console.error('Erro ao chamar API de e-mail:', emailError);
    // Não falhamos a geração do lead por falha de e-mail
  }

  return { success: true };
}
