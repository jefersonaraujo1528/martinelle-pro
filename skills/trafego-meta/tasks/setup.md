---
task: "Setup"
responsavel: "@setup-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Usuario leigo quer configurar Meta Ads do zero"
Saida: "Infraestrutura completa: BM, paginas, pixel, eventos, CAPI, publicos, API — tudo verificado"
Checklist:
  - "Step 1: BM criado e configurado"
  - "Step 2: Pagina Facebook criada"
  - "Step 3: Instagram profissional vinculado"
  - "Step 4: Conta de anuncios criada (moeda BRL, fuso SP)"
  - "Step 5: Permissoes atribuidas corretamente"
  - "Step 6: Verificacao CNPJ submetida"
  - "Step 7: Pixel + eventos + CAPI configurados e verificados"
  - "Step 8: Todos os publicos Andromeda criados"
  - "Step 9: Meta App live + System User + token permanente"
  - "Step 10: Checklist final 100%"
execution_type: "interactive"
---

# Task: Setup — Configuracao Completa Meta Ads do Zero

**Task ID:** trafego-meta/setup
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-04-09
**Category:** Setup
**Execution Type:** Interactive

---

## Executive Summary

Guiar usuario leigo pelo setup completo de Meta Ads: do zero ate conta pronta pra anunciar com API conectada. O usuario executa cada passo manualmente, manda prints, o setup-operator valida e orienta. Ao final, handoff pro chief.

## Purpose

O usuario nunca anunciou na vida. Precisa de alguem que va junto, passo a passo, garantindo que cada configuracao ficou correta. Essa task e o fluxo completo — 10 steps, validacao visual em cada um.

---

## Pipeline Visual

```
*setup (ou chief roteia)
  |
  v
STEP 1: Criar BM
  → usuario executa + manda print → operator valida
  |
  v
STEP 2: Criar Pagina Facebook
  → usuario executa + manda print → operator valida
  |
  v
STEP 3: Vincular Instagram
  → usuario executa + manda print → operator valida
  |
  v
STEP 4: Criar Conta de Anuncios
  → usuario executa + manda print → operator valida
  |
  v
STEP 5: Atribuir Permissoes
  → usuario executa + manda print → operator valida
  |
  v
STEP 6: Verificacao CNPJ
  → usuario executa + manda print → operator valida
  |
  v
STEP 7: Pixel + Eventos + CAPI (mais complexo — ~8 sub-steps)
  → usuario executa + manda print → operator valida
  |
  v
STEP 8: Criar Publicos Andromeda (7 quentes + 4 remarketing + exclusao + LAL)
  → usuario executa + manda print → operator valida
  |
  v
STEP 9: Conexao API (Meta App + System User + token)
  → usuario executa + manda print → operator valida
  |
  v
STEP 10: Checklist Final
  → operator revisa todos os steps
  |
  v
HANDOFF → chief
  "Conta pronta. Proximo passo: montar campanha."
```

---

## Step-by-Step Execution

### Step 1: Iniciar Setup

Verificar se usuario ja tem algo configurado:
- "Voce ja tem alguma conta no Facebook Ads ou Gerenciador de Anuncios? Ou e do zero total?"
- Se ja tem algo: adaptar o fluxo (pular steps ja feitos, validar o que existe)
- Se zero total: comecar do Step 1 da KB

### Step 2: Executar 10 Steps

Para CADA step (1 a 10):

1. **Ler a secao correspondente** da KB `setup-completo-meta-ads-kb.md`
2. **Explicar** o que e e por que precisa (linguagem simples, 1-2 frases)
3. **Instruir** sub-passo a sub-passo (max 3 por vez)
4. **Pedir print** pra validar
5. **Interpretar** o print — confirmar ou corrigir
6. **Verificar** checklist do step na KB
7. **Marcar** step como concluido
8. **Celebrar** e avancar

### Step 3: Quality Gate — Checklist Final (Step 10)

Revisar todos os 10 steps com o usuario:

```
=== CHECKLIST FINAL ===

[x] Step 1: BM criado — {nome da BM}
[x] Step 2: Pagina Facebook — {nome da pagina}
[x] Step 3: Instagram — @{handle} vinculado
[x] Step 4: Conta de anuncios — {ID}, BRL, Sao Paulo
[x] Step 5: Permissoes — admin em todos os ativos
[x] Step 6: CNPJ — submetido, status: {status}
[x] Step 7: Pixel — {ID}, eventos ativos, CAPI deduplicada
[x] Step 8: Publicos — {N} publicos criados
[x] Step 9: API — App live, token permanente gerado
[x] Step 10: Tudo verificado

CONTA PRONTA PRA ANUNCIAR E CONECTADA.
```

### Step 4: Handoff

Entregar pro chief com contexto:

```yaml
handoff:
  from: setup-operator
  to: andromeda-chief
  context:
    setup_completed: true
    bm_id: "{id}"
    ad_account_ids: ["{escala_id}", "{teste_id}"]
    pixel_id: "{id}"
    app_id: "{id}"
    token_generated: true
  next_action: "Usuario pronto pra montar primeira campanha"
```

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Usuario quer pular direto pra pixel sem BM | "Precisa do BM primeiro. Sem ele, nao tem onde criar pixel." |
| Usuario quer configurar GTM/contingencia | "Isso e setup avancado. Vamos terminar o basico primeiro — depois a gente volta." |
| Usuario quer criar campanha no meio do setup | "Calma, vamos terminar o setup primeiro pra nao dar problema. Faltam {N} steps." |
| Print mostra erro/tela inesperada | Diagnosticar via print, orientar correcao, pedir novo print |
| Usuario ta frustrado | "Normal, Meta muda a interface toda hora. Manda print que eu te guio." |

---

## Knowledge Dependencies

| Arquivo | Obrigatorio | Uso |
|---------|-------------|-----|
| `knowledge/setup-completo-meta-ads-kb.md` | SIM | Fonte unica de verdade pra todos os 10 steps |

---

**Task Status:** Ready for Production
