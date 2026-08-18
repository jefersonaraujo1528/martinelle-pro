# SOP — Subir e Ajustar Campanha Meta Ads (Graph Marketing API)

**Versão:** 1.1.0
**Fonte:** Método Andromeda (parâmetros estratégicos)
**Documentação técnica:** Meta Graph Marketing API v21.0 (validado contra payload real do Fred Dias em 2026-05-05)
**Data extração:** 2026-05-05
**Changelog v1.1.0:** corrigido `targeting_optimization: expansion_all` → `targeting_automation.advantage_audience: 1` (nome real do campo na v21). Adicionado `geo_locations.location_types`. Ajustado `attribution_spec` pra default real (`7d-click` apenas).

---

## ⚠️ Aviso Importante — MCP Meta Oficial

No momento desta extração, **NÃO existe MCP oficial Meta instalado no AIOS** (verificado via `claude mcp list` e `.mcp.json`). Por isso este SOP usa endpoints REST diretos do **Graph Marketing API** como contrato base.

**Quando o MCP Meta oficial for instalado**, qualquer ferramenta dele vai envelopar exatamente esses endpoints. Mapeamento: nome da tool MCP → endpoint REST aqui descrito.

**Como usar esse documento:**
- Como referência pra integração programática direta (Python SDK `facebook_business`, JS `facebook-nodejs-business-sdk`, ou HTTP cru)
- Como contrato de testes pra validar que um MCP Meta cumpre o método
- Como base pra escrever workers que sobem campanhas via n8n / scripts

**Companion docs:**
- `sop-campanha-ui.md` — versão humana (UI Gerenciador)
- `sop-campanha-mapping.md` — tabela cruzada UI ↔ API

---

## Convenções

```
{ad_account_id}    = ID da conta de anúncios (ex: act_123456789)
{access_token}     = token de longa duração com permissões ads_management + business_management
{api_version}      = v20.0 (ou superior)
{pixel_id}         = ID do pixel
{page_id}          = ID da página Facebook
{ig_user_id}       = ID do perfil Instagram (Instagram User ID)
```

**Endpoint base:**
```
https://graph.facebook.com/{api_version}
```

**Auth padrão em todos os exemplos:**
```
?access_token={access_token}
```

---

## NÍVEL 1 — CAMPANHA

### Endpoint

```
POST /{api_version}/act_{ad_account_id}/campaigns
```

### Payload Andromeda — Campanha de Lead (Escala)

```json
{
  "name": "Campanha Escala",
  "objective": "OUTCOME_LEADS",
  "status": "PAUSED",
  "special_ad_categories": [],
  "buying_type": "AUCTION",
  "is_skadnetwork_attribution": false
}
```

### Payload Andromeda — Campanha de Vendas (Escala)

```json
{
  "name": "Campanha Escala",
  "objective": "OUTCOME_SALES",
  "status": "PAUSED",
  "special_ad_categories": []
}
```

### Mapeamento de `objective` por destino do tráfego

| Destino do tráfego | `objective` (API enum) | Justificativa Andromeda |
|--------------------|------------------------|-------------------------|
| Vender no site (checkout) | `OUTCOME_SALES` | *"Você quer levar o cara para vender no site? É venda."* `[Fonte: 09-Q&A]` |
| Captar e-mail/telefone no site ou Formulário Meta | `OUTCOME_LEADS` | *"Você quer captar o e-mail e o telefone dele no site? É lead."* `[Fonte: 09-Q&A]` |
| Tráfego pra WhatsApp (preferência) | `OUTCOME_LEADS` | *"contato no WhatsApp é um lead. Ponto."* `[Fonte: 09-Q&A]` |
| Tráfego pra WhatsApp (alternativa) | `OUTCOME_ENGAGEMENT` | *"Segundo melhor é interação."* `[Fonte: 09-Q&A]` |
| Tráfego pra Direct do Instagram | `OUTCOME_ENGAGEMENT` | `[Fonte: 09-Q&A]` |
| Tráfego pra YouTube/blog | `OUTCOME_TRAFFIC` | `[Fonte: 09-Q&A]` |
| Aumento de seguidores Instagram | `OUTCOME_AWARENESS` ou específico de promoção | `[Fonte: 09-Q&A — recurso "Promover"]` |

### Orçamento — ABO vs CBO

#### [ESCALA] — ABO (recomendado pelo método)

Na criação da campanha, **NÃO definir** `daily_budget` nem `lifetime_budget`. O orçamento vai nos **adsets** (ver Nível 2).

```json
{
  "name": "Campanha Escala",
  "objective": "OUTCOME_LEADS",
  "status": "PAUSED",
  "special_ad_categories": []
  // SEM daily_budget aqui
}
```

#### [ESCALA] alternativo / [TESTE] — CBO

```json
{
  "name": "Campanha Escala CBO",
  "objective": "OUTCOME_LEADS",
  "status": "PAUSED",
  "special_ad_categories": [],
  "daily_budget": 15000,
  "bid_strategy": "LOWEST_COST_WITHOUT_CAP"
}
```

