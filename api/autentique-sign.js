const https = require('https');
const TOKEN = 'dede35294c3788844ef0df69a3ca2e016ee7ac84d06bd89df3cd5e12741a6844';
const EMAIL_J = 'agenciamartinelle@gmail.com';
const MUT = `mutation CreateDocument($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) { createDocument(document: $document, signers: $signers, file: $file) { document { id name signers { email action link { short_link } } } } }`;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS'){res.status(200).end();return;}
  if(req.method!=='POST'){res.status(405).json({erro:'Não permitido'});return;}
  try{
    const{pdfBase64,emailCliente,nomeCliente,nomeContrato}=req.body||{};
    const deadline=new Date(Date.now()+48*36e5).toISOString().split('T')[0];
    const ops=JSON.stringify({query:MUT,variables:{document:{name:nomeContrato||`Contrato — ${nomeCliente}`,message:`Olá ${nomeCliente}! Seu contrato com a Agência Martinelle está pronto. Você tem 48 horas para assinar.`,deadline_at:deadline,reminder:1,notify_in:0},signers:[{email:emailCliente,action:'SIGN'},{email:EMAIL_J,action:'SIGN'}],file:null}});
    const map=JSON.stringify({'0':['variables.file']});
    const pdf=Buffer.from(pdfBase64,'base64');
    const b='B'+Date.now();
    const pre=Buffer.from(`--${b}\r\nContent-Disposition: form-data; name="operations"\r\n\r\n${ops}\r\n--${b}\r\nContent-Disposition: form-data; name="map"\r\n\r\n${map}\r\n--${b}\r\nContent-Disposition: form-data; name="0"; filename="contrato.pdf"\r\nContent-Type: application/pdf\r\n\r\n`);
    const post=Buffer.from(`\r\n--${b}--\r\n`);
    const body=Buffer.concat([pre,pdf,post]);

    const data = await new Promise((resolve,reject)=>{
      const r=https.request({hostname:'api.autentique.com.br',path:'/v2/graphql',method:'POST',headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':`multipart/form-data; boundary=${b}`,'Content-Length':body.length}},resp=>{let s='';resp.on('data',c=>s+=c);resp.on('end',()=>resolve(JSON.parse(s)));});
      r.on('error',reject);r.write(body);r.end();
    });
    if(data.errors)throw new Error(data.errors[0].message);
    const link=data.data.createDocument.document.signers.find(s=>s.email===emailCliente)?.link?.short_link||'';
    res.status(200).json({ok:true,link});
  }catch(e){
    res.status(500).json({erro:e.message});
  }
};
