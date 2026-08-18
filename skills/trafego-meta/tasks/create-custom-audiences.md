---
task: "Create Custom Audiences"
responsavel: "@scale-operator | @test-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Conta de anúncios definida + pixel ativo + página FB/IG vinculados"
Saida: "Custom Audiences (audiência quente + exclusões) criadas/validadas na conta. IDs salvos pra uso nos adsets."
Checklist:
  - "4 públicos quentes existem ou foram criados (IG 365d, Vídeo 50%, Site visitors, Lista email)"
  - "2 públicos de exclusão existem (compradores 180d, leads 180d)"
  - "IDs salvos em variável temporária pra uso na próxima task"
execution_type: "interactive"
quality_gate: "Audiências validadas por listagem na API (GET /customaudiences)"
---

# Task: Create Custom Audiences — Step 0 do Setup Andromeda

## Por que isso é Step 0

Antes de subir qualquer campanha Andromeda, precisamos das **Custom Audiences** que vão alimentar:

1. **Conjunto 6 — Audiência Quente** (4 audiências combinadas como sugestão Adv+)
2. **Exclusões em todos os conjuntos** (compradores e/ou leads, conforme estratégia)

Sem essas audiências prontas, o setup-scale ou setup-test falha. Por isso essa task **roda primeiro**.

> Detalhes conceituais sobre o uso dessas audiências: ver `knowledge/sop-campanha-ui.md` Seção 2.8 e `knowledge/criativos-avaliacao.md` Seção 6.

---

## Pipeline Visual

```
START
  |
  v
1. Carregar credenciais Meta (load-meta-creds.sh)
  |
  v
2. GET /customaudiences — listar audiências existentes
  |
  v
3. Identificar quais já existem (REUTILIZAR) vs faltam (CRIAR)
  |
  v
4. Apresentar PREVIEW ao usuário (o que vai criar e por quê)
  |
  v
5. APROVAÇÃO HUMANA → criar audiências faltantes via API
  |
  v
6. Salvar IDs (todos os 6) pra próxima task
  |
  v
END
```

---

## Step-by-Step

### Step 1: Carregar credenciais

```bash
source ./data/load-meta-creds.sh
```

Espera-se: `META_TOKEN`, `META_API_VERSION`, `META_ACCT_MAIN` (ou `META_ACCT_ESCALA` / `META_ACCT_TESTE` conforme contexto), `META_PIXEL`, `META_PAGE`, `META_IG`.

Se falhou: orientar usuário a configurar via `data/meta-api-credentials.md` (uma das 3 opções: env, .env, 1Password).

### Step 2: Listar audiências existentes

```bash
ACCT="${META_ACCT_MAIN}"  # ou ESCALA/TESTE conforme contexto da task chamadora

curl -s "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/customaudiences?fields=id,name,subtype,retention_days,approximate_count_lower_bound,approximate_count_upper_bound&limit=100&access_token=${META_TOKEN}" > /tmp/audiences.json

cat /tmp/audiences.json | python3 -m json.tool
```

Parsear o JSON e identificar quais audiências do "set Andromeda" já existem na conta. **Match flexível por nome** (caso o usuário tenha nomenclatura própria já estabelecida — exemplo: `[ENGAJAMENTO] [@SEUPERFIL] [365D]` cobre o slot "IG Engagement 365d").

### Step 3: Identificar gaps

**Audiências do "set Andromeda" obrigatórias:**

| Slot | Função | Critério de match |
|------|--------|--------------------|
| `IG_ENGAGED_365D` | Conjunto Quente — engajamento Instagram 365 dias | `subtype: IG_BUSINESS` + `retention_days: 365` |
| `VIDEO_VIEWERS_50PCT_365D` | Conjunto Quente — viewers ≥50% últimos 365 dias | `subtype: ENGAGEMENT` + filtro `video_progress_percent >= 50` |
| `SITE_VISITORS_180D` | Conjunto Quente — visitantes do site (Page View) 180 dias | `subtype: WEBSITE` + filtro `event=PageView` + `retention_days: 180` |
| `EMAIL_LIST` | Conjunto Quente — lista de e-mail própria | `subtype: CUSTOM` + `customer_file_source: USER_PROVIDED_ONLY` |
| `BUYERS_180D` | Exclusão — compradores | `subtype: WEBSITE` + filtro `event=Purchase` + `retention_days: 180` |
| `LEADS_180D` | Exclusão — leads (se campanha de Lead) | `subtype: WEBSITE` + filtro `event=Lead` + `retention_days: 180` |

