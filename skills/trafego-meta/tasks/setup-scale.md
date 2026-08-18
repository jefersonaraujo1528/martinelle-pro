---
task: "Setup Scale Campaign"
responsavel: "@scale-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Conta de Escala configurada + Custom Audiences criadas + criativos disponíveis"
Saida: "Campanha Andromeda PAUSED na conta de Escala, fiel ao método, pronta pra revisão humana antes de ativar"
Checklist:
  - "Custom Audiences validadas (Step 0 rodou)"
  - "Payload completo montado conforme SOP"
  - "Quality Gate de fidelidade Andromeda passou"
  - "Preview apresentado e confirmado pelo usuário"
  - "Campanha + 6 conjuntos + 9 ads criados (PAUSED)"
  - "IDs e link do Gerenciador retornados ao usuário"
execution_type: "interactive"
quality_gate: "QG-FA-001 (47 checks de fidelidade Andromeda) + QG-PREV-001 (preview confirmado)"
---

# Task: Setup Scale Campaign — Subir Campanha Escala Andromeda

## Sumário Executivo

Cria a **campanha de Escala** seguindo estritamente o método Andromeda:
- 1 campanha ABO
- 6 conjuntos de anúncios (1 Adv+ Puro + 4 Adv+ Sugestões + 1 Audiência Quente)
- 9 anúncios (3 C1 + 3 C2 + 3 C3) replicados em todos os conjuntos
- Advantage+ Audience + Posicionamentos automáticos
- Partilha de orçamento ATIVA
- Sem CPA Máximo, sem regras de valor

**Fontes de verdade:**
- `knowledge/sop-campanha-ui.md` — passo a passo conceitual
- `knowledge/sop-campanha-api.md` — payloads REST
- `knowledge/sop-campanha-mapping.md` — paridade UI ↔ API
- `knowledge/criativos-avaliacao.md` — distribuição C1/C2/C3 dos 9 ads

**Toda escrita na Meta API requer aprovação humana via preview.**

---

## Pipeline Visual

```
START
  |
  v
0. (Step 0) create-custom-audiences ROUNOU? → senão, dispara primeiro
  |
  v
1. Carregar credenciais Meta (load-meta-creds.sh)
  |
  v
2. Coletar contexto do usuário:
   - Nome do produto
   - Destino do tráfego (site / WhatsApp / lead form / Direct IG)
   - Verba diária total
   - 9 criativos disponíveis (ou quantos tem)
   - Conta = Escala (act_NNNN)
  |
  v
3. Mapear OBJECTIVE pelo destino do tráfego
  |
  v
4. Montar PAYLOAD completo (campanha + 6 adsets + 9 creatives + 9 ads × 6)
  |
  v
5. Rodar QG-FA-001 (47 checks de fidelidade Andromeda)
   ↳ Se score < 47: ajustar antes de mostrar
  |
  v
6. PREVIEW HUMANO (legível, não JSON cru)
  |
  v
7. APROVAÇÃO ou ITERAÇÃO
   ├─ Pediu ajuste? → volta pro Step 4
   └─ Confirmou? → continua
  |
  v
8. Executar criação na ordem:
   a. Campaign (status=PAUSED)
   b. 6 Adsets (status=PAUSED)
   c. 9 Creatives
   d. Ads (anuncio em cada adset, status=PAUSED)
  |
  v
9. Apresentar resultado: IDs + link Gerenciador + resumo
  |
  v
10. PERGUNTAR: "Ativar agora ou quer revisar no Gerenciador antes?"
    ├─ Revisar primeiro → para aqui
    └─ Ativar → PATCH status=ACTIVE em sequência (campaign → adsets → ads)
  |
  v
END
```

---

## Step-by-Step

### Step 0: Custom Audiences

Verificar se as audiências do set Andromeda existem na conta. Se não:

```
Antes de subir a campanha, preciso garantir que as audiências quentes e de
exclusão existem. Vou rodar create-custom-audiences primeiro.
```

Executar handoff pra `tasks/create-custom-audiences.md`. Voltar com IDs.

### Step 1: Credenciais

```bash
source ./data/load-meta-creds.sh
```

Validar que `META_ACCT_ESCALA` ou `META_ACCT_MAIN` está populado. Se vazio, perguntar qual conta usar.

### Step 2: Coletar contexto do usuário

Perguntas estruturadas:

