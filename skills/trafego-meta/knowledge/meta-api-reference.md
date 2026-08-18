# Meta Marketing API — Reference

Endpoints chave do Meta Marketing API usados pelo squad.

## Autenticacao

```
Access Token: ver .env do projeto (META_ACCESS_TOKEN)
Scopes: ads_management, ads_read, business_management, pages_manage_posts, pages_read_engagement
```

## Setup do App Meta (PRE-REQUISITO)

O token vem de um Meta App registrado em developers.facebook.com.
**Se o app estiver em "modo de desenvolvimento", a API so funciona para LEITURA e criacao de campanhas/ad sets.
Criar ANUNCIOS (ads) e CRIATIVOS (adcreatives) EXIGE app em modo LIVE/PUBLICO.**

### Checklist antes de operar via API

1. Acessar https://developers.facebook.com/apps/{APP_ID}/settings/basic/
2. Verificar se o app esta em modo **Publico/Live** (toggle no topo da pagina)
3. Se estiver em **Desenvolvimento**, mudar para **Publico**:
   - Adicionar Privacy Policy URL (obrigatorio): ex. `https://seusite.com/politica-de-privacidade`
   - Pode ser necessario completar App Review para permissoes avancadas
4. Permissoes minimas necessarias: `ads_management`, `pages_manage_posts`, `pages_read_engagement`

### Por que isso importa

- Campanhas e Ad Sets: funcionam em dev mode (nao criam Page posts)
- Ads e AdCreatives com `object_story_spec`: BLOQUEADOS em dev mode (criam dark posts na Page)
- Erro exato: "O post do criativo dos anuncios foi criado por um app que esta em modo de desenvolvimento"

### App (template — preencha com seu app)

| Campo | Valor (exemplo / placeholder) |
|-------|-------------------------------|
| App Name | `<Nome do seu App Meta>` |
| App ID | `<SEU_APP_ID>` (15 a 16 dígitos) |
| Dashboard | `https://developers.facebook.com/apps/<SEU_APP_ID>/settings/basic/` |
| Status necessario | **LIVE/PUBLICO** |

> Pra descobrir seu App ID: Meta for Developers → My Apps → seu app → Settings → Basic.

## Ad Accounts (template — preencha com suas contas)

Liste aqui as contas que você usa. Estrutura sugerida:

| ID (formato `act_NNN`) | Nome interno | Função | Status |
|------------------------|--------------|--------|--------|
| `act_<SEU_ACCT_ESCALA>` | `<Nome da conta de Escala>` | Conta Escala (via principal Andromeda) | Ativa |
| `act_<SEU_ACCT_TESTE>` | `<Nome da conta de Teste>` | Conta Teste (laboratório) | Ativa |
| `act_<OUTRA_CONTA>` | `<Outra conta — ex: Imersão, Internacional>` | Função adicional | Ativa |

Pra listar suas contas via API:
```bash
curl -s "https://graph.facebook.com/${META_API_VERSION}/me/adaccounts?fields=id,name,account_status,currency&access_token=${META_TOKEN}"
```

## Campaigns

### Criar campanha
```
POST /act_{ad_account_id}/campaigns
  name: "ANDRO_{PRODUTO}"
  objective: "OUTCOME_SALES"
  special_ad_categories: []
  buying_type: "AUCTION"
  status: "PAUSED"
```

### Ler campanha
```
GET /{campaign_id}
  fields: name,status,objective,daily_budget,lifetime_budget
```

### Atualizar status
```
PATCH /{campaign_id}
  status: "ACTIVE" | "PAUSED" | "ARCHIVED"
```

## Ad Sets (Conjuntos)

### Criar conjunto
```
POST /act_{ad_account_id}/adsets
  campaign_id: {campaign_id}
  name: "{TEMP}_{TIPO}"
  optimization_goal: "OFFSITE_CONVERSIONS"
  billing_event: "IMPRESSIONS"
  daily_budget: {value_in_cents}
  targeting: {targeting_spec}
  status: "PAUSED"
```

### Targeting — Advantage+ sem sugestoes (ADV_Puro)
```json
{
  "geo_locations": {"countries": ["BR"]},
  "age_min": 18,
  "age_max": 65,
  "publisher_platforms": ["facebook", "instagram"],
  "targeting_automation": {"advantage_audience": 1}
}
```

### Targeting — Advantage+ com sugestoes (ADV_Int-*)
```json
{
  "geo_locations": {"countries": ["BR"]},
  "targeting_automation": {"advantage_audience": 1},
  "flexible_spec": [{"interests": [{"id": "...", "name": "Marketing digital"}]}]
}
```

### Targeting — Audiencia personalizada (QUENTE)
```json
{
  "custom_audiences": [{"id": "{engagement_audience_id}"}, {"id": "{website_visitor_id}"}],
  "excluded_custom_audiences": [{"id": "{purchaser_180d_id}"}]
}
```

### Atualizar orcamento (escala vertical)
```
PATCH /{adset_id}
  daily_budget: {new_value_in_cents}
```

