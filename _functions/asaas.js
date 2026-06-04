const ASAAS_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmQ2ODEyY2IwLTg5OGEtNGJhMi04MWIwLTdmZGI1YWQzY2NjMjo6JGFhY2hfMWM3NWY1YjktMTViYS00YmM4LTljNDgtNTdiNTUyMmRhM2Q3';
const BASE = 'https://www.asaas.com/api/v3';
const h = { 'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type' };
function venc(dia){const d=new Date(),v=new Date(d.getFullYear(),d.getMonth(),parseInt(dia||10));if(v<=d)v.setMonth(v.getMonth()+1);return v.toISOString().split('T')[0];}
function num(s){return parseFloat((s||'0').replace(/\./g,'').replace(',','.'))||0;}
function parc(valor,n,taxa){return(n<=1||taxa<=0)?valor:valor*(taxa*Math.pow(1+taxa,n))/(Math.pow(1+taxa,n)-1);}
async function api(path,body){const r=await fetch(BASE+path,{method:'POST',headers:{'Content-Type':'application/json',access_token:ASAAS_KEY},body:JSON.stringify(body)});return r.json();}
exports.handler=async(event)=>{
  if(event.httpMethod==='OPTIONS')return{statusCode:200,headers:h,body:''};
  if(event.httpMethod!=='POST')return{statusCode:405,headers:h,body:'{}'};
  try{
    const d=JSON.parse(event.body);
    const valor=num(d.valor),due=venc(d.diaVencimento);
    const pl=d.plano==='google'?'Google Ads Pro':d.plano==='meta'?'Meta Ads Pro':'YouTube Ads Pro';
    const desc=`Taxa Gerenciamento ${pl} — Agência Martinelle`;
    const cli=await api('/customers',{name:d.nome,cpfCnpj:d.documento.replace(/\D/g,''),email:d.email,phone:d.telefone.replace(/\D/g,''),mobilePhone:d.telefone.replace(/\D/g,''),notificationDisabled:false});
    if(cli.errors)throw new Error(cli.errors[0]?.description||'Erro ao criar cliente');
    const cid=cli.id,cobranças=[];
    if(d.pgto==='boleto'){const c=await api('/payments',{customer:cid,billingType:'BOLETO',value:valor,dueDate:due,description:desc,fine:{value:2},interest:{value:1}});cobranças.push({tipo:'Boleto',link:c.bankSlipUrl||c.invoiceUrl,vencimento:due,valor});}
    else if(d.pgto==='pix'){const c=await api('/payments',{customer:cid,billingType:'PIX',value:valor,dueDate:due,description:desc});cobranças.push({tipo:'PIX',link:c.invoiceUrl,vencimento:due,valor});}
    else if(d.pgto==='cartao'){const n=parseInt(d.parcelas||1),taxa=parseFloat(d.taxaJuros||0)/100,p=parc(valor,n,taxa),total=parseFloat((p*n).toFixed(2));const c=await api('/payments',{customer:cid,billingType:'CREDIT_CARD',value:total,dueDate:due,description:desc+(n>1?` (${n}x)`:'')}); cobranças.push({tipo:n>1?`Cartão ${n}x`:'Cartão 1x',link:c.invoiceUrl,vencimento:due,valor:p,total:n>1?total:undefined});}
    else if(d.pgto==='misto'){const ent=num(d.entrada),tipo=d.formEntrada==='pix'?'PIX':'BOLETO';const cE=await api('/payments',{customer:cid,billingType:tipo,value:ent,dueDate:due,description:desc+' — Entrada',fine:tipo==='BOLETO'?{value:2}:undefined,interest:tipo==='BOLETO'?{value:1}:undefined});cobranças.push({tipo:`Entrada (${d.formEntrada})`,link:tipo==='PIX'?cE.invoiceUrl:(cE.bankSlipUrl||cE.invoiceUrl),vencimento:due,valor:ent});const rest=valor-ent,n2=parseInt(d.parcelasMisto||1),taxa2=parseFloat(d.taxaJurosMisto||0)/100,p2=parc(rest,n2,taxa2),total2=parseFloat((p2*n2).toFixed(2));const due2=new Date(new Date(due).getTime()+30*864e5).toISOString().split('T')[0];const cR=await api('/payments',{customer:cid,billingType:'CREDIT_CARD',value:total2,dueDate:due2,description:desc+` — Restante${n2>1?` ${n2}x`:''}`});cobranças.push({tipo:n2>1?`Restante Cartão ${n2}x`:'Restante Cartão',link:cR.invoiceUrl,vencimento:due2,valor:p2,total:n2>1?total2:undefined});}
    return{statusCode:200,headers:h,body:JSON.stringify({ok:true,customerId:cid,cobranças})};
  }catch(e){return{statusCode:500,headers:h,body:JSON.stringify({erro:e.message})};}
};
