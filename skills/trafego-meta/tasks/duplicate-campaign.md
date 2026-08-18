---
task: "Duplicate Campaign"
responsavel: "@scale-operator | @test-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Campanha existente (ID) + ajustes desejados (opcional)"
Saida: "Campanha duplicada PAUSED com ajustes aplicados, fiel ao Andromeda. Custom Audiences reaproveitadas."
Checklist:
  - "Campanha origem identificada e lida via API"
  - "Ajustes do usuário coletados (delta vs origem)"
  - "Custom Audiences reaproveitadas (não duplicadas)"
  - "Payload da nova campanha montado com delta aplicado"
  - "Quality Gate de fidelidade Andromeda passou"
  - "Preview com diff (origem vs cópia) apresentado e confirmado"
  - "Nova campanha + adsets + ads criados (PAUSED)"
execution_type: "interactive"
quality_gate: "QG-FA-001 (fidelidade) + QG-PREV-001 (preview confirmado)"
---

# Task: Duplicate Campaign — Duplicar Campanha Existente

## Sumário Executivo

Duplica uma campanha existente (geralmente da Conta Escala ou Conta Teste), aplicando ajustes pontuais e mantendo fidelidade ao método Andromeda.

**Casos de uso comuns:**

1. **Levar teste pra escala** — campanha de teste deu bom, duplica pra Escala com objective fiel
2. **Novo produto / nova oferta** — copia estrutura validada, troca produto e criativos
3. **Internacional** — copia campanha BR pra LATAM (muda país, idioma de criativos)
4. **Black Friday / data sazonal** — copia base, troca apenas mensagens e urgência
5. **Rotação de criativos** — copia campanha que está saturada, troca os 9 criativos

> **Aviso método Andromeda:** *"NUNCA duplicar campanhas na escala como estratégia de escala — escala é vertical (mais orçamento), não horizontal (mais campanhas)."* `[Fonte: andromeda-rules.md, Aula 09-Q&A]`
>
> Duplicar pra **escalar** é anti-padrão. Duplicar pra **adaptar** (novo produto, internacional, sazonal) é OK.

---

## Pipeline Visual

```
START
  |
  v
1. Receber ID da campanha origem + tipo de duplicação
  |
  v
2. Carregar credenciais Meta + ler campanha origem completa
   (campaign + adsets + creatives + ads)
  |
  v
3. Validar caso de uso (não duplicar pra escalar!)
  |
  v
4. Coletar AJUSTES desejados:
   - Conta destino (mesma ou outra?)
   - Nome da nova campanha
   - Mudar produto?
   - Mudar país/idioma?
   - Trocar 9 criativos?
   - Reusar Custom Audiences?
   - Mudar verba?
  |
  v
5. Montar payload da nova campanha aplicando delta
  |
  v
6. Rodar QG-FA-001
  |
  v
7. PREVIEW com DIFF (origem vs cópia)
  |
  v
8. APROVAÇÃO ou ITERAÇÃO
  |
  v
9. Executar criação (ordem: campaign → adsets → creatives → ads)
  |
  v
10. Resultado + perguntar ativar?
  |
  v
END
```

---

## Step-by-Step

### Step 1: Receber input

```yaml
inputs_obrigatorios:
  - campaign_id_origem: "120237495717650227"  # ID da campanha a duplicar
  - tipo_duplicacao:
      options:
        1: "Levar teste pra Escala"
        2: "Novo produto / nova oferta"
        3: "Internacional (LATAM, etc.)"
        4: "Sazonal (BF, Natal, etc.)"
        5: "Rotação de criativos"
        6: "Outro (descreve)"
```

### Step 2: Ler campanha origem

```bash
source ./data/load-meta-creds.sh

CAMP_ID="${1}"

# 2.1 Campanha
curl -s "https://graph.facebook.com/${META_API_VERSION}/${CAMP_ID}?fields=id,name,objective,status,bid_strategy,daily_budget,lifetime_budget,special_ad_categories,buying_type,is_skadnetwork_attribution&access_token=${META_TOKEN}" > /tmp/campaign.json

# 2.2 Adsets da campanha
curl -s "https://graph.facebook.com/${META_API_VERSION}/${CAMP_ID}/adsets?fields=id,name,status,optimization_goal,destination_type,bid_strategy,bid_amount,daily_budget,billing_event,promoted_object,attribution_spec,targeting&limit=50&access_token=${META_TOKEN}" > /tmp/adsets.json

# 2.3 Ads da campanha (com creative_id linkado)
curl -s "https://graph.facebook.com/${META_API_VERSION}/${CAMP_ID}/ads?fields=id,name,adset_id,creative{id,name,object_story_spec,degrees_of_freedom_spec}&limit=200&access_token=${META_TOKEN}" > /tmp/ads.json
```

Parsear e ter um snapshot completo.

### Step 3: Validar caso de uso

Se `tipo_duplicacao` for "escalar uma campanha que está performando bem" (não está na lista das 5):

