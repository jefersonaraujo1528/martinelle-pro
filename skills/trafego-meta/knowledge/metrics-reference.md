# Metrics Reference — Andromeda

## Hierarquia das Metricas

Sao 8 metricas obrigatorias + 1 bonus. Existe hierarquia clara: CPA e REI ABSOLUTO e, quando esta bom, todas as outras podem ser ignoradas. As demais metricas so servem pra diagnosticar QUANDO o CPA piora.

---

## Benchmarks Consolidados

Tabela unica de referencia rapida com TODOS os benchmarks numericos.

### Benchmarks de Metricas

| Metrica | Benchmark | Nota |
|---------|----------|------|
| **CPA** | Depende do negocio (Estrela Guia) | Metrica rainha — se bom, nao olha mais nada |
| **Estrela Guia** | Referencia interna | Custo do passo anterior ao CPA |
| **CTR** | > 2% | "Acabou era do 1%" |
| **CTR (hispanico)** | > 4% | Menos competicao no LATAM |
| **CPC** | Quanto menor, melhor | Forma absoluta do CTR |
| **CPM** | Variavel (sazonalidade) | Unica que nao controla |
| **Connect Rate** | 70-80% | Abaixo de 70% = site lento |
| **Conversao pagina lead** | > 30% | "Isso e lei" — independe do ticket |
| **Conversao pagina vendas** | 2-3% | Qualquer produto/preco |
| **Conversao e-commerce** | > 1% | Mais baixo pela natureza |
| **Frequencia anuncio** | max 2 | Acima = precisa mais criativos |
| **Frequencia campanha** | Quanto mais, melhor | Remarketing automatico |
| **Discrepancia ger./CRM** | ate 15% | Acima = verificar pixel/API |
| **Pesquisa preenchida** | 60-80% | Na pagina de obrigado |
| **Entrada grupo WhatsApp** | > 70% | Com pesquisa pode cair 5-10% |

[Fonte: VOL-06 Sec 4, REPERTORIO Sec 5]

### Benchmarks de Estrutura

| Parametro | Benchmark |
|-----------|----------|
| Criativos por conjunto | 9 (3x C1, 3x C2, 3x C3) |
| Orcamento max inicial/conjunto | R$150 / US$50 |
| Escala diaria | 20-50% |
| Campanhas na escala | 1 (max 3) |
| Mix de criativos | OBRIGATORIO video + estatico |
| Refresh de criativos | Semanal (quinzenal se < R$5k) |
| Contas (< R$5k/mes) | 1 teste + 1 escala |
| Contas (> R$5k/mes) | Min 2 teste + 2 escala |
| Crescimento investimento | 20% a cada 6 meses |
| Lookalike | Sempre 1% |

[Fonte: REPERTORIO Sec 5]

---

## 8+1 Metricas

### 1. CPA (Custo por Aquisicao) — REI ABSOLUTO

O CPA e a metrica suprema. Tudo gira em torno dele.

- **Formula:** Investimento / Conversoes
- **Meta API field:** `cost_per_action_type` (filter: `offsite_conversion.fb_pixel_purchase`)
- **Benchmark:** definido pela Estrela Guia
- **Acao:** CPA <= Estrela Guia = BOM. CPA > Estrela Guia = RUIM.

> "Frequencia alta? Foda-se, esta convertendo. CTR baixo? Foda-se, esta convertendo. Nenhuma metrica supera o CPA."

**Quando olhar pras outras metricas:** so quando o CPA bambar. Enquanto CPA esta bom, nao mexe em nada, nao investiga nada.

### 2. Estrela Guia (CPA Target)

CPA maximo aceitavel para o negocio ser sustentavel. Conceito-chave do metodo — e o passo ANTES da conversao.

- **Calculo geral:** Margem do produto / 3
- **Exemplo:** Produto R$297, margem R$200 -> Estrela Guia = ~R$65
- **Regra:** Se nao sabe calcular -> "Quanto custa teu produto? Qual margem?"
- **Importancia:** SEM Estrela Guia nao tem como saber se ta bom ou ruim

