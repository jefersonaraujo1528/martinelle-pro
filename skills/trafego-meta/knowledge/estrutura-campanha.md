# Estrutura de Campanhas e Contas — Metodo Andromeda

## 1. Arquitetura de Contas: Teste vs Escala

### 1.1 Por Que Duas Contas

A separacao entre conta de teste e conta de escala e o pilar fundamental da organizacao do Andromeda. Estamos numa fase de transicao — o passado (testes manuais) coexiste com o futuro (IA otimizando tudo). [Fonte: VOL-03 Sec 2]

| Conta | Funcao | Mentalidade |
|-------|--------|-------------|
| **Escala** | Via principal — seguir o playbook do Meta | "Faco o que o algoritmo quer" |
| **Teste** | Laboratorio — testar tudo | "Faco o que EU quero testar" |

**Por que separar:** o algoritmo quer o minimo de alteracoes. Se voce testa na conta principal, a pontuacao de oportunidade cai e a performance piora. Separando, voce testa livremente numa conta e mantem a outra "limpa". [Fonte: VOL-03 Sec 2]

### 1.2 Quantas Contas Ter

| Investimento mensal | Contas de escala | Contas de teste | Total |
|---------------------|-----------------|-----------------|-------|
| **Mais de R$ 5.000** | 2 | 2 | 4 |
| **Menos de R$ 5.000** | 1 | 1 | 2 |

**Regra pratica:** [Fonte: VOL-03 Sec 2.4]
- **Conta que voce ja tem** (com historico) --> Conta de ESCALA
- **Conta nova** (que voce criar) --> Conta de TESTE

Se nao consegue ter duas contas: faz tudo em uma so. Cria uma campanha chamada "campanha de escala" e segue o metodo. [Fonte: VOL-03 Sec 2]

### 1.3 Pontuacao de Oportunidade no Contexto

O Meta pontua de 0 a 100 o quanto sua campanha segue as recomendacoes do algoritmo. [Fonte: VOL-03 Sec 1.5]

| Impacto | Pontos |
|---------|--------|
| Usar Advantage Plus | **+59** |
| Usar "Site + Formularios" ao inves de so "Site" | **+22** |
| Ativar CBO ao inves de ABO | Positivo |
| Desativar Advantage Plus nos posicionamentos | Negativo |

**Principio:** Na conta de escala, busque ~100. Na conta de teste, ignore — pode estar em 30, nao importa. O objetivo e testar, nao agradar o Meta. [Fonte: VOL-03 Sec 1.5]

> Detalhamento completo da pontuacao: ver `filosofia-metodo.md`

---

## 2. Campanha de Escala — A Via Principal

### 2.1 Arquitetura-Mestre

```
1 CAMPANHA (ABO, partilha 20%)
  |
  |-- Conjunto 1: AP puro (grupo controle)
  |-- Conjunto 2: AP + sugestao (cluster A)
  |-- Conjunto 3: AP + sugestao (cluster B)
  |-- Conjunto 4: AP + sugestao (cluster C)
  |-- Conjunto 5: AP + sugestao (cluster D)
  |-- Conjunto 6: Audiencia quente
  |
  |-- [Opcional] Conjunto 7+: Hipersegmentacao
  |
  Cada conjunto: 9 CRIATIVOS IDENTICOS (3 C1 + 3 C2 + 3 C3)
```

1 campanha, multiplos conjuntos de anuncios (ABO), 9 criativos iguais em cada conjunto. Os MESMOS 9 criativos sao replicados em TODOS os conjuntos. Diferenciacao entre conjuntos e so no publico/sugestao.

**Principio:** voce nao faz criativos diferentes por conjunto. A IA segmenta por consciencia nos criativos, nao nos conjuntos.

### 2.2 ABO vs CBO

| Aspecto | ABO (Padrao Escala) | CBO (Conta de Teste) |
|---------|---------------------|----------------------|
| Orcamento definido em | Conjunto de anuncios | Campanha |
| Controle do gestor | Alto — define quanto cada conjunto recebe | Baixo — algoritmo distribui |
| Uso na escala | Recomendado | Nao recomendado (ainda) |
| Uso no teste | Pode testar | Pode testar |
| Visao de futuro | Vai migrar pra CBO | Sera padrao quando IA amadurecer |

### 2.3 Orcamento Inicial

- Todos os conjuntos comecam com o **mesmo orcamento**
- Maximo **R$150** (ou US$50) por conjunto (RC-10 — ver `andromeda-rules.md`)
- Habilitar partilha de ate **20%** entre conjuntos (se disponivel)
- Quem tem pouco, comeca com o que tem — a estrutura nao muda

