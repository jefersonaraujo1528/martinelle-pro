---
task: "Duplicate Adset"
responsavel: "@scale-operator | @test-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Adset existente (ID) + ajustes desejados na cópia"
Saida: "Adset duplicado PAUSED dentro da MESMA campanha (ou outra), com ajustes aplicados"
Checklist:
  - "Adset origem identificado e lido via API"
  - "Decisão sobre destino (mesma campanha ou outra)"
  - "Ajustes coletados (público / orçamento / criativos)"
  - "Validação anti-padrão (não duplicar adset bom 'pra escalar')"
  - "Preview com diff (origem vs cópia) apresentado e confirmado"
  - "Adset + ads vinculados criados (PAUSED)"
execution_type: "interactive"
quality_gate: "QG-DUP-002 (duplicação adset coerente) + QG-PREV-001"
---

# Task: Duplicate Adset — Duplicar Conjunto de Anúncios

## Sumário Executivo

Duplica um conjunto de anúncios. Use cases válidos:

1. **Cluster novo de interesse** — copia um conjunto Adv+ Sugestões e troca os interesses (ex: "ADV_Int-marketing" → "ADV_Int-saude")
2. **Hipersegmentação** — copia um conjunto e adapta pra sub-público (ex: profissionais da saúde) — ver Seção 7 do `criativos-avaliacao.md`
3. **Mover de campanha** — adset bom de uma campanha pra outra (não recomendado por método, mas existe)
4. **Mudar exclusões** — copia mantendo público e troca a lista de exclusão

> **Aviso método Andromeda:** *"Não duplica conjunto que está bom — escala é vertical. Aprendizado vive no conjunto (analogia placa-mãe), duplicar quebra esse aprendizado."* `[Fonte: andromeda-rules.md]`
>
> Duplicar adset **bom** pra escalar = anti-padrão.
> Duplicar adset **estrutura** pra abrir cluster novo = OK.

---

## Pipeline Visual

```
START
  |
  v
1. Receber ID do adset origem + tipo de duplicação
  |
  v
2. Carregar credenciais Meta + ler adset origem (com targeting completo)
  |
  v
3. Validar caso de uso (anti-padrão se "escalar adset bom")
  |
  v
4. Coletar AJUSTES:
   - Campanha destino (mesma ou outra)?
   - Nome do novo adset
   - Mudar público (interesses / audience)?
   - Mudar exclusões?
   - Mudar orçamento?
   - Trocar criativos vinculados?
  |
  v
5. Montar payload do novo adset com delta
  |
  v
6. PREVIEW com DIFF (origem vs cópia)
  |
  v
7. APROVAÇÃO ou ITERAÇÃO
  |
  v
8. Executar criação:
   a. POST adset (PAUSED)
   b. POST ads (mesmos creatives da origem ou novos) (PAUSED)
  |
  v
9. Resultado + ativar?
  |
  v
END
```

---

## Step-by-Step

### Step 1: Receber input

```yaml
inputs_obrigatorios:
  - adset_id_origem: "120237495723190227"
  - tipo_duplicacao:
      options:
        1: "Cluster novo de interesse (sugestões diferentes)"
        2: "Hipersegmentação (sub-público específico)"
        3: "Mover/copiar pra outra campanha"
        4: "Trocar exclusões"
        5: "Outro (descreve)"
```

### Step 2: Ler adset origem

```bash
source ./data/load-meta-creds.sh

ADSET_ID="${1}"

# Adset com targeting completo
curl -s "https://graph.facebook.com/${META_API_VERSION}/${ADSET_ID}?fields=id,name,campaign_id,status,optimization_goal,destination_type,bid_strategy,bid_amount,daily_budget,billing_event,promoted_object,attribution_spec,targeting&access_token=${META_TOKEN}" > /tmp/adset.json

# Ads do adset (com creative_id linkado)
curl -s "https://graph.facebook.com/${META_API_VERSION}/${ADSET_ID}/ads?fields=id,name,creative{id,name}&limit=50&access_token=${META_TOKEN}" > /tmp/adset_ads.json
```

### Step 3: Validar caso de uso

Coletar performance do adset origem antes de duplicar:

```bash
curl -s "https://graph.facebook.com/${META_API_VERSION}/${ADSET_ID}/insights?fields=spend,actions,cost_per_action_type,ctr,cpm,frequency&date_preset=last_7d&access_token=${META_TOKEN}"
```