**Como funciona por tipo de campanha:**
- **Campanha de leads:** Estrela Guia = custo de quem PISOU NA PAGINA
- **Campanha de vendas:** Estrela Guia = custo de quem PISOU NO CHECKOUT

**Tabela Diagnostica 2x2:**

| Estrela Guia | CPA Bom | CPA Ruim |
|-------------|---------|----------|
| **Alta** | Tudo funcionando | Problema na pagina/checkout — gente chega mas nao converte |
| **Baixa** | Improvavel: pouco trafego de alta qualidade | Problema no anuncio — ninguem esta chegando |

[Fonte: VOL-06 Sec 3.2]

A Estrela Guia e o raio-X. O CPA diz "esta doente" — a Estrela Guia diz "a dor e aqui".

### 3. CTR (Click-Through Rate)

Eficiencia do anuncio em formato PERCENTUAL.

- **Formula:** Cliques / Impressoes * 100
- **Meta API field:** `ctr`
- **Referencia:** acima de 2%. CTR de 1% ja era, ficou no passado
- **Benchmarks de mercado:** campanhas Brasil 2-3%, campanhas espanhol 4%+
- **Se baixo:** Anuncio xoxo -> criativo nao atrai, precisa de material novo

**Relacao CTR x CPC:**

| CTR | CPC | Significado |
|-----|-----|-------------|
| Alto | Baixo | Anuncio excelente — muita gente clicando, custo baixo |
| Baixo | Alto | Anuncio ruim — pouca gente clicando, custo caro |

[Fonte: VOL-06 Sec 3.3]

### 4. CPC (Custo por Clique)

Eficiencia do anuncio em formato ABSOLUTO (R$). Mede a mesma coisa que CTR, so em custo.

- **Formula:** Investimento / Cliques
- **Meta API field:** `cpc`
- **Relacao com CTR:** CTR = forma relativa (%), CPC = forma absoluta (R$). Ambos diagnosticam quao bom e o anuncio
- **Se alto:** antes de culpar o anuncio, olha CPM pra confirmar se nao e mercado

### 5. CPM (Custo por Mil Impressoes)

Custo de mostrar o anuncio 1.000 vezes.

- **Formula:** (Investimento / Impressoes) * 1000
- **Meta API field:** `cpm`
- **Regra fundamental:** NAO depende de voce (se fez estrutura Andromeda). Depende do mercado, sazonalidade, concorrencia

**Sazonalidade expandida:**

| Mes | CPM | Motivo |
|-----|-----|--------|
| Janeiro | MAIS BARATO do ano | Verbas dos grandes nao aprovadas ainda |
| Novembro | MAIS CARO do ano | Todos anunciando (Black Friday) |

[Fonte: VOL-06 Sec 3.4]

**O que inflaciona SEU CPM:** muitos conjuntos competindo entre si, muitas campanhas na mesma conta. Estrutura Andromeda (poucas campanhas, escala vertical) evita isso.

**3 opcoes quando CPM explode sem culpa sua:**

| Opcao | No trafego | Quando usar |
|-------|-----------|-------------|
| Aceitar prejuizo | Seguir anunciando no CPA caro | Lancamento, evento, data limite |
| Reduzir ao minimo | Nao desativar, so reduzir orcamento | Dia normal, sem urgencia |
| Compensar depois | Acelerar pacing quando CPM normalizar | Sempre — pacing existe pra isso |

[Fonte: VOL-06 Sec 3.4]

**Futuro:** Meta caminhando para cobrar por resultado (conversao) em vez de CPM. Timeline estimada: no minimo 10 anos.

### 6. Connect Rate

Percentual de quem clicou e de fato chegou na pagina.

