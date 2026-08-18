# SOP — Subir e Ajustar Campanha Meta Ads (UI Humana)

**Versão:** 1.0.0
**Fonte:** Método Andromeda
**Data extração:** 2026-05-05
**Escopo:** procedimento minucioso de subida e ajuste de campanha pelo Gerenciador de Anúncios da Meta, fiel ao que o método ensina.

---

## Avisos de uso

1. **Fidelidade > completude.** Toda decisão aqui carrega citação literal do método + volume de origem. O que o método não cobre está marcado como `[NÃO COBERTO PELO MÉTODO]`.
2. **Conta Escala vs Conta Teste:** procedimento de subida é o mesmo na maioria dos passos. Onde diverge, está marcado `[ESCALA]` ou `[TESTE]`.
3. **UI da Meta muda.** Os nomes dos botões podem mudar; a regra estratégica não.
4. **Não substitui** o método Andromeda original. É o SOP operacional destilado dele, criado pra ser referência única do squad.

---

## Pré-requisitos (antes de criar campanha)

| Item | Status esperado | Citação / fonte |
|------|-----------------|-----------------|
| Conta Escala criada | OK | Aula 04: *"esse é o único motivo pelo qual a gente está separando as contas de anúncio... a partir de agora eu estou muito preocupada com isso aqui, com essa pontuação de relevância"* |
| Conta Teste criada (separada) | OK se investe >R$5k/mês. Opcional se <R$5k/mês | Q&A: *"Quem investe mais de 5 mil reais, você é obrigado a ter mais de duas contas... Agora, você que investe menos de 5 mil reais, você pode ter uma conta de anúncio só"* |
| Pixel instalado no site | OK e enviando eventos | Aula 03: *"o Pixel nada mais é do que um script para poder contar aqui para o meta o que é que está acontecendo no seu site"* |
| Página Facebook + perfil Instagram não bloqueados | OK | Q&A: *"você pode estar com a página do Instagram que você escolheu, ela está bloqueada, ou a página que você está usando do Facebook, ela está bloqueada"* |
| Públicos personalizados de audiência quente criados | OK (4 públicos) | Aula 03 (ver seção 2.8.6) |
| Públicos personalizados de exclusão criados | OK (compradores + leads) | Aula 05: *"é muito importante você ter arquitetado pronto os públicos que você não quer anunciar"* |

---

## NÍVEL 1 — CAMPANHA

### 1.1 Selecionar Objetivo da Campanha

Escolher pelo **destino do tráfego**, não pelo que você "quer vender":

| Destino do tráfego | Objetivo a marcar |
|--------------------|-------------------|
| Vender direto no site (tem checkout Hotmart, Asaas, Shopify, etc.) | **Vendas** |
| Captar e-mail/telefone no seu site | **Leads** |
| Levar pra WhatsApp (preferência) | **Leads** |
| Levar pra WhatsApp (alternativa testável) | **Engajamento / Interação** |
| Levar pra Direct do Instagram | **Engajamento / Interação** |
| Captar via formulário nativo do Meta (sem site) | **Leads** |
| Levar pra YouTube ou blog | **Tráfego** |
| Aumentar seguidores Instagram | **Promover → Visitas ao perfil + seguidores** |

**Citação literal (Q&A):**
> *"Não importa o que você está vendendo, não importa. Se você está começando. Não importa quanto dinheiro você tem... Só importa pra onde o seu tráfego vai. Você quer levar o cara para vender no site? É venda. Você quer captar o e-mail e o telefone dele no site? É lead."*

**Caso especial — Campanhas de WhatsApp.** Quatro objetivos aceitam WhatsApp. Ranking pelo método:

| Posição | Objetivo | Por quê |
|---------|----------|---------|
| 1º (melhor) | **Leads** | *"contato no WhatsApp é um lead. Ponto."* |
| 2º | **Interação** (antiga "Engajamento") | *"muitas vezes eu vou sentar pra fazer campanha de WhatsApp. E eu começo fazendo de interação para depois fazer o de lead"* |
| 3º | **Tráfego** | *"é elevar volume... ele tende a levar mais volume para o seu WhatsApp. Mesmo não se comprometendo com a qualidade"* |
| 4º (pior) | **Vendas** | *"para ele otimizar ao longo do tempo, ele precisa de um pixel... não tem como o algoritmo saber se aquele lead que ele está te levando de fato é um lead bom"* |

`[Fonte: 09-perguntas-respostas-estrutura.md]`

**Anti-pattern (Aula 04):** trocar Leads/Vendas por **Tráfego** é teste polêmico que ela cita. *"hoje, no presente... eu já vi muitas campanhas de vendas que deveriam performar melhor no objetivo de vendas, performando melhor no objetivo de tráfego"* — fazer só na Conta Teste.

---

### 1.2 Nomear a Campanha

Padrão do método: **`Campanha Escala`** ou **`Campanha Master`**.

O método orienta literalmente:
> *"eu vou chamar essa daqui de campanha master. Ou campanha escala, na verdade, campanha escala é a melhor."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

Não há nomenclatura mais detalhada definida nas 3 aulas principais. Para nomenclatura formal de campanhas/conjuntos/anúncios consultar `nomenclatura-protocol.md` do squad (não vem das aulas Andromeda).

---

### 1.3 Orçamento — ABO ou CBO

| Conceito | Definição |
|----------|-----------|
| **ABO** (Ad Set Budget Optimization) | Orçamento definido em cada **conjunto de anúncios** |
| **CBO** (Campaign Budget Optimization) | Orçamento definido na **campanha** inteira; algoritmo distribui livre entre conjuntos |

**Decisão Andromeda:**