> **Atenção:** valores de orçamento são em **centavos** (ex: `15000` = R$150,00).

`[Fonte: 03-arquitetura-campanhas-escala.md, 04-arquitetura-campanhas-teste.md]`

### Partilha de Orçamento

Equivalente API do "partilhar até 20% do orçamento" (UI):
```json
{
  "campaign_budget_optimization": true,
  "daily_budget": 15000
}
```

Quando trabalhando em ABO, a partilha é controlada por `is_budget_schedule_enabled` ou via configuração do Meta (campos exatos podem variar por versão).

**Decisão Andromeda:**

| Conta | `campaign_budget_optimization` |
|-------|--------------------------------|
| **[ESCALA]** | ATIVAR se disponível |
| **[TESTE]** | Testar com vs sem |

> *"se essa opção aparecer para você, eu recomendo que você deixe ela ativa"* `[Fonte: 03]`

**⚠️ Pegadinha API:** `campaign_budget_optimization=true` em ABO pode bloquear `bid_amount` no nível adset (espelha o bug UI). Pra usar `bid_amount` (CPA Máximo), considerar desabilitar.

### Estados (`status`)

| Estado | Quando |
|--------|--------|
| `PAUSED` | Subindo a campanha (default no setup) |
| `ACTIVE` | Após publicar tudo (campanha + adsets + ads) |
| `DELETED` | Soft delete |
| `ARCHIVED` | Arquivar |

### Resposta esperada

```json
{
  "id": "120210000000000000"
}
```

Guardar `{campaign_id}` para os adsets.

---

## NÍVEL 2 — AD SET (Conjunto de Anúncios)

### Endpoint

```
POST /{api_version}/act_{ad_account_id}/adsets
```

### Payload Andromeda — [ESCALA] Conjunto 1 (Advantage+ Puro)

