# Daily Operations Protocol — Protocolo Compartilhado

Protocolo operacional usado tanto pelo scale-operator quanto pelo test-operator.
Fonte unica de verdade pra operacao diaria. Se atualizar aqui, vale pros 2.

---

## Rotina Primeiras 24-48h (Campanha Nova)

### Dia 1: Sobe campanha, NAO MEXE

Instrucao literal: sobe campanha com estrutura completa e nao mexe em nada por 24 horas. A ansiedade bate, mas o algoritmo precisa de tempo pra aprender.

### Apos 24h: Primeira Analise

Dois niveis de analise — anuncios e conjuntos — cada um com logica propria.

#### Anuncios: Decisao BINARIA

- **Bom = mantem**
- **Ruim = pausa**

Pode automatizar com regras: "se custo por resultado > R$X, desativa o anuncio automaticamente." Nao existe anuncio "mais ou menos".

#### Conjuntos BOM: Escala 20-50%/dia

- **Com pressa** = perto de 50%
- **Tranquilo** = perto de 20%
- Pode ser **todo dia** — nao precisa esperar 3 dias
- **"10% e besteira"** — se esta bom, por que esperar? Amanha o CPM pode explodir

**Exemplo pratico:**

Conjunto comecou com R$50/dia. Convertendo a R$3 o lead (meta R$5):
- Dia 2: escala 30% → R$65/dia
- Dia 3: continua bom → escala 30% → R$84/dia
- Dia 4: continua bom → escala 30% → R$109/dia
- Dia 5: CPA subiu pra R$4,50 mas dentro da meta → mantem R$109, nao escala
- Dia 6: CPA voltou a R$3,20 → escala 20% → R$131/dia

Logica: escala enquanto funciona, para quando bambeia, retoma quando estabiliza.

#### Conjuntos RUIM nas primeiras 24-48h: MATA NO NINHO

Se fez 9 criativos bem feitos (C1+C2+C3), seguiu a estrutura, e o conjunto nao performou nas primeiras 24h — nao vai melhorar com remendo.

> "Mata no ninho." Pausa o conjunto imediatamente.

A tolerancia de 48h (ao inves de 24) e so pra quem nunca fez trafego e nao tem historico de pixel.

**Criterios detalhados:** [Fonte: VOL-06 Sec 2.3]

| Criterio | Acao |
|----------|------|
| Conjunto novo com 9 criativos, todos ruins em 24h | Pausar imediatamente |
| Primeira vez fazendo trafego, sem historico de pixel | Pode esperar ate 48h |
| Conjunto ja performou bem, depois piorou | NAO matar — seguir Procedimento Ciclico (secao abaixo) |

A metafora da maca: o problema nao e a maca que ja esta podre no supermercado (essa voce nao leva). O problema e a maca bonita que voce trouxe pra casa e tres dias depois esta bichenta. A maca podre de cara, voce mata no ninho.

**Exemplo pratico:**

Voce sobe 4 conjuntos. Apos 24h:
- Conjunto 1 (AP puro): 8 leads a R$4 → BOM. Escala.
- Conjunto 2 (interesse marketing): 3 leads a R$12 → RUIM. Mata no ninho.
- Conjunto 3 (interesse empreendedorismo): 6 leads a R$5 → BOM. Escala.
- Conjunto 4 (audiencia quente): 2 leads a R$3 → BOM (volume baixo e normal pra AQ). Escala.

---

## Procedimento Ciclico de Otimizacao — 6 Passos [Fonte: VOL-06 Sec 1.2]

O loop central do Andromeda quando um conjunto esta ruim NO DIA A DIA (apos as primeiras 48h). Diferente do "mata no ninho", aqui o conjunto ja teve chance de performar.

