import { getStore } from "@netlify/blobs";

export default async function handler(req, context) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ erro: 'Método não permitido' }), { status: 405 });
  }

  try {
    const { id, nomeAssinante, assinatura, dataAssinatura, ip } = await req.json();

    if (!id || !assinatura || !nomeAssinante) {
      return new Response(JSON.stringify({ erro: 'Dados incompletos' }), { status: 400 });
    }

    const store = getStore("contratos");
    const dados = await store.get(id, { type: 'json' });

    if (!dados) {
      return new Response(JSON.stringify({ erro: 'Contrato não encontrado' }), { status: 404 });
    }

    if (dados.status === 'assinado') {
      return new Response(JSON.stringify({ erro: 'Contrato já foi assinado' }), { status: 409 });
    }

    // Salva o contrato com assinatura
    await store.setJSON(id, {
      ...dados,
      status: 'assinado',
      assinatura,
      nomeAssinante,
      dataAssinatura,
      ipAssinante: ip || 'desconhecido',
    });

    // Envia e-mail de notificação (se RESEND_API_KEY configurada)
    if (process.env.RESEND_API_KEY) {
      await notificarJeferson(dados, nomeAssinante, dataAssinatura);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('assinar-contrato error:', e);
    return new Response(JSON.stringify({ erro: 'Erro interno' }), { status: 500 });
  }
}

async function notificarJeferson(dados, nomeAssinante, dataAssinatura) {
  const planoNomes = {
    google: 'Google Ads Pro',
    meta: 'Meta Ads Pro',
    youtube: 'YouTube Ads Pro',
  };

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:#c9a84c">✅ Contrato Assinado!</h2>
      <p><strong>${nomeAssinante}</strong> assinou o contrato agora.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <tr><td style="padding:8px;background:#f5f5f5"><strong>Cliente</strong></td><td style="padding:8px">${dados.nome}</td></tr>
        <tr><td style="padding:8px"><strong>Plano</strong></td><td style="padding:8px">${planoNomes[dados.plano] || dados.plano}</td></tr>
        <tr><td style="padding:8px;background:#f5f5f5"><strong>Valor</strong></td><td style="padding:8px">R$ ${dados.valor}/mês</td></tr>
        <tr><td style="padding:8px"><strong>Início</strong></td><td style="padding:8px">${dados.dataInicio}</td></tr>
        <tr><td style="padding:8px;background:#f5f5f5"><strong>Assinado em</strong></td><td style="padding:8px">${new Date(dataAssinatura).toLocaleString('pt-BR')}</td></tr>
      </table>
      <p style="margin-top:16px;color:#888;font-size:13px">Agora cadastre o cliente no Asaas para emitir a cobrança.</p>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Martinelle Contratos <contratos@agenciamartinelle.com.br>',
      to: [process.env.EMAIL_JEFERSON || 'jeferson@agenciamartinelle.com.br'],
      subject: `✅ Contrato assinado — ${dados.nome}`,
      html,
    }),
  });
}

export const config = { path: '/api/contratos/assinar' };
