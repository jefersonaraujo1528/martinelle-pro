import { getStore } from "@netlify/blobs";

export default async function handler(req, context) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ erro: 'ID não informado' }), { status: 400 });
  }

  try {
    const store = getStore("contratos");
    const dados = await store.get(id, { type: 'json' });

    if (!dados) {
      return new Response(JSON.stringify({ erro: 'Contrato não encontrado' }), { status: 404 });
    }

    // Não expor a assinatura na busca inicial
    const { assinatura, ...publico } = dados;

    return new Response(JSON.stringify(publico), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('buscar-contrato error:', e);
    return new Response(JSON.stringify({ erro: 'Erro interno' }), { status: 500 });
  }
}

export const config = { path: '/api/contratos/buscar' };