```
🛑 Aviso método Andromeda:

Você está pedindo pra duplicar uma campanha que está performando bem
pra "escalar". Mas Bárbara é categórica: escala é vertical (aumentar
orçamento da mesma campanha), não horizontal (criar campanha duplicada).

Posso te ajudar de outra forma:
1. Aumentar orçamento da campanha original em 20-50%/dia (escalar vertical)
2. Criar campanha NOVA com produto/oferta diferente (não é duplicação)
3. Você confirma mesmo assim duplicar?
```

Se confirmar, prosseguir com aviso registrado no log.

### Step 4: Coletar ajustes

Apresentar campanha origem em formato resumido e perguntar:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 CAMPANHA ORIGEM — {campaign_name_origem}

Conta: {acct_origem}
Objetivo: {objective}
ABO/CBO: {abo_ou_cbo}
6 conjuntos com R$ {budget}/dia cada
9 criativos (3 C1 + 3 C2 + 3 C3)
Audiências quentes: {ids_originais}
Status: {effective_status}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pra duplicar, me diz:

1. Conta destino — mesma ({acct_origem}) ou outra (act_NNNN)?
2. Nome da nova campanha (sugiro: ANDRO_{produto_novo})?
3. Tipo de duplicação afeta:
   {se tipo=2}: qual produto novo? trocar criativos completos?
   {se tipo=3}: qual país? idioma dos criativos? público local?
   {se tipo=4}: qual data? mensagens sazonais? trocar urgência?
   {se tipo=5}: trocar todos os 9 criativos? quais novos?
4. Reaproveitar Custom Audiences existentes da Conta destino?
   ✓ Sim (recomendado, mais rápido)
   ✗ Não (criar novas — vai disparar create-custom-audiences)
5. Mudar verba diária?
   - Manter R$ {atual}/dia
   - Aumentar pra R$ X/dia
   - Reduzir pra R$ X/dia
