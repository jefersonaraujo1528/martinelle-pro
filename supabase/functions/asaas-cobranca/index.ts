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
// ===== Cálculo financeiro centralizado =====
// valor_total = valor_mensal × duração (meses). Indeterminado (0) = 1 mês de referência.
// NÃO calcula juros: o parcelamento no cartão tem juros aplicados pela operadora/Asaas.
function calcTotal(valorMensal: number, duracaoMeses: number) {
  const meses = duracaoMeses > 0 ? duracaoMeses : 1;
  return parseFloat((valorMensal * meses).toFixed(2));
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
    const { pgto, valor, duracao, diaVencimento, plano } = body;
    const v = num(valor), due = venc(diaVencimento);
    const meses = parseInt(String(duracao || "0")) || 0;       // duração do contrato
    const total = calcTotal(v, meses);                          // valor_total = mensal × meses
    // Validação financeira (regra 8): mensal e total nunca podem ser zero/inválidos
    if (v <= 0) throw new Error("Valor mensal inválido");
    if (total <= 0) throw new Error("Valor total do contrato inválido");
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
      // Cartão = VALOR TOTAL do contrato (mensal × meses), parcelado em N vezes.
      // Enviamos totalValue ao Asaas e deixamos a operadora aplicar os juros do parcelamento.
      const n = Math.max(1, parseInt(body.parcelas || "1"));
      const b: Record<string, unknown> = {
        customer: cid, billingType: "CREDIT_CARD", dueDate: due,
        description: desc + (meses > 0 ? ` — Contrato ${meses}m` : "") + (n > 1 ? ` (${n}x)` : ""),
      };
      if (n > 1) { b.installmentCount = n; b.totalValue = total; } else { b.value = total; }
      const c = await asaas("/payments", b, key);
      if (c.errors) throw new Error(c.errors[0].description);
      cobrancas.push({ tipo: n > 1 ? `Cartão ${n}x` : "Cartão 1x", link: c.invoiceUrl, invoiceUrl: c.invoiceUrl, vencimento: due, valor: n > 1 ? parseFloat((total / n).toFixed(2)) : total, total: n > 1 ? total : undefined });
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
      // Restante no cartão = VALOR TOTAL do contrato − entrada (juros do parcelamento pela operadora).
      const rest = parseFloat((total - ent).toFixed(2)), n2 = Math.max(1, parseInt(body.parcelasMisto || "1"));
      if (rest > 0) {
        const due2 = new Date(new Date(due).getTime() + 30 * 864e5).toISOString().split("T")[0];
        const bR: Record<string, unknown> = { customer: cid, billingType: "CREDIT_CARD", dueDate: due2, description: desc + (n2 > 1 ? ` — Restante ${n2}x` : " — Restante") };
        if (n2 > 1) { bR.installmentCount = n2; bR.totalValue = rest; } else { bR.value = rest; }
        const cR = await asaas("/payments", bR, key);
        if (cR.errors) throw new Error(cR.errors[0].description);
        cobrancas.push({ tipo: n2 > 1 ? `Restante Cartão ${n2}x` : "Restante Cartão", link: cR.invoiceUrl, vencimento: due2, valor: n2 > 1 ? parseFloat((rest / n2).toFixed(2)) : rest, total: n2 > 1 ? rest : undefined });
      }
    }

    return new Response(JSON.stringify({ ok: true, customerId: cid, cobrancas }), { status: 200, headers: CORS });
  } catch (e) {
    console.error("[asaas-cobranca]", (e as Error)?.message || e);
    return new Response(JSON.stringify({ ok: false, error: String((e as Error)?.message || e) }), { status: 500, headers: CORS });
  }
});
