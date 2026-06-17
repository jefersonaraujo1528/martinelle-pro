// =============================================================
// Supabase Edge Function — meta-insights
// Puxa os dados do Meta Ads (Graph API) com o TOKEN EM SEGREDO
// e devolve já no formato que o relatorios.html consome:
//   { atual, anterior, publico, criativos, de, ate }
// O token NUNCA fica no navegador nem no código público.
//
// Segredos necessários (Painel Supabase → Edge Functions → Secrets):
//   META_ACCESS_TOKEN   → token do System User do Business Manager (ads_read)
//   META_API_VERSION    → opcional, ex.: "v21.0" (padrão abaixo)
//
// Corpo esperado (POST):
//   { accountId, since, until, prevSince?, prevUntil? }
//   accountId: número ou "act_123..." (a função normaliza)
//   datas no formato "YYYY-MM-DD"
// =============================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
  "Content-Type": "application/json",
};

// Atualize META_API_VERSION a cada nova versão maior do Meta (~a cada 6 meses).
const API_VER = Deno.env.get("META_API_VERSION") || "v25.0";
const GRAPH = `https://graph.facebook.com/${API_VER}`;

// Tipos de ação do Meta agrupados (em ordem de prioridade p/ evitar contagem dupla)
const LEAD_PRIORITY = [
  "offsite_conversion.fb_pixel_lead",   // leads do Pixel no site
  "lead",
  "onsite_conversion.lead_grouped",     // formulários nativos do Meta
];
// só conversas REALMENTE iniciadas (não conexões passivas)
const MSG_TYPES = [
  "onsite_conversion.messaging_conversation_started_7d",
];
const PURCHASE_PRIORITY = [
  "offsite_conversion.fb_pixel_purchase", // compra precisa do Pixel (site) primeiro
  "purchase",
  "omni_purchase",                        // roll-up omnichannel (mais amplo) por último
  "onsite_web_purchase",
];
const LPV_TYPES = ["landing_page_view"];

// soma o valor do PRIMEIRO action_type da lista que existir (evita duplicar o mesmo evento)
function pickAction(actions: any[], priority: string[]): number {
  if (!Array.isArray(actions)) return 0;
  for (const t of priority) {
    const hit = actions.find((a) => a.action_type === t);
    if (hit) return Number(hit.value) || 0;
  }
  return 0;
}
// soma TODOS os action_types da lista
function sumActions(actions: any[], types: string[]): number {
  if (!Array.isArray(actions)) return 0;
  return actions
    .filter((a) => types.includes(a.action_type))
    .reduce((s, a) => s + (Number(a.value) || 0), 0);
}
// leads/conversas conforme o relatório: leads do pixel/form + conversas iniciadas
function leadsDe(actions: any[]): number {
  return pickAction(actions, LEAD_PRIORITY) + sumActions(actions, MSG_TYPES);
}

async function graph(path: string, params: Record<string, string>, token: string) {
  const u = new URL(`${GRAPH}/${path}`);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set("access_token", token);
  const all: any[] = [];
  let next: string | null = u.toString();
  let guard = 0;
  while (next && guard < 12) {
    const r = await fetch(next);
    const j = await r.json();
    if (j.error) throw new Error(`Meta: ${j.error.message || JSON.stringify(j.error)}`);
    if (Array.isArray(j.data)) all.push(...j.data);
    next = j.paging?.next || null;
    guard++;
  }
  return all;
}

// mapeia uma linha de insights (level=account) → objeto "atual"/"anterior" do relatório
function mapTotais(row: any) {
  if (!row) return {};
  const a = row.actions || [];
  const av = row.action_values || [];
  const o: Record<string, number> = {};
  const num = (v: any) => (v == null || v === "" ? 0 : Number(v) || 0);
  o.investimento = num(row.spend);
  o.alcance = num(row.reach);
  o.impressoes = num(row.impressions);
  o.cliques = num(row.inline_link_clicks);
  const lp = sumActions(a, LPV_TYPES);
  if (lp) o.lp = lp;
  const leads = leadsDe(a);
  if (leads) o.leads = leads;
  const compras = pickAction(a, PURCHASE_PRIORITY);
  if (compras) o.compras = compras;
  const valor = pickAction(av, PURCHASE_PRIORITY);
  if (valor) o.valorCompras = valor;
  // limpa zeros pra não poluir os campos vazios do relatório
  Object.keys(o).forEach((k) => { if (!o[k]) delete o[k]; });
  return o;
}

async function totais(act: string, since: string, until: string, token: string) {
  const rows = await graph(`${act}/insights`, {
    level: "account",
    time_range: JSON.stringify({ since, until }),  // URLSearchParams faz o encode correto p/ a API
    fields: "spend,impressions,reach,inline_link_clicks,ctr,cpc,cpm,frequency,actions,action_values",
  }, token);
  return mapTotais(rows[0]);
}

