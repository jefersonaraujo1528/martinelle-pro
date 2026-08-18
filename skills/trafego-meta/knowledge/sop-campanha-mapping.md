# Mapeamento UI ↔ API — Subir Campanha Andromeda

**Versão:** 1.0.0
**Propósito:** tabela cruzada entre o nome do campo no Gerenciador de Anúncios da Meta (UI humana) e o equivalente JSON na Graph Marketing API. Cada linha carrega o **valor padrão Andromeda** pra Conta de Escala.

**Companion:** `sop-campanha-ui.md`, `sop-campanha-api.md`.

---

## NÍVEL 1 — CAMPANHA

| UI (Gerenciador) | API (campo JSON) | Valor padrão Andromeda [ESCALA] | Fonte |
|------------------|------------------|----------------------------------|-------|
| Objetivo da campanha | `objective` | `OUTCOME_LEADS` ou `OUTCOME_SALES` (depende do destino) | `09-Q&A` |
| Nome da campanha | `name` | `"Campanha Escala"` | `03` |
| Categoria especial de anúncio | `special_ad_categories` | `[]` | — |
| Tipo de compra | `buying_type` | `"AUCTION"` (default) | — |
| Orçamento da campanha (CBO) | `daily_budget` (na campanha) | OMITIR (Andromeda usa ABO) | `03` |
| Estratégia de lance | `bid_strategy` | `"LOWEST_COST_WITHOUT_CAP"` | `03` |
| Otimização do orçamento da campanha (CBO toggle) | `campaign_budget_optimization` | `false` (ABO recomendado) | `03` |
| Partilha de orçamento (até 20%) | (controlado por `is_budget_schedule_enabled` ou config Meta) | ATIVAR se disponível | `03` |
| Status | `status` | `"PAUSED"` (durante setup) → `"ACTIVE"` (publicar) | — |

---

## NÍVEL 2 — CONJUNTO DE ANÚNCIOS

### Configurações Principais

| UI (Gerenciador) | API (campo JSON) | Valor padrão Andromeda [ESCALA] | Fonte |
|------------------|------------------|----------------------------------|-------|
| Nome do conjunto | `name` | `"Conjunto 1 - Adv+ Puro"`, etc. | `03` |
| Campanha (link) | `campaign_id` | `{campaign_id}` | — |
| Destino da conversão (Site/Formulário/WhatsApp) | `destination_type` | `"WEBSITE"` | `03` |
| Conjunto de dados (Pixel) | `promoted_object.pixel_id` | `{pixel_id}` | `03` |
| Evento de conversão | `promoted_object.custom_event_type` | `"LEAD"` ou `"PURCHASE"` | `03` |
| Objetivo de desempenho (Otimização) | `optimization_goal` | `"OFFSITE_CONVERSIONS"` | `03` |
| Maximizar nº conversões vs valor | `bid_strategy` (na CAMPANHA) | `"LOWEST_COST_WITHOUT_CAP"` | `03` |
| Objetivo de custo de resultado (CPA Máximo) | `bid_amount` | OMITIR (deixar em branco) | `03` |
| ROAS Mínimo | `bid_amount` (com `LOWEST_COST_WITH_MIN_ROAS` na campanha) | OMITIR | `04` |
| Regras de valor | `value_rules_set` | OMITIR (não usar) | `03` |
| Modelo de atribuição | `attribution_spec` | Padrão (omitir, ou `[{"event_type":"CLICK_THROUGH","window_days":7},{"event_type":"VIEW_THROUGH","window_days":1}]`) | `03` |
| Modelo Incremental | (não usar) | NÃO USAR | `03` |
| Janela de atribuição | `attribution_spec.window_days` | Padrão | `03` |
| Orçamento (ABO) | `daily_budget` (centavos) | Igual em todos os conjuntos | `03` |
| Cobrança | `billing_event` | `"IMPRESSIONS"` | `03` |

### Públicos / Segmentação

