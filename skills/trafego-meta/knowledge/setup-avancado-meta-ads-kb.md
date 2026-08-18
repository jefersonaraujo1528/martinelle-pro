# Setup Avancado Meta Ads — KB Complementar

> **Versao:** 1.0 | **Data:** 2026-04-09
> **Fonte:** KB ETL Setup Trafego Andromeda (ETLmaker v3.0) — VOL-03, VOL-05, VOL-06
> **Uso:** Agente `andromeda-chief` quando usuario precisa de configuracoes avancadas alem do setup basico
> **Pre-requisito:** Setup basico completo (`setup-completo-meta-ads-kb.md`)

---

## O que esta KB cobre

Configuracoes avancadas que NAO sao obrigatorias pra comecar a anunciar, mas que aumentam rastreamento, seguranca e opcoes de campanha:

1. [Google Tag Manager (GTM)](#1-google-tag-manager-gtm) — centralizar todos os codigos do site
2. [Contingencia e Seguranca de Ativos](#2-contingencia-e-seguranca-de-ativos) — proteger contra bloqueios
3. [Formularios de Lead (Lead Forms)](#3-formularios-de-lead-lead-forms) — capturar leads sem site
4. [Eventos Avancados e Conversoes Personalizadas](#4-eventos-avancados-e-conversoes-personalizadas) — rastreamento granular
5. [Microsoft Clarity](#5-microsoft-clarity) — heatmaps e gravacao de sessao

---

## 1. Google Tag Manager (GTM)

**O que e:** Central de gerenciamento de TODOS os codigos do site — Pixel do Facebook, Google Analytics, Clarity, Google Ads. Centraliza tudo num lugar so, sem precisar de programador pra cada codigo.

**Quando configurar:** Quando o usuario ja tem o setup basico funcionando e quer:
- Rastrear acoes especificas (cliques em botoes, envios de formulario)
- Centralizar codigos de multiplas plataformas
- Ter controle granular de eventos sem mexer no codigo do site

> **Analogia (Mateus):** "Caixa central de luz de uma casa. Antes precisava de eletricista pra cada fiacao. Agora tudo passa pela caixa central."

### 1.1 Os 3 Pilares do GTM

| Pilar | O que e | Analogia |
|-------|---------|----------|
| **Tag** | Integracao entre site e plataforma. Contem codigo + evento | Ligacao entre caixa central e aparelhos |
| **Acionador (Trigger)** | Define ONDE e QUANDO a tag dispara | Interruptor — quando/onde ligar |
| **Variavel** | Modificador que refina condicoes do acionador | Sensor — so liga quando determinada pessoa entrar |

**Formula mental:** Tag (O QUE) + Acionador (ONDE/QUANDO) + Variavel (QUAL/COMO) = Rastreamento completo

### 1.2 Estrutura Hierarquica

```
CONTA (nivel mais alto)
  |
  +-- CONTAINER (caixa de ferramentas — 1 por projeto)
        |
        +-- WORKSPACE (area de configuracao)
              |
              +-- Tags
              +-- Acionadores
              +-- Variaveis
```

### 1.3 Criar Conta no GTM

1. Acessar Google Tag Manager no navegador (tagmanager.google.com)
2. Clicar em "Criar conta"
3. Nome da conta (ex: nome do negocio)
4. Pais: Brasil
5. Container: selecionar **"Web"**
6. Nome do container (dica: separar por projeto — "Web Perpetual", "Web Lancamento")
7. Aceitar termos > Criar

### 1.4 Instalar GTM no Site

**Via WordPress (plugin WPCode):**
1. Instalar plugin WPCode (ou "Insert Headers and Footers")
2. Menu lateral > Cabecalho e Rodape
3. Copiar codigo **HEAD** do GTM > Colar no campo "Cabecalho"
4. Copiar codigo **BODY** do GTM > Colar no campo "Corpo"
5. Salvar alteracoes

**Via GreatPages:**
1. Configuracoes > Integracoes > Google Tag Manager
2. Copiar o codigo inteiro do GTM
3. Colar e ativar. Salvar.

**Plataformas de venda (Hotmart, Eduzz):**
- Geralmente so precisa do **ID** do GTM (formato GTM-XXXXXX), nao o codigo completo

### 1.5 Configurar Tag de PageView do Facebook

1. Tags > Novo
2. Nome: **"FB PageView Pixel01"**
3. Configuracao da tag > Modelos > Pesquisar "Facebook Pixel" > Adicionar
4. Inserir ID do Pixel (copiar do Gerenciador de Eventos)
5. Acionador: **All Pages** (todas as paginas)
6. Salvar

### 1.6 Configurar Tag de Lead do Facebook

1. Tags > Novo
2. Nome: **"FB Evento Lead Pixel1"**
3. Configuracao da tag > Facebook Pixel > Evento: Lead
4. Acionador: NAO usar All Pages. Escolher:
   - **Opcao A:** "Exibicao de pagina" > Paginas especificas > Page Path contem **"obrigado"**
   - **Opcao B:** "Envio de formulario" (Form Submit) com Form ID especifico
5. Salvar

> **AVISO:** A URL da pagina de obrigado DEVE conter "obrigado" (ou outro padrao consistente) no path pro acionador funcionar.

### 1.7 Configurar Evento por Clique em Botao (ex: WhatsApp)

Cenario: paginas sem formulario, botao direto pro WhatsApp. Quer trackear quem clicou.

1. **Identificar o texto do botao:**
   - Na pagina, botao direito > Inspecionar
   - Encontrar o texto do botao no HTML (ex: "Conversar pelo WhatsApp")
   - Copiar o texto exato

2. **Criar a Tag:**
   - Tags > Nova > Configuracao: **HTML personalizado**
   - Colar script:
     ```html
     <script>
       fbq('track', 'Lead');
     </script>
     ```

3. **Criar o Acionador:**
   - Acionamento > Novo > **Apenas links**
   - "Alguns cliques em links"
   - Variavel: **Click Text** contem **"Conversar pelo WhatsApp"**

4. **Refinar por pagina (opcional):**
   - Adicionar condicao: **Page Path** contem URL da pagina especifica

5. **Nomear:** "Click Test | Contem | Conversar pelo WhatsApp"
6. Salvar

### 1.8 Criar Variaveis Permanentes

1. Variaveis > Definidas pelo usuario > Nova
2. Tipo: **Permanente**
3. Nome: "Pixel Facebook 1"
4. Valor: ID do pixel
5. Salvar

**Uso:** Nas tags, ao inves de copiar/colar o ID toda vez, usar a variavel. Criar pra TODOS os codigos (Facebook, Google Ads, Analytics).

### 1.9 Testar e Publicar

> **REGRA CARDINAL R7:** SEMPRE testar (Visualizar/Preview) ANTES de publicar.

> **REGRA CARDINAL R18:** Sem clicar em "Enviar" e "Publicar", as configuracoes NAO ficam ativas — mesmo que funcionem no modo de teste.

**Fluxo:**
1. Clicar em **"Visualizar"** (abre modo Debug)
2. Inserir URL do site > Testar
3. Navegar pelo site — verificar se tags disparam nos momentos corretos
4. Tag Assistant mostra: lado esquerdo = tags acionadas, lado direito = nao acionadas
5. Se tudo OK: voltar e clicar em **"Enviar"**
6. Dar nome a versao (ex: "V2 - Facebook Ads acionadores de captura")
7. **Publicar**

Cada publicacao cria uma **versao numerada**. Se algo der errado, pode voltar pra versao anterior.

### Validacao GTM

- [ ] Conta e container criados
- [ ] Codigo GTM instalado no site (HEAD + BODY)
- [ ] Variavel permanente com ID do Pixel
- [ ] Tag de PageView configurada (All Pages)
- [ ] Tag de Lead configurada (pagina de obrigado)
- [ ] Tags adicionais conforme necessidade
- [ ] Modo Visualizar testado com sucesso
- [ ] Pixel Helper mostra eventos corretos
- [ ] Versao nomeada e publicada

### Extensoes obrigatorias pra GTM

| Extensao | O que faz |
|----------|-----------|
| **Facebook Pixel Helper** | Verifica pixel do Facebook no site |
| **Tag Assistant (Google)** | Verifica GTM, GA4, Google Ads — "Pixel Helper do Google" |

### Se travou

Tira print da tela com o modo Visualizar aberto e manda aqui. Vou te dizer se a tag ta disparando certo.

### Referencias GTM

- [Google Tag Manager — Site oficial](https://tagmanager.google.com)
- [Stape — CAPI Setup via GTM](https://stape.io/blog/how-to-set-up-facebook-conversion-api)

---

## 2. Contingencia e Seguranca de Ativos

**O que e:** Estrutura de seguranca contra bloqueios repentinos da Meta. Ter backups de TODOS os ativos (perfis, BMs, contas) pra continuar anunciando se algo cair.

**Quando configurar:** DEPOIS do setup basico. Idealmente nas primeiras semanas de operacao.

> **REGRA CARDINAL R10:** Todo mundo precisa de contingencia, NAO so nichos black/grey. O DEC (Deep Entity Classification) bloqueia qualquer um.

**Instrutor:** Dairo Junior — "E se proteger do sem vergonha do Chiuzuki quando ele quer bloquear a gente."

### 2.1 Por que e urgente

> "Empresas quase faliram por nao ter contingencia. Ficar sem anunciar mina faturamento."

O risco NAO e so pra nichos proibidos. A IA do Facebook (DEC) bloqueia por:
- Atividade incomum (gastar muito rapido em conta nova)
- Conteudo sinalizado automaticamente
- Comportamento do perfil administrador
- Cascata: se derruba um perfil, pode derrubar TODOS que fizeram acoes recentes na BM

### 2.2 Contingencia de Perfil — O Ativo Principal

> **REGRA CARDINAL R11:** "O ativo principal (perfil) determina a qualidade de TODOS os outros ativos." Perfil ruim = BM ruim = contas ruins = pontuacao ruim.

**O problema:** Um unico administrador gerenciando tudo. Se perde o perfil, perde TUDO.

**Solucao: 3-4 perfis ADM backup**

| Regra | Detalhe |
|-------|---------|
| Pelo menos 3-4 perfis ADM backup | Obrigatorio |
| Priorizar perfis REAIS | Tia, primo, prima que nao usa Facebook |
| Perfis reais > perfis farmados | Duram mais tempo, mais confiaveis |
| Preco justo por perfil real | R$ 30 a R$ 100 |
| Perfil criador ISOLADO | Nao conectado como ADM ativo nas BMs |

**Risco de cascata:** Se todos os perfis que fizeram acoes recentes na BM caem ao mesmo tempo, perde a estrutura. A IA derruba TODOS os perfis que fizeram as ultimas acoes.

> **AVISO:** Criar perfil novo no Chrome apos bloqueio: 99 de 100 caem (DEC detecta).

### 2.3 Contingencia de BM e Contas

**Estrutura ideal:**

```
1 perfil bom (real, antigo, com documento)
  |
  +-- BM 1
  |     +-- Conta de anuncio 1
  |     +-- Conta de anuncio 2
  |     +-- (ate 3-5 contas por BM boa)
  |
  +-- BM 2 (backup)
  |     +-- ...
  |
  +-- BM 3 (se nicho sensivel)
        +-- ...

+ 3-4 perfis backup como ADM em todas as BMs
+ Perfil criador ISOLADO
```

**Quantas estruturas ter:**

| Nicho | Estruturas |
|-------|-----------|
| Nao sensivel | 1-2 |
| Sensivel (emagrecimento, saude, renda extra) | 2 |
| Altamente sensivel (cripto, sexualidade, financas) | Multiplas |

**Limite: 3 BMs por perfil.**

### 2.4 Criar BMs de Qualidade — 2 Metodos

#### Metodo 1: Via Gerenciador de Comercio (PREFERIDO)

> "Facebook valoriza quem cria BM por ali porque incentiva lojas. BM criada por esse caminho tem PONTUACAO MAIOR."

1. Pesquisar "Gerenciador de comercio Facebook"
2. Clicar em "Criar sua loja"
3. Avancar
4. Criar nova pagina ou selecionar existente
5. Inserir **e-mail profissional** (dominio proprio)
6. Criar catalogo (pode ser de teste)
7. Finalizacao de compra: "em outro site"
8. Pais: Brasil
9. Concluir — BM criada automaticamente

Tags vermelhas podem aparecer — NAO e bloqueio. E o Facebook pedindo verificacao.

#### Metodo 2: Via WhatsApp Business

- Usar WhatsApp Business real pra criar BM
- BMs ja vem com limite mais alto
- Limitacao: um numero so cria uma BM

### 2.5 Aquecimento de Contas

Contas backup devem ser **aquecidas** — gastar gradualmente antes de precisar.

| Cenario | Risco |
|---------|-------|
| Conta nova que NUNCA anunciou | Bloqueio por "atividade incomum" |
| Conta de perfil bom, ja aquecida | Pode subir com qualquer verba |

### 2.6 E-mail Profissional — Impacto no Score

> **REGRA CARDINAL R14:** Usar e-mail profissional (dominio proprio) em TUDO no Facebook.

| Tipo | Pontuacao |
|------|-----------|
| **Profissional** (nome@seudominio.com.br) | Alta — empresa seria |
| **Gratuito** (@gmail, @hotmail) | Inferior — "ate robo cria" |

**Dica:** Ter varios dominios = varios e-mails profissionais. Plataforma sugerida: Hostinger (dominio gratis, 50-100 contas de e-mail).

### Validacao Contingencia

- [ ] 3-4 perfis reais como ADM backup
- [ ] Perfil criador isolado
- [ ] Pelo menos 1 BM backup criada (via Gerenciador de Comercio)
- [ ] E-mail profissional em todas as BMs
- [ ] Contas de anuncio nas BMs backup
- [ ] Contas backup aquecidas
- [ ] NAO verificou identidade proativamente
- [ ] Informacoes da empresa preenchidas nas BMs backup

### Se travou

Tira print da tela e manda aqui. Se aparecer tag vermelha na BM nova, NAO entre em panico — e verificacao normal.

---

## 3. Formularios de Lead (Lead Forms)

**O que e:** Formularios de captura DENTRO do Facebook/Instagram — sem precisar de site. O usuario preenche sem sair da plataforma.

**Quando usar:**

| Cenario | Recomendacao |
|---------|-------------|
| Quem NAO tem site | Excelente alternativa |
| Negocios locais | Forte candidata (investimento baixo) |
| Prestadores de servico | Ideal pra qualificacao |
| Teste A/B vs site | Pra ver se converte melhor |
| Lancamentos/infoprodutos em volume | NAO ideal |

### 3.1 Criar Campanha de Formulario

**Nivel Campanha:**
1. Objetivo: **Leads**
2. Configuracao manual
3. Nome descritivo

**Nivel Conjunto:**
1. Escolher **"Formularios instantaneos"** (nao "site")
2. Orcamento e publico iguais a campanhas tradicionais

**Nivel Anuncio:**
1. Criacao normal (imagem, texto)
2. Destino: **formulario instantaneo**

### 3.2 Configurar o Formulario — 5 Secoes

#### Objetivo do formulario

> **REGRA:** Sempre escolher **"Mais volume"**. Nunca "Maior intencao" ou "Criativo avancado" — diminuem MUITO o alcance.

#### Secao 1: Apresentacao/Saudacao

- Imagem de fundo opcional
- Copy forte: headline + chamada pra acao
- Formato: paragrafo ou lista

#### Secao 2: Perguntas (OPCIONAL — so pra high-ticket)

| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| Multipla escolha | Opcoes pre-definidas | "Qual sua renda?" |
| Perguntas abertas | Campo livre | "O que espera do tratamento?" |
| Condicionais | Mudam conforme resposta anterior | "Em quanto tempo quer comprar?" |

**Quando usar perguntas:**
- High-ticket (tratamento R$10k+, imobiliaria, concessionaria): SIM
- Infoproduto / volume de leads: NAO

#### Secao 3: Dados de Contato

- Sempre pedir: **email + telefone** (min 1 obrigatorio)

> **Hack:** Usar campo **"email comercial"** ao inves de "email" pra EVITAR auto-preenchimento. Forca a pessoa a digitar manualmente. Melhora qualidade do lead.

#### Secao 4: Politica de Privacidade

- Link da politica (obrigatorio pelo Facebook)
- **Aviso personalizado RECOMENDADO:**
  - "Ainda nao terminou!"
  - "Falta apenas mais um passo"
  - "Clique no botao azul para avancar"

> **Motivo:** Muitas pessoas param nesta tela achando que ja acabou. Muitos leads se perdem aqui.

#### Secao 5: Finalizacao

| Destino | Uso |
|---------|-----|
| **Site** | Link pra pagina, grupo WhatsApp (wa.me/numero) |
| **Download** | E-book, material digital |
| **Telefone** | Fazer chamada diretamente |

**Configuracoes finais:**
- Idioma: ajustar pro pais
- Compartilhamento: **SEMPRE aberto**

### 3.3 Dois Modelos de Formulario

**Modelo 1: Simples (volume)**
```
Saudacao (copy forte)
  → Dados de contato (email + telefone)
    → Politica de privacidade + aviso "nao terminou"
      → Finalizacao (link WhatsApp/download)
```
Pra: captura em volume, workshops, iscas digitais.

**Modelo 2: Qualificatorio (high-ticket)**
```
Saudacao (copy forte)
  → Perguntas de qualificacao
    → Dados de contato (email + telefone)
      → Politica de privacidade + aviso "nao terminou"
        → Finalizacao (link WhatsApp/telefone)
```
Pra: imobiliaria, concessionaria, tratamentos caros, consultorias.

### 3.4 Integracao dos Leads

| Metodo | Custo | Complexidade | Destino |
|--------|-------|-------------|---------|
| **Zapier** | Pago | Baixa | HubSpot, ActiveCampaign, qualquer CRM |
| **Google Sheets** | Gratuito | Baixa | Planilha (conexao nativa do Facebook) |
| **Webhooks (Make/N8N)** | Variavel | Alta | Qualquer sistema |

Download manual em CSV sempre possivel.

### Validacao Formularios

- [ ] Campanha com objetivo Leads
- [ ] Conjunto com "Formularios instantaneos"
- [ ] Objetivo do formulario: "Mais volume"
- [ ] Saudacao com copy forte
- [ ] Dados de contato: email + telefone
- [ ] Campo "email comercial" (nao "email")
- [ ] Politica de privacidade com aviso "nao terminou"
- [ ] Finalizacao com destino configurado
- [ ] Compartilhamento ABERTO
- [ ] Integracao testada (lead teste recebido)

### Se travou

Tira print do formulario em construcao e manda aqui. Vou te guiar secao por secao.

---

## 4. Eventos Avancados e Conversoes Personalizadas

**O que e:** Rastreamento granular alem dos eventos padrao. Permite separar acoes diferentes que cairiam no mesmo evento.

**Quando configurar:** Quando o usuario tem multiplos produtos, multiplas paginas de captura, ou precisa de dados mais granulares.

### 4.1 Conversoes Personalizadas (Decupagem de Dados)

Diferente de eventos personalizados, conversoes personalizadas sao **filtros criados DENTRO do gerenciador** que decupam eventos padrao por URL ou Content ID. NAO precisam instalar nada no site.

**Exemplo:** Purchase marca 80 vendas de todos os produtos. Conversao personalizada "Metodo Aureo" filtra so vendas desse produto (Content ID = 0930).

> "Etiqueta principal = todas as compras. Etiqueta personalizada = compras do produto X."

**Uso pratico:** Aparece como coluna no painel de campanhas — saber qual campanha vendeu qual produto.

**Passo a passo:**
1. Gerenciador de eventos > Pixel > Conversoes personalizadas
2. Criar nova
3. Nome descritivo (ex: "Purchase - Metodo Aureo")
4. Evento base: Purchase
5. Filtro: URL contem "obrigado-aureo" OU Content ID = 0930
6. Criar

### 4.2 Eventos de Retargeting Especifico

Com pixel + eventos personalizados, criar publicos ultra-especificos:

| Cenario | Evento | Publico resultante |
|---------|--------|--------------------|
| Assistiu aula gratuita | Evento personalizado "Assistiu Aula" | Remarketing so pra quem assistiu |
| Baixou ebook | Evento personalizado "Baixou Ebook" | Reimpactar com oferta relacionada |
| Visitou pagina de produto especifico | Conversao personalizada por URL | Remarketing do produto exato |

### Validacao Eventos Avancados

- [ ] Conversoes personalizadas criadas por produto (se multiplos produtos)
- [ ] Eventos personalizados configurados (se acoes especificas)
- [ ] Publicos de retargeting criados a partir dos eventos
- [ ] Colunas personalizadas adicionadas ao painel de campanhas

---

## 5. Microsoft Clarity

**O que e:** Ferramenta gratuita da Microsoft que mostra heatmaps (onde pessoas clicam) e gravacoes de sessao (replay do que o usuario fez no site).

**Quando usar:** Pra entender comportamento no site — onde clicam, onde param, onde abandonam. Complementa dados do Pixel.

### Passo a passo (via GTM)

1. Acessar clarity.microsoft.com
2. Criar novo projeto > Inserir URL do site
3. Opcao de instalacao: **Conectar com Google Tag Manager**
4. Selecionar conta GTM > Container
5. Publicar automaticamente

### Sem GTM

1. Copiar codigo do Clarity
2. Colar no `<head>` do site (mesmo processo do Pixel)

### O que analisar

| Recurso | O que mostra |
|---------|-------------|
| **Heatmap** | Areas quentes (mais clicadas) e frias (ignoradas) |
| **Session Recording** | Replay completo da navegacao do usuario |
| **Scroll Depth** | Ate onde as pessoas rolam a pagina |

### Validacao Clarity

- [ ] Projeto criado no Clarity
- [ ] Codigo instalado (via GTM ou manual)
- [ ] Sessoes sendo gravadas (verificar apos 24h)

---

## Glossario Avancado

| Termo | Definicao |
|-------|-----------|
| **GTM (Google Tag Manager)** | Central de gerenciamento de codigos do site. "Caixa central de luz" |
| **Tag** | Integracao entre site e plataforma. Contem codigo + evento |
| **Acionador (Trigger)** | Define ONDE e QUANDO a tag dispara. "Interruptor" |
| **Variavel (GTM)** | Modificador do acionador. Refina condicoes |
| **Container** | Caixa de ferramentas dentro da conta GTM. Um por projeto |
| **Workspace** | Area de trabalho onde se configura tags/acionadores/variaveis |
| **Click Text** | Variavel que contem o texto do elemento clicado |
| **Page Path** | Variavel que contem o caminho da URL apos o dominio |
| **Tag Assistant** | Extensao Chrome pra verificar GTM, GA4, Google Ads |
| **DEC (Deep Entity Classification)** | IA do Facebook que classifica e bloqueia contas/perfis |
| **Score/Pontuacao** | Nivel de confianca que o Facebook atribui a perfis e ativos |
| **Perfil farmado** | Perfil falso criado artificialmente (inferior a real) |
| **Aquecimento** | Gastar gradualmente em contas novas pra evitar bloqueio |
| **Nichos sensiveis** | Emagrecimento, saude, renda extra, cripto, sexualidade, financas |
| **Formulario instantaneo** | Formulario de captura dentro do Facebook/Instagram, sem site |
| **Conversao personalizada** | Filtro que decupa eventos padrao por URL ou Content ID |
| **Clarity** | Ferramenta Microsoft de heatmap e gravacao de sessao |
| **Gerenciador de Comercio** | Ferramenta do Facebook pra criar lojas — caminho preferido pra BMs com melhor score |

---

## Regras Cardinais Avancadas

| # | Regra | Dominio |
|---|-------|---------|
| R7 | SEMPRE testar (Visualizar/Preview) antes de publicar no GTM | GTM |
| R10 | Todo mundo precisa de contingencia, nao so nichos black | Contingencia |
| R11 | O ativo principal (perfil) determina a qualidade de TODOS os outros ativos | Contingencia |
| R14 | Usar e-mail profissional (dominio proprio) em tudo no Facebook | Contingencia |
| R18 | Sem publicar ("Enviar"), alteracoes do GTM NAO ficam ativas | GTM |
| — | Pelo menos 3-4 perfis ADM backup (reais, nao farmados) | Contingencia |
| — | Limite de 3 BMs por perfil | Contingencia |
| — | Objetivo do formulario: SEMPRE "Mais volume" | Formularios |
| — | Usar "email comercial" pra evitar auto-preenchimento | Formularios |
| — | Aviso "nao terminou" na tela de politica de privacidade | Formularios |

---

*KB criada em 2026-04-09. Fonte: KB ETL Setup Trafego Andromeda (VOL-03, VOL-05, VOL-06) — ETLmaker v3.0. Complementa a KB setup-completo-meta-ads-kb.md.*
