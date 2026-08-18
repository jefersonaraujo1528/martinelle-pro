# Regras Cardinais — Metodo Andromeda

> 38 regras inegociaveis do metodo Andromeda.
> Organizadas por dominio, com proveniencia rastreavel ao ETL KB.

---

## Estrategia (RC-01 a RC-11)

### RC-01. Duas contas separadas — Teste e Escala

Sempre operar com duas contas de anuncio: uma de escala (segue as regras do Andromeda) e uma de teste (faz o que quiser). Cada uma tem mentalidade propria.

**Regra: NUNCA misturar teste e escala na mesma conta.**

Analogia (Lab vs Fabrica): Teste = laboratorio onde experimenta. Escala = fabrica onde replica o que funciona.

[Fonte: VOL-01, VOL-03]

#### Estrategia 2 Contas — Detalhamento

| Conta | Funcao | Mentalidade | Regras |
|-------|--------|-------------|--------|
| TESTE | Laboratorio | Experimental, aceita risco | 1 variavel por vez, orcamento separado |
| ESCALA | Fabrica | Conservadora, protege resultado | So criativos validados, escala vertical |

**Fluxo:** Criativos novos --> TESTE --> se campeao, fica no reservatorio --> ESCALA puxa quando precisa

**Conta de Teste — Comportamento Completo:**

| Aspecto | Diretriz |
|---------|----------|
| **Qual conta** | A conta que voce JA POSSUI, com historico anterior ao Andromeda |
| **Objetivo** | Descobrir pepitas de ouro (gems). Testar todas as hipoteses. |
| **Comportamento** | Ser ousado, transgredir, testar disruptivamente |
| **Duplicacao** | Pode duplicar quantas vezes quiser |
| **Campanhas** | Sem limite de quantidade |
| **Publicos** | Testar todo tipo de publico |
| **Pontuacao** | Ignorar Pontuacao de Oportunidade (ate 30 e aceitavel) |

**A conta de teste NAO e para gastar pouco.** Pode escalar a vontade se estiver performando. O nome "teste" e porque nao segue as regras do Andromeda — nao porque tem orcamento menor.

**Testes Recomendados (Conta de Teste):**

Os **significativos** sao:
1. **Duplicar conjunto de anuncios** (escala horizontal tradicional)
2. **Trading de orcamento** (regras automaticas horarias — ver RC-32)
3. **Criar campanha com objetivo novo**
4. **Criar campanha com objetivo de otimizacao novo** (volume vs. ROAS)

Os demais (partilha, exclusoes) sao opcionais e com resultados menos expressivos.

**Sobre exclusoes de publico:** Testado e nao gostou. A estrutura de 9 criativos ja resolve frequencia (quase impossivel repetir o mesmo anuncio). Citado apenas como referencia.

**Quando Testar na Escala vs Teste:**

Mudancas frequentes na conta de escala **derrubam a Pontuacao de Oportunidade**. O Andromeda e obcecado por essa pontuacao — ela sinaliza estabilidade e confianca para o algoritmo. Mexer muito na escala = sinalizar instabilidade = algoritmo recua.

| Tipo de Teste | Onde Fazer |
|---|---|
| **Teste pesado** (30-150 criativos, duplicacoes, mudancas estruturais, objetivos diferentes) | Conta de TESTE, sempre |
| **Teste cirurgico** (trocar 1-2 criativos via AB Test nativo do Meta) | Pode ser na conta de ESCALA |

O **AB Test de conteudo criativo** e a excecao porque **nao reseta aprendizado** do conjunto. Permite testar variacoes dentro de um conjunto ativo sem destruir a inteligencia acumulada. E o unico tipo de teste liberado na conta de escala.

### RC-02. Conta de escala: seguir a cartilha do Meta

Na conta de escala, obediencia total ao Andromeda. Nao inventar moda: poucas campanhas (maximo 3), ABO, Advantage Plus, escala vertical.

