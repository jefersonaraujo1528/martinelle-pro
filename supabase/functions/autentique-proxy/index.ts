// =============================================================
// Supabase Edge Function — autentique-proxy
// Recebe { operations, pdfBase64 } do formulário de contratos,
// monta o multipart e envia pro Autentique com o token em SEGREDO.
// O token NUNCA fica no navegador nem no código público.
//
// Segredo necessário:  AUTENTIQUE_TOKEN
//   (Painel Supabase → Edge Functions → Secrets)
// =============================================================

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("", { status: 200, headers: CORS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: CORS,
    });
  }

  try {
    const token = Deno.env.get("AUTENTIQUE_TOKEN");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "AUTENTIQUE_TOKEN não configurado no servidor" }),
        { status: 500, headers: CORS },
      );
    }

    const { operations, pdfBase64 } = await req.json();
    if (!operations || !pdfBase64) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios ausentes: operations, pdfBase64" }),
        { status: 400, headers: CORS },
      );
    }

    // base64 -> bytes do PDF
    const pdfBytes = Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0));

    // multipart conforme spec do GraphQL multipart request (Autentique)
    const form = new FormData();
    form.append("operations", operations);
    form.append("map", JSON.stringify({ "0": ["variables.file"] }));
    form.append("0", new Blob([pdfBytes], { type: "application/pdf" }), "contrato.pdf");

    const resp = await fetch("https://api.autentique.com.br/v2/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await resp.json();
    return new Response(JSON.stringify(data), { status: 200, headers: CORS });
  } catch (e) {
    console.error("[autentique-proxy]", e?.message || e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: CORS,
    });
  }
});