| Conta | Recomendação | Citação |
|-------|--------------|---------|
| **[ESCALA]** | ☑ **ABO** | *"eu recomendo que você comece. Nas primeiras campanhas, utilizando o ABO, particularmente, e aqui é totalmente pessoal e totalmente os testes que a gente executa. Eu sempre uso ABO, tá? Dificilmente eu uso CBO"* |
| **[TESTE]** | Testar **ABO vs CBO** | *"você vai testar uma campanha. Só com a BO e você vai testar uma campanha só com o CBO e vai ver a diferença desses resultados"* |

**Ressalva do método:** *"eu vejo muitas pessoas usando CBO e funcionando também"*. CBO é considerada como o "futuro" (combinada com outros recursos), mas hoje a recomendação para começar é ABO.

`[Fontes: 03-arquitetura-campanhas-escala.md, 04-arquitetura-campanhas-teste.md]`

**Inserir orçamento:**
- ABO: definir o mesmo orçamento em **cada conjunto** (ver seção 2.7).
- CBO: definir orçamento total da campanha. Sem regra de valor mínimo no método. *"a verba mínima é um dólar... estrategicamente você deve concentrar"*.

---

### 1.4 Partilha de Orçamento (até 20%)

**Onde:** opção dentro da configuração de orçamento da campanha (quando aparecer — não aparece em todas as contas).

**Decisão:**

| Cenário | Marcar? |
|---------|---------|
| **[ESCALA]** opção aparece | ☑ **ATIVAR** |
| **[ESCALA]** opção não aparece | OK, ignora |
| **[TESTE]** | Testa com vs sem |

**Citação literal:**
> *"se essa opção aparecer para você, eu recomendo que você deixe ela ativa, tá bom?... eu dou para ele uma margem de 20%, porque se ele vê que um conjunto está melhor que o outro, ele mesmo modula esse investimento."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Pegadinha crítica:** Partilha ATIVADA pode **bloquear** o campo de CPA Máximo e ROAS Mínimo no conjunto de anúncios. Se quiser usar CPA Máximo (Conta Teste), DESATIVAR a partilha primeiro:
> *"se eu tirar a opção da partilha, desativar a partilha, tá? Desativei a opção da partilha. Agora eu vou entrar de volta lá no conjunto de anúncios. Ele vai me deixar definir aqui o meu custo de lead."* `[Fonte: 04-arquitetura-campanhas-teste.md]`

---

### 1.5 O que NÃO mexer no Nível 1

| Configuração | Decisão | Por quê |
|--------------|---------|---------|
| Categoria especial (crédito, emprego, habitação, política) | ☐ Não marcar (a menos que seu produto se enquadre) | `[NÃO COBERTO PELO MÉTODO]` — exigência legal Meta |
| Teste A/B no nível campanha | ☐ Não usar pra subir campanha do zero | O método só recomenda Teste A/B no nível anúncio (ver 5.8) |

---

## NÍVEL 2 — CONJUNTO DE ANÚNCIOS

### 2.1 Destino / Conversão

A primeira escolha dentro do conjunto. Em campanha de Leads aparecem opções tipo "Site", "Site e Formulários", "Site e Chamada", "Mensagens", "Aplicativo", "Ligações".

| Conta | Decisão | Citação |
|-------|---------|---------|
| **[ESCALA]** | ☑ **Site** (apenas) | *"nessa nossa continha de escala, nós vamos continuar usando o site"* |
| **[TESTE]** | Testar **Site vs Site+Formulários** | *"lá nas nossas campanhas de teste, eu vou falar o inverso"* |

**Exceção:** se o site é ruim ou inexistente, usar **Formulário** desde já.

> *"Tô partindo do pressuposto que seu site é bom, obviamente. Se você não tem um site. Ou o seu site está ruim, você vai utilizar o formulário."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Aviso UI:** Site+Formulários soma +22 pontos na "pontuação de relevância" da campanha vs Site só. O método orienta **ignorar essa pontuação na fase de subida da escala**:
> *"isso não é 100% certo ainda... no ponto de partida aqui, nós vamos em site, mas saiba. Saiba que uma hora nós vamos chegar nisso aqui [site+formulário]"*

**Tendência futura (declarada):** Site+Formulário vira padrão. *"a tendência, o rumo é que isso aqui vai ser o padrão com o tempo"* `[Fonte: 04-arquitetura-campanhas-teste.md]`

---

### 2.2 Pixel + Evento de Conversão

| Campo | Valor |
|-------|-------|
| **Conjunto de dados** | Pixel da conta |
| **Evento de conversão (Campanha de Lead)** | `Lead` |
| **Evento de conversão (Campanha de Venda)** | `Compra` |

**Citação:**
> *"se fosse uma campanha de vendas, o evento de conversão aqui seria compra. Como é uma campanha de lead, o evento de conversão é lead."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

`[NÃO COBERTO PELO MÉTODO NESTAS AULAS]`: configuração da CAPI (Conversions API), eventos personalizados, deduplicação. Consultar `setup-avancado-meta-ads-kb.md` no squad ou aulas do módulo 07 do Andromeda.

---

### 2.3 Otimização (Maximizar Nº de Conversões vs Maximizar Valor)

Aparece como "Objetivo de desempenho".

| Conta | Decisão padrão |
|-------|----------------|
| **[ESCALA]** | ☑ **Maximizar o número de conversões** (default) |
| **[ESCALA]** se CPA está caro | Trocar pra Maximizar valor da conversão + ROAS (estratégia de otimização — ver 5.x) |
| **[TESTE]** | Testar Maximizar nº de conversões **vs** Maximizar valor da conversão |