**Regra: Na escala, o Andromeda manda. Sem excecoes.**

[Fonte: VOL-01, VOL-03, VOL-06]

### RC-03. Conta de teste: ser ousado, testar tudo

Na conta de teste, liberdade total. Publicos manuais, estrategias diferentes, regras automaticas, trading de orcamento — tudo vale.

**Regra: Na conta de teste, nao existe regra do Andromeda. A inovacao vem dos testes; o que funcionar migra para escala.**

[Fonte: VOL-03, VOL-06]

### RC-04. Escala vertical, nunca horizontal

Escalar aumentando orcamento (20-50% por dia), nao duplicando campanhas. O Andromeda penaliza duplicacao.

**Regra: VERTICAL. Aumentar orcamento do conjunto existente. Duplicar = comecar do zero.**

Analogia (placa-mae): O aprendizado vive no conjunto. Duplicar = comecar do zero. Escalar = aproveitar o aprendizado.

**Protocolo Completo de Escala:**

Quando Escalar:
- ROAS > 1.5-2
- Dentro da meta (CPA <= Estrela Guia)
- Algoritmo ja aprendeu (geralmente 3-7 dias)

Como Escalar:
- 20-50% por vez (nao dobrar de uma vez)
- Pode ser diario — nao existe regra de "esperar 3 dias"
- Se ROAS cai --> pausar. Se mantem --> continuar.

Pos-escala: Monitorar 24-48h obrigatoriamente. Se CPA nao sustenta --> trocar criativos OU baixar orcamento e observar.

[Fonte: VOL-01, VOL-06]

### RC-05. ABO > CBO na maioria dos casos

Orcamento no nivel do conjunto de anuncios (ABO), nao no nivel da campanha (CBO). CBO so para testes especificos na conta de teste.

**Regra: ABO como padrao. CBO somente em testes na conta de teste.**

[Fonte: VOL-03, VOL-06]

### RC-06. Remarketing separado: MORTO

Nao criar campanha de remarketing separada. Os 9 criativos C1/C2/C3 no mesmo conjunto fazem o remarketing automaticamente.

**Regra: Campanha de remarketing separada = MORTA. Os 9 criativos resolvem isso.**

Frequencia alta na campanha + baixa no anuncio = algoritmo intercalando criativos diferentes para a mesma pessoa.

[Fonte: VOL-01, VOL-04, VOL-06]

### RC-07. Proibido testar quando esta indo bem

Se a campanha esta performando, nao mexe. Foque em escalar ("vaca gorda"). Testar e para quando algo nao funciona ou quando voce busca novas oportunidades na conta de teste.

**Regra: Campanha com CPA dentro da Estrela Guia = nao altera. Nao "otimiza". Nao testa variacao. NAO MEXE.**

Analogia (achocolatado): Voce nao muda a receita do achocolatado que ta vendendo bem pra "ver se melhora".

[Fonte: VOL-03, VOL-06]

### RC-08. 1 teste por vez, 1 por semana

Nunca misturar variaveis de teste. Se voce testa ABO vs CBO E CPA maximo ao mesmo tempo, nao vai saber qual causou o resultado.

**Regra: Antes de rodar teste, responder: "Qual UNICA variavel estou testando?"**

[Fonte: VOL-03]

### RC-09. Crescer 20% a cada 6 meses

A cada semestre, aumentar o investimento em trafego em pelo menos 20%. Quem nao cresce, morre.

**Regra: Maximo 6 meses com o mesmo investimento. O trafego vai ficar mais caro — essa e a ordem natural.**

[Fonte: VOL-01, VOL-04]

### RC-10. Nunca comecar conjunto com mais de R$150

Orcamento inicial maximo por conjunto: R$150 (ou US$50). Mesmo quem tem muito dinheiro.

**Regra: Max R$150 (US$50) inicial por conjunto. Algoritmo precisa aprender antes de gastar.**

[Fonte: VOL-06]