| UI (Gerenciador) | API (campo JSON) | Valor padrão [ESCALA] | Fonte |
|------------------|------------------|------------------------|-------|
| Advantage+ Audience (toggle) | `targeting.targeting_automation.advantage_audience` | `1` (validado em campanha real do Fred Dias v21) | `03` |
| Limitar ainda mais o alcance | (definir filtros rígidos sem `targeting_automation.advantage_audience: 1`) | NÃO USAR (Escala) | `03` |
| Localização > País | `targeting.geo_locations.countries` | `["BR"]` (ou país-alvo) | `03` |
| Localização > Tipo (home/recent/travel) | `targeting.geo_locations.location_types` | `["home", "recent"]` (default Meta validado real) | — |
| Localização > Cidade/Região | `targeting.geo_locations.cities`, `.regions` | OMITIR (Conjunto 1 puro); usar só nível conta se local | `03/04` |
| Localização > Raio (negócio local) | `targeting.geo_locations.location_types` | OMITIR (use Account-Level) | `04` |
| Idade mínima | `targeting.age_min` | OMITIR | `03` |
| Idade máxima | `targeting.age_max` | OMITIR | `03` |
| Sexo | `targeting.genders` | OMITIR | `03` |
| Idioma | `targeting.locales` | OMITIR | `03` |
| Interesses (sugestões em Adv+) | `targeting.flexible_spec[].interests` | Conjuntos 2-5: 1 cluster cada (3-4 IDs) | `03` |
| Comportamentos | `targeting.flexible_spec[].behaviors` | OMITIR (a menos que cluster específico) | `03` |
| Públicos personalizados | `targeting.custom_audiences` | Conjunto 6: 4 audiências quentes | `03` |
| Públicos lookalike | `targeting.custom_audiences` (com type lookalike) | OK usar mas Adv+ é preferido | `09` |
| Públicos de exclusão | `targeting.exclusions.custom_audiences` | Compradores + leads conforme estratégia | `05` |

### Posicionamentos

| UI (Gerenciador) | API (campo JSON) | Valor padrão [ESCALA] | Fonte |
|------------------|------------------|------------------------|-------|
| Advantage+ Placements (toggle) | OMITIR `publisher_platforms` etc. | Default = Advantage+ | `03` |
| Plataforma (FB/IG) | `targeting.publisher_platforms` | OMITIR | `03` |
| Posicionamentos Facebook | `targeting.facebook_positions` | OMITIR | `03` |
| Posicionamentos Instagram | `targeting.instagram_positions` | OMITIR | `03` |
| Stories, Reels, Feeds | (idem) | OMITIR | `03` |
| Dispositivos | `targeting.device_platforms` | OMITIR | `03` |

---

## NÍVEL 3 — ANÚNCIO (Ad + Creative)

### Estrutura do Creative

| UI (Gerenciador) | API (campo JSON) | Valor padrão Andromeda | Fonte |
|------------------|------------------|------------------------|-------|
| Identidade > Página Facebook | `object_story_spec.page_id` | `{page_id}` da marca | — |
| Identidade > Conta Instagram | `object_story_spec.instagram_actor_id` | `{ig_user_id}` da marca | — |
| Formato > Imagem | `object_story_spec.link_data.image_hash` | hash da imagem | — |
| Formato > Vídeo | `object_story_spec.video_data.video_id` | id do vídeo | — |
| Formato > Carrossel | `object_story_spec.link_data.child_attachments` | array de cartões | — |
| Texto principal | `object_story_spec.*.message` | Texto único — IA gera 5 variações | `09-Q&A` |
| Título / Headline | `object_story_spec.*.title` ou `name` no card | Definido por anúncio | — |
| Descrição | `object_story_spec.*.description` | — | — |
| Link de destino | `object_story_spec.*.link` | URL com UTMs | — |
| CTA (botão) | `object_story_spec.*.call_to_action.type` | `SIGN_UP` (Lead), `SHOP_NOW` (Venda), `WHATSAPP_MESSAGE` (WA) | `09-Q&A` |
| Texto da CTA verbal/legenda | (faz parte do `message` ou `title`) | Sempre presente em 100% dos ads | `09-Q&A` |

### Recursos Automáticos do Meta (Advantage+ Creative)

| UI (Gerenciador) | API — `degrees_of_freedom_spec.creative_features_spec.*.enroll_status` | Padrão Andromeda | Fonte |
|------------------|------------------------------------------------------------------------|------------------|-------|
| Geração de imagens (Adv+) | `image_templates` | `OPT_IN` se já vier ativo | `09-Q&A` |
| Variação de texto (5 textos) | `text_optimizations` | `OPT_IN` (default) | `09-Q&A` |
| Retoque visual / contraste | `image_brightness_and_contrast` ou `standard_enhancements` | `OPT_IN` | `09-Q&A` |
| Animação de imagem (3D) | `image_animation` | `OPT_OUT` | `09-Q&A` |
| Sobreposição | `image_uncrop` | `OPT_OUT` ("vai que faz merda") | `09-Q&A` |
| Música de fundo | `music` | `OPT_IN` se já vier ativo | `09-Q&A` |
| Auto-crop de vídeo | `video_auto_crop` | `OPT_IN` | — |
| Melhoria de texto | `text_generation` | `OPT_IN` se já vier ativo | `09-Q&A` |