```yaml
questions:
  - q: "Nome do produto/oferta?"
    field: produto_nome
  - q: "Destino do tráfego — pra onde vai o lead?"
    options:
      1: "Vender direto no site (tem checkout Hotmart/Asaas/Shopify)"
      2: "Captar e-mail/telefone no site"
      3: "Levar pra WhatsApp"
      4: "Levar pra Direct do Instagram"
      5: "Captar via Formulário Meta (sem site)"
      6: "YouTube/blog (tráfego puro)"
    field: destino
  - q: "Verba diária TOTAL pra essa campanha (R$)? Será dividida igualmente entre os 6 conjuntos."
    field: verba_diaria_total
    rule: ">= R$30 (R$5/conjunto mínimo Meta)"
  - q: "Quantos criativos prontos você tem? (ideal: 9)"
    field: num_criativos
  - q: "Lista de e-mail própria existente?"
    field: tem_email_list
  - q: "Negócio é local (entrega só num raio geográfico)?"
    field: eh_local
```

### Step 3: Mapear OBJECTIVE

| Destino do tráfego | `objective` API | `custom_event_type` |
|--------------------|-----------------|---------------------|
| Vender direto no site | `OUTCOME_SALES` | `PURCHASE` |
| Captar e-mail/telefone no site | `OUTCOME_LEADS` | `LEAD` |
| Levar pra WhatsApp (preferência) | `OUTCOME_LEADS` | `LEAD` |
| Direct do Instagram | `OUTCOME_ENGAGEMENT` | `MESSAGING_CONVERSATION_STARTED_7D` |
| Formulário Meta | `OUTCOME_LEADS` | `LEAD` |
| YouTube/blog | `OUTCOME_TRAFFIC` | `LINK_CLICK` |

Citação Andromeda: *"Não importa o que você está vendendo... Só importa pra onde o seu tráfego vai."* `[Fonte: Aula 09-Q&A]`

### Step 4: Montar Payload

#### 4.1 Campanha

```json
{
  "name": "ANDRO_{produto_nome}",
  "objective": "{objective_mapeado}",
  "status": "PAUSED",
  "special_ad_categories": [],
  "buying_type": "AUCTION",
  "is_skadnetwork_attribution": false
}
```

> Não definir `daily_budget` na campanha (ABO).

#### 4.2 6 Adsets — orçamento dividido igualmente

```python
budget_per_adset = (verba_diaria_total // 6) * 100  # em centavos
```

##### Conjunto 1 — Advantage+ Puro

```json
{
  "name": "ADV_Puro",
  "campaign_id": "{campaign_id}",
  "status": "PAUSED",
  "daily_budget": <budget_per_adset>,
  "billing_event": "IMPRESSIONS",
  "optimization_goal": "OFFSITE_CONVERSIONS",
  "destination_type": "WEBSITE",
  "promoted_object": {
    "pixel_id": "{META_PIXEL}",
    "custom_event_type": "{custom_event_type}"
  },
  "targeting": {
    "geo_locations": {
      "countries": ["BR"],
      "location_types": ["home", "recent"]
    },
    "targeting_automation": {"advantage_audience": 1}
  },
  "attribution_spec": [
    {"event_type": "CLICK_THROUGH", "window_days": 7}
  ]
}
```

> Sem idade, sem sexo, sem interesses, sem cidade. Só país.
> `[Fonte: SOP-UI Seção 2.8.2]`

##### Conjuntos 2-5 — Advantage+ com Sugestões

Mesma base do Conjunto 1, mas adiciona `flexible_spec` com 1 cluster por conjunto (3-4 sugestões cada).

```json
{
  "name": "ADV_Int-{cluster_slug}",
  ...,
  "targeting": {
    "geo_locations": {"countries": ["BR"], "location_types": ["home", "recent"]},
    "flexible_spec": [
      {
        "interests": [
          {"id": "{interest_id_1}", "name": "{nome_1}"},
          {"id": "{interest_id_2}", "name": "{nome_2}"},
          {"id": "{interest_id_3}", "name": "{nome_3}"}
        ]
      }
    ],
    "targeting_automation": {"advantage_audience": 1}
  }
}
```

**Como descobrir IDs de interesses:**

```bash
curl -s "https://graph.facebook.com/${META_API_VERSION}/search?type=adinterest&q={termo}&access_token=${META_TOKEN}"
```