```json
{
  "name": "Conjunto 1 - Advantage+ Puro",
  "campaign_id": "{campaign_id}",
  "status": "PAUSED",
  "daily_budget": 2500,
  "billing_event": "IMPRESSIONS",
  "optimization_goal": "OFFSITE_CONVERSIONS",
  "destination_type": "WEBSITE",
  "promoted_object": {
    "pixel_id": "{pixel_id}",
    "custom_event_type": "LEAD"
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

> **Nota:** O método usa só "padrão". Validamos contra campanha real (`TESTE_NDF_L03`) — está com `7d-click` apenas, sem `1d-view`. Se você tem campanha rodando bem, mantém esse padrão. Se quiser usar default Meta atual, é `7d-click + 1d-view`. Ambos OK pelo método.

### Payload Andromeda — [ESCALA] Conjuntos 2-5 (Advantage+ com sugestões)

```json
{
  "name": "Conjunto 2 - Cluster Marketing",
  "campaign_id": "{campaign_id}",
  "status": "PAUSED",
  "daily_budget": 2500,
  "billing_event": "IMPRESSIONS",
  "optimization_goal": "OFFSITE_CONVERSIONS",
  "destination_type": "WEBSITE",
  "promoted_object": {
    "pixel_id": "{pixel_id}",
    "custom_event_type": "LEAD"
  },
  "targeting": {
    "geo_locations": {
      "countries": ["BR"]
    },
    "flexible_spec": [
      {
        "interests": [
          {"id": "6003020834693", "name": "Marketing digital"},
          {"id": "6003397425735", "name": "Marketing de conteúdo"}
        ]
      }
    ],
    "targeting_automation": {"advantage_audience": 1}
  }
}
```

> Os IDs de interesses (ex: `6003020834693`) vêm da Targeting Search API:
> ```
> GET /{api_version}/search?type=adinterest&q=marketing+digital
> ```

### Payload Andromeda — [ESCALA] Conjunto 6 (Audiência Quente)

```json
{
  "name": "Conjunto 6 - Audiencia Quente",
  "campaign_id": "{campaign_id}",
  "status": "PAUSED",
  "daily_budget": 2500,
  "billing_event": "IMPRESSIONS",
  "optimization_goal": "OFFSITE_CONVERSIONS",
  "destination_type": "WEBSITE",
  "promoted_object": {
    "pixel_id": "{pixel_id}",
    "custom_event_type": "LEAD"
  },
  "targeting": {
    "geo_locations": {
      "countries": ["BR"]
    },
    "custom_audiences": [
      {"id": "{custom_audience_ig_engaged_365d_id}"},
      {"id": "{custom_audience_video_50pct_id}"},
      {"id": "{custom_audience_site_visitors_id}"},
      {"id": "{custom_audience_email_list_id}"}
    ],
    "targeting_automation": {"advantage_audience": 1}
  }
}
```

---

### Mapeamento de campos críticos

#### `optimization_goal` (Otimização do conjunto)

| Caso | Valor |
|------|-------|
| Lead pelo site / formulário (Andromeda padrão) | `OFFSITE_CONVERSIONS` |
| Vendas pelo site | `OFFSITE_CONVERSIONS` (com `custom_event_type=PURCHASE`) |
| Tráfego (link clicks) | `LINK_CLICKS` |
| Conversas WhatsApp | `CONVERSATIONS` |
| Impressões | `IMPRESSIONS` |

#### `destination_type` (Destino da conversão)

| Conta | Andromeda diz | API |
|-------|---------------|-----|
| **[ESCALA]** | Site | `"WEBSITE"` |
| **[TESTE]** | Testa Site vs Site+Formulário | `"WEBSITE"` vs `"WEBSITE_OR_INSTANT_FORM"` (se disponível) ou `"ON_AD"` |
| Site sem ou ruim | Formulário | `"ON_AD"` (Lead Form) |
| WhatsApp direto | — | `"MESSENGER"` ou `"WHATSAPP"` |

#### `promoted_object` (Pixel + Evento)

```json
{
  "promoted_object": {
    "pixel_id": "{pixel_id}",
    "custom_event_type": "LEAD"      // ou "PURCHASE", "COMPLETE_REGISTRATION", etc.
  }
}
```

| Campanha de... | `custom_event_type` |
|----------------|---------------------|
| Lead | `LEAD` |
| Venda | `PURCHASE` |
| Cadastro | `COMPLETE_REGISTRATION` |

> *"Como é uma campanha de lead, o evento de conversão é lead."* `[Fonte: 03]`

#### `bid_strategy` (vai na CAMPANHA, não no adset, no Meta moderno)

| Andromeda diz | `bid_strategy` |
|---------------|----------------|
| **[ESCALA]** Maximizar número de conversões + sem CPA Máx | `LOWEST_COST_WITHOUT_CAP` |
| **[ESCALA]** com CPA Máximo (etapa de troubleshoot) | `COST_CAP` (define `bid_amount` no adset) |
| Maximizar valor da conversão + ROAS | `LOWEST_COST_WITH_MIN_ROAS` (define `roas_average_floor`) |

> *"a gente vai trabalhar com maximizar o número de conversões"* (escala) `[Fonte: 03]`
> *"a gente não vai colocar CPA máximo aqui... A gente vai deixar sem nada."* `[Fonte: 03]`

#### `bid_amount` (CPA Máximo) — só quando aplicável

```json
{
  "bid_amount": 490,
  "bid_strategy": "COST_CAP"
}
```

`490` = R$4,90 em centavos.

| Conta | Decisão |
|-------|---------|
| **[ESCALA]** | NÃO definir (omitir o campo) |
| **[TESTE]** | Testa com vs sem |

> *"a gente vai deixar sem nada. Deixar o algoritmo trazer ali o custo do lead"* `[Fonte: 03]`

#### `targeting.targeting_automation.advantage_audience` (Advantage+ Audience)

> ✅ Validado contra campanha real do Fred Dias em 2026-05-05.

| Valor | Significado |
|-------|-------------|
| `1` | Advantage+ Audience ATIVO (Andromeda padrão) |
| `0` ou ausente | Restrito à segmentação manual (não-Andromeda) |

Para usar Advantage+ Audience com sugestões: combinar `targeting_automation: {"advantage_audience": 1}` + `flexible_spec` (sugestões) + `geo_locations.countries`.

> *"Posicionamentos também sempre advantage de plus, ou seja, sempre automáticos."* `[Fonte: 03]`

#### `targeting` — Limitar Advantage+ ([TESTE] apenas)

Para o teste de "público segmentado tradicional":

```json
{
  "targeting": {
    "geo_locations": {"countries": ["BR"]},
    "age_min": 18,
    "age_max": 30,
    "genders": [1],
    "interests": [{"id": "...", "name": "..."}]
    // SEM targeting_automation.advantage_audience: 1
  }
}
```

> *"para você desativar, você sempre vai clicar aqui em limitar, mudar a configuração... ele saiu de Advantage Plus"* `[Fonte: 04]`

#### `attribution_spec` (Janela de atribuição)

**[ESCALA]** — usar padrão do Meta (omitir o campo deixa o default):
```json
// padrão atual: 7d click + 1d view
[
  {"event_type": "CLICK_THROUGH", "window_days": 7},
  {"event_type": "VIEW_THROUGH", "window_days": 1}
]
```

> *"Janela de atribuição. Nós não vamos mexer com nada, cara."* `[Fonte: 03]`

#### `billing_event`

Andromeda usa default (`IMPRESSIONS`):
```json
"billing_event": "IMPRESSIONS"
```

#### `value_rules_set` (Regras de Valor)

```json
// [ESCALA] — NÃO incluir
// [TESTE] — pode testar
```

> *"aqui em regras de valor, na via principal... nós não vamos mexer com isso daqui"* `[Fonte: 03]`

#### Posicionamentos

**[ESCALA] — Advantage+ Placements (omitir):**
```json
// NÃO incluir publisher_platforms / facebook_positions / instagram_positions / etc.
// API automaticamente ativa Advantage+ Placements
```

**[TESTE] — Posicionamentos manuais (apenas se testando):**
```json
{
  "targeting": {
    "publisher_platforms": ["facebook", "instagram"],
    "facebook_positions": ["feed", "video_feeds", "marketplace"],
    "instagram_positions": ["stream", "story", "reels"]
  }
}
```

---

### Quantidade e nomenclatura dos adsets

| Default | Mínimo | Máximo prático |
|---------|--------|----------------|
| **6** (1 puro + 4 sugestões + 1 quente) | 3 | 10-12 |

> *"você trabalhar com seis conjuntos de anúncios, mas se você precisar escalar muito, colocar 10, 12, não tem problema algum."* `[Fonte: 03]`

---

## NÍVEL 3 — AD CREATIVE + AD

### 3.1 Criar Creative

```
POST /{api_version}/act_{ad_account_id}/adcreatives
```

#### Vídeo

```json
{
  "name": "C1-Quebra-Padrao-V1",
  "object_story_spec": {
    "page_id": "{page_id}",
    "instagram_actor_id": "{ig_user_id}",
    "video_data": {
      "video_id": "{video_id}",
      "image_url": "https://...",
      "title": "Headline do anúncio",
      "message": "Texto principal do anúncio com CTA escrito.",
      "call_to_action": {
        "type": "SIGN_UP",
        "value": {"link": "https://seusite.com.br/inscricao?utm_source=meta&utm_medium=ads&utm_campaign=escala"}
      }
    }
  },
  "degrees_of_freedom_spec": {
    "creative_features_spec": {
      "standard_enhancements": {"enroll_status": "OPT_IN"},
      "image_brightness_and_contrast": {"enroll_status": "OPT_IN"},
      "image_uncrop": {"enroll_status": "OPT_OUT"},
      "video_auto_crop": {"enroll_status": "OPT_IN"}
    }
  }
}
```

#### Imagem estática

```json
{
  "name": "C1-Conteudo-Valor-Static-1",
  "object_story_spec": {
    "page_id": "{page_id}",
    "instagram_actor_id": "{ig_user_id}",
    "link_data": {
      "image_hash": "{image_hash}",
      "link": "https://seusite.com.br/inscricao?utm_source=meta&utm_medium=ads&utm_campaign=escala",
      "message": "Texto principal do anúncio",
      "call_to_action": {
        "type": "SIGN_UP"
      }
    }
  }
}
```

#### Carrossel

```json
{
  "object_story_spec": {
    "page_id": "{page_id}",
    "link_data": {
      "child_attachments": [
        {"link": "...", "image_hash": "...", "name": "..."},
        {"link": "...", "image_hash": "...", "name": "..."},
        {"link": "...", "image_hash": "...", "name": "..."}
      ],
      "link": "...",
      "message": "...",
      "call_to_action": {"type": "SIGN_UP"}
    }
  }
}
```

### 3.2 Recursos Automáticos do Meta (Advantage+ Creative)

Campo: `degrees_of_freedom_spec.creative_features_spec`.

Cada feature aceita: `OPT_IN` (ativar), `OPT_OUT` (desativar).

**Recomendação Andromeda — opt_in apenas no que vier ativo por default:**

| Feature | Decisão Andromeda |
|---------|-------------------|
| `standard_enhancements` (retoque, contraste) | `OPT_IN` |
| `image_brightness_and_contrast` | `OPT_IN` |
| `text_optimizations` (gerar variações de texto — 5 textos) | `OPT_IN` (vem ativo) |
| `image_templates` (geração de imagens variantes) | `OPT_IN` se já vier ativo |
| `image_uncrop` (sobreposição) | `OPT_OUT` (não recomendado pelo método — "vai que faz merda") |
| `image_animation` (animação 3D) | `OPT_OUT` (não ativar manualmente) |
| `music` | `OPT_IN` se já vier ativo |
| `video_auto_crop` | `OPT_IN` |

> *"Tudo que está aqui em melhoria, que ele já está ativo, deixa. E aqui nessa parte de geração, se você viu que tem algum interessante, você pode habilitar. [...] Isso aqui não tá habilitado, deixa sem, porque vai que faz merda."* `[Fonte: 09-Q&A]`

> Os nomes exatos dos features podem variar por versão da API. Validar via `GET /{api_version}/{ad_creative_id}?fields=degrees_of_freedom_spec`.

### 3.3 Múltiplos textos (recurso de 5 variações automáticas)

API ainda usa `message` como texto principal. As variações são geradas pela Meta automaticamente quando `text_optimizations` está em `OPT_IN`.

> *"Você não vai precisar escrever cinco textos diferentes, não. A IA é inteligente demais. Você só sobe o primeiro texto. E ele vai criar cinco variações."* `[Fonte: 09-Q&A]`

### 3.4 CTA (`call_to_action.type`)

| Tipo de campanha | `call_to_action.type` típico |
|------------------|------------------------------|
| Lead (cadastro) | `SIGN_UP` |
| Venda | `SHOP_NOW` |
| Tráfego pra Instagram | `LIKE_PAGE` ou `INSTAGRAM_FOLLOW` |
| WhatsApp | `WHATSAPP_MESSAGE` |
| Direct Instagram | `MESSAGE_PAGE` |
| Saiba mais (genérico) | `LEARN_MORE` |

**Regra Andromeda:** TODO anúncio deve ter CTA, verbalizada no vídeo OU escrita no `message` (legenda).

> *"todo anúncio, 100% do anúncio, independente de qual estrutura ele está, ele precisa ter chamada para ação"* `[Fonte: 09-Q&A]`

### 3.5 Criar Ad

```
POST /{api_version}/act_{ad_account_id}/ads
```

```json
{
  "name": "Ad C1 V1",
  "adset_id": "{adset_id}",
  "creative": {"creative_id": "{creative_id}"},
  "status": "PAUSED"
}
```

### 3.6 Quantidade — 9 anúncios por adset

Loop de criação:
- 3 ads C1 (baixa consciência)
- 3 ads C2 (média consciência)
- 3 ads C3 (alta consciência)

> *"a víscera do Andrômeda. É a gente ter nove criativos. Falando para C1, C2 e C3. Isso aqui é imutável"* `[Fonte: 09-Q&A]`

**Mesmos creatives podem ser referenciados em múltiplos adsets:**
> *"podem ser os mesmos nove anúncios"* `[Fonte: 03]`

---

## NÍVEL CONTA

### 4.1 Limitação a nível de conta — Negócios Locais

```
POST /{api_version}/act_{ad_account_id}/agencies
```

ou via "Account Targeting Restrictions":

```
POST /{api_version}/act_{ad_account_id}/customaudiences
GET  /{api_version}/act_{ad_account_id}?fields=agency_client_declaration,business
```

> Endpoints exatos para "controles de conta / restrição de localização global" variam por versão. Verificar `Business Manager > Account-Level Targeting`. Funcionalidade pode exigir Business Manager API.

**Decisão Andromeda:**
- Negócio LOCAL → configurar restrição global de localização
- Negócio NACIONAL/digital → não configurar

> *"eu só recomendo você fazer isso para negócios locais. Caso contrário, deixa isso aqui sem nenhum tipo de configuração."* `[Fonte: 04]`

### 4.2 Públicos personalizados (Custom Audiences)

```
POST /{api_version}/act_{ad_account_id}/customaudiences
```

#### Visitantes do site

```json
{
  "name": "Visitantes do site - 180d",
  "subtype": "WEBSITE",
  "retention_days": 180,
  "rule": {
    "inclusions": {
      "operator": "or",
      "rules": [
        {"event_sources": [{"id": "{pixel_id}", "type": "pixel"}], "retention_seconds": 15552000, "filter": {"operator": "and", "filters": [{"field": "event", "operator": "eq", "value": "PageView"}]}}
      ]
    }
  }
}
```

#### Engajamento Instagram (365 dias)

```json
{
  "name": "IG Engaged 365d",
  "subtype": "ENGAGEMENT",
  "retention_days": 365,
  "rule": {
    "inclusions": {
      "operator": "or",
      "rules": [
        {"event_sources": [{"id": "{ig_user_id}", "type": "ig_business"}], "retention_seconds": 31536000, "filter": {"operator": "and", "filters": [{"field": "event", "operator": "eq", "value": "ig_business_profile_all"}]}}
      ]
    }
  }
}
```

> *"pessoas que engajaram com seu Instagram nos últimos 365 dias"* `[Fonte: 03]`

#### Visualizadores de Vídeo (≥50%)

```json
{
  "name": "Video Viewers 50pct",
  "subtype": "ENGAGEMENT",
  "retention_days": 365,
  "rule": {
    "inclusions": {
      "operator": "or",
      "rules": [
        {"event_sources": [{"id": "{page_id}", "type": "page"}], "retention_seconds": 31536000, "filter": {"operator": "and", "filters": [{"field": "event", "operator": "eq", "value": "video_view"}, {"field": "video_progress_percent", "operator": "gte", "value": 50}]}}
      ]
    }
  }
}
```

> *"quem assistiu pelo menos 50% do seu vídeo"* `[Fonte: 03]`

#### Lista de E-mail (Customer File)

```
POST /{api_version}/act_{ad_account_id}/customaudiences
```

```json
{
  "name": "Lista E-mail",
  "subtype": "CUSTOM",
  "description": "Lista própria de e-mail",
  "customer_file_source": "USER_PROVIDED_ONLY"
}
```

Depois subir os hashes:
```
POST /{api_version}/{custom_audience_id}/users
```

#### Compradores (para EXCLUSÃO)

```json
{
  "name": "Compradores Produto X",
  "subtype": "WEBSITE",
  "retention_days": 365,
  "rule": {
    "inclusions": {
      "rules": [{
        "event_sources": [{"id": "{pixel_id}", "type": "pixel"}],
        "filter": {"operator": "and", "filters": [{"field": "event", "operator": "eq", "value": "Purchase"}]}
      }]
    }
  }
}
```

> *"é muito importante você ter arquitetado pronto os públicos que você não quer anunciar... Se você está fazendo uma campanha de leads, você quer excluir quem já virou leads"* `[Fonte: 05]`

Usar como exclusão:
```json
{
  "targeting": {
    "exclusions": {
      "custom_audiences": [{"id": "{compradores_audience_id}"}]
    }
  }
}
```

---

## AJUSTES PÓS-SUBIDA — OTIMIZAÇÃO

### 5.1 Aumentar orçamento (20-50% por dia)

```
POST /{api_version}/{adset_id}    # se ABO
POST /{api_version}/{campaign_id} # se CBO
```

```json
{
  "daily_budget": 3750
}
```

> Subindo de 2500 → 3750 = +50% (limite Andromeda).

> *"Você pode aumentar todo dia entre 20% e 50%."* `[Fonte: 09-Q&A]`

### 5.2 Reduzir orçamento

Mesmo endpoint — reduzir o `daily_budget`. Pode ser ao chão (passo 3 do troubleshoot).

### 5.3 Pausar / Reativar

```json
{"status": "PAUSED"}    // pausar
{"status": "ACTIVE"}    // reativar
```

### 5.4 Sequência de Troubleshoot — "Campanha era boa, ficou ruim"

```python
# Pseudocódigo
def troubleshoot_campaign(campaign_id, has_pressure=False):
    # Passo 1: trocar criativos (subir novos no adset)
    upload_new_creatives(adset_id, count=9)
    if has_pressure: pass
    else: wait_24h(); if recovered: return

    # Passo 2: definir CPA máximo no adset
    update_adset(adset_id, {
      "bid_strategy": "COST_CAP",
      "bid_amount": target_cpa_cents
    })
    if has_pressure: pass
    else: wait_24h(); if recovered: return

    # Passo 3: baixar orçamento ao chão
    update_adset(adset_id, {"daily_budget": minimum_cents})
    wait_24h()
    if recovered: return

    # Passo 4: criar campanha NOVA
    create_new_campaign()
