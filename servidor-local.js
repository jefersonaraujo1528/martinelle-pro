/**
 * Servidor Local — Consultoria MRTN
 * Proxy para API do Asaas e Autentique
 *
 * Como usar:
 *   No terminal: node servidor-local.js
 *   No Claude Code: ! node servidor-local.js
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Segredos ficam FORA do código público — em secrets.local.json (está no .gitignore).
const SECRETS = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'secrets.local.json'), 'utf8')); }
  catch (e) { console.warn('⚠ secrets.local.json não encontrado — Asaas/Autentique ficarão inativos.'); return {}; }
})();
const ASAAS_KEY = process.env.ASAAS_KEY || SECRETS.ASAAS_KEY || '';
const AUTENTIQUE_TOKEN = process.env.AUTENTIQUE_TOKEN || SECRETS.AUTENTIQUE_TOKEN || '';
const EMAIL_JEFERSON = 'agenciamartinelle@gmail.com';
const BASE_ASAAS = 'https://www.asaas.com/api/v3';
const PORT = 3765;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
      headers: { 'User-Agent': 'Consultoria-MRTN/1.0', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), access_token: ASAAS_KEY },
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
  const desc = `Taxa Gerenciamento ${pl} — Consultoria MRTN`;

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

// E-mail de boas-vindas via Resend.com (gratuito 3000/mês)
// Para ativar: criar conta em resend.com e colar a API key abaixo
const RESEND_KEY = process.env.RESEND_KEY || ''; // cole sua key aqui ou use variável de ambiente

async function enviarBoasVindas({ nomeCliente, emailCliente, plano, dataInicio, valor }) {
  if (!RESEND_KEY) {
    console.log(`[Boas-vindas] Resend não configurado. Para ativar: set RESEND_KEY=sua_key`);
    return { ok: false, msg: 'RESEND_KEY não configurada' };
  }

  const planoNome = { google: 'Google Ads Pro', meta: 'Meta Ads Pro', youtube: 'YouTube Ads Pro' }[plano] || plano;
  const data = JSON.stringify({
    from: 'Consultoria MRTN <agenciamartinelle@gmail.com>',
    to: [emailCliente],
    subject: `Boas-vindas à Consultoria MRTN — ${planoNome}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5">
        <div style="background:#0d0d0d;padding:28px 32px;text-align:center">
          <h1 style="color:#c9a84c;margin:0;font-size:22px">Consultoria MRTN</h1>
          <p style="color:#888;margin:6px 0 0;font-size:13px">Tráfego pago que gera resultados reais</p>
        </div>
        <div style="padding:32px">
          <h2 style="color:#111;margin:0 0 16px">Olá, ${nomeCliente}! 👋</h2>
          <p style="color:#444;line-height:1.6;margin-bottom:16px">
            Seu contrato com a <strong>Consultoria MRTN</strong> foi assinado com sucesso. Estamos muito felizes em ter você como cliente!
          </p>
          <div style="background:#f8f8f8;border-radius:8px;padding:18px;margin-bottom:20px">
            <p style="margin:0 0 8px;font-weight:700;color:#111">Resumo do seu pacote:</p>
            <p style="margin:4px 0;color:#444">📦 Plano: <strong>${planoNome}</strong></p>
            <p style="margin:4px 0;color:#444">💰 Investimento: <strong>R$ ${valor}/mês</strong></p>
            <p style="margin:4px 0;color:#444">📅 Início: <strong>${dataInicio}</strong></p>
          </div>
          <p style="color:#444;line-height:1.6;margin-bottom:8px"><strong>Próximos passos:</strong></p>
          <ol style="color:#444;line-height:1.8;padding-left:20px;margin-bottom:20px">
            <li>Nossa equipe entrará em contato em até <strong>48 horas</strong> para iniciar o setup</li>
            <li>Você receberá um link para acesso à sua conta e relatórios</li>
            <li>Em até <strong>15 dias úteis</strong>, suas campanhas estarão no ar</li>
          </ol>
          <p style="color:#444;line-height:1.6">Qualquer dúvida, fale conosco pelo WhatsApp ou responda este e-mail.</p>
        </div>
        <div style="background:#f5f5f5;padding:20px 32px;text-align:center;border-top:1px solid #e5e5e5">
          <p style="color:#888;font-size:12px;margin:0">Consultoria MRTN · agenciamartinelle@gmail.com · Teresina/PI</p>
          <p style="color:#888;font-size:12px;margin:4px 0 0">CNPJ 49.561.800/0001-70</p>
        </div>
      </div>
    `,
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        const r = JSON.parse(raw);
        console.log(`[Boas-vindas] E-mail enviado para ${emailCliente} — ${r.id || r.error || 'erro'}`);
        resolve({ ok: !r.error, id: r.id, erro: r.error });
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Proxy para API do Autentique (mantém token server-side)
async function handleAutentiqueProxy({ operations, pdfBase64 }) {
  if (!operations || !pdfBase64) throw new Error('operations e pdfBase64 são obrigatórios');
  const pdfBuffer = Buffer.from(pdfBase64, 'base64');
  const boundary = 'MartinelleBoundary' + Date.now();
  const pre = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="operations"\r\n\r\n${operations}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="map"\r\n\r\n{"0":["variables.file"]}\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="0"; filename="contrato.pdf"\r\nContent-Type: application/pdf\r\n\r\n`, 'utf8');
  const post = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  const bodyBuffer = Buffer.concat([pre, pdfBuffer, post]);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.autentique.com.br', path: '/v2/graphql', method: 'POST',
      headers: { Authorization: `Bearer ${AUTENTIQUE_TOKEN}`, 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': bodyBuffer.length },
    }, (r) => {
      let raw = '';
      r.on('data', c => raw += c);
      r.on('end', () => { try { resolve(JSON.parse(raw)); } catch (e) { reject(new Error('Resposta inválida: ' + raw.slice(0, 200))); } });
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, CORS);
    return res.end();
  }

  // Servir arquivos estáticos (HTML, JS, CSS, imagens)
  if (req.method === 'GET') {
    const urlPath = req.url.split('?')[0];
    const filePath = path.join(ROOT, urlPath === '/' ? '/contratos/index.html' : urlPath);
    const ext = path.extname(filePath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ct = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': ct, 'Access-Control-Allow-Origin': '*' });
      return res.end(fs.readFileSync(filePath));
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found: ' + urlPath);
  }

  let body = '';
  req.on('data', c => body += c);
  req.on('end', async () => {
    try {
      const data = JSON.parse(body || '{}');
      let result;

      if (req.url === '/api/asaas') {
        result = await handleAsaas(data);
      } else if (req.url === '/api/boas-vindas') {
        result = await enviarBoasVindas(data);
      } else if (req.url === '/api/autentique-proxy') {
        result = await handleAutentiqueProxy(data);
      } else {
        res.writeHead(404, CORS);
        return res.end(JSON.stringify({ erro: 'Endpoint não encontrado: ' + req.url }));
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
  const url = 'http://localhost:' + PORT + '/contratos/index.html';
  console.log('');
  console.log('✅ Servidor MRTN rodando!');
  console.log('');
  console.log('   📄 Contratos → ' + url);
  console.log('');
  console.log('   Abrindo navegador...');
  console.log('   (Mantenha esta janela aberta. Para parar: Ctrl+C)');
  console.log('');
  // Abre o navegador automaticamente
  exec('open "' + url + '"');
});
