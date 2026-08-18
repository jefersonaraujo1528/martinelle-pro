---
task: "Operate Scale"
responsavel: "@scale-operator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Campanha escala ativa (QG-TA-002 PASS)"
Saida: "Campanhas otimizadas, metricas coletadas, acoes executadas com aprovacao"
Checklist:
  - "Pacing verificado"
  - "CPA comparado com Estrela Guia"
  - "Conjuntos bons mantidos/escalados"
  - "Conjuntos ruins pausados"
  - "Metricas registradas"
execution_type: "interactive"
---

# Task: Operate Scale — Operacao Diaria da Conta Escala

## Executive Summary

Core loop do squad. Roda diariamente na conta escala. 5 passos de otimizacao: pacing → metricas → diagnostico → acao → registro. Leitura e autonoma (GET insights). Escrita precisa de aprovacao humana (PATCH status, PATCH budget).

**Protocolo base:** `knowledge/daily-ops-protocol.md` — os 5 passos compartilhados com operate-test. Esta task adiciona steps especificos da escala (diagnostico, escala vertical, frequencia/fadiga, feed).

## Steps

### Step 1: Coletar metricas (AUTONOMO)

Via Meta API — sem precisar de aprovacao:
```
GET /act_{scale_id}/insights
  fields: spend,impressions,clicks,ctr,cpc,cpm,actions,cost_per_action_type,frequency
  date_preset: today
  level: adset
```

Coletar tambem no nivel de campanha e ad.

### Step 2: Checar pacing (AUTONOMO)

Verificar gasto proporcional ao horario:
- As 12h → ~50% do budget deveria estar gasto
- As 18h → ~75%
- Se as 18h gastou <60% → problema de entrega

```
pacing_ratio = spend_hoje / (daily_budget * hora_atual / 24)
```

Se pacing ruim → ir pro Step 3 (diagnostico).
Se pacing ok → ir pro Step 4 (otimizacao).

### Step 3: Diagnostico (se necessario — AUTONOMO)

Campanha que nao gasta — 7 causas:
1. Lance muito baixo
2. Publico muito pequeno
3. Restricao de entrega
4. Sobreposicao de publico
5. Criativo reprovado
6. Pixel com problema
7. Orcamento muito baixo

Via API:
```
GET /{adset_id}/delivery_estimate
GET /{ad_id}?fields=effective_status,ad_review_feedback
GET /act_{id}/delivery_estimate?targeting_spec={spec}
```

Crosscheck de metricas pra causa raiz:
- CPA alto + CTR baixo = criativo fraco
- CPA alto + CTR bom + CPM alto = competicao/sazonalidade
- CPA alto + CTR bom + CPM normal = pagina nao converte
- CPA bom + spend baixo = publico pequeno ou lance baixo

### Step 4: Decisao por conjunto (AUTONOMO analise, HUMANO execucao)

Para CADA conjunto ativo, decisao binaria (CR-08):

**Se CPA <= Estrela Guia:**
- Manter ativo
- Se consistente 3+ dias → recomendar escala 20-50%

**Se CPA > Estrela Guia:**
- Matar no ninho (CR-03)
- Recomendar: PATCH status=PAUSED

**Apresentar recomendacao ao usuario:**
```
RECOMENDACAO DIARIA — Conta Escala

Conjuntos BOM (CPA <= Estrela Guia):
- ADV_Puro: CPA R$22 (EG R$30) — MANTER
- ADV_Int-mkt-digital: CPA R$18 (EG R$30) — ESCALAR 30%

Conjuntos RUIM (CPA > Estrela Guia):
- ADV_Int-ia: CPA R$45 (EG R$30) — PAUSAR (matar no ninho)

Acao recomendada: pausar 1, escalar 1, manter 4.
Aprovar? [S/N]
```

### Step 5: Executar acoes aprovadas

**APROVACAO HUMANA**

Apos aprovacao, executar via API:

Pausar:
```
PATCH /{adset_id}
  status: "PAUSED"
```

Escalar (vertical — CR-07):
```
PATCH /{adset_id}
  daily_budget: {current * 1.2 a 1.5}
```

NUNCA duplicar conjunto bom. Escala VERTICAL sempre. Aprendizado vive no conjunto (analogia placa-mae).

### Step 5b: Monitorar pos-escala (AUTONOMO)

Apos escalar, monitorar 24-48h obrigatoriamente:
- Se CPA se sustenta dentro da Estrela Guia → escala deu certo, manter
- Se CPA nao sustenta apos 24-48h → 2 opcoes (apresentar ao usuario):
  1. **Trocar criativos** — fadiga acelerada pelo volume maior
  2. **Baixar orcamento** — voltar ao patamar anterior e observar comportamento

Apresentar ao usuario com dados antes de agir.

### Step 6: Verificar frequencia (AUTONOMO)

Checar frequencia dos conjuntos:
```
GET /{adset_id}/insights?fields=frequency&date_preset=last_7d
```

Frequencia > 3 + CPA subindo = FADIGA → **acionar feed-scale imediatamente na mesma sessao**. Nao adiar.
Frequencia > 3 + CPA estavel = CONSOLIDACAO → nao mexer (CR-02)

**Trigger formal:** Se fadiga detectada, o scale-operator DEVE executar a task `feed-scale` como proximo passo antes de encerrar a sessao. Nao depender do usuario lembrar.

### Step 7: Registrar metricas

Registrar dados do dia:
- Investido total
- CPA medio
- ROAS
- CTR
- Frequencia media
- Acoes tomadas
- Motor de Arranque (se dados suficientes)

## Timeout de Aprovacao

Se o usuario nao responde a uma recomendacao:
- A recomendacao nao expira — permanece valida enquanto as metricas nao mudarem
- Na proxima sessao, re-coletar metricas antes de reapresentar (dados podem ter mudado)
- Se metricas mudaram significativamente, gerar nova recomendacao com dados atualizados

## Error Handling

| Cenario | Acao |
|---------|------|
| API retorna erro | Retry 1x. Se persistir, reportar. |
| Todos conjuntos com CPA ruim | Nao matar tudo de uma vez. Manter o melhor, pausar os piores. Acionar traffic-strategist pra diagnostico macro. |
| Campanha zerou gastando | Diagnostico 7 causas (Step 3). |
| CPM explodiu | Verificar sazonalidade. Se nao for, trocar criativos. |
| Criativos morreram (fadiga generalizada) | Pausar piores. Acionar feed-scale. Se reservatorio vazio, pedir producao ao traffic-strategist. |
| Budget sharing >20% num conjunto | Se CPA do dominante e bom, deixar. Se ruim, pausar e redistribuir. |