**Citação:**
> *"via de regra, vamos seguir, como eu disse, a rodovia principal. A rodovia principal. A gente vai trabalhar com maximizar o número de conversões. Então, essas primeiras campanhas, a gente está trabalhando na via principal."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Maximizar valor da conversão:**
- Define um ROAS mínimo (ex: produto a R$100, paga até R$20 por venda)
- Útil se está com problema de CPA caro
- Pode requerer **partilha de orçamento DESATIVADA** pra liberar o campo de ROAS
> *"sempre que essa opção estiver limitada, você volta lá na campanha. E muitas vezes é por causa da partilha"* `[Fonte: 04-arquitetura-campanhas-teste.md]`

---

### 2.4 CPA Máximo / ROAS Mínimo (Objetivo de custo de resultado)

| Conta | Decisão padrão |
|-------|----------------|
| **[ESCALA]** | ☐ **NÃO PREENCHER** (deixar em branco) |
| **[ESCALA]** se CPA cresceu e troca de criativo não resolveu | Definir CPA Máximo (próximo passo do troubleshoot — ver 5.5) |
| **[TESTE]** | Testar **com vs sem** CPA Máximo |

**Citação:**
> *"a gente não vai colocar CPA máximo aqui, ou seja, o custo de aquisição máximo que a gente quer pagar. A gente vai deixar sem nada. Deixar o algoritmo trazer ali o custo do lead"* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Como funciona o CPA Máximo:**
- É **direção, não regra**. Algoritmo tenta respeitar mas não garante.
- Se algoritmo não acha leads no preço, **desacelera o gasto** (limita escala).
- Se acha, gasta normal.

> *"o CPA máximo, ele sim ajuda a controlar o seu custo, tanto de lead quanto de vendas. Porém, ele limita a escala."* `[Fonte: 04-arquitetura-campanhas-teste.md]`

**Pegadinha:** Pra liberar o campo, pode precisar desativar Partilha de Orçamento (ver 1.4).

---

### 2.5 Regras de Valor

| Conta | Decisão |
|-------|---------|
| **[ESCALA]** | ☐ **NÃO USAR** |
| **[TESTE]** | Pode testar |

**Citação:**
> *"aqui em regras de valor, na via principal, que é onde a gente está aqui na campanha de escala, nós não vamos mexer com isso daqui... guarda essa informação para você usar lá na campanha na conta de anúncios de teste."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**O que são:** permitem aumentar/reduzir lance (licitação) baseado em idade, gênero, localização. Ex: "para 45-54 anos, aumente lance em 50%".

---

### 2.6 Modelo de Atribuição + Janela de Atribuição

| Campo | Valor Andromeda |
|-------|-----------------|
| **Modelo de atribuição** | ☑ **Padrão** |
| **Modelo Incremental** | ☐ NÃO USAR |
| **Janela de atribuição** | ☑ **Padrão** (não mexer) |

**Citação:**
> *"Modelo de atribuição, mesma coisa, é um modelo de padrão mesmo... o incremental é um outro tipo de modelo de atribuição que a gente não vai focar nele aqui agora. Então nós vamos deixar aí no padrão... Janela de atribuição. Nós não vamos mexer com nada, cara. Nós vamos usar o piloto automático."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

`[NÃO COBERTO PELO MÉTODO NESTAS AULAS]`: valores específicos da janela (1d-click, 7d-click, etc.).

---

### 2.7 Orçamento do Conjunto (se ABO)

**Regra:** todos os conjuntos começam com o **mesmo orçamento**.

> *"eu recomendo que você inicie todos os conjuntos com o mesmo orçamento."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Não há valor mínimo definido pelo método.** *"a verba mínima é um dólar"*. Definição fica a critério da estratégia (ver 1.3 sobre concentração de baixa verba).

**Exemplo prático do método (Q&A):** aluna subiu Conta Escala com **R$150/dia em ABO** distribuído em 6 conjuntos = R$25/dia por conjunto. *"Eu criei uma nova conta para ser a conta de escala e subi também. Nela, uma campanha de ABO com 150 reais por dia e nove anúncios, massa."*

---

### 2.8 Públicos — Estrutura dos 6 Conjuntos

> *"você trabalhar com seis conjuntos de anúncios, mas se você precisar escalar muito, colocar 10, 12, não tem problema algum."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

#### 2.8.1 Estrutura geral

| # Conjunto | Tipo | Configuração principal |
|---|------|------------------------|
| 1 | **Advantage+ Puro** (grupo controle) | Sem nenhuma sugestão |
| 2 | Advantage+ com sugestão (cluster A) | 1 cluster de interesses |
| 3 | Advantage+ com sugestão (cluster B) | 1 cluster diferente |
| 4 | Advantage+ com sugestão (cluster C) | 1 cluster diferente |
| 5 | Advantage+ com sugestão (cluster D) | 1 cluster diferente |
| 6 | **Audiência Quente** | Públicos personalizados próprios |

#### 2.8.2 Conjunto 1 — Advantage+ Puro (grupo controle)

Configurações no Conjunto:

| Campo | Valor |
|-------|-------|
| Localização | ☑ Apenas país (ex: Brasil) |
| Cidade | ☐ Não preencher |
| Idade | ☐ Não preencher (deixa Advantage decidir) |
| Sexo | ☐ Não preencher |
| Idioma | ☐ Não preencher |
| Interesses | ☐ Não preencher |
| Exclusões | ☐ Não preencher |
| Advantage+ Audience | ☑ ATIVO (default) |

**Citação:**
> *"Eu não estou definindo localização, apenas o país, que é importante você colocar o país, mas eu não estou definindo a cidade, eu não estou definindo o sexo, eu não estou definindo idioma, exclusão, nada. E eu também não estou definindo nenhum tipo de interesse"* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Por quê:** *"é o nosso grupo controle... É o algoritmo indo atrás do melhor público para você"*.

#### 2.8.3 Conjuntos 2-5 — Advantage+ com Sugestões

Mesma base do Conjunto 1, mas com **sugestões de interesses** (1 cluster por conjunto).

**Regra de sugestões:**