### Estrutura do Ad

| UI (Gerenciador) | API (campo JSON) | Valor padrão | Fonte |
|------------------|------------------|--------------|-------|
| Nome do anúncio | `name` | Padrão `C1-Quebra-V1`, etc. | — |
| Conjunto (link) | `adset_id` | `{adset_id}` | — |
| Creative | `creative.creative_id` | `{creative_id}` | — |
| Status | `status` | `PAUSED` durante setup → `ACTIVE` | — |

---

## NÍVEL CONTA

| UI (Gerenciador) | API (endpoint/campo) | Padrão Andromeda | Fonte |
|------------------|----------------------|------------------|-------|
| Definições > Controles da conta > Conjunto de controle de público | Account-level targeting (Business Manager API — endpoints variam) | Configurar SE negócio local | `04` |
| Localização restrita a nível conta | (subset de account-level targeting) | SE negócio local: definir cidades/raio | `04` |
| Idade mínima/máxima a nível conta | (idem) | NÃO recomenda | `04` |
| Lista de exclusão a nível conta | (Custom Audience aplicada globalmente) | Estratégico | `04` |
| Anúncios a colaboradores | (config Business Manager) | NÃO recomenda mexer | `04` |

### Custom Audiences (Públicos Personalizados)

| UI > Públicos > Tipo | API endpoint | Configuração Andromeda | Fonte |
|----------------------|--------------|-----------------------|-------|
| Público > Site (Pixel) | `POST /act_{id}/customaudiences` (subtype=WEBSITE) | Visitantes (page view), compradores, leads | `03/05` |
| Público > Lista de clientes | `POST /act_{id}/customaudiences` (subtype=CUSTOM, customer_file_source=USER_PROVIDED_ONLY) | Lista de e-mail | `03` |
| Público > Página Facebook | (subtype=ENGAGEMENT, page) | Engajamento da página | — |
| Público > Instagram | (subtype=ENGAGEMENT, ig_business) | Engajamento IG 365d | `03` |
| Público > Vídeo | (subtype=ENGAGEMENT, video) | Viewers ≥50% | `03` |
| Público > Lookalike (LAL) | `POST /act_{id}/customaudiences` (subtype=LOOKALIKE) | Pode usar mas caminhando pra aposentado | `09` |

### Regras Automáticas

| UI (Gerenciador) | API endpoint | Padrão Andromeda | Fonte |
|------------------|--------------|------------------|-------|
| Regras > Criar nova regra | `POST /act_{id}/adrules_library` | Pode usar com cuidado | `04` |
| Frequência (30min/horária/diária) | `schedule_spec.schedule_type` | `HOURLY` ou `DAILY` | `04` |
| Filtro: CPA acima de X | `filters[].field=cost_per_result, operator=GREATER_THAN, value=X` | Threshold definido por campanha | `04` |
| Ação: pausar | `execution_spec.execution_type=PAUSE` | Comum | `04` |

---

## OTIMIZAÇÃO PÓS-SUBIDA

| Ação humana | API call | Limite Andromeda | Fonte |
|-------------|----------|------------------|-------|
| Aumentar orçamento diário | `POST /{adset_id}` ou `POST /{campaign_id}` (CBO) | +20% a +50% por dia | `09-Q&A` |
| Reduzir orçamento | (idem, valor menor) | Quando troubleshoot OU vaca magra OU sem suporte em feriado | `09-Q&A` |
| Pausar anúncio ruim | `POST /{ad_id}` `{status:PAUSED}` | Imediato | `09-Q&A` |
| Trocar criativos (passo 1 troubleshoot) | `POST /act_{id}/adcreatives` + `POST /act_{id}/ads` | 1 dia entre cada passo (ou tudo no mesmo dia se urgente) | `09-Q&A` |
| Definir CPA Máximo (passo 2 troubleshoot) | `POST /{adset_id}` `{bid_strategy:COST_CAP, bid_amount:X}` | Após trocar criativos | `09-Q&A` |
| Baixar orçamento ao chão (passo 3 troubleshoot) | `POST /{adset_id}` `{daily_budget:N}` | Após CPA Máx | `09-Q&A` |
| Criar campanha nova (passo 4 troubleshoot) | `POST /act_{id}/campaigns` | Última cartada | `09-Q&A` |
| Subir anúncio em conjunto bom | (NÃO FAZER) | "Não caça confusão" | `09-Q&A` |
| Subir anúncio em conjunto destrambelhado (era bom) | A/B Test: `POST /act_{id}/ad_studies` | Não reseta aprendizado | `09-Q&A` |