```
╔══════════════════════════════════════════════════════════════╗
║              PROCEDIMENTO CICLICO ANDROMEDA                  ║
║                                                              ║
║  CONJUNTO RUIM (apos 48h)                                    ║
║      |                                                       ║
║      v                                                       ║
║  [1] SUBIR NOVOS CRIATIVOS                                   ║
║      (no mesmo conjunto — sem medo de resetar aprendizado)   ║
║      |                                                       ║
║      v                                                       ║
║  [2] DEU BOM? ──sim──> ESCALAR 20-50%/dia ──> FIM            ║
║      |                                                       ║
║      nao                                                     ║
║      v                                                       ║
║  [3] AJUSTAR CPA MAXIMO                                      ║
║      (teto de quanto o conjunto pode gastar por conversao)   ║
║      |                                                       ║
║      v                                                       ║
║  [4] DEU BOM? ──sim──> ESCALAR 20-50%/dia ──> FIM            ║
║      |                                                       ║
║      nao                                                     ║
║      v                                                       ║
║  [5] CRIAR CONJUNTO/CAMPANHA NOVA                            ║
║      Campanha boa no geral? → Cria FORA (campanha nova)      ║
║      Campanha ruim no geral? → Cria DENTRO da mesma          ║
║      |                                                       ║
║      v                                                       ║
║  [6] NADA FUNCIONOU?                                         ║
║      → PROBLEMA NAO E TRAFEGO                                ║
║      → Rever: produto, preco, pagina, comercial, funil       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

> "Quando esta ruim, poe mais anuncios, CPA maximo. Essa e a conduta." [Fonte: VOL-06 Sec 1.2]

---

## Regras de Subida de Criativos [Fonte: VOL-06 Sec 1.3]

Quando subir novos anuncios em um conjunto existente:

| Aspecto | Regra |
|---------|-------|
| Como subir | Normal, sem pirotecnia |
| Onde subir | No mesmo conjunto de anuncios (mesmo que esteja ruim) |
| Reset de aprendizado | Nao importa — conjunto ja esta ruim mesmo |
| Quantidade | Manter a logica de 9 anuncios |
| Mix obrigatorio | Video + Estatico (NUNCA so um tipo) |

> "Subir os novos anuncios no mesmo conjunto de anuncios. Para de ficar criando moda." [Fonte: VOL-06 Sec 1.3]

**Alternativa:** Se tem recurso de Teste AB de criativos na conta (nao disponivel em todas), usar — NAO reseta aprendizado. Ideal pra conjuntos com historico bom que bambearam.

---

## 5 Passos da Operacao Diaria (Rotina Continua)

### Passo 1: Coletar Metricas (AUTONOMO)

```
GET /act_{account_id}/insights
  fields: spend,impressions,clicks,ctr,cpc,cpm,actions,cost_per_action_type,frequency
  date_preset: today
  level: adset
```

Coletar tambem no nivel de campanha e ad quando necessario.

### Passo 2: Checar Pacing (AUTONOMO)

```
pacing_ratio = spend_hoje / (daily_budget * hora_atual / 24)
```

- As 12h → ~50% do budget
- As 18h → ~75%
- Pacing < 60% as 18h → problema de entrega → diagnostico

Pacing e lei suprema (CR-09). Checar ANTES de qualquer outra metrica.

### Passo 3: Comparar CPA vs Estrela Guia (AUTONOMO)

Por conjunto, decisao binaria (CR-08):
- CPA <= Estrela Guia = **BOM** → manter
- CPA > Estrela Guia = **RUIM** → recomendar pausar

Volume minimo pra decisao: gasto de 3-5x o CPA target. Abaixo disso, amostra insuficiente — apresentar pro usuario decidir.

### Passo 4: Recomendar Acoes (AUTONOMO analise, HUMANO decisao)

Apresentar recomendacao com dados:
```
Conjuntos BOM (CPA <= EG):
- [nome]: CPA R$XX (EG R$YY) — [MANTER/ESCALAR]

Conjuntos RUIM (CPA > EG):
- [nome]: CPA R$XX (EG R$YY) — [PAUSAR]