Marcar:
- ✓ Existe → reutilizar `id` (capturar)
- ✗ Falta → criar
- ⚠ Existe mas com janela diferente (ex: 30d em vez de 180d) → perguntar ao usuário se quer reutilizar ou criar novo

### Step 4: Preview obrigatório

Apresentar ao usuário ANTES de criar:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Custom Audiences pra Conta {ACCT_NAME}

REUTILIZAR (já existem):
  ✓ {nome existente 1} — id: {id}
  ✓ {nome existente 2} — id: {id}

CRIAR NOVAS (faltam):
  + IG Engagement 365d (subtype IG_BUSINESS)
    ↳ Vai contar pessoas que interagiram com o Instagram nos últimos 365 dias
  + Site Visitors 180d (subtype WEBSITE — Page View)
    ↳ Vai contar visitantes do site nos últimos 180 dias
  + Buyers 180d (subtype WEBSITE — Purchase) [exclusão]
    ↳ Compradores dos últimos 180 dias, pra excluir das campanhas de aquisição

⚠️ AVISO janela diferente:
  - "{nome existente}" está com retention 30d, método Andromeda usa 365d.
    Reutilizar ou criar novo?

Total: {N} criar + {M} reutilizar = {Total} audiências.

Confirmar criação? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Criar audiências faltantes (após confirmação)

#### 5.1 IG Engagement 365d

```bash
curl -X POST "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/customaudiences" \
  -d "name=IG Engagement 365d" \
  -d "subtype=ENGAGEMENT" \
  -d "retention_days=365" \
  -d "rule={\"inclusions\":{\"operator\":\"or\",\"rules\":[{\"event_sources\":[{\"id\":\"${META_IG}\",\"type\":\"ig_business\"}],\"retention_seconds\":31536000,\"filter\":{\"operator\":\"and\",\"filters\":[{\"field\":\"event\",\"operator\":\"eq\",\"value\":\"ig_business_profile_all\"}]}}]}}" \
  -d "access_token=${META_TOKEN}"
```

#### 5.2 Video Viewers 50% (365d)

```bash
curl -X POST "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/customaudiences" \
  -d "name=Video Viewers 50pct 365d" \
  -d "subtype=ENGAGEMENT" \
  -d "retention_days=365" \
  -d "rule={\"inclusions\":{\"operator\":\"or\",\"rules\":[{\"event_sources\":[{\"id\":\"${META_PAGE}\",\"type\":\"page\"}],\"retention_seconds\":31536000,\"filter\":{\"operator\":\"and\",\"filters\":[{\"field\":\"event\",\"operator\":\"eq\",\"value\":\"video_view\"},{\"field\":\"video_progress_percent\",\"operator\":\"gte\",\"value\":50}]}}]}}" \
  -d "access_token=${META_TOKEN}"
```

#### 5.3 Site Visitors 180d (Page View)

```bash
curl -X POST "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/customaudiences" \
  -d "name=Site Visitors 180d" \
  -d "subtype=WEBSITE" \
  -d "retention_days=180" \
  -d "rule={\"inclusions\":{\"operator\":\"or\",\"rules\":[{\"event_sources\":[{\"id\":\"${META_PIXEL}\",\"type\":\"pixel\"}],\"retention_seconds\":15552000,\"filter\":{\"operator\":\"and\",\"filters\":[{\"field\":\"event\",\"operator\":\"eq\",\"value\":\"PageView\"}]}}]}}" \
  -d "access_token=${META_TOKEN}"
```

#### 5.4 Lista de E-mail (placeholder — usuário sobe lista depois)