---

## CHECKLIST CRUZADO — PARIDADE UI ↔ API

Use ao validar que sua automação API entrega o mesmo resultado que faria na UI.

```
CAMPANHA
[ ] objective ↔ Objetivo da campanha
[ ] name ↔ Nome
[ ] status PAUSED→ACTIVE ↔ Status
[ ] bid_strategy LOWEST_COST_WITHOUT_CAP ↔ Maximizar nº de conversões
[ ] sem daily_budget ↔ ABO

ADSET (×6)
[ ] destination_type WEBSITE ↔ Site
[ ] promoted_object.pixel_id + custom_event_type ↔ Pixel + Evento
[ ] optimization_goal OFFSITE_CONVERSIONS ↔ Otimização para Conversões
[ ] sem bid_amount ↔ CPA Máximo vazio
[ ] sem value_rules_set ↔ Regras de valor não mexidas
[ ] attribution_spec padrão ↔ Janela padrão
[ ] daily_budget igual em todos ↔ Mesmo orçamento por conjunto
[ ] targeting.targeting_optimization expansion_all ↔ Advantage+ Audience ON
[ ] sem publisher_platforms ↔ Advantage+ Placements (auto)
[ ] geo_locations.countries só ↔ Localização: só país
[ ] flexible_spec[] com 1 cluster ↔ Sugestões 3-4 (Conjuntos 2-5)
[ ] custom_audiences x4 ↔ Audiência Quente (Conjunto 6)
[ ] exclusions.custom_audiences ↔ Exclusões (compradores/leads)

CREATIVE
[ ] page_id + instagram_actor_id ↔ Identidade
[ ] message com CTA verbal/textual ↔ Texto principal + CTA
[ ] link com UTMs ↔ URL do site
[ ] call_to_action.type ↔ Botão de CTA
[ ] degrees_of_freedom_spec OPT_IN apropriado ↔ Recursos automáticos só nos defaults

AD (×9 por adset)
[ ] adset_id ↔ Conjunto correto
[ ] creative.creative_id ↔ Creative ligado
[ ] status PAUSED→ACTIVE ↔ Status
[ ] 3 C1 + 3 C2 + 3 C3 ↔ Mix de níveis de consciência
```

---

## Validação contra campanha real (TESTE_NDF_L03 do Fred Dias)

Em 2026-05-05 inspecionei a campanha ativa do Fred Dias via API pra validar nomes de campos:

| Campo no SOP | Valor real visto na API | Status |
|--------------|-------------------------|--------|
| `bid_strategy` | `LOWEST_COST_WITHOUT_CAP` | ✓ |
| `optimization_goal` | `OFFSITE_CONVERSIONS` | ✓ |
| `billing_event` | `IMPRESSIONS` | ✓ |
| `promoted_object.pixel_id` + `custom_event_type` | `PURCHASE` | ✓ |
| `targeting.targeting_automation.advantage_audience` | `1` | ✓ (corrigido em v1.1.0) |
| `targeting.geo_locations.location_types` | `["home", "recent"]` | ✓ (adicionado em v1.1.0) |
| `attribution_spec` | `[{"event_type":"CLICK_THROUGH","window_days":7}]` | ✓ (default real, sem 1d-view) |
| `special_ad_categories` | `[]` | ✓ |
| `buying_type` | `AUCTION` | ✓ |
| `is_skadnetwork_attribution` | `false` | ✓ |

---

## REFERÊNCIAS

| Símbolo | Significado |
|---------|-------------|
| `[Fonte: 03]` | Método Andromeda — Aula 03 (Arquitetura Campanhas Escala) |
| `[Fonte: 04]` | Método Andromeda — Aula 04 (Arquitetura Campanhas Teste) |
| `[Fonte: 05]` | Método Andromeda — Aula 05 (Arquitetura dos Públicos) |
| `[Fonte: 09-Q&A]` | Método Andromeda — Aula 09 (Q&A Estrutura) |
| `[ESCALA]` | Conta de Escala — via principal do método |
| `[TESTE]` | Conta de Teste — onde se exploram as variações |

### Companion docs deste squad

- `knowledge/sop-campanha-ui.md` — passo a passo via UI Gerenciador
- `knowledge/sop-campanha-api.md` — passo a passo via Graph Marketing API
- `data/meta-api-credentials.md` — configurar credenciais

---

*Documento operacional do squad — paridade UI ↔ API verificada contra Graph Marketing API v21.0.*