Acao recomendada: [resumo]
Aprovar? [S/N]
```

### Passo 5: Executar + Registrar (APROVACAO HUMANA)

Apos aprovacao:
- Pausar: `PATCH /{adset_id} status=PAUSED`
- Escalar: `PATCH /{adset_id} daily_budget={novo_valor}`
- Registrar: investido, CPA, ROAS, CTR, frequencia, acoes tomadas

---

## Arvore de Decisao Expandida [Fonte: VOL-06 Sec 2.1-2.2]

A Arvore de Decisao Andromeda e um fluxograma que elimina decisoes emocionais. Metafora do baralho: espada = anuncio, espadilha = conjunto de anuncios.

### Decisao de Anuncio — SEMPRE BINARIA

```
╔═══════════════════════════════════════╗
║         ANUNCIO (Espada)              ║
║   Decisao SEMPRE binaria              ║
╠═══════════════════════════════════════╣
║                                       ║
║   CPA do anuncio esta BOM?            ║
║        |              |               ║
║       SIM            NAO              ║
║        |              |               ║
║    MANTEM          PAUSA              ║
║  (nao mexe)    (sem do)              ║
║                                       ║
╚═══════════════════════════════════════╝
```

Regra automatica opcional: "Desativar anuncio quando custo por resultado > R$ X". Sem peso na consciencia.

### Decisao de Conjunto de Anuncios — COMPLEXA

```
╔══════════════════════════════════════════════════════════════════════════╗
║              CONJUNTO DE ANUNCIOS (Espadilha)                          ║
║              Decisao com multiplos caminhos                            ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║                    Conjunto esta BOM?                                   ║
║                    /            \                                       ║
║                  SIM            NAO                                     ║
║                  |               |                                      ║
║          ESCALAR 20-50%     ┌────┴──────────────────┐                  ║
║           por dia           |                        |                  ║
║                        PRIMEIRAS               DIA A DIA               ║
║                        24-48 HORAS            (apos 48h)               ║
║                             |                        |                  ║
║                    9 criativos,           [PROCEDIMENTO CICLICO]        ║
║                    tudo ruim?             1. Subir novos criativos      ║
║                        |                 2. Deu bom? → Escalar         ║
║                       SIM                3. CPA maximo                  ║
║                        |                 4. Deu bom? → Escalar         ║
║                   MATAR NO NINHO         5. Novo conjunto/campanha     ║
║                   (pausar conjunto)       6. Nada? → Nao e trafego     ║
║                        |                                                ║
║                   Criar novo                                            ║
║                   conjunto                                              ║
║                        |                                                ║
║                   Campanha boa?                                         ║
║                    /       \                                            ║
║                  SIM       NAO                                          ║
║                   |         |                                           ║
║              Criar FORA  Criar DENTRO                                   ║
║              da campanha da campanha                                    ║
║                                                                        ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## Contra-Ataque de Panico — 5 Passos [Fonte: VOL-06 Sec 2.5]

Protocolo emocional pra quando o panico bate. Operacional, nao teorico.

1. **Parar.** Saia do gerenciador.
2. **Respirar.** Literalmente.
3. **Olhar a Arvore de Decisao.** Calma, racional, sem emocao.
4. **Seguir os passos:** 24h? Conjunto ou anuncio? Ja troquei criativo? Ja mudei CPA? Ja criei campanha nova?
5. **Aceitar que o problema pode ser outro.** Se tudo ja foi feito e nada funcionou, o problema nao e trafego. Aceite sem emocao.

> "No dia que voce estiver ali meio com o vento virado, meio assustado, voce vai vir e vai olhar para ela. Calma, racional, sem emocao." [Fonte: VOL-06 Sec 2.5]

---

## Framework Vaca Gorda / Vaca Magra [Fonte: VOL-03 Sec 4.12]