| Item | Limite |
|------|--------|
| Sugestões por conjunto | ☑ Máx **3 a 4** |
| Misturar clusters | ☐ NÃO — 1 cluster por conjunto |

**Citação:**
> *"Colocar no máximo três sugestões de segmentação, não mais do que isso, em cada conjunto"* (depois ela ajusta para 4: *"acho que uma quantidade de 3, no máximo 4, está ok. Mais do que isso, isso poderia ser um outro conjunto de anúncios"*) `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Exemplo de clusters separados (referência do método):**
- Conjunto 2: Google AdWords + Google Analytics + Google Ads
- Conjunto 3: Marketing Digital + Marketing de Conteúdo
- Conjunto 4: Social Media Marketing + Social Media Manager
- Conjunto 5: Hotmart + Empreendedorismo

**O que mostra que ainda é Advantage+:** depois de adicionar sugestões, o card no UI continua mostrando "Advantage+ ativado". Sugestão NÃO desativa.

#### 2.8.4 NÃO usar "Limitar ainda mais o alcance" na Escala

Na UI: opção "Limitar... mudar a configuração" — pop-up alerta "você está saindo do Advantage Plus". Cai 59 pontos da pontuação de oportunidade.

| Conta | Decisão |
|-------|---------|
| **[ESCALA]** | ☐ NUNCA usar |
| **[TESTE]** | Pode testar (Advantage+ vs público segmentado tradicional) |

**Citação:**
> *"Eu não recomendo você fazer isso aqui [na escala]. lá nas nossas campanhas de teste. Lá na conta de texto a gente vai poder fazer isso, mas aqui a gente vai sempre trabalhar com o Advantage Plus."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

#### 2.8.5 Conjunto 6 — Audiência Quente

**Não é Advantage+ Puro.** É Advantage+ COM sugestões de públicos personalizados próprios. Pelo menos UM dos conjuntos deve conter a audiência quente.

> *"Pelo menos em um dos conjuntos, reúna toda a sua audiência quente. Então, se você tem seguidores, lista de e-mail, pelo menos um desses advantages..."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Composição padrão (4 públicos personalizados juntos):**

| Público | Critério |
|---------|----------|
| Engajamento Instagram | Interagiu nos últimos **365 dias** |
| Visualizadores de vídeo | Assistiu **≥ 50%** do vídeo |
| Visitantes do site | Acessou em qualquer momento (page view) |
| Lista de e-mail | Lista própria |

**Citação:**
> *"Ele deve ter ali pessoas que engajaram com seu Instagram nos últimos 365 dias. Ele precisa ter um público de quem assistiu seus vídeos. E eu recomendo que seja ali quem assistiu pelo menos 50% do seu vídeo... Pessoas que acessaram o seu site em algum momento ali na vida delas... e alguma lista de e-mails que você tenha."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Quando separar em múltiplos conjuntos quentes:**
- Mais de 1M de seguidores no Instagram, ou
- Lista de e-mail >100k, ou
- Volume de produção orgânica intenso (1-2 conteúdos/dia)

Nesses casos: 1 conjunto por tipo (engajamento, vídeo, site, e-mail). Caso contrário: tudo num conjunto único.

#### 2.8.6 Como criar os Públicos Personalizados (caminho UI)

```
Gerenciador → Públicos → Criar público → Público personalizado
```

Tipos relevantes:

| Origem | Para quê |
|--------|----------|
| **Site** (precisa pixel) | Visitantes, compradores, abandono carrinho |
| **Lista de clientes** | Lista de e-mail / telefone |
| **Página Facebook** | Engajamento na página |
| **Instagram** | Engajamento (seguidor, like, comentário, salvar) |
| **Vídeo** | % assistido |

**Para EXCLUSÕES (Aula 05):**
- Compradores do produto X → exclui em campanha pra produto X
- Leads do produto X → exclui em campanha de captação de lead

> *"é muito importante você ter arquitetado pronto os públicos que você não quer anunciar... Se você está fazendo uma campanha de leads, você quer excluir quem já virou leads, certo? Você não quer ficar reimpactando a mesma pessoa."* `[Fonte: 05-arquitetura-dos-publicos.md]`

#### 2.8.7 Hipersegmentação (estratégia opcional de escala)

**Quando:** quando o cluster principal está saturado e você identificou um sub-cluster com forte sinal de compra (dado histórico ou intuição validada).

**Como:**
1. Criar conjunto de anúncios separado com público hipersegmentado (ex: profissionais da saúde)
2. Continua sendo Advantage+ COM sugestão (do interesse do sub-cluster)
3. Criativos exclusivos pra esse sub-cluster (anúncio começa com "Você que é X...")
4. Idealmente: página de destino com headline que casa (parametrizada via URL)

**Verba:** 5-10% da verba total.

**Citação:**
> *"profissional da saúde, eu já tenho convicção de que ele é um ponto. Ele é um outlier ali, ele é um ponto fora do meu limite... priorize também, em paralelo. Um pedacinho da sua verba, pode ser 5%, 10% dela, em fazer testes de campanhas hipersegmentadas."* `[Fonte: 05-arquitetura-dos-publicos.md]`

#### 2.8.8 Lookalike (LAL)

| Status | Recomendação |
|--------|--------------|
| Pode usar | ☑ Sim, ainda funciona |
| Tendência | Caminhando pra ser aposentado (Advantage+ é mais certeiro) |

> *"Tamo caminhando pra matar o Look-alike. Já morreu no Google... Mas até que ele morra. Pode usar, tá? Mas estamos caminhando, porque o Advantage Plus é bom demais."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

#### 2.8.9 Remarketing tradicional

**Aposentado pelo Andromeda.** A audiência quente foi absorvida pelo Conjunto 6 (Advantage+ com sugestão de públicos personalizados).

> *"o Andrômeda aparentemente aposentou as campanhas de remarketing, fato."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

### 2.9 Posicionamentos

| Conta | Decisão |
|-------|---------|
| **[ESCALA]** | ☑ **Advantage+ Placements (automáticos)** |
| **[TESTE]** | Pode testar manuais |

**Citação:**
> *"Posicionamentos também sempre advantage de plus, ou seja, sempre automáticos. Nós não vamos falar que para você não anunciar nos stories ou não anunciar no Facebook. Não, a gente vai deixar tudo automático."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

---

### 2.10 Quantidade de Conjuntos

| Cenário | Quantidade |
|---------|------------|
| Padrão | **6 conjuntos** (1 puro + 4 sugestões + 1 quente) |
| Escalando muito | Até 10-12 conjuntos sem problema |
| Poucas opções de público | OK ter só 3 conjuntos |

> *"você trabalhar com seis conjuntos de anúncios, mas se você precisar escalar muito, colocar 10, 12, não tem problema algum."* `[Fonte: 03-arquitetura-campanhas-escala.md]`

> *"Se você só tem 3, você pode fazer só 3 conjuntos de anúncios."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

## NÍVEL 3 — ANÚNCIO

### 3.1 Quantidade — A "Víscera" do Andromeda

| Item | Valor | Observação |
|------|-------|------------|
| Anúncios por conjunto | **9** | Imutável: *"Nove criativos. Isso aqui é imutável"* |
| Distribuição | 3 × C1 + 3 × C2 + 3 × C3 | Por nível de consciência |

| Nível de Consciência | Quem | Tipos de anúncio |
|----------------------|------|------------------|
| **C1** (baixa) | Não está procurando o produto | Conteúdo de valor, quebra de padrão, dores |
| **C2** (média) | Pesquisando o assunto | (detalhes nas aulas 06/07/08) |
| **C3** (alta) | Em momento de compra | (detalhes nas aulas 06/07/08) |

**Citação:**
> *"a víscera do Andrômeda. É a gente ter nove criativos. Falando para C1, C2 e C3. Isso aqui é imutável, beleza? Nove criativos."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

**Os mesmos 9 anúncios podem repetir entre os conjuntos** (não precisa criar 9 anúncios distintos por conjunto).
> *"podem ser os mesmos nove anúncios"* `[Fonte: 03-arquitetura-campanhas-escala.md]`

**Exceção (poucas verbas / poucos criativos):** se você só tem 3-5 criativos, sobe esses mesmos. Não há mínimo de 9 obrigatório pra subir a campanha.
> *"Se você tem pouco criativo, já vai direto para a campanha de escala, porque se tem pouco. Você tem pouco criativo, não tem o que testar."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

`[Fora do escopo deste SOP]` Anatomia interna de cada anúncio C1/C2/C3 — ver aulas 06/07/08 do módulo 03.

---

### 3.2 Identidade do Anúncio

| Campo | Valor |
|-------|-------|
| Página Facebook | A da marca |
| Conta Instagram | A da marca |

`[NÃO COBERTO COM DETALHE NESTAS AULAS]`: Identidades existentes, multiconta, etc.

---

### 3.3 Mídia

**Mix recomendado (Q&A — exemplo de aluna validado):**
- Vídeos
- Imagens estáticas
- Carrossel

> *"Mezclei carrossel, vídeo, estático... perfeito"* `[Fonte: 09-perguntas-respostas-estrutura.md]`

**Diversidade > Quantidade:**
> *"a inteligência artificial é mais inteligente agora. Então ela vê que você mudou pouquíssimos elementos e ela considera todos eles um anúncio muito parecido. E o que ela está pedindo para a gente é diversidade."* `[Fonte: 04-arquitetura-campanhas-teste.md]`

---

### 3.4 Texto Principal — Recurso de 5 Variações Automáticas

UI permite até 5 textos. Meta gera variações automáticas a partir do texto principal.

| Decisão | Marcar |
|---------|--------|
| Recurso já vem habilitado por default | ☑ Deixar como está |
| Escrever 5 textos manualmente | ☐ Não precisa |

**Citação:**
> *"Esse recurso aqui você pode deixar ativado. Você não vai precisar escrever cinco textos diferentes, não. A IA é inteligente demais. Você só sobe o primeiro texto. E ele vai criar cinco variações."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

### 3.5 Recursos Automáticos (IA do Meta no nível Anúncio)

Aparecem ao subir mídia. Categorias na UI:

#### 3.5.1 Geração de imagens / conteúdos criativos (Advantage+)
- Cria variações automáticas da imagem subida
- ☑ Deixar habilitado se já vier ativo
- Pode aprovar/rejeitar variações geradas
- Botão "Gerar imagens novas" gera mais variações
> *"você acabou de fazer um criativo seu virar mais outros três, porque a própria IA dele fez isso"* `[Fonte: 09-perguntas-respostas-estrutura.md]`

#### 3.5.2 Animação 3D em imagem estática
- Pulsa/movimenta imagem estática
- ☐ Só ativar se quiser explicitamente
- *"Esse aqui não tá habilitado, deixa sem"*

#### 3.5.3 Sobreposição
- Mistura elementos visuais
- ☐ Não ativar (o método não recomenda explicitamente)
- *"Não sei o que é essa sobreposição... vai que faz merda"*

#### 3.5.4 Retoque visual (contraste, brilho)
- ☑ Deixar como vem (geralmente ativo padrão)

#### 3.5.5 Música de fundo
- Comportamento default da Meta
- ☑ Deixar como vem

#### 3.5.6 Melhoria de texto
- Ajusta texto para tamanho do posicionamento
- ☑ Deixar como vem

#### 3.5.7 Animação da imagem
- ☑ Deixar como vem

**Regra de ouro (Aula 09):**
> *"Meu conselho pra você é deixar padrão, cara. Isso aqui não tá habilitado, deixa sem, porque vai que faz merda. E deixa o que ele já está sugerindo. Então, o meu conselho é sim. Tudo que está aqui em melhoria, que ele já está ativo, deixa. E aqui nessa parte de geração, se você viu que tem algum interessante, você pode habilitar."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

### 3.6 Chamada de Ação (CTA)

**Regra inegociável:** 100% dos anúncios C1/C2/C3 devem ter CTA. Pode ser verbalizada no vídeo OU escrita na legenda.

| Tipo de campanha | CTA típica |
|------------------|------------|
| Lead | "se cadastre" / "garanta sua vaga" |
| Venda | "compre agora" / "garanta o seu" |
| Tráfego pra Instagram | "me siga" |
| Tráfego pra WhatsApp | "manda mensagem" |

**Citação:**
> *"todo anúncio, 100% do anúncio, independente de qual estrutura ele está, ele precisa ter chamada para ação... seja chamada para ação, se cadastre, compre, me siga, me envia uma mensagem no WhatsApp."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

**Botão de CTA na UI** (Saiba mais, Cadastre-se, Comprar, Enviar mensagem etc): `[NÃO COBERTO COM ESPECIFICIDADE NESTAS AULAS]` — escolher conforme campanha.

---

### 3.7 Link de Destino

URL com parâmetros UTM e parâmetros de hipersegmentação se aplicável.

`[NÃO COBERTO COM DETALHE NESTAS AULAS]`: padrões de UTM exatos. Para parâmetros de hipersegmentação ver Aula 05 (URL param que troca headline da página via script WordPress).

---

### 3.8 Formato do Anúncio

| Formato | Quando |
|---------|--------|
| Vídeo único | Default |
| Imagem única | Padrão |
| Carrossel | Quando faz sentido (aluna aprovou no exemplo) |
| Coleção | `[NÃO COBERTO]` |

---

## NÍVEL CONTA — Configurações Especiais

### 4.1 Limitação a Nível de Conta (Negócios Locais)

**Quando usar:**

| Tipo de negócio | Decisão |
|-----------------|---------|
| Pizzaria, clínica, loja física, advocacia local | ☑ Configurar |
| Infoproduto, e-commerce nacional, serviço digital | ☐ Não mexer |

**Caminho UI:**
```
Definições de publicidade → Controles da conta → 
Conjunto de controle de público → "Quer configurar um?" → Sim
```

**O que configurar:**

| Campo | Decisão |
|-------|---------|
| Localização (cidades / raio) | ☑ Configurar se local |
| Idade mínima | ☐ NÃO recomenda (mesmo pra negócios com público específico) |
| Lista de exclusão a nível conta | Pode usar se estratégia exigir |
| Anúncios a colaboradores | ☐ NÃO recomenda |

**Por que isso e não segmentação direta no conjunto?**
> *"você está dizendo pra ele assim: pode usar o Advantage Plus, mas desde que você respeite uma regra que eu coloquei lá no nível da conta. Que não pode mudar. Isso aqui é lei."* `[Fonte: 04-arquitetura-campanhas-teste.md]`

Vantagem: você mantém Advantage+ ATIVO no conjunto + pontuação de relevância alta + freio de mão geográfico imposto pela conta.

---

### 4.2 Lista de Exclusão a Nível Conta

Subir lista de pessoas que **nunca** devem ver anúncios da conta. Estratégico, não default.

> *"sei lá, por alguma razão, você está fazendo uma estratégia que você não quer de jeito nenhum que alguém veja um tipo de campanha. Você sobe aqui uma base de leads, de lista e tudo mais para ele poder fazer essa exclusão"* `[Fonte: 04-arquitetura-campanhas-teste.md]`

---

## AJUSTES PÓS-SUBIDA — OTIMIZAÇÃO

### 5.1 Quando aumentar orçamento

| Cadência | Limite |
|----------|--------|
| Diário | ☑ Pode ser todo dia |
| Aumento por dia | **20% a 50%** |

> *"Você pode aumentar todo dia entre 20% e 50%."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

**Anti-pattern:** "esperar 3 dias antes de aumentar" — o método nega explicitamente.

---

### 5.2 Quando reduzir orçamento

| Situação | Reduzir? |
|----------|----------|
| Campanha caiu / desempenho ruim | ☑ Sim, válido (passo 3 do troubleshoot — ver 5.5) |
| Natal / Réveillon (povo viajando) | ☐ NÃO reduzir (povo está comprando) |
| Sem equipe comercial pra atender em feriados | ☑ Reduzir |
| Vaca gorda (resultado bom) | ☐ NÃO mexer |

> *"Quando elas vão bem, você só segue o que está funcionando."* `[Fonte: 04-arquitetura-campanhas-teste.md]`

---

### 5.3 Quando subir anúncio novo

**3 formas técnicas de subir:**

| Método | Reseta aprendizado? | Quando usar |
|--------|---------------------|-------------|
| **Criar normal** dentro do conjunto | ☑ SIM reseta | Default |
| **Duplicar** anúncio existente + trocar mídia | ☑ SIM reseta | Conveniência |
| **Teste de Conteúdos de Criativos** (Teste A/B nativo) | ☐ NÃO reseta | Conjunto com BOM histórico que destrambelhou |

**Caminho UI Teste A/B:**
```
Conjunto → selecionar anúncio → Editar → 
seção "Teste de conteúdos de criativos" → Configurar teste
```
Define até 5 versões + quanto da verba do conjunto vai pros testes.

**Decisão de qual método usar:**

| Cenário | Método |
|---------|--------|
| Conjunto está performando bem | ☐ NÃO subir nada |
| Conjunto era ótimo, ficou ruim | Teste A/B (não reseta) |
| Conjunto novo / não tinha histórico | Subir normal |
| Tem muito criativo pronto e quer escalar | Cria nova campanha ou nova conta |

**Citação:**
> *"campanha está muito boa agora... Eu não subo fucking anúncio nenhum. Eu não vou subir anúncios em campanha, em conjunto de anúncios que estão bons. Porque eles estão bons, porque eu vou caçar confusão."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

> *"a inteligência está toda no conjunto"* — referência sempre o conjunto, não a campanha, ao tomar essa decisão.

---

### 5.4 Frequência de produção de criativos novos

| Verba mensal | Criativos novos / semana |
|--------------|--------------------------|
| < R$5k | 5 |
| Médio | 10 - 15 |
| > R$5k (escala forte) | 20 - 30 |

**Regra de exceção:** se campanha está boa, está LIBERADO de criar novos naquela semana.
> *"se a sua campanha está boa, né? você está liberado de fazer esses cinco novos criativos essa semana. Mas você sabe que semana que vem é outro jogo."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

### 5.5 Sequência de Troubleshoot — "Campanha era boa, ficou ruim"

**Sequência (ordem importa):**

```
Passo 1: Trocar criativos (subir novos)
  ↓ não resolveu (1 dia)