Se adset está performando bem (CPA <= alvo por 3+ dias) e usuário não escolheu uma das 4 opções padrão:

```
🛑 Aviso método Andromeda:

O adset {nome_origem} está performando bem (CPA R$ {cpa} nos últimos 7 dias).
O método é categórico: NÃO duplica adset bom pra escalar.

> "A inteligência fica no conjunto, não na campanha. Se quebrou, perde tudo
   que estava nele. Não mexer no que está dando resultado."

Posso te ajudar de outra forma:
1. Aumentar orçamento desse adset em 20-50%/dia (escalar vertical)
2. Criar adset NOVO com público diferente (cluster diferente, sem competir)
3. Você confirma mesmo assim duplicar?
```

### Step 4: Coletar ajustes

Mostrar adset origem em formato resumido:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📷 ADSET ORIGEM — {name_origem}

Campanha: {campaign_id} ({campaign_name})
Conta: {acct}
Verba: R$ {budget}/dia
Otimização: {optimization_goal}
Pixel + evento: {pixel} / {event}
Targeting:
  - País: {countries}
  - Adv+ Audience: {on/off}
  - Interesses (sugestões): {flexible_spec.interests}
  - Custom Audiences: {custom_audiences}
  - Exclusões: {exclusions.custom_audiences}
Ads vinculados: {N} ads
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pra duplicar, me diz:

1. Campanha destino — mesma ({campaign_id_origem}) ou outra ({list_outras})?
2. Nome do novo adset (sugiro: {sugestao_nome})?
3. {se tipo=1}: quais interesses novos? (3-4 sugestões, 1 cluster)
4. {se tipo=2}: qual sub-público hipersegmentado?
5. {se tipo=4}: quais novas exclusões?
6. Manter mesmo orçamento ({budget}) ou ajustar?
7. Manter mesmos ads/creatives ou subir novos?
   ✓ Manter (recomendado, reutiliza creative_ids)
   ✗ Subir novos (vai pedir os 9 ou subset)
```

### Step 5: Montar payload com delta

#### 5.1 Adset — campos que mantêm vs trocam

| Campo | Comportamento default |
|-------|----------------------|
| `name` | TROCA pelo novo |
| `campaign_id` | MUDA se tipo=3 (move pra outra campanha) |
| `daily_budget` | TROCA se ajustou |
| `optimization_goal` | MANTÉM |
| `destination_type` | MANTÉM |
| `promoted_object` | MANTÉM |
| `attribution_spec` | MANTÉM |
| `billing_event` | MANTÉM |
| `targeting.geo_locations` | MANTÉM (a menos que mude) |
| `targeting.flexible_spec` | MUDA se tipo=1 ou 2 (interesses diferentes) |
| `targeting.custom_audiences` | MUDA se tipo=2 ou 4 |
| `targeting.exclusions` | MUDA se tipo=4 |
| `targeting.targeting_automation` | MANTÉM (Adv+ ON) |
| `status` | SEMPRE `PAUSED` |

#### 5.2 Ads — manter ou trocar

Se manter: pega lista de `creative_ids` dos ads originais, cria novos `Ad` linkando aos mesmos creatives no adset novo.

```bash
for CREATIVE_ID in creative_ids_originais; do
  curl -X POST ".../act_{ACCT}/ads" \
    -d "name=..." \
    -d "adset_id=${NEW_ADSET_ID}" \
    -d "creative={\"creative_id\":\"${CREATIVE_ID}\"}" \
    -d "status=PAUSED" \
    -d "access_token=${META_TOKEN}"
