const TOKEN = 'dede35294c3788844ef0df69a3ca2e016ee7ac84d06bd89df3cd5e12741a6844';
const EMAIL_JEFERSON = 'agenciamartinelle@gmail.com';

const MUTATION = `mutation CreateDocument($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) {
  createDocument(document: $document, signers: $signers, file: $file) {
    document { id name signers { email action link { short_link } } }
  }
}`;

const cors = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ erro: 'Método não permitido' }) };

  try {
    const { pdfBase64, emailCliente, nomeCliente, nomeContrato } = JSON.parse(event.body);
    if (!pdfBase64 || !emailCliente) return { statusCode: 400, headers: cors, body: JSON.stringify({ erro: 'Dados incompletos' }) };

    const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];

    const operations = JSON.stringify({
      query: MUTATION,
      variables: {
        document: { name: nomeContrato || `Contrato — ${nomeCliente}`, message: `Olá ${nomeCliente}! Seu contrato com a Agência Martinelle está pronto. Você tem 48 horas para assinar.`, deadline_at: deadline, reminder: 1, notify_in: 0 },
        signers: [
          { email: emailCliente, action: 'SIGN' },
          { email: EMAIL_JEFERSON, action: 'SIGN' },
        ],
        file: null,
      },
    });

    const map = JSON.stringify({ '0': ['variables.file'] });
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const boundary = 'B' + Date.now();

    const pre = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="operations"\r\n\r\n${operations}\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="map"\r\n\r\n${map}\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="0"; filename="contrato.pdf"\r\nContent-Type: application/pdf\r\n\r\n`
    );
    const post = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([pre, pdfBuffer, post]);

    const resp = await fetch('https://api.autentique.com.br/v2/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body,
    });

    const data = await resp.json();
    if (data.errors) throw new Error(data.errors[0].message);

    const signers = data.data.createDocument.document.signers;
    const link = signers.find(s => s.email === emailCliente)?.link?.short_link || '';

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, link }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ erro: e.message }) };
  }
};
