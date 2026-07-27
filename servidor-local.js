/**
 * Servidor Local — Consultoria MRTN
 * Serve os arquivos do sistema e o envio de e-mail de boas-vindas.
 * (Assinatura eletrônica foi removida: o contrato é gerado e baixado em PDF.)
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
  catch (e) { console.warn('⚠ secrets.local.json não encontrado — envio de e-mail ficará inativo.'); return {}; }
})();
const EMAIL_JEFERSON = 'agenciamartinelle@gmail.com';
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

      if (req.url === '/api/boas-vindas') {
        result = await enviarBoasVindas(data);
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
