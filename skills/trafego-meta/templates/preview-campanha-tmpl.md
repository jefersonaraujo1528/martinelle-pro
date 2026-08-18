# Template — Preview de Campanha (apresentação humana antes do POST)

> Formato OBRIGATÓRIO de preview que o squad apresenta antes de criar/duplicar/ativar qualquer campanha na Meta API.
> Quality Gate: QG-PREV-001 exige que esse formato seja seguido.
> Renderiza em texto plano (markdown opcional). NÃO mostrar JSON cru.

---

## Princípios do preview

1. **Humano-legível** — formato de cards/tabelas, sem JSON
2. **Diff explícito** — quando duplicação ou ajuste, sempre mostra `Antes → Depois`
3. **Fidelidade Andromeda** — mostra score `N/47` (QG-FA-001)
4. **Gaps declarados** — qualquer divergência do método precisa estar visível
5. **Decisão clara** — termina sempre com "Confirmar? [s/N]" ou "Ativar agora ou revisar antes?"
6. **Citações da fonte quando relevante** — *"X coisa porque Y disse Z"*

---

## Template — Setup novo (campanha do zero)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Vou subir esta campanha na conta {ACCT_NAME} ({ACCT_ID})

📌 CAMPANHA
  Nome:           ANDRO_{produto}
  Objetivo:       {OBJECTIVE_PT}  ← {explicação curta do porquê}
  Modo orçamento: ABO ✓ (sem orçamento na campanha)
  Partilha 20%:   ATIVA
  Bid strategy:   LOWEST_COST_WITHOUT_CAP
  Status inicial: PAUSED (não vai gastar até você ativar)

📌 6 CONJUNTOS DE ANÚNCIOS (R$ {budget_per_adset}/dia cada — total R$ {total}/dia)

  1. ADV_Puro (grupo controle)
       └─ Apenas país: {país}
       └─ Sem idade, sem sexo, sem interesses
       └─ Adv+ Audience ON

  2. ADV_Int-{cluster_A}
       └─ {cluster}: {3-4 interesses}
       └─ Adv+ Audience ON

  3. ADV_Int-{cluster_B}
       └─ {cluster}: {3-4 interesses}
       └─ Adv+ Audience ON

  4. ADV_Int-{cluster_C}
       └─ {cluster}: {3-4 interesses}
       └─ Adv+ Audience ON

  5. ADV_Int-{cluster_D}
       └─ {cluster}: {3-4 interesses}
       └─ Adv+ Audience ON

  6. QUENTE_Audiencia-completa
       └─ 4 públicos personalizados:
          - IG Engagement 365d ({size})
          - Video Viewers 50% 365d ({size})
          - Site Visitors 180d ({size})
          - Email List ({size})
       └─ Adv+ Audience ON

  Comuns a TODOS os conjuntos:
  ├─ Adv+ Placements (automáticos)
  ├─ Pixel: {PIXEL_NAME} ({PIXEL_ID})
  ├─ Evento: {custom_event_type}
  ├─ Otimização: {optimization_goal}
  ├─ Atribuição: {window_days}d click {(+ 1d view se default)}
  ├─ Sem CPA Máx, sem ROAS Mínimo, sem regras de valor
  └─ Excluindo: {compradores_180d / leads_180d}

📌 9 CRIATIVOS (mesmos nos 6 conjuntos = 54 ads no total)

  C1 — Topo de funil (consciência baixa)
    🎬 C1-CV-{slug}    | {formato}  | {headline curta}
    🎬 C1-QP-{slug}    | {formato}  | {headline curta}
    🎬 C1-DOR-{slug}   | {formato}  | {headline curta}

  C2 — Meio de funil (consciência média)
    🎬 C2-HS-{slug}    | {formato}  | {headline curta}
    🎬 C2-DEMO-{slug}  | {formato}  | {headline curta}
    🎬 C2-COMP-{slug}  | {formato}  | {headline curta}

  C3 — Fundo de funil (consciência alta)
    🎬 C3-PROVA-{slug} | {formato}  | {headline curta}
    🎬 C3-OBJ-{slug}   | {formato}  | {headline curta}
    🎬 C3-URG-{slug}   | {formato}  | {headline curta}

  CTA padrão: {CTA_TYPE}
  Link de destino: {landing_page_com_utms}
  Recursos automáticos Meta:
    ✓ Variação de texto (5 textos automáticos)
    ✓ Standard enhancements
    ✓ Brightness/contrast
    ✗ Image animation (3D)  — Bárbara: "deixa sem, vai que faz merda"
    ✗ Image uncrop          — idem

✅ FIDELIDADE ANDROMEDA: {N}/47 checks passaram

{Se N < 47, listar gaps:}
⚠️ GAPS DECLARADOS:
  ⚠ {ex: usuário só tem 7 criativos — faltam C2-DEMO e C3-OBJ}
  ⚠ {ex: lista de e-mail vazia — audiência quente vai contar com 3/4 públicos}
  ⚠ {ex: pixel ainda sem evento Lead disparado — pode demorar 24-48h pra otimizar}

