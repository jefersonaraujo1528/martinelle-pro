---
task: "Operate Test"
responsavel: "@test-operator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Campanha teste ativa, criativos novos pra testar"
Saida: "Criativos avaliados (campeao/descartado), reservatorio atualizado"
Checklist:
  - "Experimento com 1 variavel isolada (CR-06)"
  - "Metricas coletadas"
  - "CPA comparado com Estrela Guia"
  - "Campeoes no reservatorio"
  - "Aprendizados registrados"
execution_type: "interactive"
---

# Task: Operate Test — Operacao da Conta Teste

## Executive Summary

Opera a conta teste como laboratorio. Mesma estrutura operacional da escala (metricas, pacing, decisoes), mas com mentalidade experimental. Foco: testar criativos novos, avaliar com Estrela Guia, manter reservatorio de campeoes. 1 variavel por vez SEMPRE (CR-06).

**Protocolo base:** `knowledge/daily-ops-protocol.md` — os 5 passos compartilhados com operate-scale. Esta task adiciona steps especificos do teste (experimentos, avaliacao, reservatorio).

## Steps

### Step 1: Coletar metricas (AUTONOMO)

Via Meta API:
```
GET /act_{test_id}/insights
  fields: spend,impressions,clicks,ctr,cpc,cpm,actions,cost_per_action_type,frequency
  date_preset: today
  level: adset
```

### Step 2: Checar pacing (AUTONOMO)

Mesma logica da escala:
```
pacing_ratio = spend_hoje / (daily_budget * hora_atual / 24)
```

### Step 3: Rodar experimentos

**APROVACAO HUMANA pra criar novos testes**

10 testes possiveis. 4 testes estrela:
1. **Duplicar conjunto** — mesmo criativo, publico diferente
2. **Troca de orcamento** — mesmo setup, orcamento diferente
3. **Trocar objetivo campanha** — vendas vs leads vs trafego
4. **Trocar objetivo otimizacao** — purchase vs add to cart vs landing page view

Regra absoluta: **1 variavel por vez** (CR-06).

Checklist pre-teste:
- [ ] Qual variavel estou testando?
- [ ] Qual o controle?
- [ ] Qual a variante?
- [ ] Tudo mais e IDENTICO?

Se mais de 1 variavel → redesenhar teste.

### Step 4: Avaliar resultados (AUTONOMO analise)

Apos 48h+ de dados:

**Criterio de funciona (decisao binaria — CR-08):**
- CPA <= Estrela Guia com volume minimo de gasto (3-5x o CPA) = **FUNCIONA**
- CPA > Estrela Guia = **NAO FUNCIONA**
- Sem "mais ou menos"
- **Volume minimo:** gasto de pelo menos 3-5x o valor do CPA target antes de concluir. Abaixo disso, amostra insuficiente — apresentar ao usuario pra ele decidir.

**Se FUNCIONA:**
```
Marcar como CAMPEAO
Manter rodando no teste (reservatorio)
Registrar: criativo X funciona no publico Y com CPA Z
```

**Se NAO FUNCIONA:**
```
PATCH /{adset_id ou ad_id} status=PAUSED
Registrar: criativo X NAO funciona — CPA ficou em Z (EG era Y)
```

### Step 5: Manter reservatorio (AUTONOMO)

Criativos campeoes ficam RODANDO no teste:
- Nao migram automatico pra escala
- Scale-operator PUXA quando precisa (quando detecta fadiga)
- Reservatorio e buffer contra fadiga de criativos

**Storage do reservatorio:** A fonte de verdade e a propria conta teste via API. O reservatorio NAO depende de arquivo local — e consultado em tempo real:
```
GET /act_{test_id}/ads
  fields: name,effective_status,insights{cost_per_action_type,spend,impressions}
  filtering: [{"field":"effective_status","operator":"IN","value":["ACTIVE"]}]
```
Filtrar por CPA <= Estrela Guia = campeoes disponiveis.

Apresentar registro atualizado ao usuario quando solicitado:
```
RESERVATORIO — Campeoes Ativos (live da API)
- SELF_dep-lanc_H1: CPA R$22 (EG R$30) — rodando desde DD/MM
- UGC_result-aluno_H1: CPA R$18 (EG R$30) — rodando desde DD/MM
- IAGEN_ia-expert_H2: CPA R$25 (EG R$30) — rodando desde DD/MM
```

### Step 6: Subir novos criativos

**APROVACAO HUMANA**

Quando criativos novos chegam do squad externo:
```
POST /act_{test_id}/adcreatives
  name: "{FORMATO}_{ANGULO}_{H}"
  object_story_spec: {creative_spec}

POST /act_{test_id}/ads
  name: "{FORMATO}_{ANGULO}_{H}"
  adset_id: {adset_id}
  creative: {creative_id}
  tracking_specs: {utm_url}
```

Criativos NOVOS entram AQUI primeiro. Nunca direto na escala.

### Step 7: Operacao diaria (mesma da escala)

5 passos adaptatados pro teste:
1. Ler pacing
2. Checar CPA vs Estrela Guia
3. Identificar campeoes vs falhas
4. Decisao: manter campeoes, matar falhas, subir novos testes
5. Registrar metricas + aprendizados

## Error Handling

| Cenario | Acao |
|---------|------|
| Criativo nao gasta | Normal no teste. Dar 48-72h. Se persistir, checar creative review. |
| Todos os testes falharam | Normal — teste e pra descobrir. Registrar aprendizados, pedir novos criativos. |
| Reservatorio esvaziou | Avisar traffic-strategist pra pedir producao urgente ao squad externo. |
| Volume insuficiente pra conclusao | Aumentar orcamento do teste OU esperar mais tempo. |