Sugerir clusters padrão se usuário não souber:
- Cluster A: Marketing Digital + Marketing de Conteúdo + Mídia Social
- Cluster B: Empreendedorismo + Negócios + Startup
- Cluster C: (depende do nicho — perguntar)
- Cluster D: (idem)

##### Conjunto 6 — Audiência Quente

```json
{
  "name": "QUENTE_Audiencia-completa",
  ...,
  "targeting": {
    "geo_locations": {"countries": ["BR"], "location_types": ["home", "recent"]},
    "custom_audiences": [
      {"id": "{ig_engaged_365d_id}"},
      {"id": "{video_viewers_50pct_365d_id}"},
      {"id": "{site_visitors_180d_id}"},
      {"id": "{email_list_id}"}
    ],
    "targeting_automation": {"advantage_audience": 1}
  }
}
```

##### Exclusões em TODOS os adsets (se aplicável)

Se objective for `OUTCOME_SALES`:
```json
"exclusions": {
  "custom_audiences": [{"id": "{buyers_180d_id}"}]
}
```

Se for `OUTCOME_LEADS`:
```json
"exclusions": {
  "custom_audiences": [
    {"id": "{leads_180d_id}"},
    {"id": "{buyers_180d_id}"}
  ]
}
```

##### Limite de localização (negócio local)

Se `eh_local: true`, adicionar via Account-Level Targeting (separado, fora do adset). Caso contrário, omitir.

#### 4.3 9 Creatives (3 C1 + 3 C2 + 3 C3)

Pra cada criativo trazido pelo usuário:

```json
{
  "name": "C{nivel}-{subtipo}-{slug}",
  "object_story_spec": {
    "page_id": "{META_PAGE}",
    "instagram_actor_id": "{META_IG}",
    "video_data": {
      "video_id": "{video_id}",
      "image_url": "{thumbnail_url}",
      "title": "{headline}",
      "message": "{texto_principal}",
      "call_to_action": {
        "type": "{cta_type_pelo_objective}",
        "value": {"link": "{landing_page_com_utms}"}
      }
    }
  },
  "degrees_of_freedom_spec": {
    "creative_features_spec": {
      "standard_enhancements": {"enroll_status": "OPT_IN"},
      "image_brightness_and_contrast": {"enroll_status": "OPT_IN"}
    }
  }
}
```

Nomenclatura sugerida (baseada em `nomenclatura-protocol.md`):
- `C1-CV-{slug}` — C1 Conteúdo de Valor
- `C1-QP-{slug}` — C1 Quebra de Padrão
- `C1-DOR-{slug}` — C1 Dor
- `C2-HS-{slug}` — C2 Hard Sell
- `C2-DEMO-{slug}` — C2 Demonstrativo
- `C2-COMP-{slug}` — C2 Comparativo
- `C3-PROVA-{slug}` — C3 Prova
- `C3-OBJ-{slug}` — C3 Quebra de Objeção
- `C3-URG-{slug}` — C3 Urgência

Se o usuário tem **menos de 9** criativos, registrar gap e seguir com o que tem (método: *"Se você tem pouco criativo, já vai direto para a campanha de escala"*).

`call_to_action.type` por objective:

| Objective | CTA padrão |
|-----------|-----------|
| `OUTCOME_SALES` | `SHOP_NOW` ou `LEARN_MORE` |
| `OUTCOME_LEADS` | `SIGN_UP` |
| `OUTCOME_LEADS` (WhatsApp) | `WHATSAPP_MESSAGE` |
| `OUTCOME_ENGAGEMENT` (Direct IG) | `MESSAGE_PAGE` |
| `OUTCOME_TRAFFIC` | `LEARN_MORE` |

#### 4.4 Ads — instanciar creatives nos adsets

Decisão estratégica:
- **Caminho A (recomendado pelo método):** mesmos 9 criativos em **TODOS** os 6 conjuntos = **54 ads**
- **Caminho B (lite):** 9 criativos em apenas 1 adset (se conta com baixa verba e poucos criativos)

Default: Caminho A. Confirmar com usuário se diferente.

```json
{
  "name": "{creative_name}",
  "adset_id": "{adset_id}",
  "creative": {"creative_id": "{creative_id}"},
  "status": "PAUSED"
}
```

### Step 5: Quality Gate QG-FA-001 (Fidelidade Andromeda)

Antes do preview, rodar 47 checks contra o payload montado. Lista completa em `data/qg-fidelidade-andromeda.yaml`.

Top 10 checks críticos:

```
[ ] objective casa com destino do tráfego
[ ] bid_strategy: LOWEST_COST_WITHOUT_CAP (sem CPA Máx)
[ ] ABO (sem daily_budget na campanha)
[ ] Partilha de orçamento ATIVA (se disponível)
[ ] 6 adsets ou número aprovado pelo usuário
[ ] Conjunto 1 = Adv+ Puro (sem flexible_spec, sem age_min/max)
[ ] Todos com targeting_automation.advantage_audience: 1
[ ] Sem publisher_platforms (Adv+ Placements)
[ ] Sem bid_amount (CPA Máx vazio)
[ ] Conjunto 6 com 4 custom_audiences quentes
```

Se algum check falhou: ajustar payload e re-rodar QG. Score deve ser **47/47** ou justificativa explícita do gap (ex: "menos de 9 criativos").

### Step 6: Preview Humano

Renderizar conforme `templates/preview-campanha-tmpl.md`. Resumo:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Vou subir esta campanha na conta {ACCT_NAME}

CAMPANHA
  Nome: ANDRO_{produto}
  Objetivo: {objective_pt}  ← {por_que}
  ABO ✓ (sem orçamento na campanha)
  Partilha 20%: ATIVA
  Bid strategy: LOWEST_COST_WITHOUT_CAP

6 CONJUNTOS (R$ {budget_per_adset/100} / dia cada — total R$ {total}/dia)
  1. ADV_Puro          — só Brasil, sem segmentação
  2. ADV_Int-{cluster_A} — sugestões: {3 interesses}
  3. ADV_Int-{cluster_B} — sugestões: {3 interesses}
  4. ADV_Int-{cluster_C} — sugestões: {3 interesses}
  5. ADV_Int-{cluster_D} — sugestões: {3 interesses}
  6. QUENTE_Audiencia-completa — 4 públicos personalizados

  Todos: Adv+ Audience ON, Adv+ Placements ON, sem CPA Máx
  Excluindo: {compradores_180d / leads_180d}
  Pixel: {META_PIXEL} | Evento: {custom_event_type}

9 CRIATIVOS (mesmos nos 6 conjuntos = 54 ads no total)
  C1 (topo de funil):
    - {C1-CV-slug}
    - {C1-QP-slug}
    - {C1-DOR-slug}
  C2 (meio de funil):
    - {C2-HS-slug}
    - {C2-DEMO-slug}
    - {C2-COMP-slug}
  C3 (fundo de funil):
    - {C3-PROVA-slug}
    - {C3-OBJ-slug}
    - {C3-URG-slug}

  CTA padrão: {cta_type}
  Link de destino: {landing_page}

FIDELIDADE ANDROMEDA: ✓ {N}/47 checks passaram
{lista de gaps se houver}

GAPS DECLARADOS:
  ⚠ {ex: usuário só tem 7 criativos, faltam C2-DEMO e C3-OBJ}
  ⚠ {ex: lista de e-mail vazia, audiência quente vai contar com 3/4}

Confirmar e subir tudo PAUSED? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 7: Aprovação ou Iteração

| Resposta usuário | Ação |
|------------------|------|
| Confirma | Vai pro Step 8 |
| Pede ajuste ("muda X pra Y") | Ajusta payload, roda QG de novo, re-apresenta preview |
| Cancela | Aborta, limpa estado, retorna |

### Step 8: Execução na ordem

```bash
# 8.1 Campaign
CAMPAIGN_ID=$(curl -X POST "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/campaigns" \
  -d "{...payload da campanha...}" \
  -d "access_token=${META_TOKEN}" | jq -r '.id')

# 8.2 6 Adsets (loop)
for adset_payload in adsets[]; do
  ADSET_ID=$(curl -X POST ".../adsets" -d "..." -d "campaign_id=${CAMPAIGN_ID}" ...)
  ADSET_IDS+=("$ADSET_ID")
done

# 8.3 9 Creatives (loop)
for creative_payload in creatives[]; do
  CREATIVE_ID=$(curl -X POST ".../adcreatives" -d "...")
  CREATIVE_IDS+=("$CREATIVE_ID")
done

# 8.4 Ads — 9 creatives × 6 adsets = 54 ads
for ADSET_ID in adsets[]; do
  for CREATIVE_ID in creatives[]; do
    AD_ID=$(curl -X POST ".../ads" \
      -d "adset_id=${ADSET_ID}" \
      -d "creative={\"creative_id\":\"${CREATIVE_ID}\"}" \
      -d "status=PAUSED" -d "...")
  done
done
```

