const TOKEN = 'dede35294c3788844ef0df69a3ca2e016ee7ac84d06bd89df3cd5e12741a6844';
const EMAIL_JEFERSON = 'agenciamartinelle@gmail.com';

const MUTATION = `
  mutation CreateDocument($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) {
    createDocument(document: $document, signers: $signers, file: $file) {
      document {
        id
        name
        signers {
          email
          action
          link { short_link }
        }
      }
    }
  }
`;

export default async (req, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ erro: 'Método não permitido' }), { status: 405, headers });
  }

  try {
    const { pdfBase64, emailCliente, nomeCliente, nomeContrato } = await req.json();

    if (!pdfBase64 || !emailCliente || !nomeCliente) {
      return new Response(JSON.stringify({ erro: 'Dados incompletos' }), { status: 400, headers });
    }

    // Prazo: 48 horas
    const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];

    const operations = JSON.stringify({
      query: MUTATION,
      variables: {
        document: {
          name: nomeContrato || `Contrato — ${nomeCliente}`,
          message: `Olá ${nomeCliente}! Seu contrato com a Agência Martinelle está pronto para assinatura. Você tem 48 horas para assinar.`,
          deadline_at: deadline,
          reminder: 1,
          notify_in: 0,
        },
        signers: [
          { email: emailCliente, action: 'SIGN', positions: [{ x: '60', y: '75', z: '1', element: 'signature' }] },
          { email: EMAIL_JEFERSON, action: 'SIGN', positions: [{ x: '10', y: '75', z: '1', element: 'signature' }] },
        ],
        file: null,
      },
    });

    const map = JSON.stringify({ '0': ['variables.file'] });
    const pdfBuffer = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    const boundary = 'Boundary' + Date.now();
    const encoder = new TextEncoder();

    const headerPart = encoder.encode(
      `--${boundary}\r\nContent-Disposition: form-data; name="operations"\r\n\r\n${operations}\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="map"\r\n\r\n${map}\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="0"; filename="contrato.pdf"\r\nContent-Type: application/pdf\r\n\r\n`
    );
    const footerPart = encoder.encode(`\r\n--${boundary}--\r\n`);

    const body = new Uint8Array(headerPart.length + pdfBuffer.length + footerPart.length);
    body.set(headerPart, 0);
    body.set(pdfBuffer, headerPart.length);
    body.set(footerPart, headerPart.length + pdfBuffer.length);

    const resp = await fetch('https://api.autentique.com.br/v2/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });

    const data = await resp.json();

    if (data.errors) throw new Error(data.errors[0].message);

    const signers = data.data.createDocument.document.signers;
    const linkCliente = signers.find(s => s.email === emailCliente)?.link?.short_link || '';

    return new Response(JSON.stringify({ ok: true, link: linkCliente }), { status: 200, headers });

  } catch (e) {
    console.error('autentique-sign error:', e.message);
    return new Response(JSON.stringify({ erro: e.message }), { status: 500, headers });
  }
};

export const config = { path: '/api/autentique' };