// público (idade × gênero) — mesma lógica de níveis do relatório (leads > cliques > impressões)
async function publicoDe(act: string, since: string, until: string, token: string) {
  const rows = await graph(`${act}/insights`, {
    level: "account",
    breakdowns: "age,gender",
    time_range: JSON.stringify({ since, until }),
    fields: "impressions,inline_link_clicks,actions",
  }, token);
  const FAIXAS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const gen = { f: [0, 0, 0], m: [0, 0, 0] };
  const idades: Record<string, number[]> = {};
  for (const r of rows) {
    const pesos = [leadsDe(r.actions || []), Number(r.inline_link_clicks) || 0, Number(r.impressions) || 0];
    const g = String(r.gender || "").toLowerCase();
    const alvo = g === "female" ? "f" : g === "male" ? "m" : null;
    if (alvo) pesos.forEach((p, n) => (gen[alvo][n] += p));
    const fx = String(r.age || "").trim();
    if (FAIXAS.includes(fx)) {
      idades[fx] = idades[fx] || [0, 0, 0];
      pesos.forEach((p, n) => (idades[fx][n] += p));
    }
  }
  const totN = [0, 1, 2].map((n) => gen.f[n] + gen.m[n]);
  const nivel = totN[0] >= 10 ? 0 : totN[1] >= 10 ? 1 : 2;
  const publico: any = {};
  const totGen = gen.f[nivel] + gen.m[nivel];
  if (totGen > 0) publico.fem = Math.round((gen.f[nivel] / totGen) * 100);
  const totId = Object.values(idades).reduce((a, v) => a + v[nivel], 0);
  if (totId > 0) {
    publico.idades = FAIXAS.map((f) => ({
      faixa: f,
      pct: String(Math.round(((idades[f]?.[nivel] || 0) / totId) * 100)),
    }));
  }
  return publico;
}

// hierarquia de criativos — top anúncios por leads, depois cliques
async function criativosDe(act: string, since: string, until: string, token: string) {
  const rows = await graph(`${act}/insights`, {
    level: "ad",
    time_range: JSON.stringify({ since, until }),
    fields: "ad_name,spend,impressions,inline_link_clicks,clicks,ctr,actions",
    limit: "300",
  }, token);
  const lista = rows.map((r) => {
    const leads = leadsDe(r.actions || []);
    const cliques = Number(r.inline_link_clicks) || 0;
    const inv = Number(r.spend) || 0;
    return {
      nome: r.ad_name || "(sem nome)",
      leads,
      cliques,
      inv: Math.round(inv * 100) / 100,
      ctr: r.ctr != null ? Math.round(Number(r.ctr) * 100) / 100 : null,
      cpl: leads > 0 && inv > 0 ? Math.round((inv / leads) * 100) / 100 : null,
    };
  }).filter((c) => c.leads > 0 || c.cliques > 0)
    .sort((a, b) => (b.leads - a.leads) || (b.cliques - a.cliques));
  return lista.slice(0, 5);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("", { status: 200, headers: CORS });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: CORS });

  try {
    const token = Deno.env.get("META_ACCESS_TOKEN");
    if (!token)
      return new Response(JSON.stringify({ error: "META_ACCESS_TOKEN não configurado no servidor (Supabase → Edge Functions → Secrets)" }), { status: 500, headers: CORS });

    const body = await req.json();
    let { accountId, since, until, prevSince, prevUntil } = body || {};
    if (!accountId || !since || !until)
      return new Response(JSON.stringify({ error: "Campos obrigatórios: accountId, since, until" }), { status: 400, headers: CORS });

    const act = String(accountId).startsWith("act_") ? String(accountId) : `act_${accountId}`;

    // (opcional) trava de segurança: se o segredo META_ALLOWED_ACCOUNTS estiver setado
    // (IDs separados por vírgula), só aceita as contas dos seus clientes — impede que a
    // função seja usada como proxy aberto pra puxar dados de contas de terceiros.
    const allow = (Deno.env.get("META_ALLOWED_ACCOUNTS") || "").split(",").map((s) => s.trim().replace(/^act_/i, "")).filter(Boolean);
    if (allow.length && !allow.includes(act.replace(/^act_/i, ""))) {
      return new Response(JSON.stringify({ error: "Conta não autorizada" }), { status: 403, headers: CORS });
    }

    // chamadas em paralelo
    const [atual, publico, criativos] = await Promise.all([
      totais(act, since, until, token),
      publicoDe(act, since, until, token),
      criativosDe(act, since, until, token),
    ]);

    let anterior: Record<string, number> = {};
    if (prevSince && prevUntil) {
      try { anterior = await totais(act, prevSince, prevUntil, token); } catch (_) { /* período anterior é opcional */ }
    }

    return new Response(JSON.stringify({
      ok: true, conta: act, de: since, ate: until,
      atual, anterior, publico, criativos,
    }), { status: 200, headers: CORS });
  } catch (e) {
    console.error("[meta-insights]", e?.message || e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: CORS });
  }
});
