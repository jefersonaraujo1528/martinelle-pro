const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const STATIC_URL = 'https://martinelle-pro.netlify.app/doctors-data.json';

let getStore = null;
try { getStore = require('@netlify/blobs').getStore; } catch (e) {}

async function sendMsg(chatId, text) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  });
}

async function getDoctors() {
  if (getStore) {
    try {
      const store = getStore('martinelle-doctors');
      const data = await store.get('current', { type: 'json' });
      if (data && Array.isArray(data) && data.length) return data;
    } catch (e) {}
  }
  try {
    const res = await fetch(STATIC_URL + '?t=' + Date.now());
    return await res.json();
  } catch { return []; }
}

function briefingDoDia() {
  const dias = ['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sabado'];
  const dia = dias[new Date().getDay()];
  const data = new Date().toLocaleDateString('pt-BR');
  const frases = [
    'Vendas e o seu melhor com o que voce tem.',
    'O resultado e inevitavel quando o processo e feito todo dia.',
    'Nao romantize o problema. Resolva.',
    'O NAO e momentaneo. O processo e permanente.',
    'Perfeccionismo e inimigo do progresso. Execute.'
  ];
  const frase = frases[new Date().getDate() % frases.length];
  const focos = {
    Segunda: 'Prospectar novos medicos — ligar para secretarias e mapear clinicas',
    Terca:   'Visitas presenciais — Diamond Center, Ininga, Fatima',
    Quarta:  'Follow-ups + confirmar agendamentos da semana',
    Quinta:  'Visitas presenciais — Joquei, Centro Norte, Zona Leste',
    Sexta:   'Fechar propostas abertas + revisao da semana',
    Sabado:  'Planejamento da semana seguinte',
    Domingo: 'Preparacao mental e revisao de metas'
  };
  return `☀️ <b>Bom dia, Jeferson! ${dia} ${data}</b>\n\n<i>"${frase}"</i>\n\n🎯 <b>Foco de hoje:</b>\n${focos[dia] || 'Foco total no processo'}\n\n📋 <b>Metodo Hermano:</b>\n• Chegue como representante, nao vendedor\n• Script: "Satisfacao, sou representante da Martinelle..."\n• 3 perguntas do medico: Quem voce e? Por que esta aqui? Por que eu fui selecionado?\n• NAO e momentaneo — combine sempre o retorno\n\n💪 <b>Desafio do dia:</b> 3 abordagens novas antes do meio-dia.\n\n<i>Hermano — Agencia Martinelle</i>`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 200, body: 'ok' };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 200, body: 'ok' }; }

  const message = body.message || body.edited_message;
  if (!message) return { statusCode: 200, body: 'ok' };

  const chatId = message.chat.id;
  const texto = (message.text || '').trim();
  const lower = texto.toLowerCase();
  let reply = '';

  // --- BRIEFING ---
  if (lower === '/briefing' || lower === 'briefing' || lower.includes('briefing do dia')) {
    reply = briefingDoDia();

  // --- LISTA DE MEDICOS ---
  } else if (lower === '/medicos' || lower.includes('lista') || lower.includes('medicos') || lower.includes('medico')) {
    const docs = await getDoctors();
    const pend = docs.filter(d => d.status === 'Pendente').length;
    const visit = docs.filter(d => d.status === 'Visitado').length;
    const inter = docs.filter(d => d.status === 'Interessado').length;
    const prop = docs.filter(d => d.status === 'Proposta').length;
    const fech = docs.filter(d => d.status === 'Fechado').length;
    const sem = docs.filter(d => d.positioning === 'Sem').length;
    reply = `🏥 <b>Seus Medicos — Martinelle Pro</b>\n\n📊 <b>Pipeline:</b>\n📍 Pendentes: ${pend}\n👋 Visitados: ${visit}\n🔥 Interessados: ${inter}\n📄 Proposta: ${prop}\n✅ Fechados: ${fech}\n\n🎯 Sem posicionamento: ${sem} (prioridade!)\n\nTotal: ${docs.length} medicos\n\n🌐 Ver completo: martinelle-pro.netlify.app\n\n<i>Use /leads para top prioridades</i>`;

  // --- LEADS / PRIORIDADES ---
  } else if (lower === '/leads' || lower.includes('lead') || lower.includes('prioridade') || lower.includes('prioridades')) {
    const docs = await getDoctors();
    const top = docs.filter(d => d.positioning === 'Sem' && d.status === 'Pendente').slice(0, 8);
    if (!top.length) {
      reply = '🎯 Nenhum lead prioritario pendente. Use /medicos para ver todos.';
    } else {
      const lista = top.map((d, i) => `${i+1}. <b>${d.name}</b>\n   ${d.specialty} — ${d.clinic || 'Clinica nao informada'}\n   ${d.phone1 ? '📞 ' + d.phone1 : '📍 Visitar'}`).join('\n\n');
      reply = `🎯 <b>Top ${top.length} Leads Prioritarios</b>\n(Sem posicionamento digital)\n\n${lista}\n\n🌐 Lista completa: martinelle-pro.netlify.app`;
    }

  // --- FOLLOW-UP ---
  } else if (lower === '/followup' || lower.includes('follow') || lower.includes('retorno') || lower.includes('pendente')) {
    const docs = await getDoctors();
    const hoje = new Date().toISOString().slice(0, 10);
    const atrasados = docs.filter(d => d.followUpDate && d.followUpDate < hoje && !['Fechado','Perdido'].includes(d.status));
    const hoje_fu = docs.filter(d => d.followUpDate === hoje);
    let r = '';
    if (hoje_fu.length) r += `🔔 <b>Follow-up HOJE (${hoje_fu.length}):</b>\n${hoje_fu.map(d => `• ${d.name} — ${d.specialty}`).join('\n')}\n\n`;
    if (atrasados.length) r += `⚠️ <b>Atrasados (${atrasados.length}):</b>\n${atrasados.slice(0,6).map(d => `• ${d.name} — ${d.specialty} (${d.followUpDate})`).join('\n')}`;
    reply = r || '✅ Nenhum follow-up pendente! Continue assim.';

  // --- STATUS DO PIPELINE ---
  } else if (lower === '/status' || lower === 'status' || lower.includes('pipeline')) {
    const docs = await getDoctors();
    const s = { Pendente:0, Visitado:0, Interessado:0, Proposta:0, Fechado:0, Perdido:0 };
    docs.forEach(d => { if(s[d.status] !== undefined) s[d.status]++; });
    const receita = docs.filter(d => d.status === 'Fechado').reduce((acc,d) => acc + (d.value||0), 0);
    const pipeline = docs.filter(d => d.status === 'Proposta').reduce((acc,d) => acc + (d.value||0), 0);
    reply = `📊 <b>Status — Martinelle Pro</b>\n\n📍 Pendentes: ${s.Pendente}\n👋 Visitados: ${s.Visitado}\n🔥 Interessados: ${s.Interessado}\n📄 Proposta: ${s.Proposta}\n✅ Fechados: ${s.Fechado}\n❌ Perdidos: ${s.Perdido}\n\n💰 Receita fechada: R$ ${receita.toLocaleString('pt-BR')}/mes\n📈 Pipeline: R$ ${pipeline.toLocaleString('pt-BR')}/mes\n\n<i>Hermano — Agencia Martinelle</i>`;

  // --- BUSCA POR ESPECIALIDADE ---
  } else if (lower.includes('dermatolog') || lower.includes('ginecolog') || lower.includes('psiquiat') || lower.includes('neurolog') || lower.includes('reumatolog') || lower.includes('cardiolog') || lower.includes('oftalmolog') || lower.includes('ortoped') || lower.includes('pediatr')) {
    const docs = await getDoctors();
    const specs = ['dermatolog','ginecolog','psiquiat','neurolog','reumatolog','cardiolog','oftalmolog','ortoped','pediatr'];
    const matched = specs.find(s => lower.includes(s));
    const filtrados = docs.filter(d => d.specialty && d.specialty.toLowerCase().includes(matched));
    reply = `🔍 <b>${filtrados.length} medico(s) — ${filtrados[0]?.specialty || matched}</b>\n\n${filtrados.slice(0,8).map(d => `• <b>${d.name}</b>\n  ${d.status} | ${d.clinic || 'sem clinica'}`).join('\n\n')}\n\n🌐 Ver todos: martinelle-pro.netlify.app`;

  // --- BUSCA POR BAIRRO ---
  } else if (lower.includes('diamond') || lower.includes('ininga') || lower.includes('fatima') || lower.includes('joquei') || lower.includes('centro')) {
    const docs = await getDoctors();
    const bairro = lower.includes('diamond') ? 'diamond' : lower.includes('ininga') ? 'ininga' : lower.includes('joquei') ? 'joquei' : lower.includes('fatima') ? 'fatima' : 'centro';
    const local = docs.filter(d => d.address && d.address.toLowerCase().includes(bairro));
    reply = `📍 <b>Medicos em ${bairro.charAt(0).toUpperCase()+bairro.slice(1)} (${local.length})</b>\n\n${local.slice(0,8).map(d => `• ${d.name} — ${d.specialty}\n  ${d.arrive ? '⏰ '+d.arrive : '📞 Ligar'}`).join('\n\n')}\n\n🌐 Ver rota: martinelle-pro.netlify.app`;

  // --- HOJE / ROTA DO DIA ---
  } else if (lower.includes('hoje') || lower.includes('visitar') || lower.includes('rota') || lower.includes('dia')) {
    const docs = await getDoctors();
    const diasSemana = ['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sabado'];
    const hoje = diasSemana[new Date().getDay()];
    const doDia = docs.filter(d => d.days && d.days.some(x => x.toLowerCase().includes(hoje.toLowerCase())) && d.status === 'Pendente');
    if (!doDia.length) {
      reply = `📅 Nenhum medico agendado para hoje (${hoje}).\n\nUse /leads para ver as prioridades ou acesse martinelle-pro.netlify.app`;
    } else {
      reply = `📅 <b>Rota de hoje — ${hoje} (${doDia.length} medicos)</b>\n\n${doDia.slice(0,8).map(d => `• <b>${d.name}</b> ${d.arrive ? '⏰ '+d.arrive : ''}\n  ${d.specialty} | ${d.clinic || ''}`).join('\n\n')}\n\n🌐 Ver rota completa: martinelle-pro.netlify.app`;
    }

  // --- AJUDA ---
  } else if (lower === '/ajuda' || lower === '/help' || lower === 'oi' || lower === 'ola' || lower === 'ola!' || lower === 'oi!') {
    reply = `👋 <b>Hermano — Martinelle Pro Bot</b>\n\nComo posso te ajudar?\n\n<b>Comandos:</b>\n/briefing — Briefing do dia\n/medicos — Resumo do pipeline\n/leads — Top prioridades\n/followup — Follow-ups pendentes\n/status — Status e receita\n\n<b>Perguntas livres:</b>\n• "dermatologistas"\n• "medicos no Diamond"\n• "quem visitar hoje"\n• "follow-ups de hoje"\n\n🌐 martinelle-pro.netlify.app\n\n<i>Hermano — Agencia Martinelle</i>`;

  // --- RESPOSTA PADRAO ---
  } else {
    reply = `Nao entendi. Tente:\n\n/briefing /medicos /leads /followup /status\n\nOu pergunte: "dermatologistas", "Diamond Center", "visitar hoje"\n\n/ajuda para ver tudo\n\n<i>Hermano — Agencia Martinelle</i>`;
  }

  await sendMsg(chatId, reply);
  return { statusCode: 200, body: 'ok' };
};
