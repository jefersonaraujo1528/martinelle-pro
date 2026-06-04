const ASAAS_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmQ2ODEyY2IwLTg5OGEtNGJhMi04MWIwLTdmZGI1YWQzY2NjMjo6JGFhY2hfMWM3NWY1YjktMTViYS00YmM4LTljNDgtNTdiNTUyMmRhM2Q3';
const BASE = 'https://www.asaas.com/api/v3';

const cors = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function api(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', access_token: ASAAS_KEY },
    body: JSON.stringify(body),
  });
  return r.json();
}

function vencimento(dia) {
  const d = new Date();
  let v = new Date(d.getFullYear(), d.getMonth(), parseInt(dia || 10));
  if (v <= d) v.setMonth(v.getMonth() + 1);
  return v.toISOString().split('T')[0];
}

function num(s) { return parseFloat((s || '0').replace(/\./g, '').replace(',', '.')) || 0; }

function jurosParcela(valor, n, taxa) {
  if (n <= 1 || taxa <= 0) return valor;
  return valor * (taxa * Math.pow(1 + taxa, n)) / (Math.pow(1 + taxa, n) - 1);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ erro: 'Método não permitido' }) };

  try {
    const d = JSON.parse(event.body);
    const valorBase = num(d.valor);
    const dueDate = vencimento(d.diaVencimento);
    const planoNome = d.plano === 'google' ? 'Google Ads Pro' : d.plano === 'meta' ? 'Meta Ads Pro' : 'YouTube Ads Pro';
    const descricao = `Taxa de Gerenciamento ${planoNome} — Agência Martinelle`;

    // Criar cliente
    const cli = await api('/customers', {
      name: d.nome,
      cpfCnpj: d.documento.replace(/\D/g, ''),
      email: d.email,
      phone: d.telefone.replace(/\D/g, ''),
      mobilePhone: d.telefone.replace(/\D/g, ''),
      notificationDisabled: false,
    });
    if (cli.errors) throw new Error(cli.errors[0]?.description || 'Erro ao criar cliente no Asaas');
    const cid = cli.id;

    const cobranças = [];

    if (d.pgto === 'boleto') {
      const c = await api('/payments', { customer: cid, billingType: 'BOLETO', value: valorBase, dueDate, description: descricao, fine: { value: 2 }, interest: { value: 1 } });
      cobranças.push({ tipo: 'Boleto', link: c.bankSlipUrl || c.invoiceUrl, vencimento: dueDate, valor: valorBase });
    }

    else if (d.pgto === 'pix') {
      const c = await api('/payments', { customer: cid, billingType: 'PIX', value: valorBase, dueDate, description: descricao });
      cobranças.push({ tipo: 'PIX', link: c.invoiceUrl, vencimento: dueDate, valor: valorBase });
    }

    else if (d.pgto === 'cartao') {
      const n = parseInt(d.parcelas || 1);
      const taxa = parseFloat(d.taxaJuros || 0) / 100;
      const parcela = jurosParcela(valorBase, n, taxa);
      const total = parseFloat((parcela * n).toFixed(2));
      const c = await api('/payments', { customer: cid, billingType: 'CREDIT_CARD', value: total, dueDate, description: descricao + (n > 1 ? ` (${n}x)` : ''), installmentCount: n > 1 ? n : undefined, totalValue: n > 1 ? total : undefined });
      cobranças.push({ tipo: n > 1 ? `Cartão ${n}x com juros` : 'Cartão 1x', link: c.invoiceUrl, vencimento: dueDate, valor: parcela, total: n > 1 ? total : undefined });
    }

    else if (d.pgto === 'misto') {
      const valorEnt = num(d.entrada);
      const tipoEnt = d.formEntrada === 'pix' ? 'PIX' : 'BOLETO';
      const cEnt = await api('/payments', { customer: cid, billingType: tipoEnt, value: valorEnt, dueDate, description: descricao + ' — Entrada', fine: tipoEnt === 'BOLETO' ? { value: 2 } : undefined, interest: tipoEnt === 'BOLETO' ? { value: 1 } : undefined });
      cobranças.push({ tipo: `Entrada (${d.formEntrada?.toUpperCase()})`, link: tipoEnt === 'PIX' ? cEnt.invoiceUrl : (cEnt.bankSlipUrl || cEnt.invoiceUrl), vencimento: dueDate, valor: valorEnt });

      const restante = valorBase - valorEnt;
      const n = parseInt(d.parcelasMisto || 1);
      const taxa = parseFloat(d.taxaJurosMisto || 0) / 100;
      const parcela = jurosParcela(restante, n, taxa);
      const total = parseFloat((parcela * n).toFixed(2));
      const d2 = new Date(new Date(dueDate).getTime() + 30 * 864e5).toISOString().split('T')[0];
      const cRest = await api('/payments', { customer: cid, billingType: 'CREDIT_CARD', value: total, dueDate: d2, description: descricao + ` — Restante${n > 1 ? ` ${n}x` : ''}`, installmentCount: n > 1 ? n : undefined, totalValue: n > 1 ? total : undefined });
      cobranças.push({ tipo: n > 1 ? `Restante Cartão ${n}x` : 'Restante Cartão 1x', link: cRest.invoiceUrl, vencimento: d2, valor: parcela, total: n > 1 ? total : undefined });
    }

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, customerId: cid, cobranças }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ erro: e.message }) };
  }
};
