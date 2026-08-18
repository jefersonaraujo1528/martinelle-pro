---
task: "Start"
responsavel: "@andromeda-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario"
Saida: "Contexto coletado (produto, Estrela Guia, orcamento), squad pronto pra operar"
Checklist:
  - "Produto/oferta identificado"
  - "Estrela Guia (CPA target) definida"
  - "Orcamento mensal definido"
  - "Pagina de vendas confirmada"
  - "Ad Account IDs coletados (escala + teste) OU marcado pra onboard"
  - "Pixel ID identificado OU marcado pra onboard"
execution_type: "interactive"
---

# Task: Start — Entry Point do Trafego Meta Ads

## Executive Summary

Ponto de entrada do squad. O chief coleta contexto essencial e roteia pro proximo passo.

## Steps

### Step 1: Greeting

```
=== TRAFEGO META v2.0 ===
Squad da mentoria | Criado por Fred Dias
Usado por ele e pela mentoria

Trafego pago Meta Ads pelo Metodo Andromeda. 4 agentes operando suas
campanhas: strategist, 2 operators (teste + escala) e chief.
Leitura autonoma, escrita com sua aprovacao.

O que posso fazer:

1. Onboarding — configurar contas, pixel e iniciar operacao
2. Operar — gerenciar campanhas diarias (teste e escala)
3. Consultoria — analisar metricas, revisar estrategia

Qual produto vamos rodar? Qual CPA target? Quanto de orcamento?
```

### Step 2: Coletar contexto

Registrar:
- `product`: nome e codigo do produto
- `estrela_guia`: CPA target em R$
- `budget_monthly`: orcamento mensal em R$
- `landing_page`: URL da pagina
- `utmify_url`: URL com UTMs (se ja tiver)
- `scale_account_id`: ID da conta escala (ou "criar" se nao existir)
- `test_account_id`: ID da conta teste (ou "criar" se nao existir)
- `pixel_id`: ID do pixel (ou "criar" se nao existir)
- `page_id`: ID da pagina Facebook

### Step 3: Rotear

Se contas ja existem → rotear pra operacao (operate-scale, operate-test, consult)
Se contas nao existem → rotear pra onboard

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario nao sabe CPA target | Ajudar a calcular: "Quanto custa teu produto? Qual margem? Estrela Guia = margem / 3 (regra geral)" |
| Usuario ja tem contas configuradas | Pular onboard, ir direto pra operacao |