### RC-11. Campanha boa: criar conjunto FORA. Campanha ruim: criar DENTRO

Quando precisa criar algo novo: se a campanha atual esta boa, crie um novo conjunto fora (para nao contaminar). Se a campanha esta ruim, crie dentro (para reaproveitar historico).

**Regra: Boa = conjunto novo FORA. Ruim = conjunto novo DENTRO. O Andromeda quer MENOS campanhas.**

[Fonte: VOL-06]

---

## Publicos (RC-12 a RC-16)

### RC-12. Sobreposicao > 30% = mesmo publico

Se dois publicos tem mais de 30% de sobreposicao no Audience Overlap, sao efetivamente o mesmo publico. Nao rodar ambos ao mesmo tempo — escolher um.

**Regra: Sobreposicao > 30% = eliminar um dos dois. Checar sempre no Audience Overlap do Meta.**

[Fonte: VOL-02]

### RC-13. Publicos < 50k: juntar em Audiencia Completa

Publicos quentes pequenos (IG engagement, FB engagement, PageView, etc.) que individualmente tem menos de 50 mil pessoas devem ser unidos em um unico publico chamado "Audiencia Completa".

**Regra: < 50k individual = juntar tudo em "Audiencia Completa". Publicos pequenos sao caros e instaveis.**

[Fonte: VOL-02]

### RC-14. Excluir APENAS compradores e leads

As unicas exclusoes que importam: quem ja comprou (nao faz sentido reimpactar) e quem ja e lead (nao faz sentido pagar de novo).

**Regra: So 2 exclusoes validas: compradores e leads. Qualquer outra exclusao reduz publico sem impacto real no CPA.**

[Fonte: VOL-02]

### RC-15. Lookalike SEMPRE 1%

Lookalike e sempre 1%. Se der muito certo, fazer outro de 2% como teste. Nunca comecar com 5%, 10%.

**Regra: LAL = 1%. Percentuais maiores diluem demais a semelhanca com a base original.**

[Fonte: VOL-02]

### RC-16. Advantage Plus com sugestao de interesse = configuracao padrao

Na conta de escala, usar Advantage Plus e incluir sugestoes de interesse. Os publicos antigos viram sugestoes, nao restricoes.

**Regra: AP + sugestao de interesse na escala. Sugestoes sao guardrails, nao restricoes.**

Analogia (placas de estrada): Sugestoes no Advantage+ funcionam como placas de estrada — indicam direcao, mas nao impedem o algoritmo de explorar.

[Fonte: VOL-02, VOL-03]

---

## Criativos (RC-17 a RC-24)

### RC-17. 9 criativos OBRIGATORIOS (3 C1 + 3 C2 + 3 C3)

Minimo 9 anuncios por conjunto: 3 de consciencia baixa (C1), 3 de consciencia media (C2), 3 de consciencia alta (C3). E o "enxoval" inegociavel.

**C1 — Topo:** Conteudo de valor, quebra de padrao, dor. Atrai atencao.
**C2 — Meio:** Hard sell, demonstrativo, comparativo. Convence.
**C3 — Fundo:** Prova social, objecoes, urgencia. Converte.

**Regra: Sem cobertura completa do funil = campanha incompleta. 9 criativos fazem o remarketing automatico funcionar.**

[Fonte: VOL-01, VOL-04]

#### 3 Formas de Subir Anuncios

1. **Criar Novo Diretamente** — Reseta aprendizado. Usar quando: campanha nova ou muito ruim.
2. **Duplicar e Editar** — Rapido. Pega existente, muda video/imagem.
3. **Teste A/B** — Ate 5 variacoes. **Nao reseta aprendizado.** Distribui orcamento entre elas. Usar quando: campanha era boa, ficou ruim.

**Regra de Ouro: Nao Mexa no Que Esta Funcionando**
- Campanha otima? **Nao suba anuncio novo nela.** Espere bambear.
- Se tem criativo pronto, crie outra campanha ou use outra conta.
- **Pior erro possivel:** mexer em campanha que esta performando.