**Exemplo numerico (6 conjuntos, verba R$600/dia):** Cada conjunto recebe R$100/dia. Com partilha de 20%, o algoritmo pode redistribuir entre R$80 e R$120 por conjunto conforme performance. [Fonte: VOL-03 Sec 3]

**Atencao:** Se a partilha estiver ativa, voce NAO consegue definir CPA maximo nos conjuntos. E preciso desativar a partilha primeiro para liberar o campo de CPA. [Fonte: VOL-03 Sec 1.3]

### 2.4 Duracao da Campanha

Nao existe prazo de 5 dias ou qualquer outro. A campanha fica ativa enquanto der resultado. Parou de dar resultado, otimiza. Fez tudo e nao voltou: desliga e cria outra. [Fonte: VOL-03 Sec 3.12]

---

## 3. Detalhamento dos Conjuntos (Escala)

### 3.1 Conjunto 1: Advantage Plus Puro (Grupo Controle)

Primeiro conjunto e o **grupo controle** — nenhuma interferencia humana na segmentacao. A IA decide tudo.

**Configuracao:**
- Advantage Plus ativado
- **Sem NENHUMA sugestao** de idade, sexo, interesse
- Apenas o pais
- Mesmos 9 criativos que todos os outros conjuntos

**Por que funciona ate em nicho pequeno:** a IA usa cascateamento — historico da conta, pixel, conteudo do Instagram e os criativos como base de dados pra decidir pra quem mostrar, mesmo sem segmentacao explicita.

**O que "grupo controle" significa:** baseline pra comparar com os conjuntos com sugestao. Se performar melhor que os demais, sinal de que a IA ja esta madura pra aquele nicho.

### 3.2 Conjuntos 2-5: Advantage Plus com Sugestoes (Clusters)

Meio-termo entre liberdade total e controle humano. A IA continua com autonomia (AP ativado), mas voce da sugestoes de interesse pra direcionar.

**Regras dos Clusters:**
1. **1 cluster por conjunto** — cada conjunto = grupo de interesse diferente
2. **Maximo 3-4 sugestoes por conjunto** — nao exagerar
3. **NAO misturar clusters** diferentes no mesmo conjunto
4. **Continua sendo Advantage Plus** — sugestoes sao direcionamento, nao restricao

**Sugestao NAO e Restricao:** Diferenca critica do modelo antigo — sugestao no Advantage Plus nao e restricao. Se sugere idade 40-50, IA ainda pode mostrar pra 35 se perfil for bom.

**Por que Separar em Conjuntos:** Se misturar tudo num conjunto so, IA otimiza pro caminho mais facil. Separando, cada cluster recebe verba minima pra ser testado e a IA explora caminhos diferentes.

> Detalhamento de publicos e exemplos de clusters: ver `publicos-reference.md`

### 3.3 Conjunto de Audiencia Quente

Pelo menos 1 conjunto dedicado a pessoas que ja tiveram contato com voce.

| Publico | Tipo | Configuracao |
|---------|------|--------------|
| Engajou com Instagram | Personalizado | Ultimos 365 dias |
| Assistiu videos | Personalizado | 50%+ do video |
| Visitou o site | Personalizado | Page views |
| Lista de e-mails | Personalizado | Upload da base |

**Audiencia pequena (maioria):** junta tudo num conjunto so. Instagram, video, site, email — tudo junto com AP.

**Audiencia grande (1M+ seguidores, 100k+ leads):** pode separar cada publico quente em conjuntos diferentes.

**Page Views e Checkout Abandonado:** entram como **sugestao** no AP do conjunto de audiencia quente — nao como publico fechado. A IA prioriza naturalmente, especialmente com criativos C3.

### 3.4 Hipersegmentacao

Estrategia **de negocio**, nao de trafego. Falar especificamente com uma fatia que o AP puro nunca encontraria.

**Quando Usar:**
- Dados/intuicao mostram grupo especifico com potencial fora do publico obvio
- Batendo cabeca pra escalar porque ataca sempre o mesmo publico
- Quer validar hipotese de mercado

**4 Regras:**
1. **Decisao estrategica de NEGOCIO** — baseada em dados de compradores, nao em achismo
2. **Criativos PROPRIOS obrigatorios** — nos primeiros segundos, referencia quem quer atingir
3. **Pode ser AP com sugestao** — interesse e o nicho em questao
4. **5-10% da verba** — nao dispersar a estrategia principal