```

> *"Primeira coisa, era boa no passado, então ela tem um histórico positivo... Troativos. Passo um... Colocar o CPA máximo... terceiro caminho... Baixa o orçamento... Você cria uma campanha nova"* `[Fonte: 09-Q&A]`

### 5.5 Diagnóstico "Campanha gastou zero"

```python
def diagnose_zero_spend(account_id, campaign_id):
    # 1. Conta nova com trava (~70% dos casos)
    account = get_account(account_id)
    if account.created_recently:
        return "ACTION: open Meta support ticket"

    # 2. Pixel mal instalado — testar com campanha de Interação (sem pixel)
    test_campaign = create_test_campaign(
      objective="OUTCOME_ENGAGEMENT",
      destination="MESSENGER",
      daily_budget=2000  # R$20
    )
    if test_campaign.spend > 0:
        return "ROOT_CAUSE: pixel"
    else:
        return "ROOT_CAUSE: account or page block"

    # 3. Verificar bloqueio página IG/FB
    # 4. Verificar status de publicação dos ads (devem estar ACTIVE)
```

> *"se gastou zero, é algum problema de configuração... Cria-se campanha de interação. Ao invés de mandar a pessoa pro site, você manda a pessoa pro seu perfil do Instagram, ou pro seu direct, né?... Se gastou, então o problema nem é a sua conta de anúncio, não. Aí nós comprovamos que o problema é o pixel."* `[Fonte: 09-Q&A]`

### 5.6 Pausar anúncio ruim, manter os bons

```json
POST /{api_version}/{ad_id_ruim}
{"status": "PAUSED"}
```

> *"Pausa os ruins. Pronto. Está resolvido, deixa os bons lá."* `[Fonte: 09-Q&A]`

### 5.7 Subir anúncio novo — método A/B Test (sem reset de aprendizado)

Para conjuntos com bom histórico que destrambelharam, usar **Ad Studies / A/B Test** via:

```
POST /{api_version}/act_{ad_account_id}/ad_studies
```

```json
{
  "name": "Test Andromeda Q2",
  "type": "SPLIT_TEST",
  "cells": [
    {"name": "Original", "treatment_percentage": 50, "adsets": ["{original_adset_id}"]},
    {"name": "Variante", "treatment_percentage": 50, "adsets": ["{variant_adset_id}"]}
  ]
}
```

Ou criativos paralelos no mesmo adset usando flag `adlabels`. **Não disponível em todas as contas.**

> *"se eu subir no formato de teste... eu não reseto o período de aprendizado. Então, esse lance do formato teste é recomendado subir quando? Quando a campanha tem bom histórico."* `[Fonte: 09-Q&A]`

### 5.8 Regras automáticas

```
POST /{api_version}/act_{ad_account_id}/customaudiences/?fields=...
```

Endpoint correto:
```
POST /{api_version}/act_{ad_account_id}/adrules_library
```

Exemplo — pausar ad com CPA acima de R$5:

```json
{
  "name": "Auto Pause High CPA",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {"field": "entity_type", "operator": "EQUAL", "value": "AD"},
      {"field": "cost_per_result", "operator": "GREATER_THAN", "value": 500}
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE",
    "execution_options": []
  },
  "schedule_spec": {
    "schedule_type": "HOURLY"
  },
  "status": "ENABLED"
}
```

> Frequências: `HOURLY`, `DAILY`, `CUSTOM` (a cada 30min etc.)

> *"a cada 30 minutos ou 60 minutos, o próprio algoritmo vai lá e olha"* `[Fonte: 04]`

---

## DIVERGÊNCIAS [TESTE] vs [ESCALA] — Mapeamento API

| Item | [ESCALA] (API) | [TESTE] (API) |
|------|----------------|----------------|
| `bid_strategy` (campanha) | `LOWEST_COST_WITHOUT_CAP` | Testa `COST_CAP` / `LOWEST_COST_WITH_MIN_ROAS` |
| `bid_amount` (adset) | omitir | Testa com vs sem |
| `optimization_goal` | `OFFSITE_CONVERSIONS` (max conversões) | Testa `VALUE` (max valor com ROAS) |
| `destination_type` | `WEBSITE` (Lead) ou omitido/`UNDEFINED` (Sales) | Testa `WEBSITE` vs `WEBSITE_OR_INSTANT_FORM` |
| `targeting.targeting_automation.advantage_audience` | `1` (Advantage+) | Testa com vs sem (público segmentado tradicional) |
| `targeting.publisher_platforms` | omitir (Advantage+ Placements) | Pode testar manuais |
| `objective` | Fiel ao destino real | Pode testar `OUTCOME_TRAFFIC` para Lead/Venda |
| Adrules | Pode usar com cuidado | Testa com vs sem |
| `campaign_budget_optimization` (CBO) | `false` (ABO) | Testa `true` |

---

## CHECKLIST API DE SUBIDA — Conta Escala

```
[ ] CAMPAIGN
    [ ] objective correto
    [ ] status: PAUSED
    [ ] special_ad_categories: [] (a menos que produto exija)
    [ ] sem daily_budget (ABO)
    [ ] bid_strategy: LOWEST_COST_WITHOUT_CAP