### RC-18. Criativo e o 80-20 do trafego

Estudo Nielsen/Meta: 50% de todos os resultados de leilao sao atribuidos ao criativo. Depois de dominar a operacao, toda energia vai para criativos.

**Regra: Criativo e responsavel por 50% do resultado. Se esta colocando energia em outro lugar, esta colocando no lugar errado.**

[Fonte: VOL-04]

### RC-19. Video + estatico: OBRIGATORIO mesclar

Nunca so video, nunca so imagem estatica. O algoritmo trata os dois como recursos mecanicos diferentes. Mesclar e obrigatorio para diversidade de formato.

**Regra: Mix de video + estatico OBRIGATORIO. O mix maximiza os posicionamentos em que seus anuncios aparecem.**

[Fonte: VOL-04, VOL-06]

### RC-20. "Criativo feio converte"

O jogo nao esta na producao cinematografica, esta na estrutura C1/C2/C3. Design bonito e um bonus, nao requisito.

**Regra: Nao depender de producao cara. Estrutura > estilo. Se tiver beleza, use. Mas nao dependa disso.**

[Fonte: VOL-04]

### RC-21. "Dor voce nao toca, dor se aperta"

Em criativos C1 de dor, nao suavizar. Apertar a dor, fazer a pessoa sentir o peso do problema. Ser direto, sem edulcorar.

**Regra: Dor se APERTA, nao suaviza. A dor e o motor da acao.**

Analogia (garganta seca): C1 resolve a garganta seca — a pessoa ja sente o problema, voce so faz ela perceber com mais intensidade.

[Fonte: VOL-04]

### RC-22. Gestor de trafego TEM que fazer criativos

Com IA (GPT, Gemini, VO3), nao existe mais desculpa. Gestor que nao faz criativo nao sobrevive na era Andromeda.

**Regra: Gestor OBRIGATORIAMENTE produz criativos. O operacional esta sendo automatizado pela IA do Meta — criativo e o diferencial.**

[Fonte: VOL-04, VOL-05]

### RC-23. Hard sell: 50%+ dos anuncios C2

Pelo menos metade dos criativos C2 deve ser hard sell (7 elementos: gancho, dor, motivo, prova, oferta, urgencia, CTA). E o tipo de anuncio que mais vende.

**Regra: Hard sell SEMPRE se destaca. Minimo 50% dos C2 devem ser hard sell. "Topa um desafio?" e o gancho vencedor.**

[Fonte: VOL-04]

### RC-24. CTA: SEMPRE dizer como a pessoa compra

Todo anuncio termina com CTA explicito. "Clica aqui para me chamar no WhatsApp", "Clica aqui para acessar o site", "Clica aqui para se cadastrar".

**Regra: Sem CTA = sem conversao. A pessoa precisa saber o proximo passo.**

[Fonte: VOL-04]

---

## Metricas (RC-25 a RC-30)

### RC-25. "Nada supera o CPA"

CPA e a metrica soberana. Se o CPA esta bom, nao mexe em mais nada — mesmo que outras metricas parecam ruins.

**Regra: CPA <= Estrela Guia = BOM. Ponto. Todas as outras metricas voce joga no lixo se elas comprometerem o CPA.**

[Fonte: VOL-06]

### RC-26. CTR > 2%

A era do CTR 1% acabou. Referencia minima: 2%. Abaixo disso, o criativo precisa ser trocado.

**Regra: CTR < 2% = criativo fraco. Trocar.**

[Fonte: VOL-06]

### RC-27. Connect Rate 70-80%

Taxa de conexao (cliques que viram page views reais) deve estar entre 70-80%. Abaixo disso, o problema e o site (lento ou fora do ar).

**Regra: Connect Rate < 70% = problema no site, nao no anuncio. Consertar a pagina primeiro.**

[Fonte: VOL-06]

### RC-28. Conversao de pagina: lead > 30%, vendas 2-3%, e-commerce > 1%

