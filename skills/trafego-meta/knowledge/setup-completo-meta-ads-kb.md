# Setup Completo Meta Ads — KB Definitiva

> **Versao:** 1.0 | **Data:** 2026-04-08
> **Fonte:** Merge inteligente de KB Trafego Meta Ads + KB ETL Setup Trafego Andromeda + Meta API Reference + Pesquisa atualizada (2025-2026)
> **Uso:** Agente `andromeda-chief` guiando usuario leigo do zero ate conta pronta pra anunciar + conectada via API

---

## Objetivo

Pegar o usuario do **ZERO ABSOLUTO** — nunca anunciou na vida, nao sabe o que e BM, nao tem nada configurado — e guia-lo passo a passo ate ter:

- Business Manager criado e configurado
- Pagina do Facebook do negocio criada e apresentavel
- Instagram profissional conectado a Pagina e ao BM
- WhatsApp conectado
- Conta de anuncios criada com pagamento configurado
- Permissoes corretas em todos os assets
- Verificacao da empresa com CNPJ submetida
- Pixel instalado com eventos configurados
- CAPI (API de Conversoes) ativa e deduplicada
- TODOS os publicos do Metodo Andromeda criados
- Meta App criado e em modo Live
- System User com token permanente gerado e salvo
- **CONTA PRONTA PRA ANUNCIAR E CONECTADA AO CLAUDE CODE**

---

## Indice