📊 RESUMO
  Total a criar:     1 campanha + 6 adsets + 9 creatives + 54 ads
  Verba diária:      R$ {total}
  Verba mensal est:  R$ {total * 30}
  Status inicial:    tudo PAUSED
  Tempo estimado:    ~2 minutos pra criar tudo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Confirmar e subir tudo PAUSED?   [s/N]

Se quiser ajustar antes, me diz o que mudar (ex: "tira o cluster C, põe outro").
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template — Setup Teste (com hipótese)

Variação do template anterior, com seção `🧪 HIPÓTESE` e `DIFF` no topo.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Campanha de TESTE na conta {ACCT_NAME}

🧪 HIPÓTESE
  Testando:           {variavel_nome} (variável {N} do canivete suíço)
  Hipótese:           "{texto da hipótese}"
  Critério sucesso:   {critério}
  Janela avaliação:   {N} dias
  Próxima avaliação:  {data_atual + janela}

📊 DIFF vs padrão Andromeda (Escala)

  Campo                 │ Padrão Escala       │ Este Teste
  ──────────────────────┼─────────────────────┼─────────────────────
  Modo orçamento        │ ABO                 │ {ABO ou CBO}  ← se mudou
  Otimização            │ Maximize conversões │ {valor}
  CPA Máx               │ Não                 │ {com/sem}
  Adv+ Audience         │ ON                  │ {on/off}
  Partilha              │ ATIVA               │ {ativa/desativa}
  Destino               │ Site                │ {Site/Site+Form/Form}
  Verba diária total    │ R$ {escala}         │ R$ {teste} (~50% da Escala)

(Resto idêntico ao template setup novo)

⚠️  Lembretes método:
  • Pontuação de relevância pode cair (na Teste é OK, até 30 está bem)
  • 1 teste por semana — não cruzar com outros testes ativos
  • Se der bom (atende critério), levar pra Escala. Se não, descartar.

QG-TEST-001: ✓ 1 variável isolada confirmada
QG-FA-001:   ✓ {N}/47 (gaps são intencionais — variação testada)

Confirmar e subir PAUSED? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template — Duplicação de campanha

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Duplicação de campanha

📷 ORIGEM
  Nome:    {nome_origem}
  Conta:   {acct_origem}
  Status:  {effective_status}
  Performance 7d: CPA R$ {cpa}, gasto R$ {spend}, {actions} conversões

🎯 DESTINO
  Nome:    {nome_novo}
  Conta:   {acct_destino}
  Tipo de duplicação: {tipo}

📊 DIFF (o que mudou da origem pra cópia)

  Campo               │ Origem              │ Cópia              │ Mudou?
  ────────────────────┼─────────────────────┼────────────────────┼────────
  Conta              │ {origem}           │ {destino}         │ {sim/não}
  Nome               │ {origem}           │ {novo}            │ SIM
  Objetivo           │ {objective}        │ {objective}       │ {sim/não}
  Verba/dia (total)  │ R$ {origem}        │ R$ {nova}         │ {sim/não}
  País target        │ {origem}           │ {destino}         │ {sim/não}
  Custom Audiences   │ {ids_origem}       │ {ids_destino}     │ {reaproveita/cria}
  Creatives (9)      │ originais          │ {mesmos/novos}    │ {sim/não}

📌 CAMPANHA NOVA — payload completo

(seções idênticas ao template setup novo, com ✓ marcado nos itens iguais à origem)

✅ FIDELIDADE ANDROMEDA: {N}/47 checks passaram
✅ QG-DUP-001: duplicação coerente

⚠️ AVISOS
  {avisos contextuais}

Confirmar e duplicar tudo PAUSED? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template — Duplicação de adset

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PREVIEW — Duplicação de adset

📷 ADSET ORIGEM
  Nome:        {name_origem}
  Campanha:    {campaign_origem_name} ({id})
  Verba:       R$ {budget}/dia
  Performance 7d: CPA R$ {cpa}, gasto R$ {spend}
  Targeting:
    - País: {countries}
    - Adv+ Audience: {on/off}
    - Interesses: {flexible_spec}
    - Custom Audiences: {ids}
    - Exclusões: {exclusions}
  Ads vinculados: {N} ads ({lista nomes resumidos})

🎯 DESTINO
  Nome:        {name_novo}
  Campanha:    {campaign_destino} ({mesma/diferente})
  Tipo:        {tipo_duplicacao}