**Script de Headline Dinamica (WordPress):**
- URL normal: `seusite.com/workshop`
- URL hipersegmentada: `seusite.com/workshop?h=profissionais-da-saude`
- Script le parametro e troca headline automaticamente. 1 pagina serve pra todos os nichos
- Restricao: so WordPress. Outras plataformas precisam de dev proprio

---

## 4. Configuracoes da Campanha de Escala

Configuracao padrao. Sem inventar, sem testar — testes vao na conta de teste.

| Configuracao | Valor | Notas |
|-------------|-------|-------|
| Tipo de orcamento | **ABO** | Controle sobre investimento por conjunto |
| Partilha de orcamento | **Ativa (20%)** | Margem pro algoritmo otimizar |
| Destino | **Site** | Nao "site + formulario" na escala |
| Objetivo | **Maximizar numero de conversoes** | Nao ROAS, nao valor |
| CPA maximo | **Nao definir no inicio** | So quando conjunto ja esta ruim |
| Posicionamentos | **Advantage Plus (automatico)** | Nao remover nada |
| Regras de valor | **Nao mexer** | Testar isso na conta de teste |
| Janela de atribuicao | **Padrao** | Nao mexer |
| Pixel | **Configurado com evento correto** | Lead ou compra |

### CPA Maximo — Segunda Linha de Defesa

CPA maximo controla custo mas **limita escala**. Se algoritmo nao acha lead no preco, para de gastar. Muita gente reclama "campanha nao gasta" — e porque tem CPA maximo definido.

So define quando conjunto ja esta ruim e trocar criativos nao resolveu.

### Via Principal vs Vias Paralelas

- **Via principal:** segue a cartilha (ABO, AP, site, maximizar conversoes, sem CPA maximo)
- **Vias paralelas:** planos B e C baseados nos resultados da conta de teste

Se teste provar que algo diferente funciona melhor, leva pra escala mesmo saindo da cartilha:
- CBO bateu ABO no teste --> leva
- Publico segmentado (sem AP) bateu AP --> leva, aceita queda na pontuacao
- Site + formulario mostrou lead mais barato --> leva

---

## 5. Campanha de Teste — O Laboratorio

### 5.1 Filosofia

A conta de teste e o laboratorio. Liberdade total para testar qualquer coisa, sem se preocupar com pontuacao de oportunidade. [Fonte: VOL-03 Sec 4]

**Fluxo de validacao:**
1. Teste na conta de teste
2. Analise as metricas
3. Funcionou? Leve para a conta de escala
4. Nao funcionou? Descarte e teste outra coisa

### 5.2 Os 10 Tipos de Teste

```
CONTA DE TESTE
  |
  |-- Teste 1: Criativos (80/20 — mais importante)
  |-- Teste 2: ABO vs CBO
  |-- Teste 3: CPA maximo
  |-- Teste 4: Maximizar conversoes vs valor/ROAS
  |-- Teste 5: Com vs sem partilha de orcamento
  |-- Teste 6: Advantage Plus vs publico segmentado
  |-- Teste 7: Limitacao de publico a nivel de CONTA
  |-- Teste 8: Site vs formulario
  |-- Teste 9: Objetivo de campanha cruzado
  |-- Teste 10: Regras automaticas
```

[Fonte: VOL-03 Sec 4.2]

#### Teste 1: Criativos (Pareto 80/20)

O teste que mais alavanca resultado. Na era do Andromeda, diversidade criativa e o maior diferencial. [Fonte: VOL-03 Sec 4.3]

| Cenario | O que fazer |
|---------|------------|
| Poucos criativos (<9) | Sobe direto na escala — nao tem o que testar |
| Producao moderada (10-20/semana) | Testa no teste, leva os melhores pra escala |
| Producao alta (20-30+/semana) | Obrigatorio testar — volume grande precisa filtragem |

**Diversidade vs Quantidade:** Angulos diferentes, enquadramentos diferentes, abordagens de venda diferentes, formatos variados (video, carrossel, estatico) = correto. Mesma mensagem com cor diferente, copy parecido em formatos diferentes = errado. A IA ve que voce mudou pouquissimos elementos e considera todos um anuncio parecido. [Fonte: VOL-03 Sec 4.3]

#### Teste 2: ABO vs CBO

Criar campanha ABO e outra CBO, comparar metricas. Mentalidade: essa semana ABO funcionou? Fica. Parou? Testa CBO. CBO ficou bom? Usa. Daqui a 3 meses parou? Volta pro ABO. E tentativa e erro permanente. [Fonte: VOL-03 Sec 4.4]

