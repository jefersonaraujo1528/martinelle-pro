const https = require('https');

// Token fica server-side — não fica exposto no browser
const TOKEN = process.env.AUTENTIQUE_TOKEN || 'dede35294c3788844ef0df69a3ca2e016ee7ac84d06bd89df3cd5e12741a6844';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { operations, pdfBase64 } = JSON.parse(event.body || '{}');

    if (!operations || !pdfBase64) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Campos obrigatórios ausentes: operations, pdfBase64' }),
      };
    }

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const boundary = 'MartinelleBoundary' + Date.now();

    const pre = Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="operations"\r\n\r\n` +
      `${operations}\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="map"\r\n\r\n` +
      `{"0":["variables.file"]}\r\n` +
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="0"; filename="contrato.pdf"\r\n` +
      `Content-Type: application/pdf\r\n\r\n`,
      'utf8'
    );
    const post = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    const bodyBuffer = Buffer.concat([pre, pdfBuffer, post]);

    const result = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.autentique.com.br',
          path: '/v2/graphql',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': bodyBuffer.length,
          },
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error('Resposta inválida do Autentique: ' + data.slice(0, 300)));
            }
          });
        }
      );
      req.on('error', reject);
      req.write(bodyBuffer);
      req.end();
    });

    return { statusCode: 200, headers: CORS, body: JSON.stringify(result) };
  } catch (e) {
    console.error('[autentique-proxy]', e.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