- **Formula:** Visualizacoes de pagina de destino / Cliques no link
- **Meta API field:** metrica personalizada (ver abaixo)
- **Referencia:** 70-80%. Abaixo de 70% = problema de carregamento. 100% = impossivel (configuracao errada)
- **Benchmarks de mercado:** 80-90% nas campanhas de Black Friday
- **Por que e mais confiavel que PageSpeed:** ferramentas de teste sao teoria. Connect rate e pratica real
- **Se baixo:** Problema tecnico — pagina lenta, redirect quebrado, 404. NAO e problema de trafego

**Como criar a coluna no gerenciador (4 passos):**

1. Ir ao final das colunas do gerenciador
2. Clicar no sinal de "+"
3. Clicar em "Personalizar"
4. Criar metrica: **Visualizacao de pagina de destino** / **Cliques no link**

> ALERTA PT-PT: "Cliques na ligacao" no gerenciador portugues de Portugal = cliques no link. "Ligacao" = "conexao/link", nao chamada telefonica.

[Fonte: VOL-06 Sec 3.5]

### 7. Taxa de Conversao da Pagina

Percentual de quem chegou na pagina e realizou a acao.

- **Formula:** Conversoes / Page Views * 100

| Tipo de Pagina | Taxa Minima | Notas |
|---------------|-------------|-------|
| Pagina de captura de leads | **30%** | Nao importa o ticket — casa de R$1M tambem captura lead primeiro |
| Pagina de vendas (infoproduto, servico) | **2-3%** | Conversao direta em venda |
| E-commerce | **1%** | Volume alto compensa taxa baixa |
| Pagina de aplicacao (high-ticket) | **30%** | Mesma regra de lead |

- **Benchmarks de mercado:** media 39% na Black Friday. Meta interna: 45%
- **Se baixa:** Problema da pagina/oferta — NAO e problema do trafego

### 8. Frequencia — Duas Leituras Diferentes

A metrica mais mal interpretada do trafego pago. Tem que distinguir DUAS frequencias completamente distintas:

#### Frequencia do ANUNCIO (maximo 2)

- **O que mede:** quantas vezes o MESMO anuncio aparece pra MESMA pessoa
- **Meta API field:** `frequency`
- **Se alta:** algoritmo com garganta seca. Precisa de mais criativos
- **EXCECAO CRITICA:** acima de 2 MAS CPA bom -> NAO pausa. CPA e rei. Aproveita

| Frequencia do anuncio | Interpretacao |
|----------------------|---------------|
| 1,0 a 1,5 | Perfeito |
| 1,5 a 2,0 | Normal, ficar de olho |
| Acima de 2,0 | Algoritmo implorando por mais criativos |

#### Frequencia da CAMPANHA (pode ser alta — e BOM)

- **O que mede:** quantas vezes anuncios DIFERENTES seus aparecem pra mesma pessoa
- **Cenario perfeito:** frequencia campanha subindo + frequencia anuncios estabilizada em 1-2. IA intercalando C1, C2, C3 automaticamente
- **"Tiro de metralhadora":** nos Stories, Meta mostra 4 anuncios em sequencia quando comportamento e receptivo. Precisa de muitos criativos — municao

**Exemplo real:** Campanha freq 2,85 com anuncios A(1,0) B(1,75) C(1,3) D(1,0) = pessoa viu quase 3 anuncios DIFERENTES, nenhum repetido. EXCELENTE. [Fonte: VOL-06 Sec 3.7]

**Resumo:**
- Frequencia anuncio alta + CPA subindo = **FADIGA** -> trocar criativos
- Frequencia anuncio alta + CPA estavel = **CONSOLIDACAO** -> NAO MEXER (CR-02)
- Frequencia campanha alta = **BOM** -> remarketing natural

### 9. Pesquisa na Pagina de Obrigado (Bonus)

Formulario de pesquisa na pagina de obrigado, ANTES de direcionar pro WhatsApp/grupo.