Passo 2: Definir CPA Máximo no conjunto
  ↓ não resolveu (1 dia)
Passo 3: Baixar orçamento ao chão
  ↓ não resolveu (1 dia)
Passo 4: Criar campanha NOVA
```

**Sem pressa:** 1 ação por dia (4-5 dias resolução).
**Com pressa:** todos os passos 1-3 no mesmo dia, passo 4 no dia seguinte.

> *"se você não tá com pressa de escalar, esse é o melhor caminho. Fazer devagar mesmo... Agora, se você está com pressa de escalar e você não tem quatro dias... você vai fazer tudo isso no mesmo dia."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

**Por que ordem importa:** *"toda vez que você faz uma mudança, ele tem que recalcular a rota. E aí, ele leva mais tempo. Então o algoritmo está caminhando para ser automático. Não fica mexendo demais."*

---

### 5.6 Diagnóstico — "Campanha gastou zero"

| Causa | Probabilidade | Como diagnosticar | Como resolver |
|-------|---------------|-------------------|---------------|
| Conta nova com trava de segurança Meta | ~70% | Conta criada recentemente | Abrir ticket no suporte Meta |
| Pixel mal instalado | Comum | Criar campanha de **Interação** (não usa pixel) com R$10-20. Se gastar = pixel é o problema | Reinstalar pixel |
| Página Instagram/Facebook bloqueada | Raro | Verificar status das páginas | Resolver bloqueio |
| Anúncios não publicados (algum sinal verde faltando) | Erro de iniciante | Voltar ao Gerenciador, "Revisar e publicar" | Publicar |
| Público pequeno demais | Possível | Tamanho estimado no conjunto | Ampliar |
| Conta com débito Meta | Possível | Verificar conta de cobrança | Acertar pagamento |

**Citação:**
> *"se gastou zero, é algum problema de configuração. Primeiro ponto pode ser. Essa conta é nova... 70% dos casos estão aí. Segundo motivo pelo qual isso pode estar acontecendo é o pixel instalado errado. Como que a gente tira a prova? Cria uma campanha que não dependa de pixel. Então, por exemplo, que uma campanha de interação"* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

### 5.7 Anúncio Ruim em Campanha Saudável

**Decisão:** PAUSAR o anúncio ruim. Manter os bons rodando.

| Reação | Decisão |
|--------|---------|
| Reaproveitar em outra campanha | ☐ NÃO |
| Pausar e esquecer | ☑ SIM |
| Subir criativos novos no lugar | ☑ SIM |

> *"se ele já foi ruim, esquece. O algoritmo já achou que ele é ruim. A IA já deu bomba nele."* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

### 5.8 Regras Automáticas

**Caminho UI:**
```
Campanha (ou Conjunto/Anúncio) → Regras → Criar nova regra
```

**Frequências disponíveis:** a cada 30min, a cada hora, diária.

**Exemplo de regra (Andromeda menciona):** "Se anúncio ultrapassar CPA de R$5 → desativar".

| Conta | Decisão |
|-------|---------|
| **[ESCALA]** | Pode usar com cuidado |
| **[TESTE]** | Pode testar com vs sem |

**Aviso:** algoritmo pausa cegamente, não diagnostica. Pode pausar campanha que tinha bug fácil de corrigir.

> *"muitas vezes, você vê que uma campanha não está dando resultado. Quando você entra lá pra pausar, na hora que você vai pausar, você fala assim: nossa, comi mosca, isso aqui não era pra anunciar pra essa audiência. Isso aqui não era pra fazer assim. Então, quando você põe as regras, o que acontece é que o algoritmo vai fazer automático pra você. E você não tem a capacidade de julgar se aquela regra realmente vale a pena ou não"* `[Fonte: 04-arquitetura-campanhas-teste.md]`

---

### 5.9 Cronograma Mensal — Verbas Pequenas (≤ R$1k/mês)

Padrão de concentração (anti-diluição):

| Semana | Atividade | Investimento |
|--------|-----------|--------------|
| Semana 1 | Gravar criativos + postar orgânico | R$0 em ads |
| Semana 2 | **Ativar campanhas** | ~R$66/dia (verba dividida em 2 semanas) |
| Semana 3 | Otimizar campanhas + processo comercial (cupons, vídeos no WhatsApp pra leads frios) | ~R$66/dia |
| Semana 4 | Tiro de misericórdia (oferta final pros leads do mês) | Resto |

**Anti-pattern:** dividir R$1k por 30 dias = R$33/dia.
> *"Acho colatado bem denso, ao invés de fazer algo diluído"* `[Fonte: 09-perguntas-respostas-estrutura.md]`

---

## DIVERGÊNCIAS [TESTE] vs [ESCALA] — Quadro Resumo

| Item | [ESCALA] | [TESTE] |
|------|----------|---------|
| Conta separada | Sim | Sim (preserva relevância da Escala) |
| Pontuação de relevância pode cair | NÃO | OK cair (até 30) |
| Destino conversão | Site só | Testa Site vs Site+Formulário |
| Otimização | Maximizar nº conversões | Testa Maximizar valor (ROAS) |
| CPA Máximo | Não preencher (default) | Testa com vs sem |
| Regras de valor | Não usar | Pode testar |
| Partilha de orçamento | Ativar | Testa ON vs OFF |
| Advantage+ Audience | Sempre ativo | Testa vs público segmentado tradicional |
| Posicionamentos | Advantage+ (auto) | Pode testar manuais |
| ABO vs CBO | ABO | Testa ambos |
| Objetivo "errado" | Lead/Venda fiel | Testa Tráfego pra Lead/Venda |
| Regras automáticas | Pode usar com cuidado | Testa com vs sem |
| Limite a nível de conta | Configurar se local | Testar configurações |

---

## ANTI-PATTERNS — O que NUNCA fazer

| Anti-pattern | Razão |
|--------------|-------|
| Diluir verba pequena em 30 dias | Concentrar é mais eficaz |
| Esperar 3 dias pra aumentar orçamento | Pode subir 20-50% por dia |
| Limitar duração da campanha (ex: "5 dias") | Campanha boa fica anos no ar |
| Subir anúncio novo em conjunto que está performando | Reseta aprendizado, "caça confusão" |
| Reaproveitar anúncio ruim em outra campanha | IA já julgou — esquece |
| Tirar Advantage+ Audience na Escala | Cai 59 pontos de relevância e contradiz método |
| Misturar mais de 1 cluster de interesse num conjunto | Cria conjuntos separados por cluster |
| Definir CPA Máximo logo no setup da Escala | Limita escala desnecessariamente |
| Usar todos os recursos automáticos (3D, sobreposição, etc.) | Só usar os que vêm ativos por padrão |
| Mexer em janela de atribuição / modelo incremental | Padrão é o caminho |
| Usar Look-alike em vez de Advantage+ na Escala | Advantage+ é mais certeiro |
| Usar objetivo "Vendas" em campanha de WhatsApp | Sem pixel não otimiza venda |
| Reduzir orçamento no Natal/Réveillon (sem motivo) | Povo está comprando |
| Combinar testes (testar 2-3 coisas ao mesmo tempo) | Confunde leitura de resultados |

---

## CHECKLIST FINAL DE SUBIDA — Conta Escala

Antes de publicar, conferir:

```
NÍVEL 1 — CAMPANHA
[ ] Objetivo correto pelo destino do tráfego
[ ] Nome da campanha definido
[ ] ABO ativado
[ ] Partilha de orçamento ATIVA (se opção apareceu)
[ ] Categoria especial NÃO marcada (se não aplicar)

