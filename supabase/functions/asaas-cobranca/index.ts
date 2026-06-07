// =============================================================
// Supabase Edge Function — asaas-cobranca
// Cria o cliente no Asaas e gera a(s) cobrança(s) automaticamente,
// devolvendo o link de pagamento. A chave fica em SEGREDO no servidor.
//
// Segredo necessário:  ASAAS_KEY
//   (Painel Supabase → Edge Functions → Secrets)
// =============================================================

const ASAAS_BASE = "https://www.asaas.com/api/v3";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
  "Content-Type": "application/json",
};

function num(s: string) {
  return parseFloat(String(s || "0").replace(/\./g, "").replace(",", ".")) || 0;
}
function parc(v: number, n: number, t: number) {
  return n <= 1 || t <= 0 ? v : (v * (t * Math.pow(1 + t, n))) / (Math.pow(1 + t, n) - 1);
}
function venc(dia: string) {
  const d = new Date();
  const v = new Date(d.getFullYear(), d.getMonth(), parseInt(dia || "10"));
  if (v <= d) v.setMonth(v.getMonth() + 1);
  return v.toISOString().split("T")[0];
}

async function asaas(path: string, body: unknown, key: string) {
  const r = await fetch(ASAAS_BASE + path, {
    method: "POST",
    headers: {
      "User-Agent": "Agencia-Martinelle/1.0",
      "Content-Type": "application/json",
      access_token: key,
    },
    body: JSON.stringify(body),
  });
  return await r.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("", { status: 200, headers: CORS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: CORS });
  }

  try {
    const key = Deno.env.get("ASAAS_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "ASAAS_KEY não configurado no servidor" }), { status: 500, headers: CORS });
    }

    const body = await req.json();
    const { pgto, valor, diaVencimento, plano } = body;
    const v = num(valor), due = venc(diaVencimento);
    const pl = { google: "Google Ads Pro", meta: "Meta Ads Pro", youtube: "YouTube Ads Pro" }[plano] || plano;
    const desc = `Taxa Gerenciamento ${pl} — Agência Martinelle`;

    // 1) Cliente
    const cli = await asaas("/customers", {
      name: body.nome,
      cpfCnpj: String(body.documento || "").replace(/\D/g, ""),
      email: body.email,
      mobilePhone: String(body.telefone || "").replace(/\D/g, ""),
      notificationDisabled: false,
    }, key);
    if (cli.errors) throw new Error(cli.errors[0].description);
    const cid = cli.id;
    const cobrancas: unknown[] = [];

    // 2) Cobrança(s) conforme forma de pagamento
    if (pgto === "boleto") {
      const c = await asaas("/payments", { customer: cid, billingType: "BOLETO", value: v, dueDate: due, description: desc, fine: { value: 2 }, interest: { value: 1 } }, key);
      if (c.errors) throw new Error(c.errors[0].description);
      cobrancas.push({ tipo: "Boleto", link: c.bankSlipUrl || c.invoiceUrl, invoiceUrl: c.invoiceUrl, vencimento: due, valor: v });
    } else if (pgto === "pix") {
      const c = await asaas("/payments", { customer: cid, billingType: "PIX", value: v, dueDate: due, description: desc }, key);
      if (c.errors) throw new Error(c.errors[0].description);
      cobrancas.push({ tipo: "PIX", link: c.invoiceUrl, invoiceUrl: c.invoiceUrl, vencimento: due, valor: v });
    } else if (pgto === "cartao") {
      const n = parseInt(body.parcelas || "1"), t = parseFloat(body.taxaJuros || "0") / 100;
      const p = parc(v, n, t), tot = parseFloat((p * n).toFixed(2));
      const b: Record<string, unknown> = { customer: cid, billingType: "CREDIT_CARD", value: tot, dueDate: due, description: desc + (n > 1 ? ` (${n}x)` : "") };
      if (n > 1) { b.installmentCount = n; b.totalValue = tot; }
      const c = await asaas("/payments", b, key);
      if (c.errors) throw new Error(c.errors[0].description);
      cobrancas.push({ tipo: n > 1 ? `Cartão ${n}x` : "Cartão 1x", link: c.invoiceUrl, invoiceUrl: c.invoiceUrl, vencimento: due, valor: p, total: n > 1 ? tot : undefined });
    } else if (pgto === "misto") {
      const ent = num(body.entrada);
      const fe = String(body.formEntrada || "").toUpperCase();
      // Entrada via PIX ou Boleto (Dinheiro = recebido em espécie, sem cobrança no Asaas)
      if (ent > 0 && (fe === "PIX" || fe === "BOLETO")) {
        const bE: Record<string, unknown> = { customer: cid, billingType: fe, value: ent, dueDate: due, description: desc + " — Entrada" };
        if (fe === "BOLETO") { bE.fine = { value: 2 }; bE.interest = { value: 1 }; }
        const cE = await asaas("/payments", bE, key);
        if (cE.errors) throw new Error(cE.errors[0].description);
        cobrancas.push({ tipo: `Entrada (${body.formEntrada})`, link: fe === "PIX" ? cE.invoiceUrl : (cE.bankSlipUrl || cE.invoiceUrl), vencimento: due, valor: ent });
      } else if (ent > 0) {
        cobrancas.push({ tipo: `Entrada (${body.formEntrada || "Dinheiro"})`, link: null, vencimento: due, valor: ent });
      }
      // Restante no cartão
      const rest = v - ent, n2 = parseInt(body.parcelasMisto || "1"), t2 = parseFloat(body.taxaJurosMisto || "0") / 100;
      if (rest > 0) {
        const p2 = parc(rest, n2, t2), tot2 = parseFloat((p2 * n2).toFixed(2));
        const due2 = new Date(new Date(due).getTime() + 30 * 864e5).toISOString().split("T")[0];
        const bR: Record<string, unknown> = { customer: cid, billingType: "CREDIT_CARD", value: tot2, dueDate: due2, description: desc + (n2 > 1 ? ` — Restante ${n2}x` : " — Restante") };
        if (n2 > 1) { bR.installmentCount = n2; bR.totalValue = tot2; }
        const cR = await asaas("/payments", bR, key);
        if (cR.errors) throw new Error(cR.errors[0].description);
        cobrancas.push({ tipo: n2 > 1 ? `Restante Cartão ${n2}x` : "Restante Cartão", link: cR.invoiceUrl, vencimento: due2, valor: p2, total: n2 > 1 ? tot2 : undefined });
      }
    }

    return new Response(JSON.stringify({ ok: true, customerId: cid, cobrancas }), { status: 200, headers: CORS });
  } catch (e) {
    console.error("[asaas-cobranca]", (e as Error)?.message || e);
    return new Response(JSON.stringify({ ok: false, error: String((e as Error)?.message || e) }), { status: 500, headers: CORS });
  }
});