Benchmarks minimos de conversao por tipo de pagina. Abaixo disso, o problema e a pagina/oferta, nao o trafego.

**Regra: Abaixo do benchmark = problema de pagina/oferta, NAO de trafego. Primeiro consertar a pagina.**

| Tipo | Benchmark Minimo |
|------|-----------------|
| Lead | > 30% |
| Vendas | 2-3% |
| E-commerce | > 1% |

[Fonte: VOL-06]

### RC-29. Frequencia do anuncio max 2 / Frequencia da campanha pode ser alta

Frequencia do anuncio individual acima de 2 = fadiga. Mas frequencia da campanha alta e BOM — significa que o algoritmo esta intercalando criativos diferentes para a mesma pessoa (remarketing automatico).

**Regra: Freq. anuncio > 2 = fadiga, trocar criativo. Freq. campanha alta + freq. anuncio baixa = algoritmo funcionando.**

[Fonte: VOL-06]

### RC-30. Discrepancia gerenciador/CRM: ate 15%

Diferenca entre dados do Meta e dados reais do CRM deve ser no maximo 15%. Acima disso, verificar pixel e API de conversoes.

**Regra: Discrepancia > 15% = falha de rastreamento. Sem rastreamento correto, o algoritmo nao aprende quem realmente compra.**

[Fonte: VOL-06, VOL-09]

---

## Operacional (RC-31 a RC-35)

### RC-31. Matar no ninho: 24h com 9 criativos e nao funcionou, mata

Se um conjunto de anuncios recebeu os 9 criativos obrigatorios e em 24 horas nao deu resultado, desativar. Sem sentimentalismo.

**Regra: 24h sem resultado = PAUSED sem piedade. Nao existe "talvez melhore". Redirecionar orcamento para o que funciona.**

Analogia (funcionarios): Anuncios sao funcionarios. Funcionario ruim = demite rapido. Nao espera meses pra ver se melhora.

**Volume minimo pra decisao:** Gasto de pelo menos 3-5x o valor do CPA target. Abaixo disso, amostra insuficiente.

[Fonte: VOL-03, VOL-06]

### RC-32. Escalar 20-50% por dia

Quando esta bom, aumentar orcamento de 20% a 50% por dia. Pode ser diario, nao precisa esperar 3 dias (regra antiga que nao vale mais no Andromeda).

**Regra: Escala = 20-50% por dia. Pode ser diario. O Andromeda absorve melhor mudancas de orcamento que o algoritmo antigo.**

#### Trading de Orcamento (Escala Agressiva — Conta de Teste)

Aumentos e reducoes constantes de orcamento ao longo do dia via **regras automaticas**.

**Como funciona:**
- Criar regra: a cada hora, se CPA abaixo do limite --> +10% orcamento
- Criar regra: a cada hora, se CPA acima do limite --> -10% orcamento
- Orcamento sobe e desce ao longo do dia conforme performance

**Onde funciona melhor:**
- Campanhas de leads (volume por hora suficiente)
- Para vendas: intervalo maior (2-3h), especialmente low ticket

**Para quem e:**
- Gestores com grandes orcamentos e experiencia
- Excelente para escalar onde a escala vertical bateu num teto
- **Arriscado** — apenas operadores avancados

**Contexto importante:** O Andromeda foi feito para grandes anunciantes que fazem campanhas de reconhecimento de marca, nao de conversao. Quem investe muito em conversao bate num limite estrutural — a escala vertical tem um teto quando o volume de conversoes e alto. A conta de teste com trading resolve esse conflito: permite escalar alem do teto da escala vertical sem quebrar as regras da conta de escala.

[Fonte: VOL-03, VOL-06]

### RC-33. CPM caro: reduz orcamento, NAO desativa

Quando o CPM sobe (periodos de Black Friday, Natal, eleicoes), reduzir orcamento e esperar. Nao desativar campanhas.