#### Teste 3: CPA Maximo

CPA maximo controla custo mas limita escala. Se algoritmo nao acha lead no preco, desacelera. Usar quando CPA esta caro demais e trocar criativos nao resolveu. Sem CPA = gasta orcamento todo, escala maxima. Solucao pra leads caros? Criativos melhores. Sempre volta pros criativos. [Fonte: VOL-03 Sec 4.5]

#### Teste 4: Maximizar Conversoes vs Valor/ROAS

Via principal = maximizar numero de conversoes ("traz o MAXIMO"). Futuro = maximizar valor de conversao ("respeita o ROAS/CPA que eu defini"). A segunda e pra quando custo esta caro demais. [Fonte: VOL-03 Sec 4.6]

#### Teste 5: Com vs Sem Partilha de Orcamento

Testar se a redistribuicao de ate 20% entre conjuntos melhora ou piora o resultado geral. [Fonte: VOL-03 Sec 4.2]

#### Teste 6: Advantage Plus vs Publico Segmentado

AP = IA livre, +59 pontos, futuro. Segmentado = voce define quem ve, -59 pontos, passado (mas funciona). Principio: lide com fatos. Ate que a conta de teste prove que segmentado e melhor, fica com AP. [Fonte: VOL-03 Sec 4.7]

#### Teste 7: Limitacao de Publico a Nivel de CONTA (Negocios Locais)

Problema: negocios locais sofrem com AP porque o anuncio vaza para outras regioes. **Solucao:** limitar no NIVEL DA CONTA (nao da campanha) — Definicoes de publicidade > Controles da conta > "Meu negocio so pode publicar em localizacoes especificas". Na campanha, continua usando AP normalmente. Funciona tambem pra idade (raramente) e exclusao de publico. [Fonte: VOL-03 Sec 4.8]

#### Teste 8: Site vs Formulario

Testar "Site + Formularios" contra "Site" puro. Analisar: taxa de conversao, qualidade do lead (quem comprou depois), custo por lead, cruzar origem com conversao final. Tendencia: Site + Formularios vai ser padrao no futuro. Hoje, precisa validacao. [Fonte: VOL-03 Sec 4.9]

#### Teste 9: Objetivo de Campanha Cruzado

Usar objetivo diferente do "correto" (ex: campanha de TRAFEGO pra vender). As vezes funciona. Futuro: vai deixar de funcionar conforme IA evolui. Hoje, vale testar. [Fonte: VOL-03 Sec 4.10]

#### Teste 10: Regras Automaticas

Pausar/ativar anuncios automaticamente por condicoes (CPA > R$X, gasto sem resultado, ROAS < 2, etc.). Frequencia: diaria, horaria, 30 ou 60 min. **O dilema:** regras automaticas tiram a oportunidade de diagnosticar POR QUE um anuncio esta ruim. Quando pausa manualmente, muitas vezes percebe que o problema era outro. A regra nao faz esse diagnostico — voce perde a chance de aprender. [Fonte: VOL-03 Sec 4.10]

### 5.3 Quando Testar — Frequencia e Timing

| Cenario | O que fazer |
|---------|------------|
| **Resultados bons (vaca gorda)** | NAO teste. Foque em entender POR QUE esta bom e replique |
| **Resultados ruins (vaca magra)** | TESTE. Tire coelhos da cartola. Tem um coelhinho escondido em algum desses testes |
| **Meio-termo** | 1 teste por semana, no maximo |

[Fonte: VOL-03 Sec 4.12]

**Regras de timing:**
1. Melhor momento para testar: quando as coisas vao MAL
2. Pior momento para testar: quando as coisas vao BEM
3. Frequencia: no maximo 1 teste por semana
4. Nunca misture testes: se testa ABO vs CBO E CPA ao mesmo tempo, nao vai saber qual causou o resultado
5. Os 10 testes sao possibilidades, NAO obrigacoes simultaneas

---

## 6. Formularios Instantaneos

Formularios instantaneos sao mini-sites dentro do proprio Facebook/Instagram. A pessoa clica no anuncio e preenche um formulario sem sair da rede social. [Fonte: VOL-03 Sec 5]

### 6.1 Para Quem E Ideal

