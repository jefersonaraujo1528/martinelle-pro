---
task: "Setup Test Campaign"
responsavel: "@test-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Conta de Teste configurada + Custom Audiences criadas + Hipótese de teste definida"
Saida: "Campanha de teste PAUSED na conta de Teste, com 1 variável isolada do padrão Andromeda. Pronta pra revisão humana antes de ativar."
Checklist:
  - "Hipótese de teste explícita (1 variável só)"
  - "Custom Audiences validadas"
  - "Payload base (Andromeda) montado"
  - "Variação isolada aplicada apenas na variável testada"
  - "Preview com diff (Escala vs Teste) apresentado"
  - "Quality Gate passou"
  - "Campanha PAUSED criada"
execution_type: "interactive"
quality_gate: "QG-TEST-001 (1 variável isolada) + QG-PREV-001 (preview confirmado)"
---

# Task: Setup Test Campaign — Subir Campanha na Conta de Teste

## Sumário Executivo

A conta de Teste é o **laboratório**. Aqui pode mexer sem medo de prejudicar a Escala. Cada teste isola **UMA variável** vs o padrão Andromeda, pra responder uma pergunta específica.

> Conta Teste = transgressor (meter louco, buscar pepitas). Conta Escala = caxias (segue cartilha Meta). — método Andromeda

**Regra inegociável:** **1 variável por teste.** Misturar testes confunde a leitura de resultados.

> *"Não vá misturar teste. Misturar teste vai te deixar confuso, sem direção e sem contar padrões. Faça um teste de cada vez."*

---

## 10 Variáveis Testáveis (Canivete Suíço)

| # | Variável | Padrão Andromeda | O que testar |
|---|----------|------------------|--------------|
| 1 | **Criativos** (mais importante) | 9 do enxoval | 20-30 ou 150 criativos pra selecionar os melhores |
| 2 | **ABO vs CBO** | ABO | CBO (deixa Meta decidir orçamento por conjunto) |
| 3 | **CPA Máximo** | Sem | Com CPA Máx (define teto) |
| 4 | **Otimização** | Maximizar conversões | Maximizar valor (com ROAS Mínimo) |
| 5 | **Partilha de orçamento** | Ativa | Desativa |
| 6 | **Advantage+ Audience** | ON | OFF (público segmentado tradicional) |
| 7 | **Limitação a nível de conta** | Não usa (a menos que local) | Configurar pra negócio local |
| 8 | **Destino** | Site só (Escala) | Site+Formulário ou só Formulário |
| 9 | **Objective "errado"** | Fiel ao destino | Tráfego pra Lead/Venda |
| 10 | **Regras automáticas** | Não usa por padrão | Usa (ex: pausar ad com CPA > X) |

---

## Pipeline Visual

```
START
  |
  v
1. Carregar credenciais Meta (conta TESTE)
  |
  v
2. Coletar HIPÓTESE de teste:
   - Qual variável (1-10 da tabela)?
   - Qual a hipótese? (ex: "ROAS Mínimo vai dar leads mais baratos")
   - Critério de sucesso?
   - Janela de avaliação? (default: 7 dias)
  |
  v
3. Validar isolamento (1 variável só)
  |
  v
4. Coletar contexto produto (igual setup-scale)
  |
  v
5. Montar PAYLOAD base (Andromeda padrão)
  |
  v
6. Aplicar VARIAÇÃO ISOLADA na variável testada
  |
  v
7. Rodar QG-TEST-001 (1 variável isolada)
  |
  v
8. PREVIEW com DIFF (mostra Escala padrão vs Teste — destaca o que mudou)
  |
  v
9. APROVAÇÃO ou ITERAÇÃO
  |
  v
10. Executar criação (PAUSED)
  |
  v
11. Resultado + critério de sucesso reforçado
  |
  v
12. Ativar?
  |
  v
END
```

---

## Step-by-Step

### Step 1: Credenciais

```bash
source ./data/load-meta-creds.sh
```