[ ] CUSTOM AUDIENCES (criadas antes)
    [ ] IG Engaged 365d
    [ ] Video Viewers 50pct
    [ ] Site Visitors
    [ ] Email List
    [ ] Compradores (pra exclusão)
    [ ] Leads (pra exclusão)

[ ] 6 ADSETS (loop)
    [ ] Conjunto 1: Adv+ puro (só geo_locations.countries)
    [ ] Conjuntos 2-5: flexible_spec com 1 cluster cada (3-4 sugestões)
    [ ] Conjunto 6: custom_audiences com os 4 públicos quentes
    [ ] daily_budget igual em todos (centavos)
    [ ] optimization_goal: OFFSITE_CONVERSIONS
    [ ] destination_type: WEBSITE (ou omitir se OUTCOME_SALES)
    [ ] promoted_object: pixel + custom_event_type
    [ ] targeting_automation.advantage_audience: 1
    [ ] sem bid_amount (CPA Máx)
    [ ] sem publisher_platforms (Advantage+ Placements)
    [ ] attribution_spec: padrão
    [ ] exclusions: custom_audiences de compradores/leads conforme estratégia

[ ] AD CREATIVES (9 por adset, podem ser reutilizados)
    [ ] 3 × C1 (baixa consciência)
    [ ] 3 × C2 (média)
    [ ] 3 × C3 (alta)
    [ ] Cada creative com:
        - object_story_spec.page_id e instagram_actor_id
        - call_to_action definido (regra: 100% dos ads)
        - link com UTMs
        - degrees_of_freedom_spec.creative_features_spec:
            * standard_enhancements: OPT_IN
            * text_optimizations: OPT_IN (5 variações automáticas)
            * image_uncrop: OPT_OUT
            * image_animation: OPT_OUT (3D)