**Regra: CPM caro = REDUZIR orcamento, NUNCA desativar. Desativar perde todo o aprendizado acumulado.**

Analogia (peixe no mercado): CPM varia como preco do peixe. Hoje ta caro? Nao compra. Mas nao fecha a peixaria.

[Fonte: VOL-06]

### RC-34. Um pixel e melhor que varios

Usar um unico pixel para toda a estrutura. Varios pixels fragmentam os dados e confundem o algoritmo.

**Regra: UM pixel. Toda a inteligencia de aprendizado concentrada em um unico ponto.**

[Fonte: VOL-03, VOL-07]

### RC-35. Evento vai SEMPRE na pagina de acao concluida

Instalar o evento de conversao (Lead, Purchase) na pagina de obrigado/confirmacao, nunca na pagina onde a acao comeca (formulario, checkout).

**Regra: Evento na pagina de OBRIGADO/CONFIRMACAO. Nunca no formulario/checkout. Se instalar no formulario, conta todo mundo que abriu — nao so quem converteu.**

[Fonte: VOL-03, VOL-07]

---

## Contingencia (RC-36 a RC-38)

### RC-36. Perfil principal determina qualidade dos ativos

Perfil bom = BM boa = contas boas. Perfil ruim = tudo ruim. O DEC (Deep Entity Classification) do Meta avalia tudo a partir do perfil.

**Regra: O ativo principal determina a qualidade dos outros ativos. Investir em perfil real e antigo e a melhor defesa.**

[Fonte: VOL-07]

### RC-37. 3-4 perfis administradores backup em cada BM

Nunca depender de um unico perfil. Ter 3-4 administradores reais (nao farmados) em cada Business Manager.

**Regra: 3-4 admins REAIS por BM. Bloqueio de perfil e imprevisivel — sem backup, perde acesso a tudo.**

[Fonte: VOL-07]

### RC-38. Email profissional em toda a estrutura

Usar email com dominio proprio (.com.br, .io, .net) em TODAS as etapas do Facebook. Email gratuito reduz score.

**Regra: Email com dominio proprio OBRIGATORIO. Email gratuito = pontuacao menor no Meta.**

[Fonte: VOL-07]

---

## Decision Trees

### Decision Tree — Otimizacao Diaria

```
1. Checar PACING
   |-- Nao ta gastando? --> Diagnostico 7 causas
   |-- Ta gastando? --> Proximo passo

2. Checar CPA vs Estrela Guia (por conjunto)
   |-- CPA <= EG --> MANTER (RC-07)
   |   |-- Consistente 3+ dias? --> ESCALAR 20-50% (RC-04, RC-32)
   |-- CPA > EG --> MATAR (RC-31, RC-25)

3. Checar FREQUENCIA
   |-- Freq. anuncio > 2 + CPA subindo --> FADIGA --> trocar criativos (RC-29)
   |-- Freq. anuncio > 2 + CPA estavel --> CONSOLIDACAO --> nao mexer (RC-07)

4. Checar CRIATIVOS
   |-- Mix completo (C1+C2+C3)? --> OK
   |-- Faltando nivel? --> Pedir ao squad externo (RC-17)

5. Registrar METRICAS (RC-25 a RC-30)
```

### Decision Tree — Primeiras 24-48h

```
Campanha ativou
|-- NAO MEXER por 24-48h (aprendizado)
|-- Monitorar pacing apenas
|-- Apos 48h:
    |-- CPA bom --> manter (RC-07)
    |-- CPA ruim --> matar no ninho (RC-31)
    |-- Nao gastou --> diagnostico 7 causas
```

---

## 4 Estrategias de Reducao de CAC

1. **Renovar criativos** — A mais direta. Criativos novos = CTR novo = CPA menor. (RC-17, RC-18)
2. **Otimizar pagina** — Se CR da pagina ta baixa, nao e problema de trafego. (RC-28)
3. **Refinar publico** — Testar sugestoes diferentes no Advantage+. (RC-16)
4. **Ajustar oferta** — Se nada funciona, o problema pode ser a oferta.

