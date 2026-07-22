import { supabaseAdmin } from '../_utils/supabase';
import { sendZApiMessage } from '../_utils/zapi';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { leadId, name, phone } = await req.json();

    if (!leadId || !name || !phone) {
      return new Response(JSON.stringify({ error: 'Dados insuficientes' }), { status: 400 });
    }

    // 1. Mensagem Imediata
    const firstName = name.split(' ')[0];
    const initialMessage = `Fala ${firstName}! 👋\n\nVi que você gerou um site com a nossa IA — ficou muito bom!\n\nSe quiser, podemos deixar ele 100% pronto e profissional pra você.\n\nQuer que eu te mostre como ele ficaria finalizado? 🚀`;
    
    await sendZApiMessage(phone, initialMessage);

    // 2. Registar os Follow-ups na BD para 1h e 24h
    const now = new Date();
    const in1Hour = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const followups = [
      {
        lead_id: leadId,
        phone,
        step: '1h',
        status: 'pending',
        scheduled_for: in1Hour.toISOString()
      },
      {
        lead_id: leadId,
        phone,
        step: '24h',
        status: 'pending',
        scheduled_for: in24Hours.toISOString()
      }
    ];

    await supabaseAdmin.from('lead_followups').insert(followups);

    // 3. Agendar via QStash
    const qstashToken = process.env.QSTASH_TOKEN;
    if (qstashToken) {
      const baseUrl = process.env.VITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.get('host')}`;
      
      // Agenda 1h
      await fetch(`https://qstash.upstash.io/v2/publish/${baseUrl}/api/whatsapp/follow-up`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qstashToken}`,
          'Content-Type': 'application/json',
          'Upstash-Delay': '1h'
        },
        body: JSON.stringify({ leadId, step: '1h' })
      });

      // Agenda 24h
      await fetch(`https://qstash.upstash.io/v2/publish/${baseUrl}/api/whatsapp/follow-up`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qstashToken}`,
          'Content-Type': 'application/json',
          'Upstash-Delay': '24h'
        },
        body: JSON.stringify({ leadId, step: '24h' })
      });
    } else {
      console.warn('QSTASH_TOKEN not found. Schedules inserted in DB but QStash not triggered.');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro no on-lead-created:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