Validar `META_ACCT_TESTE`. Se vazio (cenário comum hoje quando aluno ainda não criou conta dedicada): perguntar se vai testar na conta principal mesmo, com aviso de que vai impactar a relevância.

### Step 2: Coletar Hipótese

```yaml
questions:
  - q: "Qual variável você quer testar? (1-10)"
    options: [as 10 da tabela acima]
    field: variavel_teste
  - q: "Qual sua hipótese? (ex: 'ROAS Mínimo vai trazer leads mais qualificados, mesmo com volume menor')"
    field: hipotese
  - q: "Critério de sucesso pra levar pra Escala? (ex: 'CPA igual ou melhor que padrão por 3 dias consecutivos')"
    field: criterio_sucesso
  - q: "Janela de avaliação? (default: 7 dias)"
    field: janela_dias
    default: 7
```

### Step 3: Validar isolamento

Bloquear se usuário quer testar 2+ variáveis ao mesmo tempo:

```
🛑 Aviso do método: 1 teste por vez.

Você pediu pra testar [variavel_1] E [variavel_2] simultaneamente.
Se der bom, você não vai saber qual das duas trouxe o resultado.

Posso rodar 2 campanhas paralelas:
- Campanha A: testa só [variavel_1]
- Campanha B: testa só [variavel_2]

Ou você prefere uma de cada vez. Qual?
```

### Step 4: Contexto produto

Idem ao setup-scale (produto, destino, verba, criativos disponíveis). Diferença: **na conta Teste, verba pode ser menor** — sugerir 30-50% do que está na Escala.

> É comum contas de teste ficarem em 30 de pontuação de relevância — extremamente baixo, mas tudo bem porque ali se está validando.

### Step 5: Montar payload base

Mesmo payload que setup-scale produziria (Andromeda padrão). Ver `tasks/setup-scale.md` Step 4 pra detalhes.

### Step 6: Aplicar variação isolada

Conforme variável testada, modificar **apenas** o campo correspondente. Detalhes técnicos do diff em `knowledge/sop-campanha-api.md` (seções "Divergências [TESTE] vs [ESCALA]").

#### Variação 1: Mais criativos
- Em vez de 9, sobe N (20-30 ou mais)
- Mesmos 6 conjuntos, cada um com mais ads

#### Variação 2: CBO em vez de ABO
- Move `daily_budget` da campanha (em vez de cada adset)
- Adset não tem `daily_budget`

```json
"campaign": {
  "daily_budget": <verba_total_em_centavos>,
  "bid_strategy": "LOWEST_COST_WITHOUT_CAP"
}
```

#### Variação 3: CPA Máximo
- Desativar partilha (libera campo)
- Adicionar `bid_amount` no adset

```json
"campaign": {"bid_strategy": "COST_CAP"},
"adset": {"bid_amount": <cpa_max_em_centavos>}
```

#### Variação 4: Maximizar Valor + ROAS

```json
"campaign": {"bid_strategy": "LOWEST_COST_WITH_MIN_ROAS"},
"adset": {"optimization_goal": "VALUE", "bid_amount": <roas_basis_points>}
```

#### Variação 5: Sem partilha
- Em CBO: `campaign_budget_optimization: false`
- Em ABO: já é o default (sem partilha 20%)

#### Variação 6: Advantage+ Audience OFF

```json
"adset.targeting": {
  "geo_locations": {"countries": ["BR"]},
  "age_min": 25,
  "age_max": 55,
  "interests": [{"id": "...", "name": "..."}]
  // SEM targeting_automation.advantage_audience: 1
}
```

#### Variação 7: Limite nível conta (local)
- Configurar via Account-Level Targeting API (separado)
- Resto do payload mantém igual

#### Variação 8: Destino Site+Formulário

```json
"adset": {"destination_type": "WEBSITE_OR_INSTANT_FORM"}
```

#### Variação 9: Objective "errado"
- Trocar `OUTCOME_LEADS` ou `OUTCOME_SALES` por `OUTCOME_TRAFFIC`
- Manter resto