```bash
curl -X POST "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/customaudiences" \
  -d "name=Email List" \
  -d "subtype=CUSTOM" \
  -d "description=Lista própria de e-mail (popular via upload)" \
  -d "customer_file_source=USER_PROVIDED_ONLY" \
  -d "access_token=${META_TOKEN}"
```

> **Nota:** o public ficará vazio até o usuário fazer upload da lista. Isso fica fora do escopo dessa task — squad só cria o slot. Avisar usuário.

#### 5.5 Buyers 180d (exclusão)

```bash
curl -X POST "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/customaudiences" \
  -d "name=Buyers 180d" \
  -d "subtype=WEBSITE" \
  -d "retention_days=180" \
  -d "rule={\"inclusions\":{\"operator\":\"or\",\"rules\":[{\"event_sources\":[{\"id\":\"${META_PIXEL}\",\"type\":\"pixel\"}],\"retention_seconds\":15552000,\"filter\":{\"operator\":\"and\",\"filters\":[{\"field\":\"event\",\"operator\":\"eq\",\"value\":\"Purchase\"}]}}]}}" \
  -d "access_token=${META_TOKEN}"
```

#### 5.6 Leads 180d (exclusão — só se campanha for de Lead)

```bash
curl -X POST "https://graph.facebook.com/${META_API_VERSION}/${ACCT}/customaudiences" \
  -d "name=Leads 180d" \
  -d "subtype=WEBSITE" \
  -d "retention_days=180" \
  -d "rule={\"inclusions\":{\"operator\":\"or\",\"rules\":[{\"event_sources\":[{\"id\":\"${META_PIXEL}\",\"type\":\"pixel\"}],\"retention_seconds\":15552000,\"filter\":{\"operator\":\"and\",\"filters\":[{\"field\":\"event\",\"operator\":\"eq\",\"value\":\"Lead\"}]}}]}}" \
  -d "access_token=${META_TOKEN}"
```

### Step 6: Capturar IDs

Após cada `POST`, a Meta retorna `{"id": "12345..."}`. Salvar todos os 6 IDs num bloco temporário:

```yaml
custom_audiences:
  ig_engaged_365d_id: "120238..."
  video_viewers_50pct_365d_id: "120238..."
  site_visitors_180d_id: "120238..."
  email_list_id: "120238..."
  buyers_180d_id: "120238..."
  leads_180d_id: "120238..."
```

Esses IDs são consumidos por `setup-scale.md` e `setup-test.md` no Conjunto 6 (Audiência Quente) e nas exclusões.

---

## Quality Gate QG-CA-001

Antes de retornar controle pra task chamadora:

- [ ] Todas as 6 audiências do set Andromeda existem na conta (criadas ou reutilizadas)
- [ ] IDs capturados e disponíveis
- [ ] Usuário foi avisado se alguma audiência precisa de ação manual (ex: subir lista de e-mail)
- [ ] Tempo de "warm up" — Meta leva ~30min pra audiência ficar "ready". Avisar o usuário.

Se PASS → handoff de volta pra task chamadora com IDs.

---

## Error Handling

| Cenário | Ação |
|---------|------|
| Conta sem pixel ativo | Bloquear: "pixel obrigatório pra audiências de site. Rode setup-conta-trafego primeiro" |
| Pixel sem eventos disparados ainda | Avisar: "audiências vão ficar vazias até pixel disparar eventos" |
| Token sem permissão `ads_management` | Bloquear: "token precisa de `ads_management`. Verificar System User" |
| Conta nova travada | Sugerir: "conta nova pode ter trava — abrir suporte Meta" |
| API rate limit | Aguardar 1min, retry 1x |

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Usuário só quer criar SUBSET (ex: pula lista de email) | OK, criar só os escolhidos. Avisar gaps. |
| Audiência com nome genérico ambíguo | Perguntar ao usuário qual reutilizar |
| Conta sem qualquer pixel | Bloquear, mandar pra setup-conta-trafego primeiro |

---

**Task Status:** Ready for Production (v1.0.0)