📊 DIFF

  Campo              │ Origem              │ Cópia               │ Mudou?
  ───────────────────┼─────────────────────┼─────────────────────┼────────
  Campanha          │ {origem}           │ {destino}          │ {sim/não}
  Nome              │ {origem}           │ {novo}             │ SIM
  Verba             │ R$ {origem}        │ R$ {nova}          │ {sim/não}
  Adv+ Audience     │ {on}               │ ON (mantém)        │ não
  Interesses        │ {origem_list}      │ {novo_list}        │ {sim/não}
  Custom Audiences  │ {origem}           │ {destino}          │ {sim/não}
  Exclusões         │ {origem}           │ {nova}             │ {sim/não}
  Ads vinculados    │ {N origem}         │ {N novo}           │ {mantém/troca}

⚠️ AVISOS
  {ex: "Adset origem com bom CPA — atenção pra não duplicar 'pra escalar'"}
  {ex: "Cluster novo tem interesses sobrepostos com origem — vão competir"}

✅ QG-DUP-002: duplicação coerente

Confirmar e criar adset PAUSED? [s/N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template — Pergunta de ativação (após criar)

Apresentado em sequência DEPOIS do preview confirmado e da criação bem-sucedida.

```
✅ Campanha criada com sucesso (PAUSED)

📌 IDs criados
  Campanha:  {campaign_id}
  Adsets:    {adset_id_1}, {adset_id_2}, ... ({N} no total)
  Creatives: {creative_id_1}, ... ({N} no total)
  Ads:       {N} ads no total

🔗 Link Gerenciador:
   https://adsmanager.facebook.com/adsmanager/manage/campaigns?act={ACCT}&selected_campaign_ids={campaign_id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tá tudo PAUSED. Próximo passo:

  1. Você quer revisar primeiro no Gerenciador? (recomendado pra primeira subida)
  2. Ou eu já ativo direto?

Se for ativar, eu rodo (em sequência):
  PATCH campanha → status=ACTIVE
  PATCH {N} adsets → status=ACTIVE
  PATCH {N} ads → status=ACTIVE

Qual? [revisar/ativar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Template — Confirmação de ativação

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Ativando campanha

  ✓ Campanha {campaign_id} → ACTIVE
  ✓ {N} adsets → ACTIVE
  ✓ {N} ads → ACTIVE

✅ TUDO ATIVO. Algoritmo Meta vai começar a impressionar nos próximos minutos.

📅 PRÓXIMOS PASSOS DO MÉTODO (cronograma sugerido):

  T+24h
  └─ Identificar criativos que NÃO gastaram nada — IA já julgou ruins
  └─ Pausar esses (se houver)

  T+72h (3 dias)
  └─ Identificar criativos com CPA muito acima do alvo
  └─ Pausar e/ou substituir

  T+7d (1 semana)
  └─ Identificar a CATEGORIA vencedora (dor? hard sell? prova?)
  └─ Replicar com ângulos e formatos diferentes (ver suprassumo em criativos-avaliacao.md Sec 10)

  Quando CPA sobe (fadiga)
  └─ Sequência: trocar criativos → CPA Máx → reduzir orçamento → nova campanha

  Quando CPA cai (vaca gorda)
  └─ Aumentar orçamento 20-50%/dia. NÃO mexer em mais nada.

Quer que eu volte daqui a 24h pra rodar o triagem inicial?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Regras de uso

1. **Toda criação na Meta API tem que passar por preview confirmado** — sem exceção.
2. **Resposta do usuário deve ser explícita** — "s", "sim", "ativar", "confirmo", "manda" — todas válidas. Resposta vaga ou ausente = abort.
3. **Iteração permitida** — se usuário pedir ajuste, voltar pro Step de montagem do payload, NÃO criar parcial.
4. **Score de fidelidade Andromeda** sempre visível (mesmo se for 47/47, mostrar o score).
5. **Gaps declarados explicitamente** — não esconder divergências.
6. **Citação literal da Bárbara** quando uma decisão importante puder gerar dúvida (ex: "por que sem CPA Máx?").
7. **NÃO mostrar token, IDs do Pixel sensíveis ou outros valores secretos no preview** — só o necessário pra usuário entender.

---

## Variáveis comuns no template

| Variável | O que é | Exemplo |
|----------|---------|---------|
| `{ACCT_NAME}` | Nome humano da conta | "Conta Principal" |
| `{ACCT_ID}` | ID da conta | "act_<NNN...>" (formato com 15-16 dígitos) |
| `{produto}` | Slug do produto | "ndf-workshop" |
| `{OBJECTIVE_PT}` | Objective em PT | "Vendas", "Leads", "Engajamento" |
| `{budget_per_adset}` | Verba por conjunto | "25" (R$25,00) |
| `{total}` | Verba total/dia | "150" (R$150,00) |
| `{custom_event_type}` | Evento de conversão | "PURCHASE", "LEAD" |
| `{CTA_TYPE}` | Tipo de CTA | "SHOP_NOW", "SIGN_UP", "WHATSAPP_MESSAGE" |
| `{landing_page_com_utms}` | URL final com UTMs | "https://exemplo.com/?utm_source=FB&utm_campaign=..." |

---

**Versão:** 1.0.0 | **Status:** Ready for Production
