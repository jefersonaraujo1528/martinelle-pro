---
task: "Onboard"
responsavel: "@andromeda-chief"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Contexto do start (produto, Estrela Guia, orcamento, pagina)"
Saida: "BM configurado, 2 contas de anuncio, pixel ativo, eventos configurados"
Checklist:
  - "Business Manager ativo"
  - "Conta de anuncio ESCALA criada"
  - "Conta de anuncio TESTE criada"
  - "Pixel instalado com eventos (purchase/lead)"
  - "Dominio verificado"
  - "Pagina Facebook vinculada"
  - "Instagram vinculado"
execution_type: "interactive"
---

# Task: Onboard — Setup One-Time de Contas

## Executive Summary

Setup unico de infraestrutura Meta Ads. Faz uma vez e pronto. Toda acao precisa de aprovacao humana.

## Steps

### Step 1: Verificar estado atual

Via Meta API, checar o que ja existe:
- `GET /me/businesses` — BM existe?
- `GET /act_{id}` — Contas existem?
- Pixel configurado?

### Step 2: Criar/configurar BM

Se nao existe:
- Orientar criacao via business.facebook.com
- **APROVACAO HUMANA** antes de criar

### Step 3: Criar 2 contas de anuncio

No mesmo BM:
1. Conta ESCALA (principal — onde o dinheiro roda)
2. Conta TESTE (laboratorio — onde experimenta)
- **APROVACAO HUMANA**

### Step 4: Configurar pixel + eventos

- Criar pixel ou vincular existente
- Configurar eventos: Purchase (vendas) ou Lead (captacao)
- Verificar que pixel ta disparando na pagina
- **APROVACAO HUMANA**

### Step 5: Verificar dominio + vincular paginas

- Verificacao de dominio
- Vincular pagina Facebook
- Vincular conta Instagram
- **APROVACAO HUMANA**

### Step 6: Quality Gate QG-TA-001

Checklist:
- [ ] BM ativo
- [ ] 2 contas (teste + escala)
- [ ] Pixel com eventos
- [ ] Dominio verificado
- [ ] Paginas vinculadas

Se PASS → liberar pra campaign setup.

## Error Handling

| Cenario | Acao |
|---------|------|
| BM ja existe | Usar existente, verificar contas |
| Pixel ja existe | Vincular ao BM, verificar eventos |
| Dominio nao verifica | Orientar configuracao DNS |