NÍVEL 2 — CONJUNTO (replicar p/ cada um dos 6+)
[ ] Destino: Site (Escala)
[ ] Pixel selecionado + evento correto (Lead ou Compra)
[ ] Otimização: Maximizar nº de conversões
[ ] CPA Máximo: VAZIO
[ ] Regras de valor: NÃO mexido
[ ] Modelo de atribuição: Padrão (não Incremental)
[ ] Janela de atribuição: Padrão
[ ] Orçamento do conjunto: igual entre os 6 conjuntos
[ ] Advantage+ Audience: ATIVO
[ ] Localização: SÓ país (no Conjunto 1 — puro)
[ ] Sugestões: máx 3-4 por conjunto, 1 cluster cada (Conjuntos 2-5)
[ ] Audiência quente: 4 públicos personalizados (Conjunto 6)
[ ] Posicionamentos: Advantage+ (automáticos)

NÍVEL 3 — ANÚNCIOS (9 por conjunto)
[ ] 3 × C1 (baixa consciência)
[ ] 3 × C2 (média)
[ ] 3 × C3 (alta)
[ ] Cada anúncio com CTA (verbal OU na legenda)
[ ] Mix de formatos (vídeo + imagem + carrossel)
[ ] Texto principal subido (5 variações IA por default — não mexer)
[ ] Recursos automáticos: deixar como vem (não ativar 3D, sobreposição manualmente)
[ ] Link de destino com UTMs

