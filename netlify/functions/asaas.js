const ASAAS_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmQ2ODEyY2IwLTg5OGEtNGJhMi04MWIwLTdmZGI1YWQzY2NjMjo6JGFhY2hfMWM3NWY1YjktMTViYS00YmM4LTljNDgtNTdiNTUyMmRhM2Q3';
const BASE = 'https://www.asaas.com/api/v3';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function asaas(path, body) {
  const resp = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', access_token: ASAAS_KEY },
    body: JSON.stringify(body),
  });
  return resp.json();
}

async function criarCliente(dados) {
  const cpfCnpj = dados.documento.replace(/\D/g, '');
  const telefone = dados.telefone.replace(/\D/g, '');
  return asaas('/customers', {
    name: dados.nome,
    cpfCnpj,
    email: dados.email,
    phone: telefone,
    mobilePhone: telefone,
    notificationDisabled: false,
    externalReference: `martinelle-${Date.now()}`,
  });
}

function proximoVencimento(diaVencimento) {
  const hoje = new Date();
  let data = new Date(hoje.getFullYear(), hoje.getMonth(), parseInt(diaVencimento));
  if (data <= hoje) data.setMonth(data.getMonth() + 1);
  return data.toISOString().split('T')[0];
}

function valorNumerico(str) {
  return parseFloat((str || '0').replace(/\./g, '').replace(',', '.')) || 0;
}

export default async (req, context) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 200, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ erro: 'Método não permitido' }), { status: 405, headers });

  try {
    const dados = await req.json();
    const { pgto, valor, diaVencimento, duracao, plano, parcelas, taxaJuros,
            entrada, formEntrada, parcelasMisto, taxaJurosMisto } = dados;

    const valorBase = valorNumerico(valor);
    const dueDate = proximoVencimento(diaVencimento || '10');
    const descricao = `Taxa de Gerenciamento ${plano === 'google' ? 'Google Ads Pro' : plano === 'meta' ? 'Meta Ads Pro' : 'YouTube Ads Pro'} — Agência Martinelle`;

    // 1. Criar/buscar cliente no Asaas
    const cliente = await criarCliente(dados);
    if (cliente.errors) throw new Error(cliente.errors[0]?.description || 'Erro ao criar cliente');
    const customerId = cliente.id;

    const resultado = { customerId, cobranças: [] };

    // ─── BOLETO ───
    if (pgto === 'boleto') {
      const cobrança = await asaas('/payments', {
        customer: customerId, billingType: 'BOLETO',
        value: valorBase, dueDate, description: descricao,
        fine: { value: 2 }, interest: { value: 1 },
      });
      resultado.cobranças.push({ tipo: 'Boleto', link: cobrança.bankSlipUrl, vencimento: dueDate, valor: valorBase });
    }

    // ─── PIX ───
    else if (pgto === 'pix') {
      const cobrança = await asaas('/payments', {
        customer: customerId, billingType: 'PIX',
        value: valorBase, dueDate, description: descricao,
      });
      resultado.cobranças.push({ tipo: 'PIX', link: cobrança.invoiceUrl, vencimento: dueDate, valor: valorBase });
    }

    // ─── CARTÃO ───
    else if (pgto === 'cartao') {
      const n = parseInt(parcelas || 1);
      const taxa = parseFloat(taxaJuros || 0) / 100;

      if (n <= 1 || taxa === 0) {
        // 1x sem juros
        const cobrança = await asaas('/payments', {
          customer: customerId, billingType: 'CREDIT_CARD',
          value: valorBase, dueDate, description: descricao,
        });
        resultado.cobranças.push({ tipo: 'Cartão 1x', link: cobrança.invoiceUrl, vencimento: dueDate, valor: valorBase });
      } else {
        // Parcelado com juros — criar parcelamento no Asaas
        const parcela = valorBase * (taxa * Math.pow(1 + taxa, n)) / (Math.pow(1 + taxa, n) - 1);
        const totalComJuros = parseFloat((parcela * n).toFixed(2));
        const cobrança = await asaas('/payments', {
          customer: customerId, billingType: 'CREDIT_CARD',
          value: totalComJuros, dueDate, description: `${descricao} (${n}x)`,
          installmentCount: n, totalValue: totalComJuros,
        });
        resultado.cobranças.push({
          tipo: `Cartão ${n}x`, link: cobrança.invoiceUrl,
          vencimento: dueDate, valor: parcela, total: totalComJuros,
        });
      }
    }

    // ─── MISTO ───
    else if (pgto === 'misto') {
      const valorEntrada = valorNumerico(entrada);
      const restante = valorBase - valorEntrada;
      const tipoEntrada = formEntrada === 'pix' ? 'PIX' : 'BOLETO';

      // Cobrança de entrada
      const cobEntrada = await asaas('/payments', {
        customer: customerId, billingType: tipoEntrada,
        value: valorEntrada, dueDate,
        description: `${descricao} — Entrada`,
        fine: tipoEntrada === 'BOLETO' ? { value: 2 } : undefined,
        interest: tipoEntrada === 'BOLETO' ? { value: 1 } : undefined,
      });
      resultado.cobranças.push({
        tipo: `Entrada (${tipoEntrada === 'PIX' ? 'PIX' : 'Boleto'})`,
        link: tipoEntrada === 'PIX' ? cobEntrada.invoiceUrl : cobEntrada.bankSlipUrl,
        vencimento: dueDate, valor: valorEntrada,
      });

      // Restante no cartão
      const n = parseInt(parcelasMisto || 1);
      const taxa = parseFloat(taxaJurosMisto || 0) / 100;

      const dueDateRestante = new Date(new Date(dueDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (n <= 1 || taxa === 0) {
        const cobRestante = await asaas('/payments', {
          customer: customerId, billingType: 'CREDIT_CARD',
          value: restante, dueDate: dueDateRestante,
          description: `${descricao} — Restante`,
        });
        resultado.cobranças.push({ tipo: 'Restante Cartão 1x', link: cobRestante.invoiceUrl, vencimento: dueDateRestante, valor: restante });
      } else {
        const parcela = restante * (taxa * Math.pow(1 + taxa, n)) / (Math.pow(1 + taxa, n) - 1);
        const total = parseFloat((parcela * n).toFixed(2));
        const cobRestante = await asaas('/payments', {
          customer: customerId, billingType: 'CREDIT_CARD',
          value: total, dueDate: dueDateRestante,
          description: `${descricao} — Restante ${n}x`,
          installmentCount: n, totalValue: total,
        });
        resultado.cobranças.push({
          tipo: `Restante Cartão ${n}x`, link: cobRestante.invoiceUrl,
          vencimento: dueDateRestante, valor: parcela, total,
        });
      }
    }

    return new Response(JSON.stringify({ ok: true, ...resultado }), { status: 200, headers });

  } catch (e) {
    console.error('asaas error:', e.message);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500, headers });
  }
};

export const config = { path: '/api/asaas' };
