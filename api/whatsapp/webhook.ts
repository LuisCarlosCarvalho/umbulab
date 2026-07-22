import { supabaseAdmin } from '../_utils/supabase';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await req.json();

    // Estrutura típica de webhook da Z-API para mensagens recebidas:
    // payload.phone (quem enviou a mensagem)
    // payload.text (conteúdo da mensagem)
    
    // Extraímos o telemóvel e limpamos para apenas números
    const senderPhone = payload.phone?.replace(/\D/g, '');

    if (!senderPhone) {
      return new Response(JSON.stringify({ error: 'Telefone não encontrado no payload' }), { status: 400 });
    }

    // Procura todos os follow-ups pendentes cujo telemóvel coincida ou termine nos mesmos algarismos 
    // (às vezes a Z-API envia o country code diferente, mas como guardámos o número limpo, verificamos via LIKE)
    const { error } = await supabaseAdmin
      .from('lead_followups')
      .update({ status: 'cancelled' })
      .eq('status', 'pending')
      .like('phone', `%${senderPhone.slice(-8)}%`);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, message: 'Automações canceladas com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro no webhook do Z-API:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