CONTA
[ ] Limitação nível conta SE negócio local (apenas localização)
[ ] Públicos de exclusão criados (compradores + leads)
```

---

## REFERÊNCIAS

### Citações neste documento

Todas as citações literais marcadas com `[Fonte: NN-...]` correspondem a **volumes do Módulo "Estrutura para Andromeda"** do Método Andromeda:

| Tag | Aula |
|-----|------|
| `[Fonte: 03]` | Aula 03 — Arquitetura de Campanhas (Escala) |
| `[Fonte: 04]` | Aula 04 — Arquitetura de Campanhas (Teste) |
| `[Fonte: 05]` | Aula 05 — Arquitetura dos Públicos |
| `[Fonte: 09-Q&A]` | Aula 09 — Perguntas e Respostas (Estrutura) |

Para aprofundamento da **anatomia interna dos anúncios C1/C2/C3** (fora do escopo deste SOP), consulte as aulas 06/07/08 do mesmo módulo.

### Companion docs deste squad

- `knowledge/sop-campanha-api.md` — mesmo procedimento via Graph Marketing API (REST)
- `knowledge/sop-campanha-mapping.md` — tabela cruzada UI ↔ API
- `data/meta-api-credentials.md` — como configurar credenciais Meta API

---

*Documento operacional do squad de tráfego — fidelidade verificada contra fontes originais do método.*