| Cenario | Formulario e ideal? |
|---------|-------------------|
| Nao tem site | **SIM** — alternativa perfeita |
| Negocio local | **SIM** — funciona muito bem |
| Prestador de servico | **SIM** — captura rapida |
| Pouco orcamento (sem estrutura de site) | **SIM** — zero custo adicional |
| Lancamento/infoproduto em volume | **NEM TANTO** — site tende a converter melhor |
| Quer testar contra o site | **SIM** — teste valido na conta de teste |

[Fonte: VOL-03 Sec 5.2]

### 6.2 Hack do E-mail Comercial

**Problema:** quando voce pede "e-mail", o formulario auto-preenche com o e-mail de login do Facebook/Instagram — que muitas vezes e um e-mail antigo, abandonado. [Fonte: VOL-03 Sec 5.5]

**Solucao:** ao inves de pedir "E-mail", peca **"E-mail comercial"**. Como o campo "e-mail comercial" nao tem auto-preenchimento, a pessoa e forcada a digitar manualmente um e-mail real. [Fonte: VOL-03 Sec 5.5]

**Quando usar:** quando a qualidade dos leads (taxa de abertura de e-mail, taxa de resposta) esta baixa. [Fonte: VOL-03 Sec 5.5]

### 6.3 Hack do "Ainda Nao Terminou"

A secao de politica de privacidade e obrigatoria. Problema: muitas pessoas acham que acabou o formulario quando veem essa secao e abandonam. [Fonte: VOL-03 Sec 5.6]

**Solucao:** adicione aviso personalizado acima: "Ainda nao terminou! Falta apenas mais um passo. Clique no botao azul para avancar." [Fonte: VOL-03 Sec 5.6]

### 6.4 Integracao e Download de Leads

| Metodo | Custo | Complexidade |
|--------|-------|-------------|
| **Google Sheets** (direto) | Gratuito | Baixa |
| **Zapier / Make / N8N** | Pago | Media |
| **Webhook** | Variavel | Alta (precisa dev) |

[Fonte: VOL-03 Sec 5.10]

### 6.5 Formulario como Teste na Escala

Os testes com formularios tem dado bons resultados. O algoritmo com "Site + Formularios" faz: [Fonte: VOL-03 Sec 5.9]
- Identifica pessoas com comportamento de clicar e ir para sites --> manda pro site
- Identifica pessoas que ficam so dentro das redes sociais --> manda pro formulario
- O algoritmo decide dinamicamente para cada usuario

**Limitacao atual:** leads de formulario podem ser de menor qualidade que leads de site. Cruzar origem do lead com conversao final (quem comprou?) para saber se vale. [Fonte: VOL-03 Sec 5.9]

---

## 7. Remarketing no Andromeda

O Andromeda **aposentou** campanhas de remarketing como estrutura separada. A IA faz automaticamente.

**Como funciona:** criativos de C3 (prova, objecao, urgencia) JA sao remarketing — por criativo, nao por publico. AP + audiencia quente + C3 fazem o trabalho.

**NAO criar campanha separada** de remarketing como no modelo antigo (frio/morno/quente). E 1 conjunto dentro da mesma campanha com publicos quentes como sugestao.

**Checkout abandonado:** entra como parte do publico quente — sugestao no AP, nao campanha separada.

---

## 8. Publicos de Exclusao

| Publico | Quando Excluir | Quando NAO Excluir |
|---------|---------------|-------------------|
| Compradores do produto A | Em campanhas vendendo produto A | Em campanhas vendendo produto B (upsell) |
| Leads ja captados | Em campanhas de captacao | Em campanhas de venda pra leads |

Mesmo publico pode ser exclusao OU publico-alvo dependendo do objetivo.

---

## 9. Tabela de Referencia Rapida

### Conta de Escala — Conjuntos

| # | Conjunto | Tipo | Sugestoes | Criativos |
|---|----------|------|-----------|-----------|
| 1 | Grupo Controle | AP puro | Nenhuma (so pais) | 9 (3C1 + 3C2 + 3C3) |
| 2 | Cluster A | AP + sugestao | 3-4 interesses | 9 (mesmos) |
| 3 | Cluster B | AP + sugestao | 3-4 interesses | 9 (mesmos) |
| 4 | Cluster C | AP + sugestao | 3-4 interesses | 9 (mesmos) |
| 5 | Cluster D | AP + sugestao | 3-4 interesses | 9 (mesmos) |
| 6 | Audiencia quente | AP + personalizado | IG 365d, video, site, email | 9 (mesmos) |
| 7* | Hiperseg. | AP + sugestao nicho | Interesse do nicho | 9 (PROPRIOS) |