done
```

Se trocar: pedir os novos creatives ao usuário (mesmo fluxo do setup-scale).

### Step 6: Preview com DIFF

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Duplicação de adset

ORIGEM: {name_origem} (campanha {campaign_origem})
DESTINO: {name_novo} (campanha {campaign_destino})

DIFF:

  Campo               │ Origem              │ Cópia              │ Mudou?
  ────────────────────┼─────────────────────┼────────────────────┼────────
  Campanha           │ {origem}           │ {destino}         │ {sim/não}
  Nome               │ {origem}           │ {novo}            │ SIM
  Verba              │ R$ {origem}        │ R$ {nova}         │ {sim/não}
  Adv+ Audience      │ {on}               │ ON (mantém)       │ não
  Interesses         │ {origem_list}      │ {novo_list}       │ {sim/não}
  Custom Audiences   │ {origem}           │ {destino}         │ {sim/não}
  Exclusões          │ {origem}           │ {nova}            │ {sim/não}
  Ads vinculados     │ {N origem}         │ {N novo}          │ {mantém/troca}

ADSET NOVO — payload:
  {detalhes técnicos}

⚠️ AVISOS:
  {ex: "Adset original está com CPA bom — duplicar pode confundir aprendizado"}
  {ex: "Cluster novo tem interesses sobrepostos com adset origem — vão competir"}

QG-DUP-002: ✓ duplicação coerente

Confirmar e criar adset PAUSED? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 7: Aprovação ou iteração

Mesma lógica das outras tasks.

### Step 8: Execução

```bash
# 8.1 Criar novo adset
NEW_ADSET_ID=$(curl -X POST ".../act_{ACCT}/adsets" -d "..." | jq -r '.id')

# 8.2 Criar ads vinculados
for CREATIVE_ID in creative_ids_a_usar; do
  curl -X POST ".../act_{ACCT}/ads" \
    -d "adset_id=${NEW_ADSET_ID}" \
    -d "creative={\"creative_id\":\"${CREATIVE_ID}\"}" \
    -d "status=PAUSED" -d "..."
done
```

### Step 9: Resultado

```
✅ Adset duplicado (PAUSED)

Novo adset:
  ID: {new_adset_id}
  Nome: {novo_nome}
  Campanha: {campaign_destino}
  Ads vinculados: {N}

Link Gerenciador:
  https://adsmanager.facebook.com/adsmanager/manage/adsets?act={ACCT}&selected_adset_ids={new_adset_id}

Quer que eu ative o adset agora ou prefere revisar primeiro?
```

---

## Casos especiais

### Caso: Hipersegmentação (tipo=2)

> Detalhes conceituais: ver `knowledge/criativos-avaliacao.md` Seção 7 (Hipersegmentação) e `knowledge/sop-campanha-ui.md` Seção 2.8.7.

Quando usuário identifica sub-público com forte sinal de compra:

1. Adset origem: ADV_Int-marketing (3 interesses genéricos)
2. Sub-público identificado: profissionais da saúde
3. Novo adset: ADV_HiperSeg-saude
4. Verba: 5-10% da total da campanha
5. Interesses específicos do sub-cluster
6. Idealmente, ads dedicados (não os mesmos genéricos) — alertar usuário

### Caso: Cluster novo de interesse (tipo=1)

Adset original tem 3 interesses (ex: marketing digital, mídia social, marketing de conteúdo).
Novo adset: cluster diferente que ainda não foi explorado (ex: empreendedorismo, hotmart, infoproduto).

Regra do método: máximo 3-4 sugestões por conjunto, 1 cluster por conjunto. Não misturar clusters.

---

## Quality Gates

### QG-DUP-002 — Duplicação Adset Coerente

- [ ] Tipo de duplicação registrado (1-5)
- [ ] DIFF apresentado claramente
- [ ] Aviso anti-padrão se for "escalar adset bom"
- [ ] Targeting do novo adset não compete com origem (mesmo público em conjuntos diferentes da mesma campanha = competição interna — Lei 4 dos Públicos)
- [ ] Custom Audiences resolvidas (reuso ou recriação se conta destino diferente)

### QG-PREV-001 — Preview confirmado

Idem outras tasks.

---

## Error Handling

| Cenário | Ação |
|---------|------|
| Adset origem não existe | Bloquear, listar adsets disponíveis na campanha |
| Custom Audiences referenciadas foram deletadas | Avisar, oferecer recriar ou usar outras |
| Campanha destino não existe | Bloquear, sugerir criar campanha primeiro |
| Mover entre contas distintas | Não funciona via duplicate-adset — orientar usuário a usar duplicate-campaign |

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Usuário quer duplicar adset BOM pra "escalar" | Aviso forte (Step 3). Sugerir aumentar orçamento (escalar vertical). |
| Cópia teria targeting idêntico ao origem na mesma campanha | Bloquear: vão competir entre si (Lei 4 dos Públicos). Forçar diferenciação. |

---

**Task Status:** Ready for Production (v1.0.0)
