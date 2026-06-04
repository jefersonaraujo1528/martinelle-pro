/**
 * Servidor Local — Agência Martinelle
 * Proxy para API do Asaas e Autentique
 *
 * Como usar:
 *   No terminal: node servidor-local.js
 *   No Claude Code: ! node servidor-local.js
 */

const http = require('http');
const https = require('https');

const ASAAS_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmQ2ODEyY2IwLTg5OGEtNGJhMi04MWIwLTdmZGI1YWQzY2NjMjo6JGFhY2hfMWM3NWY1YjktMTViYS00YmM4LTljNDgtNTdiNTUyMmRhM2Q3';
const AUTENTIQUE_TOKEN = 'dede35294c3788844ef0df69a3ca2e016ee7ac84d06bd89df3cd5e12741a6844';
const EMAIL_JEFERSON = 'agenciamartinelle@gmail.com';
const BASE_ASAAS = 'https://www.asaas.com/api/v3';
const PORT = 3765;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function venc(dia) {
  const d = new Date(), v = new Date(d.getFullYear(), d.getMonth(), parseInt(dia || 10));
  if (v <= d) v.setMonth(v.getMonth() + 1);
  return v.toISOString().split('T')[0];
}
function num(s) { return parseFloat((s || '0').replace(/\./g, '').replace(',', '.')) || 0; }
function parc(v, n, t) { return (n <= 1 || t <= 0) ? v : v * (t * Math.pow(1 + t, n)) / (Math.pow(1 + t, n) - 1); }

async function asaasAPI(path, body) {
  const data = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.asaas.com',
      path: '/api/v3' + path,
      method: 'POST',
      headers: { 'User-Agent': 'Agencia-Martinelle/1.0', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), access_token: ASAAS_KEY },
    }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function handleAsaas(body) {
  const { pgto, valor, diaVencimento, plano } = body;
  const v = num(valor), due = venc(diaVencimento);
  const pl = { google: 'Google Ads Pro', meta: 'Meta Ads Pro', youtube: 'YouTube Ads Pro' }[plano] || plano;
  const desc = `Taxa Gerenciamento ${pl} — Agência Martinelle`;

  const cli = await asaasAPI('/customers', {
    name: body.nome,
    cpfCnpj: (body.documento || '').replace(/\D/g, ''),
    email: body.email,
    notificationDisabled: false,
  });
  if (cli.errors) throw new Error(cli.errors[0].description);
  const cid = cli.id;
  const cobranças = [];

  if (pgto === 'boleto') {
    const c = await asaasAPI('/payments', { customer: cid, billingType: 'BOLETO', value: v, dueDate: due, description: desc, fine: { value: 2 }, interest: { value: 1 } });
    cobranças.push({ tipo: 'Boleto', link: c.bankSlipUrl || c.invoiceUrl, invoiceUrl: c.invoiceUrl, vencimento: due, valor: v });
  } else if (pgto === 'pix') {
    const c = await asaasAPI('/payments', { customer: cid, billingType: 'PIX', value: v, dueDate: due, description: desc });
    cobranças.push({ tipo: 'PIX', link: c.invoiceUrl, invoiceUrl: c.invoiceUrl, vencimento: due, valor: v });
  } else if (pgto === 'cartao') {
    const n = parseInt(body.parcelas || 1), t = parseFloat(body.taxaJuros || 0) / 100;
    const p = parc(v, n, t), tot = parseFloat((p * n).toFixed(2));
    const b = { customer: cid, billingType: 'CREDIT_CARD', value: tot, dueDate: due, description: desc + (n > 1 ? ` (${n}x)` : '') };
    if (n > 1) { b.installmentCount = n; b.totalValue = tot; }
    const c = await asaasAPI('/payments', b);
    cobranças.push({ tipo: n > 1 ? `Cartão ${n}x` : 'Cartão 1x', link: c.invoiceUrl, invoiceUrl: c.invoiceUrl, vencimento: due, valor: p, total: n > 1 ? tot : undefined });
  } else if (pgto === 'misto') {
    const ent = num(body.entrada), tipo = body.formEntrada === 'pix' ? 'PIX' : 'BOLETO';
    const bE = { customer: cid, billingType: tipo, value: ent, dueDate: due, description: desc + ' — Entrada' };
    if (tipo === 'BOLETO') { bE.fine = { value: 2 }; bE.interest = { value: 1 }; }
    const cE = await asaasAPI('/payments', bE);
    cobranças.push({ tipo: `Entrada (${body.formEntrada})`, link: tipo === 'PIX' ? cE.invoiceUrl : (cE.bankSlipUrl || cE.invoiceUrl), vencimento: due, valor: ent });
    const rest = v - ent, n2 = parseInt(body.parcelasMisto || 1), t2 = parseFloat(body.taxaJurosMisto || 0) / 100;
    const p2 = parc(rest, n2, t2), tot2 = parseFloat((p2 * n2).toFixed(2));
    const due2 = new Date(new Date(due).getTime() + 30 * 864e5).toISOString().split('T')[0];
    const bR = { customer: cid, billingType: 'CREDIT_CARD', value: tot2, dueDate: due2, description: desc + (n2 > 1 ? ` — Restante ${n2}x` : ' — Restante') };
    if (n2 > 1) { bR.installmentCount = n2; bR.totalValue = tot2; }
    const cR = await asaasAPI('/payments', bR);
    cobranças.push({ tipo: n2 > 1 ? `Restante Cartão ${n2}x` : 'Restante Cartão', link: cR.invoiceUrl, vencimento: due2, valor: p2, total: n2 > 1 ? tot2 : undefined });
  }

  return { ok: true, customerId: cid, cobranças };
}

const server = http.createServer(async (req, res) => {
  // CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, CORS);
    return res.end();
  }

  let body = '';
  req.on('data', c => body += c);
  req.on('end', async () => {
    try {
      const data = JSON.parse(body || '{}');
      let result;

      if (req.url === '/api/asaas') {
        result = await handleAsaas(data);
      } else {
        result = { erro: 'Endpoint não encontrado: ' + req.url };
        res.writeHead(404, CORS);
        return res.end(JSON.stringify(result));
      }

      res.writeHead(200, CORS);
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500, CORS);
      res.end(JSON.stringify({ erro: e.message }));
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('✅ Servidor Martinelle rodando em http://localhost:' + PORT);
  console.log('   Pronto para criar clientes e cobranças no Asaas!');
  console.log('   Deixe esta janela aberta enquanto usa o formulário.');
  console.log('   Para parar: Ctrl+C');
  console.log('');
});
