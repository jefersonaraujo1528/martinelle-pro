import { getStore } from "@netlify/blobs";

export default async function handler(req, context) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ erro: 'Método não permitido' }), { status: 405 });
  }

  try {
    const dados = await req.json();

    // Gera ID único
    const id = crypto.randomUUID();

    // Salva no Netlify Blobs
    const store = getStore("contratos");
    await store.setJSON(id, {
      ...dados,
      criadoEm: new Date().toISOString(),
      status: 'aguardando_assinatura',
    });

    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('criar-contrato error:', e);
    return new Response(JSON.stringify({ erro: 'Erro interno' }), { status: 500 });
  }
}

export const config = { path: '/api/contratos/criar' };
