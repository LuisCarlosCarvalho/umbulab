import { supabaseAdmin } from '../_utils/supabase';
import { sendZApiMessage } from '../_utils/zapi';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // O QStash envia a signature para validação (opcional mas recomendado em prod)
  // Para manter simples nesta fase, omitimos a validação strict do token.

  try {
    const body = await req.json();
    const { leadId, step } = body;

    if (!leadId || !step) {
      return new Response(JSON.stringify({ error: 'Dados insuficientes' }), { status: 400 });
    }

    // 1. Obter o Lead e o Agendamento
    const { data: followup, error: followupError } = await supabaseAdmin
      .from('lead_followups')
      .select('*, aprovacoes_usuario(name)')
      .eq('lead_id', leadId)
      .eq('step', step)
      .eq('status', 'pending')
      .single();

    if (followupError || !followup) {
      // Se não encontrou ou status já não for 'pending' (foi cancelled por resposta), aborta
      return new Response(JSON.stringify({ success: true, message: 'Follow-up cancelado ou inexistente.' }), { status: 200 });
    }

    const { phone } = followup;
    const name = (followup as any).aprovacoes_usuario?.name || 'Cliente';
    const firstName = name.split(' ')[0];

    // 2. Definir a Mensagem
    let message = '';
    if (step === '1h') {
      message = `Oi ${firstName}, passando aqui rapidinho 🙂\n\nSeu site ainda está disponível para finalização.\n\nNormalmente conseguimos entregar em até 48h.\n\nQuer ver uma versão final antes de decidir?`;
    } else if (step === '24h') {
      message = `Última mensagem, ${firstName} 👇\n\nEstamos com algumas vagas abertas hoje para novos projetos.\n\nSe quiser garantir o seu site, esse é o melhor momento 🙂\n\nPosso te explicar como funciona?`;
    } else {
      return new Response(JSON.stringify({ error: 'Step inválido' }), { status: 400 });
    }

    // 3. Enviar via Z-API
    const success = await sendZApiMessage(phone, message);

    if (success) {
      // 4. Marcar como enviado
      await supabaseAdmin
        .from('lead_followups')
        .update({ status: 'sent' })
        .eq('id', followup.id);
    } else {
      throw new Error('Falha ao enviar via Z-API');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro no follow-up:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
