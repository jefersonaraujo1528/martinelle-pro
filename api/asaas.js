const ASAAS_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmQ2ODEyY2IwLTg5OGEtNGJhMi04MWIwLTdmZGI1YWQzY2NjMjo6JGFhY2hfMWM3NWY1YjktMTViYS00YmM4LTljNDgtNTdiNTUyMmRhM2Q3';
const https = require('https');

function venc(dia) {
  const d=new Date(),v=new Date(d.getFullYear(),d.getMonth(),parseInt(dia||10));
  if(v<=d)v.setMonth(v.getMonth()+1);
  return v.toISOString().split('T')[0];
}
function num(s){return parseFloat((s||'0').replace(/\./g,'').replace(',','.'))||0;}
function parc(v,n,t){return(n<=1||t<=0)?v:v*(t*Math.pow(1+t,n))/(Math.pow(1+t,n)-1);}
function asaasReq(path,body){
  return new Promise((resolve,reject)=>{
    const data=JSON.stringify(body);
    const req=https.request({hostname:'www.asaas.com',path:'/api/v3'+path,method:'POST',headers:{'User-Agent':'Agencia-Martinelle/1.0','Content-Type':'application/json','Content-Length':Buffer.byteLength(data),access_token:ASAAS_KEY}},res=>{let r='';res.on('data',c=>r+=c);res.on('end',()=>resolve(JSON.parse(r)));});
    req.on('error',reject);req.write(data);req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS'){res.status(200).end();return;}
  if(req.method!=='POST'){res.status(405).json({erro:'Método não permitido'});return;}
  try{
    const d=req.body||{};
    const valor=num(d.valor),due=venc(d.diaVencimento);
    const pl={'google':'Google Ads Pro','meta':'Meta Ads Pro','youtube':'YouTube Ads Pro'}[d.plano]||d.plano;
    const desc='Taxa Gerenciamento '+pl+' — Agência Martinelle';
    const cli=await asaasReq('/customers',{name:d.nome,cpfCnpj:(d.documento||'').replace(/\D/g,''),email:d.email,notificationDisabled:false});
    if(cli.errors)throw new Error(cli.errors[0].description);
    const cid=cli.id,cobs=[];
    if(d.pgto==='boleto'){
      const c=await asaasReq('/payments',{customer:cid,billingType:'BOLETO',value:valor,dueDate:due,description:desc,fine:{value:2},interest:{value:1}});
      cobs.push({tipo:'Boleto',link:c.bankSlipUrl||c.invoiceUrl,invoiceUrl:c.invoiceUrl,vencimento:due,valor});
    }else if(d.pgto==='pix'){
      const c=await asaasReq('/payments',{customer:cid,billingType:'PIX',value:valor,dueDate:due,description:desc});
      cobs.push({tipo:'PIX',link:c.invoiceUrl,invoiceUrl:c.invoiceUrl,vencimento:due,valor});
    }else if(d.pgto==='cartao'){
      const n=parseInt(d.parcelas||1),t=parseFloat(d.taxaJuros||0)/100,p=parc(valor,n,t),tot=parseFloat((p*n).toFixed(2));
      const b={customer:cid,billingType:'CREDIT_CARD',value:tot,dueDate:due,description:desc+(n>1?` (${n}x)`:'')};
      if(n>1){b.installmentCount=n;b.totalValue=tot;}
      const c=await asaasReq('/payments',b);
      cobs.push({tipo:n>1?`Cartão ${n}x`:'Cartão 1x',link:c.invoiceUrl,invoiceUrl:c.invoiceUrl,vencimento:due,valor:p,total:n>1?tot:undefined});
    }else if(d.pgto==='misto'){
      const ent=num(d.entrada),tipo=d.formEntrada==='pix'?'PIX':'BOLETO';
      const bE={customer:cid,billingType:tipo,value:ent,dueDate:due,description:desc+' — Entrada'};
      if(tipo==='BOLETO'){bE.fine={value:2};bE.interest={value:1};}
      const cE=await asaasReq('/payments',bE);
      cobs.push({tipo:`Entrada (${d.formEntrada})`,link:tipo==='PIX'?cE.invoiceUrl:(cE.bankSlipUrl||cE.invoiceUrl),vencimento:due,valor:ent});
      const rest=valor-ent,n2=parseInt(d.parcelasMisto||1),t2=parseFloat(d.taxaJurosMisto||0)/100,p2=parc(rest,n2,t2),tot2=parseFloat((p2*n2).toFixed(2));
      const due2=new Date(new Date(due).getTime()+30*864e5).toISOString().split('T')[0];
      const bR={customer:cid,billingType:'CREDIT_CARD',value:tot2,dueDate:due2,description:desc+(n2>1?` — Restante ${n2}x`:' — Restante')};
      if(n2>1){bR.installmentCount=n2;bR.totalValue=tot2;}
      const cR=await asaasReq('/payments',bR);
      cobs.push({tipo:n2>1?`Restante Cartão ${n2}x`:'Restante Cartão',link:cR.invoiceUrl,vencimento:due2,valor:p2,total:n2>1?tot2:undefined});
    }
    res.status(200).json({ok:true,customerId:cid,cobranças:cobs});
  }catch(e){
    res.status(500).json({erro:e.message});
  }
};
