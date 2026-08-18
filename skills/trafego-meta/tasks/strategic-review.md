---
task: "Strategic Review"
responsavel: "@traffic-strategist"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Metricas acumuladas (minimo 7 dias)"
Saida: "Analise estrategica completa, briefing de criativos, recomendacoes"
Checklist:
  - "8+1 metricas analisadas"
  - "Motor de Arranque calculado"
  - "Diagnostico crosscheck realizado"
  - "Briefing de criativos (se necessario)"
  - "Recomendacoes apresentadas"
execution_type: "semantic"
---

# Task: Strategic Review — Analise Estrategica

## Executive Summary

Analise macro semanal (ou sob demanda). O traffic-strategist analisa tendencias, calcula Motor de Arranque, faz diagnostico cruzado, decide qual tipo de criativo pedir ao squad externo. NAO opera — pensa e orienta.

## Steps

### Step 1: Coletar metricas macro (via operadores)

Solicitar dados aos operadores ou ler direto via API:
```
GET /act_{scale_id}/insights
  fields: spend,impressions,clicks,ctr,cpc,cpm,actions,cost_per_action_type,frequency
  date_preset: last_7d
  level: campaign

GET /act_{test_id}/insights
  (mesmos campos)
```

### Step 2: Analisar 8+1 metricas

| # | Metrica | O que indica |
|---|---------|-------------|
| 1 | **CPA** | Rei. Tudo gira em torno disso. |
| 2 | **Estrela Guia** | CPA target. Referencia absoluta. |
| 3 | **CTR** | Saude dos criativos. Baixo = criativos fracos. |
| 4 | **CPC** | Custo do clique. Alto = publico saturado ou criativo fraco. |
| 5 | **CPM** | Custo por mil. Alto = competicao ou sazonalidade. |
| 6 | **Connect Rate** | % que chega na pagina. Baixo = problema tecnico. |
| 7 | **Taxa conversao** | Problema da pagina, nao do trafego. |
| 8 | **Frequencia** | Leitura dupla: fadiga (CPA sobe) vs consolidacao (CPA estavel). |
| 9 | **Pesquisa** | Google Trends, volume busca (bonus). |

### Step 3: Calcular Motor de Arranque

Motor de Arranque = sustentabilidade do investimento.
- Positivo = investimento gerando retorno crescente
- Negativo = problema estrutural (nao e trafego — e oferta/pagina/posicionamento)

Se negativo por 10+ dias → sinal de alerta. Comunicar ao usuario.

### Step 4: Diagnostico crosscheck

Cruzar metricas pra identificar causa raiz:

| CPA | CTR | CPM | CPC | Diagnostico | Acao |
|-----|-----|-----|-----|-------------|------|
| Alto | Baixo | Normal | Alto | Criativo fraco | Pedir C1 novos |
| Alto | Bom | Alto | Alto | Competicao/sazonalidade | Esperar ou ajustar lance |
| Alto | Bom | Normal | Normal | Pagina nao converte | Problema externo — nao e trafego |
| Bom | Baixo | Normal | Normal | Funcionando mas fraco | Trocar criativos pode melhorar |
| Bom | Bom | Normal | Normal | Tudo ok | Nao mexer (CR-02) |

### Step 5: Briefing de criativos (se necessario)

Se diagnostico indica necessidade de criativos novos:

| Sintoma | Diagnostico | Pedido ao squad externo |
|---------|-------------|------------------------|
| CTR baixo | Topo fraco | C1 (conteudo valor, quebra padrao, dor) |
| CPC alto, conversao baixa | Meio fraco | C2 (hard sell, demonstrativo, comparativo) |
| CR pagina baixa | Fundo fraco | C3 (prova, objecoes, urgencia) |

Frequencia de producao por orcamento mensal:
- Ate R$3k: +3 criativos/mes
- R$3-10k: +6/mes
- R$10-30k: +9/mes (semanal)
- R$30k+: +12/mes (3/semana)

### Step 6: Apresentar analise

Formato padrao:
```
STRATEGIC REVIEW — Semana DD/MM a DD/MM

RESUMO:
- CPA medio: R$XX (EG R$YY) — [DENTRO/ACIMA]
- Motor de Arranque: [POSITIVO/NEGATIVO]
- Tendencia: [MELHORANDO/ESTAVEL/PIORANDO]

ESCALA:
- X conjuntos ativos, Y performando, Z com problema
- Frequencia media: X.X
- Fadiga: [SIM/NAO]

TESTE:
- X testes rodando, Y campeoes, Z descartados
- Reservatorio: X campeoes disponiveis

CRIATIVOS:
- Mix atual: X C1 + Y C2 + Z C3
- Necessidade: [briefing se necessario]

RECOMENDACOES:
1. ...
2. ...
3. ...
```

## Error Handling

| Cenario | Acao |
|---------|------|
| Dados insuficientes (<7 dias) | Fazer analise parcial. Avisar que conclusoes sao preliminares. |
| Motor de Arranque negativo prolongado | Escalar pro usuario: "O problema nao e trafego — e a oferta/pagina." |
| Sem criativos pra pedir | Priorizar C1 (mais impacto no topo do funil, mais rapido de produzir). |