---

## Analogias do Metodo

| Analogia | Conceito | Regra |
|----------|----------|-------|
| Funcionarios | Anuncios como empregados — demitir ruins rapido, premiar bons | RC-31 |
| Achocolatado | Nao mexer no que funciona | RC-07 |
| Lab vs Fabrica | 2 contas — teste = laboratorio, escala = fabrica | RC-01 |
| Piscina | Pacing — encher piscina proporcional ao tempo | RC-09 (pacing) |
| Placa-mae | Aprendizado do conjunto — nao mexer em conjunto bom | RC-04, RC-07 |
| Placas de estrada | Sugestoes no Advantage+ = guardrails, nao restricoes | RC-16 |
| Peixe no mercado | Sazonalidade — CPM varia como preco do peixe | RC-33 |
| Garganta seca | Necessidade do publico — C1 resolve a garganta seca | RC-21 |

---

## Indice Rapido

| # | Regra | Dominio |
|---|-------|---------|
| RC-01 | Duas contas: teste e escala | Estrategia |
| RC-02 | Escala segue cartilha do Meta | Estrategia |
| RC-03 | Teste: ser ousado | Estrategia |
| RC-04 | Escala vertical, nunca horizontal | Estrategia |
| RC-05 | ABO > CBO | Estrategia |
| RC-06 | Remarketing separado: MORTO | Estrategia |
| RC-07 | Nao testar quando esta bom | Estrategia |
| RC-08 | 1 teste por vez, 1 por semana | Estrategia |
| RC-09 | Crescer 20% a cada 6 meses | Estrategia |
| RC-10 | Max R$150 inicial por conjunto | Estrategia |
| RC-11 | Boa: fora. Ruim: dentro | Estrategia |
| RC-12 | Sobreposicao > 30% = mesmo publico | Publicos |
| RC-13 | < 50k: Audiencia Completa | Publicos |
| RC-14 | Excluir so compradores e leads | Publicos |
| RC-15 | Lookalike sempre 1% | Publicos |
| RC-16 | Advantage Plus + sugestao de interesse | Publicos |
| RC-17 | 9 criativos obrigatorios | Criativos |
| RC-18 | Criativo = 80-20 do trafego | Criativos |
| RC-19 | Video + estatico obrigatorio | Criativos |
| RC-20 | Criativo feio converte | Criativos |
| RC-21 | Dor se aperta, nao suaviza | Criativos |
| RC-22 | Gestor TEM que fazer criativos | Criativos |
| RC-23 | Hard sell: 50%+ dos anuncios C2 | Criativos |
| RC-24 | CTA sempre explicito | Criativos |
| RC-25 | Nada supera o CPA | Metricas |
| RC-26 | CTR > 2% | Metricas |
| RC-27 | Connect Rate 70-80% | Metricas |
| RC-28 | Conversao: lead 30%, vendas 2-3%, e-commerce 1% | Metricas |
| RC-29 | Freq. anuncio max 2 / campanha pode ser alta | Metricas |
| RC-30 | Discrepancia max 15% | Metricas |
| RC-31 | Matar no ninho: 24h | Operacional |
| RC-32 | Escalar 20-50%/dia | Operacional |
| RC-33 | CPM caro: reduzir, nao desativar | Operacional |
| RC-34 | Um pixel, nao varios | Operacional |
| RC-35 | Evento na pagina de acao concluida | Operacional |
| RC-36 | Perfil determina qualidade | Contingencia |
| RC-37 | 3-4 admins backup por BM | Contingencia |
| RC-38 | Email profissional em tudo | Contingencia |

---

*38 Regras Cardinais extraidas pelo ETLmaker v3.0 — Fonte: Metodo Andromeda*
*Dominios excluidos (fora do escopo de trafego): Automacoes, Dados, WhatsApp (RC-39 a RC-46)*