*Conjunto 7 e opcional e usa criativos dedicados, nao os mesmos 9.

### Conta de Teste

Campanhas: quantas quiser. Pode duplicar a vontade. Publicos: qualquer tipo (com ou sem AP). Pontuacao: ignorar. Objetivo: validar hipoteses para aplicar na escala. 10 tipos de teste disponiveis (Sec 5.2).

**~6 conjuntos** como ponto de partida na escala. Pode escalar pra 10, 12 sem problema — e ABO, cada um recebe orcamento proprio.

### 9.2 Sistema de Lotes — SOP Operacional

O fluxo padrao de teste de criativos na conta de teste opera por **lotes sequenciais**:

```
LOTE 1: 1 campanha Andromeda (ate 6 conj, 9 criativos novos)
  |-- Roda → otimiza orcamento → pausa conjuntos ruins
  |-- Resultado: criativos validados (campeoes)
  |-- Campanha fica ativa escalando enquanto performar
  |
LOTE 2: NOVA campanha Andromeda (mesma estrutura, 9 criativos NOVOS)
  |-- Mesma logica: roda, otimiza, pausa, valida
  |
LOTE 3, 4, 5... → repete indefinidamente
```

**Regras do sistema de lotes:**

| Regra | Descricao |
|-------|-----------|
| 1 lote = 1 campanha nova | Cada batch de criativos vive em campanha propria |
| Estrutura Andromeda sempre | ~6 conjuntos (1 AP puro, 4 AP+sugestao, 1 quente), 9 criativos iguais em todos |
| Nunca mexer nos anuncios | Otimizar so orcamento de conjunto. Pausar conjunto inteiro se ruim |
| Campanhas performando ficam vivas | Sobe orcamento (escala vertical), mantem rodando ate morrer |
| Criativos novos = lote novo | NUNCA subir criativos novos em campanha existente que performa |
| Nomenclatura com lote | `[OBJETIVO]_[PRODUTO]_[LOTE]` — ex: `VENDAS_ARKA_L03` |

**Fluxo para a escala:**

Criativos validados no teste (campeoes com CPA <= Estrela Guia) formam o **reservatorio**. Quando a conta de escala precisa de criativos novos (fadiga, frequencia subindo), o scale-operator **puxa** do reservatorio e monta a campanha de escala so com campeoes comprovados.

```
Conta TESTE (lotes rodando)     Conta ESCALA (so campeoes)
  Lote 1: 9 criativos            |
    → 4 campeoes ───────────────→ Campanha escala com
  Lote 2: 9 criativos            | campeoes dos lotes
    → 3 campeoes ───────────────→ (estrutura Andromeda)
  Lote 3: 9 criativos            |
    → 5 campeoes ───────────────→ |
```

---

## 10. Checklist de Montagem

### Antes de Publicar (Escala)

- [ ] 1 campanha, objetivo correto (vendas/leads)
- [ ] ABO com partilha de ate 20% habilitada
- [ ] Conjunto 1: AP puro (so pais, zero sugestoes)
- [ ] Conjuntos 2-5: AP com sugestoes (1 cluster/conjunto, max 3-4 sugestoes)
- [ ] NAO misturar clusters diferentes no mesmo conjunto
- [ ] Pelo menos 1 conjunto de audiencia quente (IG 365d, video 50%+, site, email)
- [ ] Publicos de exclusao configurados (compradores, leads)
- [ ] 9 criativos replicados em TODOS os conjuntos (3C1 + 3C2 + 3C3)
- [ ] Destino: Site
- [ ] Objetivo: Maximizar numero de conversoes
- [ ] CPA maximo: NAO definir no inicio
- [ ] Posicionamentos: Advantage Plus automatico
- [ ] Pixel configurado com evento correto
- [ ] Todo anuncio com CTA
- [ ] Todos os conjuntos com mesmo orcamento inicial (max R$150/conjunto)
- [ ] Sem data final — campanha fica ativa enquanto der resultado

### Se Tiver Hipersegmentacao

- [ ] Oportunidade identificada baseada em dados
- [ ] Criativos PROPRIOS (referenciando publico nos primeiros segundos)
- [ ] 5-10% da verba total
- [ ] [Opcional] Script headline dinamica (WordPress)

### Conta de Teste

- [ ] Conta separada da escala (ou campanha separada se so tem 1 conta)
- [ ] 1 teste por vez — nunca misturar variaveis
- [ ] Pontuacao de oportunidade: ignorar
- [ ] Resultado bom validado? Levar para escala
