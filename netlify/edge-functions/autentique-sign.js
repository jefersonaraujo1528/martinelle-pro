const TOKEN = 'dede35294c3788844ef0df69a3ca2e016ee7ac84d06bd89df3cd5e12741a6844';
const EMAIL_J = 'agenciamartinelle@gmail.com';
const h = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export default async (request, context) => {
  if (request.method === 'OPTIONS') return new Response('', { status:200, headers:h });
  if (request.method !== 'POST') return new Response('{}', { status:405, headers:h });
  try {
    const { pdfBase64, emailCliente, nomeCliente, nomeContrato } = await request.json();
    const deadline = new Date(Date.now()+48*36e5).toISOString().split('T')[0];
    const MUT = `mutation CreateDocument($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) { createDocument(document: $document, signers: $signers, file: $file) { document { id name signers { email action link { short_link } } } } }`;
    const ops = JSON.stringify({ query:MUT, variables:{ document:{ name:nomeContrato||`Contrato — ${nomeCliente}`, message:`Olá ${nomeCliente}! Seu contrato com a Agência Martinelle está pronto. Você tem 48 horas para assinar.`, deadline_at:deadline, reminder:1, notify_in:0 }, signers:[{email:emailCliente,action:'SIGN'},{email:EMAIL_J,action:'SIGN'}], file:null } });
    const map = JSON.stringify({'0':['variables.file']});
    const pdf = Uint8Array.from(atob(pdfBase64), c=>c.charCodeAt(0));
    const b = 'B'+Date.now();
    const enc = new TextEncoder();
    const pre = enc.encode(`--${b}\r\nContent-Disposition: form-data; name="operations"\r\n\r\n${ops}\r\n--${b}\r\nContent-Disposition: form-data; name="map"\r\n\r\n${map}\r\n--${b}\r\nContent-Disposition: form-data; name="0"; filename="contrato.pdf"\r\nContent-Type: application/pdf\r\n\r\n`);
    const post = enc.encode(`\r\n--${b}--\r\n`);
    const body = new Uint8Array(pre.length+pdf.length+post.length);
    body.set(pre,0); body.set(pdf,pre.length); body.set(post,pre.length+pdf.length);
    const resp = await fetch('https://api.autentique.com.br/v2/graphql', { method:'POST', headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':`multipart/form-data; boundary=${b}`}, body });
    const data = await resp.json();
    if (data.errors) throw new Error(data.errors[0].message);
    const link = data.data.createDocument.document.signers.find(s=>s.email===emailCliente)?.link?.short_link || '';
    return new Response(JSON.stringify({ ok:true, link }), { status:200, headers:h });
  } catch(e) {
    return new Response(JSON.stringify({ erro: e.message }), { status:500, headers:h });
  }
};

export const config = { path: '/api/autentique' };
