# Trafego Meta Ads

Gestao completa de trafego pago Meta Ads usando Metodo Andromeda. Squad executor via Meta Marketing API com aprovacao humana.

## Ativacao

```
/trafegoMeta
```

## Agentes

| Agente | Tier | Funcao |
|--------|------|--------|
| **andromeda-chief** | Orchestrator | Onboarding, roteamento, admin |
| **traffic-strategist** | Tier 0 (Advisor) | Analise macro, briefing criativos, consultoria |
| **scale-operator** | Tier 1 | Opera conta escala via Meta API |
| **test-operator** | Tier 1 | Opera conta teste via Meta API |

## Tasks

| Task | Agente | Tipo |
|------|--------|------|
| start | chief | Entry point — coleta contexto |
| onboard | chief | Setup one-time (BM, contas, pixel) |
| setup-scale | scale-operator | Criar campanha na escala |
| setup-test | test-operator | Criar campanha no teste |
| operate-scale | scale-operator | Operacao diaria da escala |
| operate-test | test-operator | Operacao de testes + reservatorio |
| feed-scale | scale-operator | Alimentar escala com campeoes |
| strategic-review | traffic-strategist | Analise semanal macro |
| consult | traffic-strategist | Pensar junto sobre estrategia |

## Modelo de Execucao

- **Leitura:** Autonoma (GET insights, metricas, diagnostico)
- **Escrita:** Aprovacao humana (POST/PATCH campanhas, conjuntos, criativos, orcamento)
- **Fluxo:** Agente analisa → recomenda com dados → usuario aprova → agente executa via API

## Workflow

| Fase | Nome | Frequencia |
|------|------|------------|
| 0 | Onboarding | One-time |
| 1 | Campaign Setup | Inicial |
| 2 | Operations | Diario |
| 3 | Strategic Review | Semanal |

## Dependencias

- **Meta Marketing API** — App + access token com `ads_management`
- **Estrela Guia** — CPA target definido pelo usuario
- **Criativos** — Produzidos por squad externo (futuro)
- **UTMify** — Tracking de vendas (opcional)

## Regras Cardinais

1. CPA e Rei (CR-01)
2. Campanha boa = nao mexe (CR-02)
3. Mata no ninho (CR-03)
4. 9 criativos obrigatorios (CR-04)
5. Nao sobe em conjunto bom (CR-05)
6. 1 variavel por teste (CR-06)
7. Escala vertical (CR-07)
8. Anuncios sao binarios (CR-08)
9. Pacing e lei suprema (CR-09)
10. Todo anuncio precisa de CTA (CR-10)