[ ] ADS (instanciar creatives nos adsets)
    [ ] adset_id correto
    [ ] creative.creative_id
    [ ] status: PAUSED

[ ] PUBLICAR
    [ ] status: ACTIVE em campanha → adsets → ads (nessa ordem)
```

---

## REFERÊNCIAS

### Citações neste documento

Todas as citações `[Fonte: NN]` referem-se a volumes do **Módulo "Estrutura para Andromeda"** do Método Andromeda:
- `[Fonte: 03]` — Aula 03 (Escala)
- `[Fonte: 04]` — Aula 04 (Teste)
- `[Fonte: 05]` — Aula 05 (Públicos)
- `[Fonte: 09-Q&A]` — Aula 09 (Q&A Estrutura)

### Documentação Meta

- Marketing API: https://developers.facebook.com/docs/marketing-apis/
- Graph API Reference: https://developers.facebook.com/docs/graph-api/reference

### Companion docs deste squad

- `knowledge/sop-campanha-ui.md` — mesmo procedimento via UI Gerenciador
- `knowledge/sop-campanha-mapping.md` — tabela cruzada UI ↔ API
- `knowledge/sop-upload-criativos-api.md` — upload de vídeos/imagens + criação de creatives
- `data/meta-api-credentials.md` — como configurar credenciais Meta API

---

## GOTCHAS de Produção (lições da missão noturna 2026-05-08)

### 1. `is_adset_budget_sharing_enabled` — campo obrigatório

API v21 retorna **HTTP 400** ao criar campanha sem esse campo:

```
"É necessário especificar True ou False no campo is_adset_budget_sharing_enabled"
```

**Sempre incluir explícito:**

```json
{
  "name": "TESTE_NDF_L04",
  "objective": "OUTCOME_SALES",
  "buying_type": "AUCTION",
  "is_adset_budget_sharing_enabled": "true",   // ← OBRIGATÓRIO
  "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
  "special_ad_categories": "[]",
  "status": "PAUSED"
}
```

> **Andromeda padrão = `true`** (compartilhamento 20% entre adsets — VOL-03 sec 2).

### 2. `targeting_automation.individual_setting` é absorvido na v21

Campanhas antigas têm:
```json
"targeting_automation": {
  "advantage_audience": 1,
  "individual_setting": {"age": 1, "gender": 1}
}
```

Em campanhas criadas via API v21, ao setar `individual_setting` o GET subsequente retorna **sem** ele. **Não é bug — é absorção.** `advantage_audience: 1` já flexibiliza idade/gênero por padrão. Ignorar a diferença.

### 3. `custom_audiences` no targeting — sem `name`

GET retorna:
```json
"custom_audiences": [{"id": "120211...", "name": "[ENGAJOU 365D]"}]
```

POST com esse formato pode dar HTTP 400. **Sempre strip o `name`:**

```python
custom_audiences = [{'id': a['id']} for a in source['custom_audiences']]
```

### 4. Fields deprecated/inválidos em GET

- `execution_options` — não existe mais (HTTP 400)
- `contextual_bundling_spec` — requer GK específico (`contextual_bundle_test_api_accounts`) — pular pra contas comuns

### 5. `targeting.brand_safety_content_filter_levels`

Default Meta é `['FACEBOOK_FULL_INVENTORY']` (mais restritivo). Andromeda padrão usa `['FACEBOOK_RELAXED', 'AN_RELAXED']` (maior alcance). **Setar explícito** se quer match L01.

### 6. `targeting.age_range` redundante

L01 antigo tem `age_range: [18, 65]` E `age_min: 18`, `age_max: 65`. Em campanhas novas, basta `age_min/max` — `age_range` é redundante mas não atrapalha.

### 7. Rate limit Meta — code 17

Sintoma: `"User request limit reached"` — espera ~1h pra liberar. Conta típica aguenta ~200-400 calls/hora. Em pipelines de criação massiva (3 campanhas + 18 adsets + 144 ads), prepare:
- Sleep 0.4-1s entre calls
- Cache configs do template (L01) uma vez só
- Use upload paralelo (5 workers) só pra uploads — adcreative/ads em sequência

### 8. Ordem de criação importa

Criar adsets/ads **com `status: ACTIVE`** quando a campanha ainda está sem ads pode dar erro de orçamento. **Pattern seguro:**

```
1. Criar campanha (status: PAUSED)
2. Criar adsets (status: PAUSED)
3. Criar creatives + ads (status: ACTIVE)
4. Ativar adsets (PATCH status: ACTIVE)
5. Ativar campanha (PATCH status: ACTIVE)
```

### 9. URL UTMify do Fred Dias

URL canônica (não simplificar — `xcod` é hash da loja UTMify):

```
https://digitaldofuturo.ai/?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&xcod=FBhQwK21wXxR{{campaign.name}}|{{campaign.id}}hQwK21wXxR{{adset.name}}|{{adset.id}}hQwK21wXxR{{ad.name}}|{{ad.id}}hQwK21wXxR{{placement}}
```

### 10. Endpoint `/copies` da campanha — quando NÃO usar

`POST /campaigns/{id}/copies` clona campanha **incluindo todos os ads antigos**. Se objetivo é "campanha nova com criativos novos", uma das duas:

a) `/copies` + listar todos ads do clone + setar status DELETED neles + criar novos ads (mais calls)
b) Criar campanha do zero replicando configs + criar adsets + criar ads (caminho usado nesta missão)

**Se voce quer fidelidade 100% pra L01 com mínimo esforço,** vai de (a). **Se quer estrutura customizada (mais adsets),** vai de (b).

### 11. Validação pós-criação obrigatória

Sempre rode diff pós-criação contra template (L01):

```python
# Diff L01 vs nova_campanha em fields críticos
fields = 'is_adset_budget_sharing_enabled,bid_strategy,objective,buying_type'
# + adset: targeting (recursivo), promoted_object, attribution_spec, optimization_goal, billing_event
```

Se aparecer diff, corrigir via `POST /{adset_id}` com `targeting=json` antes de ativar.

---

*Documento operacional do squad de tráfego — endpoints REST validados contra Graph Marketing API v21.0. Parâmetros estratégicos fielmente extraídos do método.*
