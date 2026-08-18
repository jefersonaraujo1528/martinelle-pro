# Nomenclatura Protocol — Meta Ads + UTMs

## URL Padrao (UTMify)

URL unica para TODOS os anuncios. Nao alterar parametros.

```
{landing_page}?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&xcod=...
```

Macros dinamicas do Meta:
- `{{campaign.name}}` — nome da campanha
- `{{campaign.id}}` — ID da campanha
- `{{adset.name}}` — nome do conjunto
- `{{adset.id}}` — ID do conjunto
- `{{ad.name}}` — nome do anuncio
- `{{ad.id}}` — ID do anuncio
- `{{placement}}` — posicionamento (feed, stories, reels, etc)

---

## 1. Campanha: `[OBJETIVO]_[PRODUTO]_[LOTE]`

### Objetivos
| Codigo | Significado |
|--------|------------|
| VENDAS | Campanha de vendas (conversao) |
| TESTE | Campanha de teste |
| LEADS | Captacao de leads |
| SEG | Seguidores |
| VIEWS | Visualizacoes de video |
| ANDRO | Campanha Andromeda principal |

### Produtos
| Codigo | Produto |
|--------|---------|
| NDF | Negocio Digital do Futuro |
| ARC | Arca |
| ULTRA | Ultra |
| ARK | Arka |

### Lotes
L01, L02, L03... (cada batch = novo lote)

### Exemplos
- `ANDRO_NDF` — campanha principal Andromeda do NDF
- `TESTE_NDF_L01` — primeiro lote de testes do NDF
- `VENDAS_ARC` — campanha de vendas do Arca

---

## 2. Conjunto: `[TEMPERATURA]_[TIPO]`

### Temperaturas
| Codigo | Significado | Descricao |
|--------|------------|-----------|
| ADV | Advantage+ | Publico aberto com IA do Meta |
| QUENTE | Quente | Audiencia personalizada (engajamento, visitantes) |
| RMK | Remarketing | Retargeting especifico |

### Tipos de Conjunto ADV
| Nome | Descricao |
|------|-----------|
| ADV_Puro | Sem sugestoes — IA pura (controle) |
| ADV_Int-mkt-digital | Com sugestao: marketing digital |
| ADV_Int-empreendedorismo | Com sugestao: empreendedorismo |
| ADV_Int-ia | Com sugestao: inteligencia artificial |
| ADV_LAL-compradores | Lookalike de compradores |

### Tipos de Conjunto QUENTE
| Nome | Descricao |
|------|-----------|
| QUENTE_Audiencia-completa | Engajadores 365d + visitantes 180d |
| QUENTE_Engajadores-IG | So engajadores Instagram |
| QUENTE_Visitantes-30d | Visitantes recentes |

### Tipos de Conjunto RMK
| Nome | Descricao |
|------|-----------|
| RMK_Checkout-7d | Abandonou checkout nos ultimos 7 dias |
| RMK_ViewContent-14d | Viu pagina nos ultimos 14 dias |

### Exclusao Obrigatoria
**TODOS os conjuntos** excluem compradores 180d.

---

## 3. Anuncio: `[FORMATO]_[ANGULO]_[CONSCIENCIA]_[H+numero]`

### Formatos
| Codigo | Descricao |
|--------|-----------|
| SELF | Selfie / talking head |
| UGC | User Generated Content |
| POD | Podcast / entrevista |
| IAGEN | Imagem gerada por IA |
| IMG | Imagem estatica |
| CAR | Carrossel |
| REEL | Reels / video curto |
| SLIDES | Slides / apresentacao |
| NORMAL | Video padrao (talking head editado) |
| CAIXA | Caixinha / overlay frame |
| LOFI | Estetica lo-fi (grain, retro) |
| HAND | Hand-held camera |
| CORTE | Corte / excerpt |

### Angulos (exemplos)
| Codigo | Descricao |
|--------|-----------|
| dep-lanc | Depoimento de lancamento |
| ia-expert | IA para experts |
| result-aluno | Resultado de aluno |
| do-zero | Comecar do zero |
| metodo | Apresentacao do metodo |
| urgencia | Urgencia / escassez |
| autor | Autoridade do autor |
| chamado | Proposito / chamado |
| antes-depois | Transformacao |
| objecao-preco | Quebrando objecao de preco |

### Nivel de Consciencia (Metodo Andromeda)
| Codigo | Nivel | Funcao |
|--------|-------|--------|
| C1 | Consciencia Baixa | Fala do universo/problema, nao do produto. Eleva consciencia |
| C2 | Consciencia Media | Apresenta solucao/produto, posiciona autoridade, seduz |
| C3 | Consciencia Alta | Prova social, quebra objecao, urgencia. Empurra pra decisao |

### Hooks
H01, H02, H03... = variacao de hook (gancho de abertura). Mesmo criativo com ganchos diferentes.

### Exemplos
- `SELF_dep-lanc_C2_H01` — Selfie de depoimento, consciencia media, hook 1
- `UGC_result-aluno_C3_H01` — UGC de resultado de aluno, consciencia alta, hook 1
- `IAGEN_ia-expert_C1_H02` — Imagem IA sobre IA pra experts, consciencia baixa, hook 2
- `CAR_metodo_C2_H01` — Carrossel do metodo, consciencia media, hook 1
- `NORMAL_extincao_C1_H01` — Video normal sobre extincao digital, consciencia baixa, hook 1

---

## 4. Estrutura Tipica Andromeda

```
ANDRO_NDF (campanha)
├── ADV_Puro (conjunto — controle, sem sugestoes)
│   ├── NORMAL_extincao_C1_H01        (C1 — dor/problema)
│   ├── NORMAL_selecao-natural_C1_H01 (C1 — quebra de padrao)
│   ├── NORMAL_visao-futuro_C1_H01    (C1 — conteudo de valor)
│   ├── SELF_metodo_C2_H01            (C2 — hard sell)
│   ├── NORMAL_lanc-vale-pena_C2_H01  (C2 — autoridade)
│   ├── CAR_do-zero_C2_H01            (C2 — demonstrativo)
│   ├── UGC_result-aluno_C3_H01       (C3 — prova social)
│   ├── UGC_antes-depois_C3_H01       (C3 — prova de mecanismo)
│   └── IMG_objecao-preco_C3_H01      (C3 — quebra de objecao)
├── ADV_Int-mkt-digital (com sugestao)
│   └── (mesmos 9 criativos)
├── ADV_Int-empreendedorismo
│   └── (mesmos 9 criativos)
├── ADV_Int-ia
│   └── (mesmos 9 criativos)
├── ADV_LAL-compradores
│   └── (mesmos 9 criativos)
└── QUENTE_Audiencia-completa
    └── (mesmos 9 criativos)
```

---

## 5. Checklist Pre-Lancamento

- [ ] Nomenclatura de campanha correta
- [ ] Nomenclatura de conjuntos correta
- [ ] Nomenclatura de anuncios correta
- [ ] URL com UTMs em TODOS os anuncios
- [ ] Exclusao de compradores 180d em TODOS os conjuntos
- [ ] Criativos identicos em todos os conjuntos
- [ ] CTA configurado em todos os anuncios