Framework de timing para decidir QUANDO testar e QUANDO escalar.

| Cenario | O que fazer |
|---------|------------|
| **Vaca gorda** (resultados bons) | **NAO TESTE.** Foque em entender POR QUE esta bom e replique. Escale o que funciona. |
| **Vaca magra** (resultados ruins) | **TESTE.** Tire coelhos da cartola. Teste toda semana ate melhorar. |
| **Meio-termo** (bom, mas quer melhorar) | 1 teste por semana, no maximo. |

**Regras de ouro do timing:** [Fonte: VOL-03 Sec 4.12]

1. **Melhor momento para testar:** quando as coisas vao MAL
2. **Pior momento para testar:** quando as coisas vao BEM
3. **Frequencia:** maximo 1 teste por semana
4. **Nunca misture testes:** se testa ABO vs CBO E CPA ao mesmo tempo, nao vai saber qual causou o resultado
5. **Se a vaca esta magra:** teste toda semana, por meses, ate melhorar

> "Vaca gorda: olha para a vaca, nao para o coelho. Vaca magra: pega o canivete suico." [Fonte: VOL-03 Sec 4.12]

**Impacto operacional direto:**

- **Campanha boa AGORA** → NAO sobe criativo novo, NAO testa, guarda municao pra quando precisar
- **Campanha ruim** → hora de agir — Procedimento Ciclico + testes na conta de teste

---

## Conta Escala = Obediencia, Conta Teste = Loucura [Fonte: VOL-06 Sec 1.7]

Duas personas operacionais. Internalizar essa divisao e obrigatorio.

| Persona | Conta | Comportamento |
|---------|-------|--------------|
| **Obediente** | Escala (Andromeda) | Segue as regras. Poucas campanhas. Escala vertical. Nao inventa. |
| **Doido** | Teste | Faz o que quiser. Experimenta. Quebra regras. Terra sem lei. |

> "Consistencia > jeito certo." [Fonte: VOL-06 Sec 1.6]

| Aspecto | Escala | Teste |
|---------|--------|-------|
| Mentalidade | Conservadora, proteger resultado | Experimental, aceitar risco |
| Criativos | So validados (campeoes) | Novos entram AQUI primeiro |
| Escala | Vertical 20-50% (CR-07) | Orcamento livre, foco em aprendizado |
| Decisao ruim | Matar no ninho (CR-03) | Descartar + registrar aprendizado |
| Pos-acao | Monitorar sustentabilidade | Avaliar pra reservatorio |

**O que EVITAR na conta de escala:** [Fonte: VOL-06 Sec 1.5]

| O que evitar | Por que |
|-------------|---------|
| Duplicar conjuntos de anuncios | Andromeda quer escala VERTICAL, nao horizontal |
| Criar muitas campanhas | Dilui dados do algoritmo |
| Mexer no que esta bom | Filho que se comporta nao mexe em nada |
| Ouvir muitas fontes | Escolhe um mentor e segue |

---

## Campanha Boa que Ficou Ruim — Sequencia de Otimizacao (5 Passos)

O cenario mais comum no dia a dia. Campanha estava boa, dias/semanas passaram, comecou a bambar.

### Passo 1: Pausar anuncios ruins (IMEDIATO)

Na hora que ve que esta ruim, pausa os anuncios que puxam custo pra cima. Nao espera, nao da mais chance.

> "Nao leva pra outra campanha — a IA ja deu bomba nele." O anuncio foi marcado como ruim pelo algoritmo. Enfiar em outro lugar nao muda nada.

### Passo 2: Subir criativos novos (espera 24h)

Se tem criativos prontos, sobe dentro do mesmo conjunto. Se nao tem, precisa produzir.

Subir criativo novo pode resetar aprendizado — mas o conjunto esta ruim:
> "Aprendeu errado, repete de ano."

Mix obrigatorio: video + estatico. Nunca so um tipo. [Fonte: VOL-06 Sec 1.3]