#### Variação 10: Regras automáticas
- Após criar campanha, criar regra via `POST /act_{id}/adrules_library`

### Step 7: QG-TEST-001

```
[ ] Variável testada está EXPLÍCITA no nome da campanha
    (ex: "TESTE_CBO_PRODUTO" ou "TESTE_ROAS_PRODUTO")
[ ] Hipótese registrada em metadata
[ ] Critério de sucesso registrado
[ ] APENAS 1 variável modificada vs padrão
[ ] Janela de avaliação clara
[ ] Verba não passa de 50% da Escala
```

### Step 8: Preview com Diff

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Campanha de TESTE na conta {ACCT_NAME}

🧪 HIPÓTESE
  Testando: {variavel_teste_nome}
  Hipótese: "{hipotese}"
  Critério de sucesso: {criterio_sucesso}
  Janela: {janela_dias} dias

DIFF vs padrão Andromeda (Escala):

  Padrão Escala       │  Este Teste
  ────────────────────┼──────────────────
  ABO                 │  CBO  ← MUDOU
  Maximize conversões │  igual
  Sem CPA Máx         │  igual
  Adv+ Audience ON    │  igual
  ... (resto igual)

CAMPANHA
  Nome: TESTE_{variavel}_{produto}
  Objetivo: {objective}
  {detalhes do payload modificado}

CONJUNTOS (6) — verba R$ {budget}/dia (50% da Escala)
  {lista igual setup-scale, com a variação aplicada}

CRIATIVOS
  {lista}

⚠️  Lembrete método:
  - Pontuação de relevância pode cair (na Teste é OK, até 30 está bem)
  - 1 teste por semana — não cruzar com outros testes ativos
  - Se der bom, leva pra Escala. Se não, descarta.

QG-TEST-001: ✓ 1 variável isolada confirmada

Confirmar e subir PAUSED? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Steps 9-12: idênticos ao setup-scale

(aprovação, execução, resultado, ativar?). Ver `tasks/setup-scale.md` Steps 7-10.

Após ativar, registrar no log de testes:

```yaml
test_log:
  campaign_id: "{id}"
  variavel: "CBO"
  hipotese: "..."
  criterio_sucesso: "..."
  janela_dias: 7
  data_inicio: "{hoje}"
  data_avaliacao: "{hoje + janela_dias}"
  status: "running"
```

---

## Outputs adicionais — Avaliação posterior

Após {janela_dias} dias, squad deve voltar pra avaliar:

```
Conferindo teste {test_id}:

CRITÉRIO: {criterio_sucesso}
RESULTADO: {comparação com padrão}

VEREDITO:
  ✓ PASS — atende critério → recomendar levar pra Escala
  ✗ FAIL — não atende → descartar
  ⚠️ INCONCLUSIVO — precisa mais dados ou ruído alto → estender janela
```

---

## Quality Gates

### QG-TEST-001 — 1 Variável Isolada

- [ ] Apenas 1 campo do payload diferente do padrão Andromeda
- [ ] Variação está no nome da campanha
- [ ] Hipótese e critério registrados
- [ ] Verba ≤ 50% da Escala (preserva orçamento principal)

### QG-PREV-001 — Preview Confirmado

- [ ] Preview foi apresentado em formato humano (não JSON cru)
- [ ] Diff explícito (Escala vs Teste)
- [ ] Usuário deu confirmação explícita

---

## Error Handling

Idêntico ao setup-scale, exceto:

| Cenário | Ação |
|---------|------|
| Usuário não tem conta Teste separada | Avisar que pode testar na principal mas perde relevância. Confirmar |
| Variável testada quebra mais de 1 campo | Aceitar mas registrar no log (ex: CPA Máx exige desativar partilha — duas mudanças interrelacionadas) |
| Já há outro teste ativo da mesma variável | Avisar, perguntar se quer rodar em paralelo ou esperar |

---

**Task Status:** Ready for Production (v2.0.0 — reescrita 2026-05-06)
**Substitui:** v1.0.0 que era esqueleto