```

### Step 5: Montar payload com delta

#### 5.1 Campanha — campos que mantêm vs que trocam

| Campo | Comportamento default |
|-------|----------------------|
| `name` | TROCA pelo novo |
| `objective` | MANTÉM (a menos que tipo=1 — teste→escala às vezes muda) |
| `bid_strategy` | MANTÉM |
| `special_ad_categories` | MANTÉM |
| `daily_budget` (CBO) | TROCA se aumentou/reduziu verba |
| `status` | SEMPRE `PAUSED` |

#### 5.2 Adsets — copia 1:1 a estrutura, ajusta

Pra cada adset original:

| Campo | Comportamento default |
|-------|----------------------|
| `name` | MANTÉM (ADV_Puro, ADV_Int-cluster, QUENTE, etc) |
| `daily_budget` | RECALCULA se verba mudou |
| `optimization_goal` | MANTÉM |
| `destination_type` | MANTÉM |
| `promoted_object.pixel_id` | MANTÉM (a menos que conta destino seja outra) |
| `promoted_object.custom_event_type` | MANTÉM |
| `targeting.geo_locations` | MUDA se internacional (tipo=3) |
| `targeting.flexible_spec` | MUDA se mudou produto/cluster |
| `targeting.custom_audiences` | RECONFIGURA (ver Step 5.3) |
| `targeting.targeting_automation` | MANTÉM |

#### 5.3 Custom Audiences — reaproveitar

Se conta destino = mesma conta origem: usa os mesmos `audience_id` originais.

Se conta destino ≠ origem: rodar `create-custom-audiences` na conta destino primeiro (audiências são por conta, não migram).

#### 5.4 Creatives — decidir trocar ou copiar

| Tipo de duplicação | Default creatives |
|--------------------|-------------------|
| 1. Teste → Escala | MESMO criativo (validar com `creative_id`, mas pode ser que esteja na conta origem — duplicar criativo se mudou de conta) |
| 2. Novo produto | TROCAR todos os 9 |
| 3. Internacional | TROCAR (idioma diferente) |
| 4. Sazonal | TROCAR ou ADAPTAR (mensagens com tema da data) |
| 5. Rotação | TROCAR todos os 9 |

Se trocar: pedir os 9 novos creatives ao usuário (mesmo fluxo do setup-scale Step 4.3).

#### 5.5 Ads — instanciar creatives nos adsets

Se manteve creatives: novos `Ad` linkam aos mesmos `creative_id` (se mesma conta).
Se trocou creatives: novos `Ad` linkam aos novos `creative_id`.

Mesma lógica do setup-scale: 9 creatives × 6 adsets = 54 ads (Caminho A) ou 9 ads num adset (Caminho B).

### Step 6: Quality Gate

Mesmos 47 checks de fidelidade Andromeda do setup-scale (`data/qg-fidelidade-andromeda.yaml`).

### Step 7: Preview com Diff

Formato: `templates/preview-campanha-tmpl.md` com seção DIFF que destaca o que mudou.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Duplicação de campanha

ORIGEM: {nome_origem} ({acct_origem})
DESTINO: {nome_novo} ({acct_destino})

DIFF (o que mudou da origem pra cópia):

  Campo               │ Origem              │ Cópia              │ Mudou?
  ────────────────────┼─────────────────────┼────────────────────┼────────
  Conta              │ {acct_origem}      │ {acct_destino}    │ {sim/não}
  Nome               │ {nome_origem}      │ {nome_novo}       │ SIM
  Objetivo           │ {objective}        │ {objective}       │ não
  Verba/dia (total)  │ R$ {origem}        │ R$ {nova}         │ {sim/não}
  País target        │ {origem}           │ {destino}         │ {sim/não}
  Custom Audiences   │ {ids_origem}       │ {ids_destino}     │ {reaproveita/cria}
  Creatives          │ 9 originais        │ 9 novos / mesmos  │ {sim/não}

CAMPANHA NOVA — payload completo:
  {detalhes técnicos seguindo formato do preview-campanha-tmpl.md}

FIDELIDADE ANDROMEDA: ✓ {N}/47 checks passaram
{gaps se houver}

⚠️ AVISOS:
  {ex: "Audiências da conta destino estão vazias — vão precisar de warm-up"}
  {ex: "9 criativos novos serão criados — squad NÃO produz, você precisa fornecer"}

Confirmar e duplicar tudo PAUSED? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 8: Aprovação ou iteração

| Resposta | Ação |
|----------|------|
| Confirma | Step 9 |
| Pede ajuste | Volta pro Step 4, re-monta, re-apresenta |
| Cancela | Aborta, limpa estado |

### Step 9: Executar criação

Mesma sequência do setup-scale Step 8:
1. POST campaign (PAUSED)
2. POST 6 adsets (PAUSED)
3. POST 9 creatives (se trocou)
4. POST 54 ads (PAUSED)

### Step 10: Resultado + ativar?

Mesmo formato do setup-scale Step 9-10.

---

## Casos especiais

### Caso 1: Levar teste pra escala

Quando teste deu bom (CPA igual ou melhor que padrão por 3+ dias) e usuário quer migrar:

- Ajustar `objective` pra fiel se for o caso (teste com `OUTCOME_TRAFFIC` que vendeu virando `OUTCOME_SALES` na escala)
- Trazer só os criativos vencedores (pode ser menos de 9)
- Aumentar verba conforme aprovação humana

### Caso 2: Internacional (LATAM/EUA)

- Mudar `geo_locations.countries` (ex: `["MX", "CO", "PE", "CL", "AR"]` pra mercado hispânico LATAM)
- Trocar criativos pra idioma local
- Trocar `flexible_spec.interests` (IDs de interesses são por idioma)
- Considerar conta de anúncios separada por região (LATAM, EUA, BR — Bárbara recomenda)
- Ajustar moeda da conta destino

### Caso 3: Sazonal (Black Friday, Natal)

- Manter estrutura (público, conjuntos)
- Trocar criativos com tema sazonal
- Reforçar urgência (C3-URG) com mensagem da data
- Aumentar verba durante a janela
- Atenção: NÃO baixar orçamento Natal/Réveillon (povo está comprando)

### Caso 4: Novo produto

- Tudo novo: nome, criativos, audiências de exclusão (compradores DESSE produto, não do anterior)
- Manter clusters de interesse se for público sobreposto
- Considerar criar nova campanha do zero (setup-scale) em vez de duplicar — geralmente mais limpo

---

## Quality Gates

### QG-FA-001 — Fidelidade Andromeda

Mesmo do setup-scale. Ver `data/qg-fidelidade-andromeda.yaml`.

### QG-DUP-001 — Duplicação Coerente

- [ ] Tipo de duplicação registrado (1-5 ou outro com justificativa)
- [ ] DIFF apresentado claramente
- [ ] Custom Audiences resolvidas (reuso ou criação)
- [ ] Creatives resolvidos (mantém / troca / cria)
- [ ] Aviso anti-padrão se for "duplicar pra escalar"

### QG-PREV-001 — Preview confirmado

Idem ao setup-scale.

---

## Error Handling

| Cenário | Ação |
|---------|------|
| Campanha origem não existe / sem permissão | Bloquear, listar campanhas disponíveis |
| Custom Audiences da origem foram deletadas | Avisar, oferecer recriar |
| Conta destino diferente sem permissões | Bloquear, orientar a verificar token |
| Creatives da origem na outra conta (não acessíveis) | Recriar creatives na conta destino (precisa upload de mídia) |
| Verba destino muito acima do origem (>5x) | Avisar, sugerir escala vertical em vez de duplicar |

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Usuário quer duplicar campanha boa "pra escalar" | Aviso forte (ver Step 3). Confirmar mesmo assim ou redirecionar |
| Usuário quer duplicar 5+ campanhas em sequência | Avisar: anti-padrão. Conversar sobre estratégia real |
| Campanha origem está com effective_status `DISAPPROVED` ou similar | Bloquear, orientar a corrigir antes |

---

**Task Status:** Ready for Production (v1.0.0)