### Passo 3: Definir CPA maximo (espera 24h)

Editar conjunto, definir valor maximo por conversao. Se algoritmo nao acha lead/venda no preco, para de gastar.

> CPA maximo e SEGUNDA LINHA DE DEFESA, nao configuracao inicial. NAO comeca com CPA definido — so define quando criativo novo nao resolveu.

### Passo 4: Baixar orcamento pro chao (espera uns dias)

Minimo possivel. Esperar uns dias pra ver se da uma acordada. Pode ser sazonalidade, bug do Meta, problema de servidor, leilao atipico — coisas que se resolvem sozinhas com tempo.

### Passo 5: Criar campanha nova

Se chegou ate aqui e nada ressuscitou, a campanha morreu.

> "Sem medo de ser feliz. Se chegou aqui, campanha morreu."

### Se NADA funcionou: o problema NAO e trafego

Pare de olhar pro gerenciador e olhe pro negocio:
- Produto que ninguem quer
- Preco errado
- Pagina que nao carrega ou nao converte
- Comercial que nao atende ou atende mal
- Timing errado
- Funil ruim

> Trafego e gasolina. Se o carro esta quebrado, mais gasolina nao resolve.

### Timing da Sequencia

| Modo | Como funciona | Duracao |
|------|--------------|---------|
| **Com tempo** | 1 acao por dia. Passo 1 hoje, passo 2 amanha... | ~4-5 dias |
| **Com pressa** | Passos 1 a 4 no mesmo dia. Campanha nova no dia seguinte | ~2 dias |

Logica do modo "com tempo": o algoritmo quer que mexam MENOS nele. Cada mudanca reseta calculos. Dar 24h entre cada passo permite absorver a mudanca.

---

## Onde Criar Novo Conjunto (Decision Tree)

Quando precisa criar conjunto novo porque o atual morreu:

**Campanha BOA no geral** (so 1-2 conjuntos ruins, resto funciona):
- Cria **FORA** da campanha (campanha nova)
- Motivo: nao contamina o que esta bom
- Protege os conjuntos que estao convertendo

**Campanha RUIM no geral** (maioria dos conjuntos ruins):
- Cria **DENTRO** da mesma campanha
- Motivo: ja esta avacalhado, nao tem o que proteger
- Andromeda quer minimo de campanhas — criar nova so adiciona ruido

**Exemplos:**

| Cenario | Conjuntos | Acao |
|---------|-----------|------|
| 5 conjuntos: 3 bons, 2 ruins | Pausa os 2 ruins | Cria novos FORA (campanha nova) |
| 5 conjuntos: 4 ruins, 1 ok | Pausa os 4 ruins | Cria novos DENTRO da mesma |

---

## Remarketing Automatico — Mecanica [Fonte: VOL-06 Sec 6]

### Como Funciona

O Andromeda faz remarketing automaticamente. NAO precisa de campanha de remarketing separada (na maioria dos casos).

O algoritmo intercala C1 (dor), C2 (objecao) e C3 (prova) para a mesma pessoa em momentos diferentes:

```
PESSOA X (nao converteu)
    |
    Momento 1: Ve anuncio C1 (dor) → Nao clicou
    |
    Momento 2: Ve anuncio C3 (prova) → Clicou, nao converteu
    |
    Momento 3: Ve anuncio C2 (objecao) → Clicou e converteu!
```

### Como saber se esta funcionando

- Frequencia da CAMPANHA alta (2,5+) = anuncios diferentes sendo mostrados para mesma pessoa = BOM
- Frequencia do ANUNCIO baixa (< 2) = nenhum anuncio individual repetindo demais = BOM

### Cadencia nos Stories — "Tiros de 4" [Fonte: VOL-06 Sec 6.4]

O algoritmo faz "tiros de 4" nos Stories — mostra 4 anuncios em sequencia para a mesma pessoa quando identifica interesse:

```
Stories normal (mae) → Stories normal (amigo)
    |
    └── ANUNCIO 1 → ANUNCIO 2 → ANUNCIO 3 → ANUNCIO 4
    |
Stories normal (tia) → ...
```

Isso reforca a importancia de ter 9 criativos variados: o algoritmo precisa de "municao" para esses tiros em sequencia.

### Quando AINDA fazer remarketing separado [Fonte: VOL-06 Sec 6.6]

| Situacao | Remarketing separado? |
|----------|---------------------|
| Orcamento pequeno/medio (ate US$ 50/dia) | NAO — Andromeda resolve |
| Orcamento muito alto (US$ 1.000+/dia) | SIM — criar campanha de remarketing na conta de escala |
| Conta de teste | Pode testar — "la e terra sem lei" |

---

## Ciclo de Vida da Campanha

Campanha e organismo vivo sem prazo de validade. Nao existe limite de 5 dias, 2 semanas, 1 mes. Pode rodar meses, anos — ate parar de performar. O que morre sao os anuncios e os criativos, nao a campanha.

### Ciclo Continuo

```
Campanha nasce → 9 criativos → dias passam → alguns morrem →
pausa os mortos → dias passam → campanha morre

**Criativos novos = LOTE novo (campanha nova).**
NAO subir criativos novos em campanha existente que performa.
Ver sistema de lotes em `estrutura-campanha.md` Sec 9.2.
```

Conjuntos acumulam inteligencia a cada conversao. Matar campanha = jogar inteligencia fora. Prioridade: manter campanha viva e trocar criativos conforme necessario.

### Quantidade de Criativos Ativos

9 e o MINIMO inicial, nao o maximo:
- Se 4 dos 9 morreram, ficaram 5 ativos → sobe mais pra repor
- Conjunto pode ter 12, 15 criativos ativos se varios performam
- A IA concentra verba nos melhores e ignora os piores naturalmente

---

## Regras Automaticas

### Regra Basica (mais util)

- **"Se custo por resultado > R$X → desativar anuncio"**
- **"Se custo por resultado < R$X → manter ativo"**

Funciona bem porque decisao de anuncio e sempre binaria.

### Regras Avancadas (conta de teste)

Trading de orcamento pra quem tem muito dinheiro:
- A cada hora: se CPA abaixo do limite → aumenta 10%
- A cada hora: se CPA acima do limite → reduz 10%

Nivel senior com orcamentos altos. Nao e pra iniciante.

---

## Diagnostico: Campanha que NAO Gasta

Se gastou ZERO (nem R$1), problema e configuracao, nao qualidade do anuncio.

| # | Causa | Probabilidade | Solucao |
|---|-------|--------------|---------|
| 1 | Conta nova com trava de seguranca | ~70% | Abrir suporte Meta, pedir liberacao |
| 2 | Pixel instalado errado | ~15% | Teste: criar campanha de interacao (R$10-20). Se gastou = problema e pixel |
| 3 | Pagina Instagram/Facebook bloqueada | ~5% | Verificar restricoes na pagina |
| 4 | Campanha nao publicada de verdade | ~3% | Checar se campanha, conjunto E anuncio estao ativos (verde) |
| 5 | Publico muito pequeno | ~3% | Verificar tamanho do publico. < 50k → usar Audiencia Completa (RC-13) |
| 6 | Sobreposicao de publicos | ~2% | Checar Audience Overlap. > 30% = mesmo publico (RC-12). Escolher um |
| 7 | Debito pendente na conta de anuncios | ~2% | Verificar forma de pagamento e faturas |

[Fonte: VOL-03 Sec 7.9, VOL-06, MIU MT11-008]

---

## Diagnostico por Eliminacao

Quando problema nao e obvio:

1. Criativos estao bons? (CTR acima de 2%, CPC aceitavel) → Se sim, problema nao e criativo
2. Pagina converte? (taxa acima de 30% pra lead, 2-3% pra venda) → Se sim, problema nao e pagina
3. Comercial atende? (leads respondidos em tempo habil) → Se sim, problema nao e comercial
4. Produto tem demanda? (busca organica, concorrentes vendem) → Se nao, problema e produto

Se todos dizem "sim" e nao vende: timing, preco ou funil. Nao e trafego.

---

## Tabela de Referencia — Decisoes por Cenario

| Cenario | Acao | Timing |
|---------|------|--------|
| Dia 1 apos subir campanha | Nao mexe, espera 24h | Imediato |
| Anuncio bom apos 24h | Mantem | Continuo |
| Anuncio ruim apos 24h | Pausa (decisao binaria) | Imediato |
| Conjunto bom apos 24h | Escala 20-50%/dia | Pode ser todo dia |
| Conjunto ruim nas primeiras 24-48h | Mata no ninho — pausa, cria outro | Imediato |
| Conjunto ruim apos 48h (dia a dia) | Procedimento Ciclico: criativos → CPA max → novo conjunto | Sequencial |
| Campanha boa que bambeou — Passo 1 | Pausar anuncios ruins | Imediato |
| Campanha boa que bambeou — Passo 2 | Subir criativos novos (video+estatico) | Espera 24h |
| Campanha boa que bambeou — Passo 3 | Definir CPA maximo | Espera 24h |
| Campanha boa que bambeou — Passo 4 | Baixar orcamento pro chao | Espera uns dias |
| Campanha boa que bambeou — Passo 5 | Criar campanha nova | Ultimo recurso |
| Nada funcionou em nenhum passo | Problema NAO e trafego — olhar pro negocio | — |
| Campanha nao gasta nenhum centavo | Problema de configuracao (7 causas — ver diagnostico) | Diagnostico |
| Campanha boa AGORA (vaca gorda) | NAO mexe, NAO sobe criativo, NAO testa, guarda pra depois | — |
| Campanha ruim AGORA (vaca magra) | Hora de testar. 1 teste por semana, nunca misturar | Semanal |
| Conjunto com muitos criativos mortos | Sobe novos pra repor (pode ter 12, 15 ativos) | Quando precisar |
| Quer escalar mais rapido mas campanha ta boa | Cria outra campanha OU usa outra conta — NAO mexe na que funciona | — |
| Panico batendo, emocao alta | Contra-Ataque: parar, respirar, olhar arvore, seguir passos | Imediato |

## Tabela de Referencia — Timing de Acoes

| Acao | Frequencia | Intervalo Minimo | Observacao |
|------|-----------|------------------|------------|
| Escalar orcamento de conjunto bom | Todo dia | 24h | 20-50% por vez. NAO precisa 3 dias |
| Pausar anuncio ruim | Qualquer momento | Nenhum | Decisao binaria — age na hora |
| Subir criativo novo (campanha ruim) | Quando precisar | 24h apos pausar ruins | Mix video+estatico obrigatorio |
| Definir CPA maximo | So quando criativo nao resolveu | 24h apos subir criativos | Segunda linha de defesa |
| Baixar orcamento | Quando CPA insustentavel | Apos CPA maximo nao resolver | Ultima tentativa antes de matar |
| Criar campanha nova | Quando campanha morreu | Apos esgotar passos 1-4 | Sem medo de ser feliz |
| Matar conjunto no ninho | Primeiras 24-48h | 24h (48h se nunca fez trafego) | 9 criativos nao performou = nao melhora |
| Subir criativo em campanha boa | NUNCA (vaca gorda) | — | Guarda pra quando precisar |
| Testar (conta de teste) | Max 1x por semana | 7 dias | Nunca misturar testes |
| Teste AB de criativo | Quando disponivel na conta | — | NAO reseta aprendizado |
| Regra automatica (anuncio) | Continua | Horaria ou diaria | Custo > X = desativa |