- **Ferramenta:** Respondi (BR, custo-beneficio) ou Typeform. Widget na pagina de obrigado
- **Resultados reais:** 50-80% dos leads preenchem. Queda de 5-10% na entrada do WhatsApp (vale pela qualificacao)
- **Eventos de pixel:** Pagina pesquisa = "Lead", Pagina conclusao = "Enviou Pesquisa"
- **REGRA DE OURO:** se colocou pesquisa e CPA disparou, tira fora. CPA nao pode cagar

**Pesquisa pode REVERTER decisao de pausar:**

| Cenario | Lead barato, pouca pesquisa | Lead caro, muita pesquisa |
|---------|---------------------------|--------------------------|
| CPA | R$ 4,00 | R$ 6,00 |
| Pesquisa | 50% | 77% |
| Decisao normal | Manter (CPA bom) | Pausar (CPA caro) |
| Decisao com pesquisa | Investigar qualidade | Manter — lead mais qualificado |

---

## Arvore de Diagnostico — Quando CPA Piora

```
CPA piorou
    |
    +-- CPM subiu junto?
    |       |
    |       SIM --> Mercado caro. Nao e sua culpa
    |       |       --> Reduzir orcamento ou esperar
    |       |
    |       NAO --> Problema e seu. Continua investigando:
    |               |
    |               +-- CTR baixo?
    |               |       |
    |               |       SIM --> Anuncio xoxo. Trocar criativos
    |               |       |
    |               |       NAO --> Anuncio esta bom. Problema e depois do clique:
    |               |               |
    |               |               +-- Connect Rate baixo (< 70%)?
    |               |               |       |
    |               |               |       SIM --> Site nao carrega. Corrigir tecnico
    |               |               |       |
    |               |               |       NAO --> Site carrega. Problema e na pagina:
    |               |               |               |
    |               |               |               +-- Conversao pagina caiu?
    |               |               |                       |
    |               |               |                       SIM --> Comeu mosca (publico errado,
    |               |               |                       |       orcamento errado, criativo errado)
    |               |               |                       |
    |               |               |                       NAO --> Problema pode ser volume/pacing.
    |               |               |                               Verificar investimento vs meta
```

---

## Diagnostico Crosscheck — Tabela de Cruzamento

| CPA | CTR | CPM | Causa Provavel | Acao |
|-----|-----|-----|----------------|------|
| Alto | Baixo | Normal | Criativo fraco | Pedir C1 novos |
| Alto | Bom | Alto | Competicao/sazonalidade | Esperar ou ajustar |
| Alto | Bom | Normal | Pagina nao converte | Problema externo |
| Alto | -- | Normal | Conversao pagina caiu | Comeu mosca — escalou errado, nao pausou, errou zero |
| Alto | -- | Normal | Connect rate baixo | Problema tecnico no site |
| Alto | -- | Normal | Frequencia anuncio alta | Garganta seca — precisa criativos |
| Bom | Baixo | Normal | Funcionando mas otimizavel | Testar criativos |
| Bom | Bom | Normal | Tudo ok | NAO MEXER (CR-02) |
| Bom | Bom | Baixo | Publico frio convertendo | Escalar! |

---

## Discrepancia — Causas e Diagnostico

**Formula:** (Leads no CRM - Leads no gerenciador) / Leads no gerenciador x 100

| Discrepancia | Status | Acao |
|-------------|--------|------|
| Ate 15% | Normal | Nenhuma |
| 15-30% | Alerta | Verificar pixel e API |
| Acima de 30% | Problema serio | Investigar: pixel mal instalado, API mal configurada, evento duplicado, ou evento nao disparando |

[Fonte: VOL-06 Sec 3.8]

---

## 7 Causas de Campanha que Nao Gasta