**Tudo PAUSED.** Não ativar nada nesta etapa.

### Step 9: Resultado

```
✅ Campanha criada com sucesso (PAUSED)

CAMPANHA
  ID: {campaign_id}
  Link Gerenciador: https://adsmanager.facebook.com/adsmanager/manage/campaigns?act={ACCT}&selected_campaign_ids={campaign_id}

CONJUNTOS (6)
  ADV_Puro           id: {id}
  ADV_Int-cluster_A  id: {id}
  ...

ADS (54)
  C1-CV em ADV_Puro  id: {id}
  C1-QP em ADV_Puro  id: {id}
  ...

Status: tudo PAUSED. Pronto pra revisão.
```

### Step 10: Ativar ou revisar?

```
Próximo passo:

1. Você quer revisar primeiro no Gerenciador (recomendado pra primeira subida)?
2. Ou eu já ativo direto?

Se quiser ativar, eu rodo:
  PATCH campanha → ACTIVE
  PATCH 6 adsets → ACTIVE
  PATCH 54 ads → ACTIVE

Qual? [revisar/ativar]
```

Se "ativar":

```bash
curl -X POST ".../{CAMPAIGN_ID}" -d "status=ACTIVE" -d "..."
for ADSET_ID in adsets[]; do
  curl -X POST ".../{ADSET_ID}" -d "status=ACTIVE" -d "..."
done
for AD_ID in ads[]; do
  curl -X POST ".../{AD_ID}" -d "status=ACTIVE" -d "..."
done
```

Confirmar mudança de status:
```
✅ Campanha ATIVA. Algoritmo Meta vai começar a impressionar nos próximos minutos.

Próximas 24h: o método recomenda observar quais criativos NÃO gastam nada
(IA já julgou ruins). Esses devem ser pausados.

Próximos 7 dias: identificar a CATEGORIA vencedora (dor? hard sell? prova?)
e replicar com ângulos diferentes.

Quer que eu volte daqui a 24h pra rodar o triagem inicial?
```

---

## Quality Gates

### QG-FA-001 — Fidelidade Andromeda

Definido em `data/qg-fidelidade-andromeda.yaml`. 47 checks, score mínimo 47/47 ou gaps declarados.

### QG-PREV-001 — Preview confirmado

- [ ] Preview foi apresentado em formato humano (não JSON)
- [ ] Gaps foram declarados explicitamente
- [ ] Usuário deu confirmação explícita ("s" / "sim" / "ativar" / equivalente)
- [ ] Iteration count > 0 se usuário pediu ajustes

---

## Error Handling

| Cenário | Ação |
|---------|------|
| Custom Audiences não existem | Disparar Step 0 (create-custom-audiences) |
| Conta sem permissão (token errado) | Bloquear, orientar usuário a verificar credenciais |
| Conta nova travada | Avisar: "70% das campanhas que não gastam é por conta nova travada — abrir suporte Meta" |
| Falha de rede no meio da criação | Reportar IDs criados até o ponto da falha. Permitir retry/cleanup |
| Pixel sem eventos | Avisar: pode subir mas otimização não vai funcionar bem |
| Menos de 9 criativos | OK, prosseguir registrando gap |
| Mais de 9 criativos disponíveis | Sugerir levar excedentes pra Conta Teste |

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Usuário quer subir sem Custom Audiences (Conjunto 6 sem audiência quente) | Avisar que perde fidelidade Andromeda. Confirmar se quer mesmo assim. |
| Usuário quer 9 conjuntos em vez de 6 | OK (método aceita 10-12). Atualizar payload. |
| Usuário quer 3 conjuntos só (poucas opções de público) | OK (método orienta: "se só tem 3 públicos, faz 3"). |
| Usuário quer pular Adv+ Audience | Bloquear: contradiz método. Sugerir testar isso na Conta Teste. |
| Usuário quer CPA Máximo na primeira subida | Bloquear: método diz pra começar SEM. Sugerir adicionar depois se CPA cair muito. |
| Usuário quer destino "Site+Formulário" | Aceitar mas avisar: método diz Site na primeira subida da Escala (testar Site+Form na Teste depois). |

---

**Task Status:** Ready for Production (v2.0.0 — reescrita 2026-05-06)
**Substitui:** v1.0.0 que era esqueleto