1. [Step 1: Criar Business Manager (BM)](#step-1-criar-business-manager-bm)
2. [Step 2: Criar Pagina do Facebook](#step-2-criar-pagina-do-facebook)
3. [Step 3: Vincular Instagram Profissional](#step-3-vincular-instagram-profissional)
4. [Step 4: Criar Conta de Anuncios](#step-4-criar-conta-de-anuncios)
5. [Step 5: Atribuir Permissoes nos Assets](#step-5-atribuir-permissoes-nos-assets)
6. [Step 6: Verificacao BM com CNPJ](#step-6-verificacao-bm-com-cnpj)
7. [Step 7: Pixel + Eventos + CAPI](#step-7-pixel--eventos--capi)
8. [Step 8: Criar Todos os Publicos do Andromeda](#step-8-criar-todos-os-publicos-do-andromeda)
9. [Step 9: Conexao API Completa](#step-9-conexao-api-completa)
10. [Step 10: Checklist Final Consolidado](#step-10-checklist-final-consolidado)
11. [Comportamento do Agente](#comportamento-do-agente)
12. [Glossario Essencial](#glossario-essencial)
13. [Regras Cardinais do Setup](#regras-cardinais-do-setup)

---

## Step 1: Criar Business Manager (BM)

**O que e:** O Business Manager (BM) — agora chamado "Portfolio Empresarial" pela Meta — e o painel de controle central pra quem usa Facebook e Instagram de forma profissional. Dentro dele ficam TODOS os ativos: contas de anuncio, paginas, pixels, Instagram, WhatsApp.

**Por que precisa:** Sem BM nao tem conta de anuncios profissional, nao tem pixel, nao tem CAPI. Fica limitado a impulsionar posts pelo botao do Instagram. Pra trafego pago de verdade, o BM e obrigatorio. Um CNPJ = uma BM.

### 1.1 Pre-requisito: Conta pessoal do Facebook

Se o usuario nao tem conta no Facebook:

1. Acessar facebook.com
2. Clicar em "Criar nova conta"
3. Preencher: nome, sobrenome, data de nascimento, genero, celular ou e-mail, senha
4. Clicar em "Cadastre-se"
5. Verificar codigo enviado por e-mail ou celular

**IMPORTANTE:** Usar Facebook pessoal REAL. Criar BM com Facebook fake = Meta bane.

### 1.2 Criar o Business Manager

1. Pesquisar "Facebook Ads" no Google
2. Clicar em "Meta for Business" ou "Gerencie seus anuncios na Meta"
3. Clicar em "Acessar o gerenciador de anuncios"
4. Fazer login com a conta do Facebook
5. Aceitar politicas de privacidade e discriminacao
6. Clicar em "Comecar"
7. Selecionar o setor da empresa (ex: Educacao)
8. Avancar — BM criada

> **Nota:** Botoes podem aparecer em posicoes diferentes — o Meta faz testes A/B de design. Nao se preocupar se a interface parecer diferente de tutoriais.

### 1.3 Preencher Informacoes da Empresa

1. Configuracoes do negocio > Informacoes da empresa
2. Clicar em "Editar"
3. Preencher: razao social, pais, endereco, cidade, site, identificacao fiscal (CNPJ)
4. Clicar em "Salvar"

**Por que:** Verificar a empresa faz o Facebook tratar como empresa confiavel — evita bloqueios, libera funcionalidades extras (API, integracoes oficiais).

### 1.4 Autenticacao de Dois Fatores (2FA)

1. Configuracoes do negocio > Autenticacao de dois fatores
2. Marcar **"Todos"** para exigir 2FA de todos os usuarios
3. Configurar app autenticador no celular

**Por que:** Aumenta seguranca e faz Facebook liberar verificacoes e opcoes mais rapido.

### 1.5 Adicionar Forma de Pagamento

1. Ir em "Todas as ferramentas" > Cobranca e pagamentos
2. Clicar em "Adicionar forma de pagamento"
3. Opcoes: cartao de credito/debito, PIX, boleto bancario
4. Para cartao: preencher nome, numero, CVV, validade, CPF, dados pessoais
5. Confirmar pagamento

**SEM FORMA DE PAGAMENTO, NAO E POSSIVEL CRIAR CAMPANHAS.**

### Validacao

- [ ] BM aparece em business.facebook.com ao logar
- [ ] Nome da empresa esta correto
- [ ] E-mail verificado
- [ ] Informacoes da empresa preenchidas
- [ ] 2FA habilitado para todos
- [ ] Forma de pagamento configurada

### Erros comuns

- Criar BM com Facebook fake → Meta bane. Usar Facebook pessoal real
- Maximo 3 BMs por perfil do Facebook. Se atingiu o limite, outro perfil precisa criar
- Contas novas do Facebook podem ter restricao temporaria pra criar BM
- Esquecer de adicionar forma de pagamento → travar na hora de criar campanha

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar.

### Referencias

- [Meta Help Center — Criar portfolio empresarial (PT-BR)](https://www.facebook.com/business/help/1710077379203657)
- [Nuvemshop — 7 passos pra criar BM](https://atendimento.nuvemshop.com.br/pt_BR/como-criar-uma-conta-no-gerenciador-de-negocios-do-facebook)
- [Shopify Brasil — Guia completo BM + Page + Ads](https://www.shopify.com/br/blog/gerenciador-de-negocios-da-meta-facebook)
- [Video: How To Set Up Meta Business Manager 2025](https://youtube.com/watch?v=WIeZNIzKlMo)

---

## Step 2: Criar Pagina do Facebook

**O que e:** A Pagina do Facebook e a identidade publica do negocio na Meta. Todos os anuncios rodam em nome dessa Pagina — e ela que aparece como "patrocinado por". Sem Pagina, nao tem anuncio.

**Por que precisa:** A Pagina e obrigatoria pra vincular Instagram, WhatsApp e rodar campanhas. E a "cara" do negocio nas plataformas Meta.

### Passo a passo

1. Ao finalizar criacao da BM, aparece opcao de criar Pagina — ou dentro do BM: Configuracoes > Contas > Paginas > Adicionar > Criar nova
2. Nome da Pagina: usar nome do negocio ou marca
3. Categoria: escolher a mais adequada (Educacao, Consultoria, Coach, etc.)
4. Foto de perfil: opcional agora (pode pular e adicionar depois)
5. Clicar em "Criar pagina"

A pagina sera automaticamente associada a BM. Pode criar mais de uma pagina na mesma BM.

### Validacao

- [ ] Pagina aparece na lista de Paginas dentro do BM
- [ ] Nome correto e categoria definida
- [ ] Foto de perfil e capa adicionadas (pode ser depois, mas precisa estar apresentavel antes de anunciar)

### Erros comuns

- Pagina sem foto/capa → anuncios passam menos confianca
- Nome generico demais → dificil de encontrar e reconhecer
- Nao precisa ser perfeita agora, mas precisa estar apresentavel

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar.

### Referencias

- [Meta Help Center — Adicionar Pagina ao portfolio](https://www.facebook.com/business/help/720478807965744)
- [mLabs — Pagina + Portfolio junto](https://ajuda.mlabs.com.br/en/articles/9362315-creating-a-facebook-page-and-business-portfolio)
- [Video: Ultimate Facebook Business Page Tutorial 2025](https://youtube.com/watch?v=XbAkJKMVovs)

---

## Step 3: Vincular Instagram Profissional

**O que e:** Vincular o Instagram ao BM permite que anuncios aparecam no Instagram (Feed, Stories, Reels) e que tudo seja gerenciado de um lugar so. O Instagram precisa ser conta profissional (Business ou Creator) — conta pessoal nao funciona.

**Por que precisa:** Sem Instagram vinculado, anuncios so aparecem no Facebook. A maioria dos usuarios esta no Instagram.

> **REGRA CARDINAL R13:** Instagram vincula na **FANPAGE**, NAO na BM. Motivo: se a BM for bloqueada, voce NAO perde o Instagram. Antes era vinculado a BM e ficava preso em caso de bloqueio. Agora, via fanpage, pode desconectar e reconectar facilmente.

### Parte 0: Criar Instagram do negocio (se nao tem)

> Perguntar: "Voce ja tem um Instagram que quer usar pro negocio, ou prefere criar um novo?"

Se nao tem:
1. Baixar o app Instagram no celular
2. Criar conta nova com e-mail da empresa
3. Escolher um @ profissional (nome da marca, metodo ou nome proprio)
4. Preencher bio basica — nome, o que faz, pra quem
5. Colocar foto de perfil profissional

### Parte A: Converter pra conta profissional (se necessario)

1. No app do Instagram: Configuracoes > Conta > Mudar para conta profissional
2. Escolher categoria (1000+ opcoes)
3. Selecionar **"Empresa"** (Business)
4. Conta fica publica automaticamente

### Parte B: Vincular a Pagina do Facebook

1. No Instagram: Configuracoes > Conta > Contas vinculadas > Facebook
2. Selecionar a Pagina do negocio criada no Step 2
3. Confirmar vinculacao

> Um Instagram so conecta a UMA Pagina por vez.

### Parte C: Adicionar ao Business Manager

1. No BM: Configuracoes > Contas > Contas do Instagram > Adicionar
2. Fazer login no Instagram quando solicitado
3. Confirmar permissoes

### Parte D: Conectar WhatsApp a Pagina

1. Ir em Painel Profissional > Contas Vinculadas
2. Clicar em WhatsApp > Conectar
3. Informar numero do WhatsApp
4. Clicar em "Enviar codigo"
5. Inserir codigo recebido no celular
6. Confirmar
7. Opcional: adicionar botao de WhatsApp na pagina

### Validacao

- [ ] Instagram aparece como conta profissional (Business)
- [ ] Instagram vinculado a Pagina do Facebook do negocio (NAO a BM)
- [ ] Instagram aparece como asset dentro do BM
- [ ] WhatsApp conectado a pagina

### Erros comuns

- Tentar vincular conta pessoal (nao profissional) → nao funciona
- Vincular Instagram direto na BM em vez de na Pagina → perde acesso se BM bloquear
- Esquecer de vincular a Pagina ANTES de adicionar ao BM

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar.

### Referencias

- [Instagram Help Center — Conta profissional (PT-BR)](https://help.instagram.com/502981923235522?locale=pt_BR)
- [Leadsie — 4 metodos pra vincular (2026)](https://www.leadsie.com/blog/link-instagram-facebook-page)
- [Nuvemshop — Conectar Instagram no Facebook 2026](https://www.nuvemshop.com.br/blog/como-conectar-o-instagram-no-facebook/)
- [Mirago — Instagram no Gerenciador de Negocios (PT-BR)](https://www.mirago.com.br/instagram-gerenciador-negocios/)

---

## Step 4: Criar Conta de Anuncios

**O que e:** A conta de anuncios e onde se cria e paga pelas campanhas. Fica dentro do Business Manager. BM e o escritorio, conta de anuncios e o caixa. E como uma conta bancaria — toda movimentacao de campanhas acontece dentro dela.

**Por que precisa:** Sem conta de anuncios, nao e possivel criar campanhas. E o container onde tudo roda.

### Modelo 2-Contas (Metodo Andromeda)

O Metodo Andromeda usa 2 contas de anuncio na MESMA BM:

| Conta | Objetivo | Postura |
|-------|----------|---------|
| **Escala** | Publicos e criativos VENCEDORES. Escala vertical | Conservadora: poucas campanhas, pouca mexida |
| **Teste** | Experimentacao livre. Liberdade total | Agressiva: duplicar, ousar, testar |

**Quantas contas ter:**

| Investimento mensal | Contas escala | Contas teste | Total |
|---------------------|---------------|--------------|-------|
| Acima de R$ 5.000/mes | 2 | 2 | 4 |
| Abaixo de R$ 5.000/mes | 1 | 1 | 2 |

**Se NAO puder ter 2 contas:** Continua com 1. Cria UMA CAMPANHA dentro chamada "campanha de escala" e aplica as regras do Andromeda nela. "Nada te impede de usufruir dos beneficios da IA do Andromeda usando a mesma conta."

### Passo a passo

1. Configuracoes do negocio > Conta de anuncio > Adicionar
2. Tres opcoes aparecem: Adicionar existente / Solicitar transferencia / **Criar nova** (selecionar esta)
3. Nome da conta (ex: "Escala - [Nome do Negocio]" ou "Teste - [Nome do Negocio]")
4. Fuso horario: **America/Sao Paulo**
5. Moeda: **Real Brasileiro**

> **REGRA CARDINAL R12:** Fuso horario e moeda NAO podem ser alterados depois de configurados. Conferir ANTES de confirmar.

6. Avancar > Selecionar "Minha empresa"
7. Criar
8. Atribuir permissoes: selecionar usuario e nivel de acesso (gerenciar campanhas, ver desempenho, acesso geral)
9. Guardar o numero de ID da conta — pode ser solicitado pelo suporte

**Limite inicial:** Facebook libera de 1 a 3 contas inicialmente. A medida que anuncia e gasta, o limite aumenta.

### Se precisar de mais contas: Ticket no Suporte

**Mensagem modelo:**
> "Ola, eu gostaria que fosse liberado para mim a permissao de criar uma nova conta de anuncios, porque eu nao consigo, ja estabeleci o meu limite. O objetivo pelo qual eu quero uma nova conta de anuncios e que eu quero aumentar os meus investimentos. Para isso eu quero poder fazer novos testes em uma conta diferente, portanto peco que liberem uma conta para mim."

Taxa de aprovacao: ~70%. Se negaram: fechar ticket, esperar 1 dia, abrir outro. Repetir ate conseguir.

### Validacao

- [ ] Conta de anuncios aparece na lista dentro do BM
- [ ] Fuso horario: America/Sao_Paulo
- [ ] Moeda: BRL (Real Brasileiro)
- [ ] ID da conta armazenado em local seguro
- [ ] Segunda conta criada (escala ou teste) se possivel

### Erros comuns

- Fuso horario errado → relatorios com horarios baguncados, IRREVERSIVEL
- Criar varias contas no inicio → levanta bandeira na Meta. Comecar com 1-2
- Esquecer de guardar o ID da conta

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar.

### Referencias

- [Meta Help Center — Criar conta de anuncios no BM (PT-BR)](https://pt-br.facebook.com/business/help/407323696966570)
- [Good Pixel — Guia completo 2025](https://goodpixel.com.br/guia-completo-como-configurar-sua-conta-de-anuncios-no-meta-ads-passo-a-passo-2025/)

---

## Step 5: Atribuir Permissoes nos Assets

**O que e:** Mesmo sendo dono de tudo dentro do BM, a Meta exige atribuicao explicita de permissoes em cada asset (Pagina, Conta de Anuncios, Instagram). Sem isso, pode ter tudo criado mas nao conseguir rodar anuncios.

**Por que precisa:** O erro nao e obvio — o usuario pode travar na criacao do anuncio sem entender por que. E sempre por falta de permissao.

### Passo a passo

1. No BM, ir em Configuracoes > Pessoas
2. Clicar no proprio nome/usuario
3. Atribuir **"Controle total"** nos assets:
   - Pagina do Facebook do negocio
   - Conta de anuncios (cada uma)
   - Conta do Instagram
4. Se tiver mais alguem que vai gerenciar (VA, gestor), adicionar e dar permissoes adequadas

### Roles por tipo de ativo

| Ativo | Roles disponiveis |
|-------|-------------------|
| Facebook Page | Admin, Editor, Moderator, Advertiser, Analyst |
| Conta de Anuncios | Admin, Advertiser, Analyst |
| Instagram | Full Control (Admin), Partial Access (Content, Messages, Ads, Insights) |

### Validacao

- [ ] Proprio nome aparece com "Controle total" ou "Admin" em cada asset
- [ ] Consegue criar rascunho de anuncio selecionando Pagina e Instagram
- [ ] Nenhum asset mostra "sem acesso" ou "permissao limitada"

### Erros comuns

- Achar que ser dono do BM ja da acesso automatico a tudo → nao da, precisa atribuir
- Dar permissao so na conta de anuncio e esquecer da Pagina/Instagram

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar.

### Referencias

- [WhiteBunnie — Assign Roles & Permissions (2025)](https://whitebunnie.com/blog/how-to-assign-roles-and-permissions-in-meta-business-manager/)
- [Extensao Digital — Estrutura de permissoes 2026](https://extensaodigital.com/meta-business-suite-2026/)

---

## Step 6: Verificacao BM com CNPJ

**O que e:** Verificacao e provar pra Meta que a empresa e real. Enviar documentos (CNPJ, comprovante de endereco) e a Meta valida. Desbloqueia funcionalidades avancadas e da estabilidade a conta.

**Por que precisa:** Contas verificadas tem menos chance de bloqueio, limites maiores de gasto, acesso a funcionalidades avancadas (publicos especiais, CAPI completo). Mais confianca pro algoritmo.

**IMPORTANTE:** O usuario JA PODE ANUNCIAR enquanto espera a verificacao. Nao precisa travar aqui.

### Documentos necessarios

1. Cartao CNPJ (baixar em servicos.receita.fazenda.gov.br)
2. Contrato Social ou Alvara de Funcionamento
3. Comprovante de endereco em nome da empresa

### Passo a passo

1. No BM, ir em Configuracoes > Central de Seguranca > Verificacao da empresa
2. Selecionar pais: Brasil
3. Selecionar tipo de documento
4. Preencher: nome legal (**EXATAMENTE** como no CNPJ), numero do CNPJ, endereco, telefone
5. Enviar documentos (CNPJ + comprovante)
6. Escolher metodo de confirmacao: e-mail (precisa ser do mesmo dominio do site) ou telefone
7. Inserir codigo de verificacao recebido
8. Aguardar analise: 10 minutos a 14 dias uteis (media: 2-3 dias)

### Erros que causam REJEICAO

- Razao social digitada diferente do cartao CNPJ (ate acentos contam)
- Site sem CNPJ, razao social e endereco visiveis (Meta cruza dados com o site!)
- Documentos com baixa qualidade de imagem ou mal escaneados
- Endereco do comprovante diferente do endereco no CNPJ
- E-mail de confirmacao com dominio diferente do site da empresa
- CNPJ com situacao cadastral irregular na Receita Federal

### Validacao

- [ ] Verificacao submetida (status: "em analise" ou "verificada")
- [ ] Se aprovada: badge de verificacao aparece na Central de Seguranca

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar.

### Referencias

- [Meta Help Center — Sobre verificacao (PT-BR)](https://pt-br.facebook.com/business/help/1095661473946872)
- [Meta Help Center — Verificar empresa (PT-BR)](https://www.facebook.com/business/help/2058515294227817)
- [Whatsflow — Guia pratico + erros comuns](https://whatsflow.com.br/como-verificar-sua-empresa-na-meta-guia-pratico/)
- [SleekFlow — Troubleshooting verificacao](https://sleekflow.io/pt-br/blog/como-verificar-sua-empresa-no-facebook-business-manager)

---

## Step 7: Pixel + Eventos + CAPI

**O que e:** O Pixel e um codigo instalado no site que rastreia tudo — quem visita, quem clica, quem compra. A CAPI (API de Conversoes) envia os mesmos dados pelo servidor, contornando bloqueadores. Juntos, garantem rastreamento completo.

**Por que precisa:** Sem Pixel, o Facebook nao sabe se as campanhas estao funcionando. Sem rastreamento = sem otimizacao = dinheiro jogado fora.

> **REGRA CARDINAL R1:** UM pixel e melhor que varios. Um centraliza todo aprendizado. Pixels NAO conversam entre si. Excecao unica: produtos totalmente diferentes pra publicos totalmente diferentes.

### 7a: Criar o Pixel no Meta

1. Configuracoes do negocio > Todas as ferramentas > Gerenciador de eventos
2. Verificar se a conta de anuncios correta esta selecionada
3. Menu lateral > Conectar fontes de dados
4. Selecionar **"Web"**
5. Dar nome ao pixel (ex: nome do negocio)
6. Clicar em "Criar"
7. Opcoes de instalacao aparecem — selecionar **"Conectar manualmente"**
8. Selecionar **"API de conversoes e pixel da meta"** (navegador + servidor — SEMPRE esta opcao)
9. Selecionar tipo de negocio (educacao, e-commerce, etc.)
10. Selecionar eventos desejados: ViewContent, Lead, Purchase, InitiateCheckout, Contact
11. Configurar parametros por evento — **marcar TODOS**
12. Continuar > Verificacao final
13. Concluir

### 7b: Gerar e Armazenar Token + Pixel ID

1. Copiar e armazenar o **numero do Pixel** (ID de 15-16 digitos)
2. Ir em Configuracoes do pixel
3. Descer ate "API de conversoes"
4. Clicar em **"Gerar token de acesso"**
5. **COPIAR E ARMAZENAR** o token imediatamente em lugar seguro (1Password, gerenciador de senhas)

> **AVISO CRITICO:** O Facebook NAO armazena o token. Se perder, precisa gerar outro. Guardar IMEDIATAMENTE.

### 7c: Configurar Lista de Permissoes de Trafego

1. Descer ate o final da tela de configuracoes do pixel
2. Clicar em "Criar lista de permissoes"
3. Adicionar dominio (ex: seusite.com.br)
4. Confirmar

### 7d: Instalar Pixel Helper (extensao Chrome)

1. Pesquisar "Facebook Pixel Helper" no Google
2. Instalar extensao no Chrome
3. Fixar na barra de extensoes
4. Usar pra verificar se pixel esta instalado em qualquer pagina:
   - Icone verde com numero = funcionando
   - Icone amarelo = problema (ex: eventos duplicados)

### 7e: Instalar Pixel na Pagina de Vendas

**Escolher o caminho conforme sua plataforma:**

#### Caminho Hotmart

1. Hotmart > Selecionar produto > Ferramentas > Pixel de rastreamento
2. Selecionar Facebook e Instagram
3. Inserir **Pixel ID**
4. Avancar
5. Marcar TODAS as opcoes: Vendas realizadas, Visitas na pagina de pagamento, Visitas de produtos
6. Opcoes avancadas: todos os metodos de pagamento, valor real da venda
7. Continuar
8. Configuracao de pixel: selecionar **Web + Servidor (Token/API)**
9. Inserir **Token da API**
10. Clicar em **"Verificar token"** — deve ficar verde
11. Salvar

**CNAME para Hotmart (obrigatorio na primeira vez):**

1. No servidor do dominio (Cloudflare, Registro.br, HostGator, etc.)
2. Ir em DNS
3. Criar registro tipo CNAME:
   - **Nome:** `pixel.seudominio.com.br`
   - **Destino:** `pixel.hotmart.com`
4. Salvar
5. Aguardar propagacao: 2-4 horas tipicamente, podendo ir ate 72h
6. Facebook pede ate 8h pra gerar certificado, pode demorar ate 72h

> **OBRIGATORIO:** CNAME deve ser feito ANTES da verificacao do token na primeira configuracao. Uma vez feito, vale pra todos os produtos da Hotmart.

#### Caminho WordPress

1. Instalar plugin **PixelYourSite** (ou similar)
2. Habilitar "Conversao de API" e "Matching de conversao avancada"
3. Colar Pixel ID e Token da API nos campos correspondentes
4. Salvar

#### Caminho Pagina Propria

1. Copiar o snippet JavaScript do Pixel no Gerenciador de Eventos
2. Colar no `<head>` de todas as paginas do site

### 7f: Eventos — O que Instalar e Onde

> **REGRA CARDINAL R4:** Eventos devem estar na pagina de CONCLUSAO da acao, NUNCA na pagina da acao em si. Evento de cadastro na pagina de "Obrigado", NAO na pagina de captura.

**9 Eventos Padrao do Meta:**

| Evento | Quando dispara | Onde instalar |
|--------|---------------|---------------|
| **PageView** | Universal, em TODAS as paginas | Todo o site |
| **ViewContent** | Visualizacao de conteudo especifico | Pagina de captura/conteudo |
| **Lead** | Pessoa se cadastrou | Pagina de OBRIGADO do cadastro |
| **InitiateCheckout** | Acessou pagina de pagamento | Pagina de checkout |
| **Purchase** | Compra concluida | Pagina de OBRIGADO da compra |
| **Contact** | Entrou em contato | Pagina de contato/obrigado |
| **AddToCart** | Adicionou ao carrinho | Pagina de carrinho |
| **Search** | Fez pesquisa | Pagina de resultados |
| **Subscribe** | Se inscreveu | Pagina de confirmacao |

**Os 4 essenciais (funil basico):**

```
SITE → PageView (universal, em tudo)
  |
  v
PAGINA DE CAPTURA → ViewContent
  |
  v
OBRIGADO CADASTRO → Lead
  |
  v
CHECKOUT → InitiateCheckout
  |
  v
OBRIGADO COMPRA → Purchase
```

**Parametros:** Marcar TODOS os parametros para TODOS os eventos (FBC, FBP, valor, moeda, Content ID). Quanto mais dados, melhor o rastreamento.

### 7g: Eventos Personalizados (se necessario)

Eventos padrao sao acumulativos — "Lead" carrega TODOS os leads. Se precisa separar (ex: lead da aula vs lead do ebook), criar evento personalizado.

**Metodo 1 — Direto no Meta (conversao personalizada):**

1. Gerenciador de eventos > Selecionar pixel > Conversoes personalizadas
2. Clicar em "Criar uma conversao personalizada"
3. Configurar: Nome, Descricao, Fonte de dados (pixel), Evento base (ViewContent ou Lead)
4. Regra de URL: **"Contem"** + URL da pagina de obrigado
5. Valor de conversao: 1 (ou valor real)
6. Clicar em "Criar"

> **REGRA CARDINAL R17:** Sempre usar "Contem" (Contains) e NAO "Igual" (Match). Se usar Match sem barra final e o servidor abrir com barra, o evento NAO dispara.

**Metodo 2 — Via plugin WordPress:**

1. PixelYourSite > Aba Eventos > Add
2. Dar nome, configurar disparador e URL
3. Selecionar **"Customer Events"** (nao eventos padrao)
4. Nomear o evento e salvar

Se criou via plugin externo, Facebook pede verificacao de seguranca:
1. Gerenciador de eventos mostra triangulo vermelho
2. Clicar no aviso > "Analisar"
3. Selecionar evento > Avancar > **"Confirmar"** (NAO "Bloquear")

### 7h: CAPI (API de Conversoes)

**Pixel vs CAPI:**

| Aspecto | Pixel | CAPI |
|---------|-------|------|
| Via de envio | Navegador do usuario | Servidor |
| Qualidade do dado | Boa, mas sujeita a bloqueios | Dado puro, sem bloqueio |
| Instalacao | Simples (20-30 min) | Mais complexa |
| Quando usar | Sempre (base obrigatoria) | Recomendado pra todos; critico acima de R$ 50-100k/mes |

Se configurou Hotmart com "Web + Servidor (Token/API)" no Step 7e, a CAPI ja esta ativa.

**DEDUPLICACAO (CRITICO):** Usar o mesmo `event_id` no Pixel e na CAPI pra nao contar conversao 2 vezes. A Hotmart faz isso automaticamente quando se usa "Ambos". Se for implementacao manual, configurar deduplicacao.

**Meta target:** Event Match Quality acima de **6.0/10**.

### 7i: Verificacao Completa com Pixel Helper

Esta e a etapa mais importante do Step 7. O agente deve guiar o usuario pra garantir que TUDO esta funcionando antes de avancar.

#### Parte 1: Verificar com Facebook Pixel Helper (extensao Chrome)

1. Abrir o site/pagina de vendas no Chrome
2. Clicar no icone do **Pixel Helper** na barra de extensoes
3. Interpretar o resultado:

| O que aparece | Significado | O que fazer |
|---------------|-------------|-------------|
| **Icone verde + numero** | Pixel disparando corretamente. Numero = quantidade de eventos na pagina | Tudo certo. Seguir pra proxima pagina |
| **Icone amarelo + numero** | Problema detectado (geralmente evento duplicado) | Verificar se tem 2 plugins mandando o mesmo evento. Desabilitar o duplicado |
| **Icone cinza / sem numero** | Pixel NAO esta instalado nessa pagina | Verificar instalacao (Step 7e). Codigo ausente ou errado |
| **Icone com "!" vermelho** | Erro critico (pixel invalido ou bloqueado) | Verificar ID do pixel. Pode estar bloqueado pela Meta |

4. **Clicar no icone pra abrir detalhes.** Mostra:
   - Nome do evento (PageView, Lead, Purchase, etc.)
   - ID do pixel
   - Parametros enviados
   - Avisos/erros especificos

5. **Verificar CADA pagina do funil:**
   - **Home/pagina principal:** deve mostrar PageView
   - **Pagina de captura:** deve mostrar PageView + ViewContent
   - **Pagina de obrigado (cadastro):** deve mostrar PageView + Lead
   - **Pagina de checkout:** deve mostrar PageView + InitiateCheckout
   - **Pagina de obrigado (compra):** deve mostrar PageView + Purchase

6. **Se aparecer icone amarelo com "Duplicate Pixel" ou evento duplicado:**
   - Causa mais comum: plugin no WordPress E codigo manual no head — ambos disparando
   - Solucao: desabilitar UM dos dois (manter so o plugin OU so o codigo manual)

#### Parte 2: Testar via Gerenciador de Eventos do Facebook

1. Abrir Facebook > Gerenciador de Eventos > Selecionar o Pixel
2. Ir na aba **"Eventos de teste"**
3. Selecionar "Confirme se eventos do site estao configurados corretamente"
4. Inserir URL do site no campo
5. Clicar em **"Abrir site"** — abre aba nova
6. Navegar pelo site normalmente (acessar paginas, preencher formulario se tiver)
7. Voltar pro Gerenciador de Eventos
8. Verificar: eventos devem aparecer como **"Processado"** com timestamp

**Se eventos NAO aparecem no teste:**
- Verificar se Pixel Helper mostra verde no site (se nao, problema de instalacao)
- Verificar se o ID do pixel no site e o MESMO do Gerenciador de Eventos
- Se Hotmart: verificar se CNAME ja propagou (pode levar ate 72h)
- Se WordPress: verificar se plugin esta ativo e configurado

#### Parte 3: Verificar na Visao Geral do Pixel

1. No Gerenciador de Eventos > Pixel > Visao geral
2. Verificar se eventos estao chegando (barras/graficos)
3. **Nota:** Demora ate 30 minutos pra eventos aparecerem na visao geral. No modo teste, aparecem imediatamente.

#### Guia de troubleshooting pra screenshots

Se o usuario mandar print, verificar:

| O que olhar no print | O que significa |
|----------------------|-----------------|
| Pixel Helper verde com "PageView" | Base OK — pixel instalado |
| Pixel Helper verde mas sem "Lead" na pagina de obrigado | Evento Lead nao configurado nessa URL |
| Pixel Helper amarelo | Evento duplicado — ver qual plugin/codigo esta duplicando |
| Pixel Helper cinza | Pixel nao instalado — verificar codigo no `<head>` ou plugin |
| Gerenciador mostra "Nenhuma atividade" | Pixel criado mas nao instalado, ou CNAME pendente |
| Gerenciador mostra eventos mas "Nao correspondido" | Deduplicacao faltando ou event_id diferente entre Pixel e CAPI |

### Validacao

- [ ] Pixel criado (opcao "API + Pixel")
- [ ] Pixel ID e Token armazenados em local seguro
- [ ] Lista de permissoes de trafego configurada
- [ ] Pixel Helper instalado no Chrome
- [ ] Pixel instalado na pagina de vendas (Hotmart/WP/propria)
- [ ] CNAME configurado (se Hotmart): pixel.dominio → pixel.hotmart.com
- [ ] Eventos padrao configurados (PageView, ViewContent, Lead, InitiateCheckout, Purchase)
- [ ] Parametros marcados para todos os eventos
- [ ] CAPI ativa (Web + Servidor)
- [ ] Token verificado (icone verde na Hotmart)
- [ ] Deduplicacao ativa
- [ ] Pixel Helper mostra icone verde ao acessar site
- [ ] Eventos de teste mostram "Processado" no Facebook
- [ ] Sem eventos duplicados (sem icone amarelo)

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar. Se for problema de CNAME, pode demorar ate 72h pra propagar — nao e bug.

### Referencias

- [Meta Help Center — Configurar Pixel (PT-BR)](https://pt-br.facebook.com/business/help/952192354843755)
- [Meta Developers — Conversions API (PT-BR)](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started?locale=pt_BR)
- [Trafius — Pixel Meta Ads guia completo (2026)](https://trafius.com.br/blog/pixel-meta-ads-guia-completo)
- [Hotmart Help — Configurar Pixel do Facebook](https://help.hotmart.com/pt-br/article/115004826368/como-configurar-o-pixel-do-facebook-)
- [Cometly — CAPI Setup 2026](https://www.cometly.com/post/facebook-conversion-api-setup)
- [Video: Criar Pixel Facebook 2024 — Dataset (PT-BR)](https://www.youtube.com/watch?v=SxH-tdRpy48)

---

## Step 8: Criar Todos os Publicos do Andromeda

**O que e:** Publicos sao os grupos de pessoas pra quem os anuncios vao aparecer. O Metodo Andromeda exige a criacao de publicos especificos ANTES de comecar a anunciar — quentes, remarketing, exclusao e lookalike.

**Por que precisa:** Sem publicos criados, a campanha nao tem pra quem rodar. Criar todos de uma vez leva ~30 minutos e nao precisa repetir.

> **Caminho no Meta:** Ads Manager > menu "Ativos" (ou "Ferramentas") > Publicos > Criar publico

### 8a: Publicos Quentes (quem ja teve contato)

**Procedimento geral para todos os publicos de engajamento:**
1. Em Publicos > Criar publico > **Publico Personalizado**
2. Selecionar a fonte (Instagram, Facebook, Site, Videos, Lista)
3. Configurar janela de dias e filtros
4. Nomear com padrao claro (ex: "IG-365D", "FB-180D", "PV-30D")
5. Criar

#### Instagram Engagement

Criar 5 publicos com janelas diferentes:

| Nome sugerido | Configuracao | Atualiza |
|---------------|-------------|----------|
| IG-30D | Publico personalizado > Instagram > Engajamento > 30 dias | Automatico |
| IG-60D | Mesmo, 60 dias | Automatico |
| IG-90D | Mesmo, 90 dias | Automatico |
| IG-180D | Mesmo, 180 dias | Automatico |
| IG-365D | Mesmo, 365 dias | Automatico |

#### Facebook Engagement

Criar 3 publicos:

| Nome sugerido | Configuracao | Atualiza |
|---------------|-------------|----------|
| FB-30D | Publico personalizado > Facebook > Engajamento > 30 dias | Automatico |
| FB-180D | Mesmo, 180 dias | Automatico |
| FB-365D | Mesmo, 365 dias | Automatico |

#### PageView (visitantes do site)

Requer Pixel instalado (Step 7).

| Nome sugerido | Configuracao | Atualiza |
|---------------|-------------|----------|
| PV-30D | Publico personalizado > Site > Todos os visitantes > 30 dias | Automatico |
| PV-180D | Mesmo, 180 dias (maximo do Pixel) | Automatico |

Nao fazer muitas variacoes (7, 10, 15 dias) — nao faz diferenca pratica.

#### VideoView (assistiram videos)

> **REGRA CARDINAL R9:** Degrade por PERCENTUAL assistido (50/70/90%), NUNCA por dias. NAO usar 100% (quase ninguem assiste tudo).

| Nome sugerido | Configuracao | Atualiza |
|---------------|-------------|----------|
| VV-50%-365D | Publico personalizado > Video > Pelo menos 50% > 365 dias > **marcar TODOS os videos** | **MANUAL (1x/semana)** |
| VV-70%-365D | Mesmo, 70% (so se investe > R$20-30k/mes) | **MANUAL** |
| VV-90%-365D | Mesmo, 90% (so se investe > R$20-30k/mes) | **MANUAL** |

> **AVISO:** VideoView e o UNICO publico que precisa de atualizacao manual. Cada video novo precisa ser marcado. Rotina: 1x/semana, ~3 minutos. "Sem miseria — marca absolutamente todos os videos."

"Pelo menos 50%" ja inclui quem viu 70%, 90% e 100%.

#### Lista de Emails/Telefone

| Nome sugerido | Configuracao |
|---------------|-------------|
| LISTA-Emails | Publico personalizado > Lista de clientes > Upload CSV > Mapear colunas (email, telefone, nome) |
| LISTA-Compradores | Separar compradores em CSV proprio > Upload separado |

Formato: CSV ou TXT exportado do Google Sheets. So email ja funciona, mais dados = melhor match.

#### Audiencia Completa

**Regra dos 50 mil:** Se a soma de TODOS os publicos quentes for menor que 50 mil pessoas, juntar tudo em um unico publico chamado "Audiencia Completa". Motivo: publicos muito pequenos custam caro.

Se algum publico individual ja tem mais de 50 mil, pode usar separado.

### 8b: Publicos de Remarketing (quem viu oferta/CTA)

Baseados no acesso ao site. So funcionam se Pixel + eventos estao instalados (Step 7).

**Procedimento:**
1. Publico personalizado > Site > selecionar evento especifico
2. Configurar janela e refinamentos
3. Nomear e criar

| Nome sugerido | Evento | Janelas | Refinamento |
|---------------|--------|---------|-------------|
| RMK-Checkout-7D | InitiateCheckout | 7D | Opcional: Content ID (produto especifico) |
| RMK-Checkout-15D | InitiateCheckout | 15D | |
| RMK-Checkout-30D | InitiateCheckout | 30D | |
| RMK-Checkout-180D | InitiateCheckout | 180D | |
| RMK-Purchase | Purchase | todas | Pode refinar por Content ID, valor |
| RMK-Lead-30D | Lead | 30D | |
| RMK-Lead-180D | Lead | 180D | |

Todos atualizam automaticamente.

### 8c: Publicos de Exclusao

> **REGRA CARDINAL R8:** Publicos de exclusao (compradores + leads) sao OBRIGATORIOS. Criar uma vez, usar pra sempre.

| Nome sugerido | Como criar | Quando usar |
|---------------|------------|-------------|
| EXCL-Compradores | Publico personalizado > Site > evento Purchase | Produto de compra unica (curso, mentoria) |
| EXCL-Leads | Publico personalizado > Site > evento Lead | Campanha de captura (nao reimpactar) |

Esses publicos sao adicionados como EXCLUSAO nos conjuntos de anuncios.

### 8d: Lookalike (Publico Semelhante)

Dar uma BASE ao Facebook e ele busca milhoes de pessoas parecidas.

**Procedimento:**
1. Em Publicos > Criar publico > **Publico Semelhante**
2. Selecionar fonte/base (um dos publicos ja criados)
3. Selecionar pais: Brasil
4. Selecionar percentual: **1%** (recomendado)
5. Criar

> **REGRA CARDINAL R15:** Lookalike 1% = ideal. Nunca 10%. "Comecou com 1%, deu certo, pode testar 2%."
>
> **REGRA CARDINAL R16:** Base minima: 200 pessoas. Abaixo disso nao da pra criar.

**Melhores bases pra Lookalike:**
- Lista de compradores (qualidade > quantidade)
- Engajamento Instagram 365D
- PageView 180D

**Percentuais:**

| % | Tamanho (Brasil) | Qualidade |
|---|-------------------|-----------|
| 1% | ~1,7 milhoes | Melhor (mais parecido) |
| 2-3% | Paises pequenos | Aceitavel |
| 10% | ~16 milhoes | Muito diluido — evitar |

### Tabela de atualizacao dos publicos

| Publico | Atualiza automaticamente? |
|---------|---------------------------|
| Instagram Engagement | Sim |
| Facebook Engagement | Sim |
| PageView | Sim |
| VideoView | **NAO — manual 1x/semana** |
| Listas (email/telefone) | Nao (resubir quando atualizar) |
| Compradores (via Pixel) | Sim |
| Remarketing (todos) | Sim |
| Lookalike | Sim (recalcula automaticamente) |

### Validacao

- [ ] Instagram Engagement: 5 publicos criados (30/60/90/180/365D)
- [ ] Facebook Engagement: 3 publicos criados (30/180/365D)
- [ ] PageView: 2 publicos criados (30D, 180D)
- [ ] VideoView: pelo menos 1 publico criado (50%-365D) com TODOS os videos marcados
- [ ] Lista de emails/telefone: subida (se tinha lista)
- [ ] Lista de compradores: subida separado (se tinha)
- [ ] Audiencia completa: criada (se total < 50k)
- [ ] Remarketing Checkout: 4 publicos (7/15/30/180D)
- [ ] Remarketing Purchase: criado
- [ ] Remarketing Lead: 2 publicos (30/180D)
- [ ] Exclusao compradores: criado
- [ ] Exclusao leads: criado
- [ ] Lookalike 1%: pelo menos 1 criado (se base > 200 pessoas)

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar. Se o publico nao aparece ou da erro de tamanho, e porque a base ainda nao tem dados suficientes — Pixel precisa de tempo pra acumular.

### Referencias

- [Meta Help Center — Publico personalizado (PT-BR)](https://www.facebook.com/business/help/170456843145568)
- [Meta Help Center — Publico semelhante (PT-BR)](https://pt-br.facebook.com/business/help/465262276878947)
- [Pedro Sobral — Publico certo Meta Ads 2025](https://pedrosobral.com.br/blog/c/introducao-ao-trafego-pago/como-anunciar-para-o-publico-certo-no-meta-ads-em-2025)

---

## Step 9: Conexao API Completa

**O que e:** Conectar a conta Meta Ads a um sistema externo (Claude Code, n8n) via API. Isso permite ler dados, criar campanhas e otimizar anuncios de forma automatizada.

**Por que precisa:** Sem conexao API, o Squad de Trafego (Trafego Meta Ads) funciona so como consultor. Com API, ele se torna operador — pode criar campanhas, ler metricas e otimizar diretamente.

### 9a: Criar Meta App

1. Acessar https://developers.facebook.com/
2. Fazer login com a conta do Facebook (mesma do BM)
3. Clicar em "Meus Apps" > "Criar App"
4. Selecionar tipo: **"Empresa"** (Business)
5. Dar nome ao app (ex: "Auroq" ou "Squad Trafego [Nome]")
6. Selecionar o Business Manager associado
7. Criar app

### 9b: Adicionar produto Marketing API

1. No dashboard do app, ir em "Adicionar produto"
2. Selecionar **"Marketing API"**
3. Configurar

### 9c: Configurar Privacy Policy e Tornar Live

O app nasce em **modo de desenvolvimento**. Nesse modo:
- Campanhas e Ad Sets: funcionam (leitura e criacao)
- Ads e AdCreatives com `object_story_spec`: **BLOQUEADOS** (criam dark posts na Page)
- Erro exato: "O post do criativo dos anuncios foi criado por um app que esta em modo de desenvolvimento"

**Para tornar Live/Publico:**

1. Ir em Configuracoes do app > Basico
2. Adicionar **Privacy Policy URL** (obrigatorio): ex. `https://seusite.com/politica-de-privacidade`
3. Adicionar **Terms of Service URL** (recomendado)
4. Salvar
5. No topo da pagina, alternar o toggle de **"Em desenvolvimento"** para **"Publico/Live"**
6. Confirmar

> **SEM PRIVACY POLICY URL, O APP NAO PODE IR LIVE.** Pode ser uma pagina simples no site com texto basico de politica de privacidade.

### 9d: Criar System User no BM

1. No BM, ir em Configuracoes > Usuarios > Usuarios do sistema
2. Clicar "Adicionar" > criar novo
3. Nome: "Auroq" ou "Squad Trafego"
4. Tipo: **Admin**
5. Criar

### 9e: Atribuir Assets ao System User

1. Selecionar o System User recem-criado
2. Atribuir acesso:
   - Conta de anuncios → **Controle total**
   - Pixel → **Controle total**
   - Pagina → **Controle total**

### 9f: Gerar Token com Permissoes

1. Ainda no System User, clicar em **"Gerar token"**
2. Selecionar o **App** criado no Step 9a
3. Marcar permissoes:

| Permissao | O que faz |
|-----------|-----------|
| `ads_management` | Criar, editar, deletar campanhas |
| `ads_read` | Ler dados e metricas |
| `business_management` | Acessar assets do BM |
| `pages_manage_posts` | Criar posts na Pagina (necessario pra dark posts) |
| `pages_read_engagement` | Ler metricas da Pagina |

4. Gerar token
5. **COPIAR IMEDIATAMENTE** — token aparece UMA VEZ

### Sobre tokens

| Tipo | Expira? | Quando usar |
|------|---------|-------------|
| **System User token** | **NUNCA** (a menos que revogado) | Automacao (Claude Code, n8n) |
| Long-lived token | 60 dias | NAO recomendado pra automacao |

> **Para automacao: SEMPRE usar System User token.** Set and forget.

### Sobre permissoes

**Standard Access e suficiente** pra gerenciar a propria conta. NAO precisa de App Review (Advanced Access) — isso so e necessario pra gerenciar contas de TERCEIROS.

### 9g: Testar Token

1. Acessar https://developers.facebook.com/tools/explorer/
2. Selecionar o App
3. Colar o token
4. Fazer request: `GET /me` — deve retornar dados do System User
5. Fazer request: `GET /act_{ad_account_id}` — deve retornar dados da conta

### 9h: Salvar Token e Conectar

1. Salvar token no **1Password** ou gerenciador de senhas
2. Para Claude Code: configurar como variavel de ambiente `META_ACCESS_TOKEN`
3. Para n8n: adicionar nas credenciais do Facebook Graph API

### Validacao

- [ ] Meta App criado em developers.facebook.com
- [ ] Marketing API adicionado como produto
- [ ] Privacy Policy URL configurada
- [ ] App em modo **Live/Publico** (nao Development)
- [ ] System User criado (tipo Admin)
- [ ] Assets atribuidos ao System User (conta, pixel, pagina)
- [ ] Token gerado com permissoes corretas (ads_management, ads_read, business_management, pages_manage_posts, pages_read_engagement)
- [ ] Token salvo no 1Password
- [ ] Token testado no Graph Explorer (GET /me funciona)
- [ ] Token conectado ao Claude Code / n8n

### Se travou

Tira print da tela e manda aqui. Vou te dizer exatamente onde clicar. Se o app nao aparece na lista de apps ao gerar token, verifica se o app esta associado ao mesmo BM.

### Referencias

- [Meta Developers — System Users](https://developers.facebook.com/docs/business-management-apis/system-users/)
- [AdManage.ai — Meta Ads API Setup 2026](https://admanage.ai/blog/meta-ads-api)
- [Sovran.ai — Meta Ads API Guide 2026](https://sovran.ai/blog/api-facebook-ads)
- [Digital-Expanse — Marketing API Access Token](https://digital-expanse.com/tutorials/facebook-marketing-api-access-token/)
- [AdPulse — Setup Meta System User](https://support.adpulse.app/en/articles/12566831-how-to-set-up-a-meta-system-user)

---

## Step 10: Checklist Final Consolidado

Verificar TODOS estes itens antes de considerar o setup completo:

### BM + Pagina + Instagram (Steps 1-3)

- [ ] Business Manager criado e acessivel
- [ ] Informacoes da empresa preenchidas
- [ ] 2FA habilitado para todos
- [ ] Forma de pagamento configurada
- [ ] Pagina do Facebook com nome, logo, capa e descricao
- [ ] Instagram profissional (Business) vinculado a Pagina (NAO a BM)
- [ ] Instagram adicionado como asset no BM
- [ ] WhatsApp conectado a pagina

### Conta + Permissoes + Verificacao (Steps 4-6)

- [ ] Conta de anuncios ESCALA criada (fuso: America/Sao_Paulo, moeda: BRL)
- [ ] Conta de anuncios TESTE criada (se possivel)
- [ ] IDs de todas as contas armazenados
- [ ] Permissoes atribuidas: Controle total em Pagina, Conta de Anuncios e Instagram
- [ ] Verificacao BM com CNPJ submetida (pode estar em analise — nao bloqueia)

### Pixel + Eventos + CAPI (Step 7)

- [ ] Pixel/Dataset criado (opcao "API + Pixel")
- [ ] Pixel ID e Token armazenados
- [ ] Pixel instalado na pagina de vendas
- [ ] CNAME configurado (se Hotmart)
- [ ] Eventos padrao configurados (PageView, ViewContent, Lead, InitiateCheckout, Purchase)
- [ ] Parametros marcados em todos os eventos
- [ ] CAPI ativa (Web + Servidor)
- [ ] Deduplicacao ativa
- [ ] Pixel Helper: icone verde
- [ ] Eventos de teste: "Processado"

### Publicos (Step 8)

- [ ] Instagram Engagement: 5 publicos (30/60/90/180/365D)
- [ ] Facebook Engagement: 3 publicos (30/180/365D)
- [ ] PageView: 2 publicos (30D, 180D)
- [ ] VideoView: pelo menos 1 publico (50%-365D)
- [ ] Listas subidas (se tinha)
- [ ] Remarketing: Checkout (4), Purchase, Lead (2)
- [ ] Exclusao: Compradores + Leads criados
- [ ] Lookalike 1%: criado (se base > 200 pessoas)
- [ ] Rotina VideoView agendada (1x/semana)

### API (Step 9)

- [ ] Meta App criado e em modo Live
- [ ] System User criado (tipo Admin)
- [ ] Assets atribuidos ao System User
- [ ] Token gerado com todas as permissoes
- [ ] Token salvo no 1Password
- [ ] Token testado e funcional
- [ ] Token conectado ao Claude Code / n8n

### Status Geral

- [ ] **CONTA PRONTA PRA ANUNCIAR E CONECTADA AO CLAUDE CODE**

---

## Comportamento do Agente

### Tom e abordagem

- Guiar passo a passo, **um step por vez**
- Perguntar antes de avancar: "Conseguiu? Quer que eu explique melhor?"
- Pedir prints quando relevante pra validar visualmente
- Adaptar ao ritmo do usuario — tem gente que vai rapido, tem gente que precisa de mais contexto
- Se o usuario travar, oferecer alternativas ou links de referencia
- Tom direto e pratico, sem enrolacao

### Fluxo de conversa

1. Identificar em que fase o usuario esta (pode ter algumas coisas ja feitas)
2. Comecar da fase/step adequado
3. Guiar cada step com instrucoes claras
4. Validar antes de avancar (checklist do step)
5. Ao final de cada fase, confirmar que tudo esta ok
6. Validacao final com checklist completo (Step 10)

### Quando NAO conseguir ajudar

- Se a interface da Meta mudou e as instrucoes nao batem, avisar honestamente e sugerir referencias externas
- Se o usuario encontrar erro que o agente nao reconhece, escalar pro Fred Dias
- **NUNCA inventar um caminho que nao tem certeza que funciona**

---

## Glossario Essencial

Termos que o usuario leigo vai encontrar durante o setup:

| Termo | Definicao |
|-------|-----------|
| **Advantage Plus** | Publico automatizado pela IA do Meta. Sem segmentacao manual. Priorizado na conta de escala |
| **API de Conversoes (CAPI)** | Envio de dados de conversao via servidor. Complementa pixel do navegador. Contorna bloqueios de privacidade |
| **Ativos** | Tudo dentro da BM — contas de anuncio, paginas, pixels, Instagram, WhatsApp |
| **Business Manager (BM)** | Perfil da empresa no Facebook Ads. Um CNPJ = uma BM. Contem todos os ativos |
| **CNAME** | Tipo de registro DNS que aponta um subdominio pra outro destino (ex: pixel.seudominio → pixel.hotmart.com) |
| **Conta de anuncios** | Onde campanhas sao criadas e gerenciadas. Multiplas podem existir dentro de uma BM |
| **Conta de escala** | Conta dedicada a publicos/criativos vencedores. Escala vertical, minimo de campanhas |
| **Conta de teste** | Conta dedicada a experimentacao livre. Duplicacoes, ousadia, tudo permitido |
| **Content ID** | Parametro de evento que identifica qual produto gerou a conversao |
| **Conversao personalizada** | Filtro criado no gerenciador que decupa eventos padrao por URL ou Content ID. Nao precisa instalar nada |
| **Escala vertical** | Aumentar investimento nas campanhas boas e pausar as ruins (vs horizontal = criar novas) |
| **Eventos padrao** | Etiquetas pre-definidas pelo Meta: PageView, ViewContent, Lead, InitiateCheckout, Purchase, Contact |
| **Eventos personalizados** | Eventos criados pelo usuario pra rastrear acoes especificas alem dos padrao |
| **Fanpage** | Pagina empresarial/comercial do Facebook. Instagram e WhatsApp vinculam aqui (nao na BM) |
| **FBC / FBP** | Parametros que rastreiam de qual anuncio veio o clique do usuario |
| **Lookalike (Semelhante)** | Publico criado pelo Facebook a partir de uma base. Busca pessoas parecidas |
| **PageView** | Evento universal, presente em TODAS as paginas do site |
| **Pixel** | Codigo instalado no site que rastreia comportamento dos usuarios |
| **Pixel Helper** | Extensao Chrome pra verificar se pixel esta instalado corretamente. Verde = ok, amarelo = problema |
| **Publico frio** | Pessoas que nunca tiveram contato com voce/marca |
| **Publico quente** | Pessoas que ja tiveram algum contato (seguem IG, viram video, acessaram site) |
| **Publico de remarketing** | Pessoas que viram uma OFERTA ou receberam um CTA. Baseado em acesso ao site |
| **Purchase** | Evento de compra concluida. Aceita parametros: valor, moeda, Content ID |
| **System User** | Usuario de sistema no BM pra automacao via API. Token gerado nunca expira |
| **Token de acesso** | Chave que autoriza envio de dados via API. Facebook NAO armazena |

---

## Regras Cardinais do Setup

As regras inegociaveis identificadas no Metodo Andromeda que se aplicam ao setup:

| # | Regra | Dominio |
|---|-------|---------|
| R1 | UM pixel e melhor que varios (exceto bolhas totalmente diferentes) | Pixel |
| R2 | Tamanho ideal de publico: acima de 100 mil pessoas | Publicos |
| R3 | Maximo 5 interesses por conjunto de anuncios | Publicos |
| R4 | Eventos na pagina de CONCLUSAO, nunca na pagina da acao | Pixel/Eventos |
| R8 | Publicos de exclusao (compradores + leads) sao OBRIGATORIOS | Publicos |
| R9 | VideoView: degrade por PERCENTUAL (50/70/90), nunca 100% | Publicos |
| R12 | Moeda e fuso horario NAO podem ser alterados apos configuracao | Conta |
| R13 | Instagram vinculado a FANPAGE, nao a BM (protecao contra bloqueios) | BM/Instagram |
| R15 | Lookalike: 1% ideal, nunca 10% | Publicos |
| R16 | Base minima pra Lookalike: 200 pessoas | Publicos |
| R17 | URL Contains > URL Match (sempre, exceto casos muito especificos) | Pixel/Eventos |

---

*KB criada em 2026-04-08. Fonte: merge de KB Trafego Meta Ads (v1) + KB ETL Setup Trafego Andromeda (ETLmaker v3.0) + Meta API Reference + Pesquisa atualizada (2025-2026). Ambas as KBs originais permanecem intactas.*