| # | Causa | Solucao |
|---|-------|---------|
| 1 | Conta nova com trava de seguranca (~70%) | Abrir suporte Meta, pedir liberacao |
| 2 | Pixel instalado errado | Teste: campanha interacao R$10-20. Se gastou = pixel |
| 3 | Pagina Instagram/Facebook bloqueada | Verificar restricoes |
| 4 | Campanha nao publicada de verdade | Checar se TODOS os niveis estao ativos |
| 5 | Lance muito baixo | Aumentar orcamento |
| 6 | Publico muito pequeno | Ampliar targeting |
| 7 | Sobreposicao de publico entre conjuntos | Consolidar |

---

## Motor de Arranque

Calculo de sustentabilidade ANTES de ligar a campanha.

**Formula:**
```
Orcamento / CPA estimado = conversoes esperadas
Conversoes / dias = conversoes/dia
Conversoes * taxa de fechamento = vendas
```

**Exemplo:** R$5.000/mes, 31 dias = R$161/dia. CPA R$5 = 32 leads/dia = 1.000/mes. CPA R$3,50 = 46/dia = 1.428/mes.

**Pergunta critica:** X leads e suficiente pra bater a meta? Se taxa de conversao lead->venda e 5% e quer 50 vendas, precisa de 1.000 leads.

| Resultado | Leitura | Acao |
|-----------|---------|------|
| Positivo | Retorno crescente | Escalar |
| Negativo | Problema estrutural | NAO e trafego — rever oferta, pagina, posicionamento |
| Negativo 10+ dias | Alerta grave | Parar e reavaliar negocio |

---

## Planilha de Analise Diaria

Gerenciador = dados da campanha. Planilha = pra onde seu DINHEIRO esta indo. Responde: pacing certo? perto da meta? problema meu ou do mercado?

### Colunas (1 linha por dia)

| Coluna | O que Mostra | Por que Importa |
|--------|-------------|-----------------|
| Investimento do dia | Quanto gastou | Controlar pacing |
| Qtd leads/vendas | Volume de conversoes | Velocidade da meta |
| CPA | Metrica mais importante | Eficiencia do dinheiro |
| Pacing | Deveria ter gasto vs gastou | Vermelho = atrasado |
| Conversao da pagina | % quem chegou e converteu | Saude da pagina |
| CPM | Leitura de mercado | Diagnostico externo |
| Leads no CRM | Leads reais no Active/RD | Validacao cruzada |
| Discrepancia | Leads gerenciador vs CRM | Saude do rastreamento |

### 3 Graficos de Diagnostico Visual

#### Grafico 1: CPA vs CPM (Anti-Panico)

| Padrao visual | Leitura | Decisao |
|--------------|---------|---------|
| CPA e CPM sobem juntos | Mercado caro — NAO e culpa sua | Nao mexer |
| CPA sobe, CPM estavel | Problema no seu anuncio/pagina | Investigar criativos e pagina |
| CPM explode, CPA estavel | Criativos segurando bem | Manter |
| CPM E CPA estouraram | Mercado prejudicando | Reduzir orcamento ao minimo |

[Fonte: VOL-06 Sec 7.2]

#### Grafico 2: CPA vs Conversao da Pagina (Comeu Mosca?)

| Padrao visual | Leitura | Decisao |
|--------------|---------|---------|
| Pagina estavel (30-40%), CPA estavel | Tudo normal | Nao mexer |
| Pagina caiu (30% -> 15%), CPA disparou | Trafego desqualificado | Escalou errado, nao pausou, errou zero |
| Pagina oscila, CPA sem impacto | Variacao normal | Monitorar |

[Fonte: VOL-06 Sec 7.3]

#### Grafico 3: CPA vs Investimento (Comportamento da Escala)

| Padrao visual | Leitura | Decisao |
|--------------|---------|---------|
| Investimento sobe, CPA da "galo" temporario | Normal e ESPERADO | Seguir escalando |
| CPA explodiu e nao volta | Escala agressiva demais | Reduzir, estabilizar |

[Fonte: VOL-06 Sec 7.4]