### Pausar conjunto
```
PATCH /{adset_id}
  status: "PAUSED"
```

## Ad Creatives

### Criar criativo
```
POST /act_{ad_account_id}/adcreatives
  name: "{FORMATO}_{ANGULO}_{H}"
  object_story_spec: {
    "page_id": "{page_id}",
    "video_data": {
      "video_id": "{video_id}",
      "title": "{titulo}",
      "message": "{copy}",
      "call_to_action": {"type": "SHOP_NOW", "value": {"link": "{url_com_utms}"}}
    }
  }
```

### Criar anuncio
```
POST /act_{ad_account_id}/ads
  name: "{FORMATO}_{ANGULO}_{H}"
  adset_id: {adset_id}
  creative: {"creative_id": "{creative_id}"}
  status: "ACTIVE"
  tracking_specs: [{"action.type": ["offsite_conversion"], "fb_pixel": ["{pixel_id}"]}]
```

## Insights (Metricas)

### Metricas diarias por conjunto
```
GET /act_{ad_account_id}/insights
  fields: spend,impressions,clicks,ctr,cpc,cpm,actions,cost_per_action_type,frequency,reach
  date_preset: today
  level: adset
  filtering: [{"field":"campaign.id","operator":"IN","value":["{campaign_id}"]}]
```

### Metricas semanais (trend)
```
GET /act_{ad_account_id}/insights
  fields: spend,cost_per_action_type,ctr,cpc,cpm,frequency
  time_range: {"since":"YYYY-MM-DD","until":"YYYY-MM-DD"}
  time_increment: 1
  level: campaign
```

### Verificar delivery
```
GET /{adset_id}/delivery_estimate
GET /{ad_id}?fields=effective_status,ad_review_feedback
```

## Custom Audiences

### Criar audiencia de compradores (exclusao)
```
POST /act_{ad_account_id}/customaudiences
  name: "Compradores 180d"
  subtype: "CUSTOM"
  customer_file_source: "USER_PROVIDED_ONLY"
  retention_days: 180
```

### Criar audiencia de engajamento
```
POST /act_{ad_account_id}/customaudiences
  name: "Engajadores 365d"
  subtype: "ENGAGEMENT"
  rule: {"retention_seconds": 31536000, "inclusions": {"operator": "or", "rules": [...]}}
```

## Limites e Boas Praticas

- Rate limit: 200 calls/hora por ad account (standard)
- Batch requests: ate 50 operacoes por batch
- daily_budget em centavos (R$100 = 10000)
- Status inicial sempre PAUSED — ativar so apos revisao
- Esperar 24-48h apos ativar antes de otimizar (aprendizado)

## Aprendizados Operacionais (campo de batalha)

### Upload de videos
- Videos **< 100MB**: upload direto via `POST /{ad_account_id}/advideos` com `-F source=@arquivo`
- Videos **> 100MB**: OBRIGATORIO usar chunked upload (start/transfer/finish) com chunks de 1MB
- Upload direto de arquivos grandes falha com "HTTP error before end of send"

### Thumbnail de video
- Ao criar ad com video, **sempre incluir `image_url`** no `video_data`
- Sem thumbnail o Meta rejeita: "Seu anuncio precisa de uma miniatura de video"
- Pegar via `GET /{video_id}?fields=thumbnails` e usar `thumbnails.data[0].uri`

### Criacao de ads via API (encoding)
- O campo `creative` aceita JSON-encoded string (nao objeto aninhado)
- **NUNCA usar subprocess+curl** pra passar JSON complexo — aspas e caracteres especiais sao manglados pelo shell
- **SEMPRE usar urllib.request** (Python) com `urllib.parse.urlencode` — encoding limpo, zero problema
- Script de referencia funcional: `/tmp/create_all_ads.py`

### Scheduling (start_time)
- `start_time` e definido no **ad set**, nao na campanha ou ad
- Se o start_time ja passou, o ad set fica ativo imediatamente e ads criados comecam a entregar na hora
- Formato: ISO 8601 com timezone, ex: `2026-03-09T00:03:00-0300`

### Rate limit
- 95 requests falhados em sequencia = rate limit imediato ("conta de anuncios tem quantidade excessiva de chamadas")
- Recuperacao: esperar ~5 min
- Dica: adicionar `time.sleep(0.3)` entre requests pra nao estourar

### Campanhas ABO via API
- Requer `is_adset_budget_sharing_enabled=true` no POST de criacao
- Requer `bid_strategy=LOWEST_COST_WITHOUT_CAP` junto (senao erro de "estrategia de lance")

### Page ID e Instagram ID

Cada aluno tem seus próprios. Estrutura no `data/.env` ou 1Password:

```
META_PAGE=<SEU_PAGE_ID>
META_IG=<SEU_IG_BUSINESS_ID>
```

Pra descobrir o IG ID a partir do Page ID:
```bash
curl -s "https://graph.facebook.com/${META_API_VERSION}/${META_PAGE}?fields=instagram_business_account&access_token=${META_TOKEN}"
```

Ambos são obrigatórios no `object_story_spec` pra veicular em FB + IG.
