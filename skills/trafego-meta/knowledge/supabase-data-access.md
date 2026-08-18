# Acesso a Dados de Vendas — Integração de Fonte Externa (opcional)

> Guia de integração: como conectar o squad a uma fonte de dados de vendas confiável.
> O setup abaixo (Supabase + webhook do checkout) é um **exemplo de arquitetura** de tracking.
> Adapte os endpoints e o schema à sua própria fonte de dados — ou ignore este arquivo
> se você for operar apenas com os dados do Gerenciador do Meta.

Sempre que precisar de métricas reais da campanha (vendas, leads, spend, CPA, criativos),
o ideal é cruzar os dados do Gerenciador Meta com uma fonte de vendas confiável — vinda
direto do seu checkout (ex: Hotmart, Kiwify, Eduzz via webhook). Dados de venda do
checkout são mais confiáveis para contagem do que o Pixel/CAPI.

---

## Credenciais (preencha com as suas)

```
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_ANON_KEY=<SUA_SUPABASE_ANON_KEY>
CAMPAIGN_REF=SEU_REF_DE_CAMPANHA
# Launch slug do ciclo ativo (atualizar a cada novo ciclo):
LAUNCH_SLUG=seu-lancamento-aaaa-mm-dd
```

> Guarde esses valores em `data/.env` (gitignored) ou no seu gerenciador de senhas.
> Nunca commite a `anon key` em texto claro.

## Dashboard Visual (opcional)

Se você publicar um dashboard de campanha, registre a URL aqui:
`https://SEU-DASHBOARD.vercel.app`

---

## Como Puxar Dados

> Os comandos abaixo assumem RPCs e views Supabase (`get_launch_dashboard`,
> `get_creative_scoreboard`, `v_campaign_sales`, `v_campaign_leads`). Se você usar
> outra fonte de dados, adapte os endpoints mantendo a mesma lógica de leitura.

### 1. Dashboard Completo (total / ontem / hoje)

```bash
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/get_launch_dashboard" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H 'Content-Type: application/json' \
  -d "{\"p_campaign_ref\": \"${CAMPAIGN_REF}\"}" | python3 -m json.tool
```

**Retorna (por período: total, yesterday, today):**
- `sales` — vendas do produto principal (exclui OBs)
- `revenue` — receita total (principal + OBs)
- `spend` — gasto em ads (Meta)
- `leads` — leads únicos
- `cost_per_sale` — CPA real (spend / sales)
- `avg_ticket` — ticket médio
- `page_conversion` — vendas / LPV (%)
- `checkout_conversion` — vendas / leads (%)
- `landing_page_views` — visualizações de página
- `link_clicks` — cliques no link
- `connect_rate` — LPV / link_clicks (%)
- `cpm`, `ctr` — métricas de ads
- `ob_total_pct`, `ob_bump1_pct`, `ob_bump2_pct` — conversão de order bumps
- `roi` — revenue / spend
- `bump1_count`, `bump2_count` — quantidade de OBs vendidos

### 2. Scoreboard de Criativos

```bash
curl -s -X POST "${SUPABASE_URL}/rest/v1/rpc/get_creative_scoreboard" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H 'Content-Type: application/json' \
  -d "{\"p_campaign_ref\": \"${CAMPAIGN_REF}\"}" | python3 -m json.tool
```

**Retorna (1 linha por criativo, ordenado por vendas desc):**
- `ad_name` — nome do criativo (normalizado, sem sufixo de conjunto _C1/_C2/_C3)
- `sales` — vendas atribuídas a esse criativo
- `revenue` — receita atribuída
- `spend` — gasto total nesse criativo (todos os conjuntos somados)
- `cost_per_sale` — CPA do criativo
- `rpm` — receita por 1000 page views (métrica principal de qualidade)
- `hook_rate` — % de views de 3s / impressões (só pra vídeo)
- `ctr` — click-through rate
- `connect_rate` — LPV / link_clicks
- `page_conversion` — vendas / LPV
- `lpv` — landing page views
- `cpc` — custo por clique
- `impressions`, `clicks`, `link_clicks`, `reach`, `video_views`

### 3. Vendas por Dia

```bash
curl -s "${SUPABASE_URL}/rest/v1/v_campaign_sales?campaign_ref=eq.${CAMPAIGN_REF}&order=sale_date.asc" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" | python3 -m json.tool
```

### 4. Leads por Dia

```bash
curl -s "${SUPABASE_URL}/rest/v1/v_campaign_leads?campaign_ref=eq.${CAMPAIGN_REF}&order=lead_date.asc" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" | python3 -m json.tool
```

---

## Quando Usar Cada Fonte

| Preciso de... | Fonte | Comando |
|---------------|-------|---------|
| Visão geral rápida (CPA, vendas, ROI) | Dashboard RPC | get_launch_dashboard |
| Qual criativo tá vendendo mais | Creative Scoreboard | get_creative_scoreboard |
| Tendência diária de vendas | v_campaign_sales | GET view |
| Tendência diária de leads | v_campaign_leads | GET view |
| Decisão de pausar/escalar criativo | Creative Scoreboard | RPM + CPA + hook_rate |
| Diagnóstico CPA alto | Dashboard RPC | Cruzar CTR, CPM, connect_rate, page_conversion |

## Diferença Fonte de Checkout vs Gerenciador Meta

| Dado | Checkout (webhook) | Gerenciador Meta |
|------|--------------------|------------------|
| Vendas | Webhook do checkout — FONTE DE VERDADE | Pixel/CAPI — delay 24-48h, atribuição diferente |
| Leads | Webhook do checkout | Pixel — pode divergir 10-15% |
| Spend | Meta API (sync periódico) | Tempo real |
| CPA | Calculado: spend / vendas_checkout | Calculado: spend / purchases_pixel |
| Criativos | Agregado por nome base (ignora conjunto) | Por anúncio individual |

**REGRA:** Para decisões de escala/pausa, SEMPRE priorizar CPA da fonte de checkout (vendas reais) sobre CPA do gerenciador (eventos de pixel).

## Sync Automático

Numa arquitetura típica, os dados do Meta Ads são sincronizados periodicamente (ex: a cada 15 minutos) por uma função agendada, e os dados de vendas/leads chegam em tempo real via webhook do checkout. Adapte a frequência à sua operação.