### Automacao da Planilha

| Nivel | Pra Quem | Como |
|-------|----------|------|
| Manual | Comecando, 2-4 clientes | Preenche todo dia (5-10 min). Mais pedagogico |
| N8N | 5+ clientes | N8N puxa dados do Facebook -> joga numa aba base -> formulas puxam pro resumo |
| Freelancer | Quem nao sabe N8N | "E coisa de um dia de trabalho" — contratar pontualmente |
| Reportei | Muitos clientes | Plataforma de relatorios. Funciona no mundo inteiro, melhor custo-beneficio |

[Fonte: VOL-06 Sec 7.7]

---

## Campanhas Internacionais (LATAM/Espanha)

### Metricas LATAM

| Metrica | Brasil | Hispanico/LATAM | Nota |
|---------|--------|----------------|------|
| CTR | 2-3% | 4%+ | Menos competicao = mais cliques |
| CPM | Referencia local | Variavel por pais | Espanha MUITO mais caro |
| Plataforma checkout | Hotmart/Kiwify | **Hotmart only** | Unica que funciona internacional |

[Fonte: VOL-06 Sec 9]

### Estrutura 5 Conjuntos para Mercado Hispanico

| Conjunto | Publico | Motivo |
|----------|--------|--------|
| 1 | Mundo inteiro, idioma espanhol | Captura geral |
| 2 | Apenas Estados Unidos, idioma espanhol | Potencia de mercado hispanico |
| 3 | Apenas Espanha | Custo muito caro — isolar |
| 4 | America Latina inteira | Cobertura ampla |
| 5 | Mexico, Colombia, Argentina, Peru | Melhores paises (poder aquisitivo + volume) |

**Espanha separada:** custo significativamente mais alto que LATAM. Misturar distorce metricas e orcamento.

**Evolucao:** quando um pais se destaca no conjunto geral, criar conjunto separado so pra ele. Considerar conversao de cambio (Google Finance no Sheets). [Fonte: VOL-06 Sec 9]

---

## 4 Perfis de Gerente

| Perfil | Comportamento | Resultado | Antidoto |
|--------|---------------|-----------|----------|
| Medroso | Nao investe, nao testa, medo de escalar | Morre lentamente | Pacing + meta +20%/6 meses |
| Imprudente | Gasta sem medir, escala no impulso | Explode | Planilha diaria + limites CPA |
| Negligente | Bota pra rodar e esquece | Estagna | Rotina 6x/dia na planilha |
| **Racional** | **Dados + paciencia + acao** | **Crescimento** | **Padrao do squad** |

O squad opera como gerente RACIONAL: analisa dados, tem paciencia com aprendizado, age com decisao.

---

## Cola Rapida — Todas as Metricas

| # | Metrica | Referencia | API Field | Quando Olhar |
|---|---------|------------|-----------|--------------|
| 1 | CPA | Depende do negocio (Estrela Guia) | `cost_per_action_type` | SEMPRE |
| 2 | Estrela Guia | Diagnostico de ONDE esta o problema | personalizada | Quando CPA piora |
| 3 | CTR | Acima de 2% (4%+ hispanico) | `ctr` | Quando CPA piora e CPM normal |
| 4 | CPC | Quanto menor, melhor | `cpc` | Mesmo diagnostico do CTR |
| 5 | CPM | Jan=barato, Nov=caro | `cpm` | Primeiro check quando CPA piora |
| 6 | Connect Rate | 70-80% | personalizada | Quando CTR bom mas conversao ruim |
| 7 | Conv. pagina | 30% (lead), 2-3% (venda), 1% (e-commerce) | -- | Quando connect ok mas CPA ruim |
| 8 | Frequencia | Anuncio max 2, campanha quanto mais melhor | `frequency` | Quando CPA piora gradual |
| B | Pesquisa obrigado | 60-80% preenchem | personalizada | Quando quer qualificar melhor |
