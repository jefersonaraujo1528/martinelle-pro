---
task: "Feed Scale"
responsavel: "@scale-operator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Fadiga detectada na escala (frequencia + CPA subindo), reservatorio de campeoes no teste"
Saida: "Criativos campeoes subidos na escala, conjuntos novos criados se necessario"
Checklist:
  - "Fadiga confirmada (nao e consolidacao)"
  - "Campeao validado no teste (CPA <= Estrela Guia)"
  - "Criativo subido na escala com nomenclatura"
  - "UTMs configurados"
  - "NAO adicionado a conjuntos bons existentes (CR-05)"
execution_type: "interactive"
---

# Task: Feed Scale — Alimentar Conta Escala

## Executive Summary

Quando a escala precisa de criativos novos (fadiga detectada), o scale-operator puxa campeoes validados da conta teste. Gatilho e a NECESSIDADE da escala, nao o sucesso do teste. O teste mantem os campeoes rodando como reservatorio.

## Pre-condicoes

1. **Fadiga confirmada** (PU-GA-022): frequencia > 3 + CPA subindo
2. **Reservatorio tem campeoes** (PU-GA-017): CPA <= Estrela Guia no teste
3. **Dependencia hard** (PU-GA-039): so puxar quando escala PRECISA

## Steps

### Step 1: Confirmar fadiga (AUTONOMO)

Via API — verificar que e fadiga, nao consolidacao:
```
GET /act_{scale_id}/insights
  fields: frequency,cost_per_action_type
  date_preset: last_7d
  level: adset
```

- Frequencia > 3 + CPA SUBINDO = **FADIGA** → prosseguir
- Frequencia > 3 + CPA ESTAVEL = **CONSOLIDACAO** → nao mexer (CR-02)

### Step 2: Consultar reservatorio (AUTONOMO)

Verificar campeoes disponiveis na conta teste:
```
GET /act_{test_id}/ads
  fields: name,effective_status,insights{cost_per_action_type,spend}
  filtering: [{"field":"effective_status","operator":"IN","value":["ACTIVE"]}]
```

Filtrar por CPA <= Estrela Guia.

Se reservatorio VAZIO → pedir producao ao traffic-strategist → FIM desta task.

### Step 3: Selecionar campeoes pra subir

**APROVACAO HUMANA**

Apresentar lista:
```
FEED SCALE — Criativos Disponiveis no Teste

Fadiga detectada nos conjuntos: ADV_Puro, ADV_Int-mkt-digital
Frequencia media: 4.2 | CPA subindo 18% na semana

Campeoes disponiveis no reservatorio:
1. SELF_dep-lanc_H1 — CPA R$22 (EG R$30) — 5 dias rodando
2. UGC_result-aluno_H1 — CPA R$18 (EG R$30) — 8 dias rodando

Recomendacao: subir ambos em conjuntos NOVOS na escala.
Aprovar? [S/N]
```

### Step 4: Criar conjuntos novos na escala

**APROVACAO HUMANA**

REGRA: NAO adicionar criativos novos a conjuntos bons existentes (CR-05 — Nao Mexa em Time que Ta Ganhando).

Criar conjuntos NOVOS dentro da campanha existente:
```
POST /act_{scale_id}/adsets
  campaign_id: {campaign_id_existente}
  name: "{TEMP}_{TIPO}"
  optimization_goal: "OFFSITE_CONVERSIONS"
  billing_event: "IMPRESSIONS"
  daily_budget: {budget}
  targeting: {audience_spec}
```

### Step 5: Subir criativos na escala

**APROVACAO HUMANA**

```
POST /act_{scale_id}/adcreatives
  name: "{FORMATO}_{ANGULO}_{H}"
  object_story_spec: {creative_spec}

POST /act_{scale_id}/ads
  name: "{FORMATO}_{ANGULO}_{H}"
  adset_id: {novo_adset_id}
  creative: {creative_id}
  tracking_specs: {utm_url}
```

UTMs padrao em todos.

### Step 6: Monitorar (AUTONOMO)

Apos subir, monitorar 24-48h (aprendizado). Nao mexer nesse periodo.

## Error Handling

| Cenario | Acao |
|---------|------|
| Reservatorio vazio | Avisar traffic-strategist. Ele pede producao ao squad externo com briefing (C1/C2/C3). |
| Campeao do teste nao funciona na escala | Normal — publicos diferentes. Monitorar 48h. Se CPA ruim, pausar. |
| Todos os conjuntos da escala com fadiga | Priorizar os piores. Pausar conjuntos mortos. Subir campeoes nos novos. |
