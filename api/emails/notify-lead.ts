export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { name, email, business_type, description, pdf_url } = await req.json();
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      console.error('RESEND_API_KEY não configurada');
      return new Response(JSON.stringify({ success: false, error: 'Configuração de email ausente' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const teamEmail = 'seuemail@umbulab.com';
    const senderEmail = 'onboarding@resend.dev';

    // 1. Notificar a equipe
    const teamEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Umbulab IA <${senderEmail}>`,
        to: [teamEmail],
        subject: 'Novo Lead Gerado via IA - Umbulab',
        html: `
          <h2>Novo Lead Recebido!</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Tipo de Negócio:</strong> ${business_type}</p>
          <p><strong>Descrição:</strong> ${description || 'N/A'}</p>
          ${pdf_url ? `<p><a href="${pdf_url}">Ver PDF do Projeto</a></p>` : ''}
        `
      })
    });

    // 2. Notificar o cliente
    const clientEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Umbulab <${senderEmail}>`,
        to: [email],
        subject: 'Seu site está pronto 🚀',
        html: `
          <p>Olá, ${name}!</p>
          <p>Recebemos seu pedido e já analisamos o seu projeto.</p>
          <p>Nosso time vai entrar em contato com você nas próximas horas para finalizar seu site profissional.</p>
          <p>Se quiser agilizar, pode falar diretamente conosco no WhatsApp:</p>
          <p>👉 <a href="https://wa.me/351928485483?text=${encodeURIComponent(`Olá, quero finalizar meu site IA para a empresa ${name}`)}">Falar no WhatsApp agora</a></p>
          <br>
          <p>Abraço,<br>Equipe Umbulab</p>
        `
      })
    });

    // We don't await/throw on client email error right now because onboarding@resend.dev
    // might block sending to unverified emails on the free tier. We log it instead.
    if (!clientEmailRes.ok) {
      console.warn('Erro ao enviar e-mail para o cliente (pode ser limitação do onboarding@resend.dev):', await clientEmailRes.text());
    }
    
    if (!teamEmailRes.ok) {
      throw new Error(await teamEmailRes.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Erro ao enviar email:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
