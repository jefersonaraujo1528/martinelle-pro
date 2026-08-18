# KB — Setup Conta de Tráfego Meta Ads

> Knowledge base do Agente de Setup de Tráfego (dentro do Trafego Meta Ads).
> Fonte: definições do Mapa da Jornada de Setup + pesquisa atualizada (2025-2026).

---

## Objetivo

Pegar o usuário do ZERO ABSOLUTO — nunca anunciou na vida, não sabe o que é BM, não tem nada configurado — e guiá-lo passo a passo até ter uma conta de tráfego pago 100% profissional e operacional, conectada ao Claude Code dele via API.

**O que o usuário vai ter ao final deste processo:**
- Business Manager (Portfólio Empresarial) criado e configurado
- Página do Facebook do negócio criada e apresentável
- Instagram profissional conectado à Página e ao BM
- Conta de anúncios criada com pagamento configurado
- Permissões corretas atribuídas em todos os assets
- Verificação da empresa com CNPJ submetida (ou aprovada)
- Públicos básicos criados (salvos + personalizado se tiver lista)
- Pixel instalado na página de vendas (Hotmart ou site)
- CAPI configurado e integrado com Hotmart
- Acesso API via System User com token que nunca expira
- Token salvo no 1Password e conectado ao Claude Code
- **Conta PRONTA PRA ANUNCIAR quando chegar a Fase 3 (Propulsão)**

---

## Pipeline — 10 steps na ordem exata

O agente guia o usuário step a step, valida cada um antes de avançar. A ordem importa — cada step depende do anterior.

```
Step 1:  Criar Business Manager (BM)
Step 2:  Criar Página do Facebook do negócio
Step 3:  Vincular Instagram profissional
Step 4:  Criar conta de anúncios
Step 5:  Atribuir permissões nos assets
Step 6:  Verificar BM com CNPJ
Step 7:  Configurar públicos básicos
Step 8:  Configurar Pixel e CAPI
Step 9:  Configurar acesso API da Meta
Step 10: Validação final (checklist completo)
```

---

## Step 1: Criar Business Manager (Portfólio Empresarial)

**O que é:**
O Business Manager (BM) é o painel de controle da Meta (Facebook/Instagram) pra quem usa as plataformas de forma profissional. É por ele que se gerencia páginas, contas de anúncio, pixels, públicos e permissões — tudo num lugar só.

> Nota: A Meta renomeou "Gerenciador de Negócios" para "Portfólio Empresarial" dentro do Meta Business Suite. Mesma coisa, nome novo. O aluno pode encontrar os dois termos.

**Por que precisa:**
Sem BM não tem conta de anúncios profissional, não tem pixel, não tem CAPI. Fica limitado a impulsionar posts pelo botão do Instagram. Pra tráfego pago de verdade, o BM é obrigatório.

**Passo a passo:**
1. Acessar business.facebook.com com conta pessoal do Facebook
2. Clicar em "Criar conta" e preencher com nome da empresa
3. Usar e-mail profissional da empresa (o do Google Workspace se tiver)
4. Completar verificação do e-mail
5. BM criado — agora configurar o que tem dentro

**Validação do step:**
- [ ] BM aparece em business.facebook.com ao logar
- [ ] Nome da empresa está correto
- [ ] E-mail verificado

**Erros comuns:**
- Criar BM com Facebook fake → Meta bane. Usar Facebook pessoal real
- Máximo 2 BMs por perfil do Facebook. Se atingiu o limite, outro perfil precisa criar
- Contas novas do Facebook podem ter restrição temporária pra criar BM

**Referências:**
- [Meta Help Center — Criar portfólio empresarial](https://www.facebook.com/business/help/1710077379203657)
- [Nuvemshop — 7 passos pra criar BM](https://atendimento.nuvemshop.com.br/pt_BR/como-criar-uma-conta-no-gerenciador-de-negocios-do-facebook)
- [Vídeo: How To Set Up Meta Business Manager 2025](https://youtube.com/watch?v=WIeZNIzKlMo)

---

## Step 2: Criar Página do Facebook do negócio

**O que é:**
A Página do Facebook é a identidade pública do negócio na Meta. Todos os anúncios rodam em nome dessa Página — é ela que aparece como "patrocinado por". Sem Página, não tem anúncio.

**Passo a passo:**
1. Dentro do BM, ir em Configurações → Contas → Páginas → Adicionar → Criar nova Página
2. Nome da Página: usar nome do negócio ou marca
3. Categoria: escolher a mais adequada (Educação, Consultoria, Coach, etc.)
4. Preencher descrição, adicionar foto de perfil (logo) e capa
5. Completar informações básicas (site, contato, horário)

**Validação do step:**
- [ ] Página aparece na lista de Páginas dentro do BM
- [ ] Nome correto e categoria definida
- [ ] Foto de perfil e capa adicionadas
- [ ] Descrição preenchida

**Erros comuns:**
- Página sem foto/capa → anúncios passam menos confiança
- Nome genérico demais → difícil de encontrar e reconhecer
- Não precisa ser perfeita agora, mas precisa estar apresentável

**Referências:**
- [Meta Help Center — Adicionar Página ao portfólio](https://www.facebook.com/business/help/720478807965744)
- [mLabs — Página + Portfólio junto](https://ajuda.mlabs.com.br/en/articles/9362315-creating-a-facebook-page-and-business-portfolio)
- [Vídeo: Ultimate Facebook Business Page Tutorial 2025](https://youtube.com/watch?v=XbAkJKMVovs)

---

## Step 3: Vincular Instagram profissional

**O que é:**
Vincular o Instagram ao BM permite que anúncios apareçam no Instagram (Feed, Stories, Reels) e que tudo seja gerenciado de um lugar só. O Instagram precisa ser conta profissional (Business ou Creator) — conta pessoal não funciona.

**Pré-requisito:** O usuário precisa ter um Instagram. Pode ser o pessoal (convertido pra profissional) ou um novo pro negócio. Se não tem nenhum, o agente guia a criação antes de seguir.

**Passo a passo:**

*Parte 0 — Criar Instagram do negócio (se não tem):*
1. Baixar o app Instagram no celular (se ainda não tem)
2. Criar conta nova com e-mail da empresa (o do Google Workspace, se tiver)
3. Escolher um @ profissional (nome da marca, método ou nome próprio)
4. Preencher bio básica — nome, o que faz, pra quem
5. Colocar foto de perfil profissional (logo ou foto pessoal de qualidade)

> Nota: O agente deve perguntar "Você já tem um Instagram que quer usar pro negócio, ou prefere criar um novo?" antes de seguir. Se o usuário quer usar o pessoal, tudo bem — basta converter pra profissional na Parte A.

*Parte A — Converter pra conta profissional (se necessário):*
1. No app do Instagram: Configurações → Conta → Mudar para conta profissional
2. Escolher categoria (1000+ opções)
3. Selecionar "Empresa" (Business)
4. Conta fica pública automaticamente

*Parte B — Vincular à Página do Facebook:*
1. No Instagram: Configurações → Conta → Contas vinculadas → Facebook
2. Selecionar a Página do negócio criada no step anterior
3. Confirmar vinculação

*Parte C — Adicionar ao Business Manager:*
1. No BM: Configurações → Contas → Contas do Instagram → Adicionar
2. Fazer login no Instagram quando solicitado
3. Confirmar permissões

> Nota: Um Instagram só conecta a UMA Página por vez.

**Validação do step:**
- [ ] Instagram aparece como conta profissional (Business)
- [ ] Instagram vinculado à Página do Facebook do negócio
- [ ] Instagram aparece como asset dentro do BM

**Erros comuns:**
- Tentar vincular conta pessoal (não profissional) → não funciona
- Usar Instagram pessoal em vez de criar um pro negócio
- Esquecer de vincular à Página antes de adicionar ao BM

**Referências:**
- [Instagram Help Center — Conta profissional](https://help.instagram.com/502981923235522?locale=pt_BR)
- [Leadsie — 4 métodos pra vincular (2026)](https://www.leadsie.com/blog/link-instagram-facebook-page)
- [Mirago — Instagram no Gerenciador de Negócios](https://www.mirago.com.br/instagram-gerenciador-negocios/)
- [Nuvemshop — Conectar Instagram no Facebook 2026](https://www.nuvemshop.com.br/blog/como-conectar-o-instagram-no-facebook/)

---

## Step 4: Criar conta de anúncios

**O que é:**
A conta de anúncios é onde se cria e paga pelas campanhas. Fica dentro do Business Manager. BM é o escritório, conta de anúncios é o caixa.

**Passo a passo:**
1. Dentro do BM, ir em Configurações → Contas → Contas de anúncios
2. Clicar "Adicionar" → "Criar uma nova conta de anúncios"
3. Dar nome (ex: "Anúncios [Nome do Negócio]")
4. Selecionar fuso horário: America/Sao_Paulo
5. Selecionar moeda: BRL (Real brasileiro)
6. Definir como uso próprio ("Minha empresa")
7. Adicionar método de pagamento (cartão de crédito)

**Validação do step:**
- [ ] Conta de anúncios aparece na lista dentro do BM
- [ ] Fuso horário: America/Sao_Paulo
- [ ] Moeda: BRL
- [ ] Método de pagamento configurado

**ALERTA CRÍTICO:** Fuso horário e moeda são IRREVERSÍVEIS após criação. Conferir antes de confirmar.

**Erros comuns:**
- Criar várias contas no início → levanta bandeira na Meta. Começar com uma só
- Fuso horário errado → relatórios com horários bagunçados, irreversível
- Contas novas têm limite de ~$50/dia que aumenta com o tempo

**Referências:**
- [Meta Help Center — Criar conta de anúncios](https://pt-br.facebook.com/business/help/407323696966570)
- [Good Pixel — Guia completo 2025](https://goodpixel.com.br/guia-completo-como-configurar-sua-conta-de-anuncios-no-meta-ads-passo-a-passo-2025/)

---

## Step 5: Atribuir permissões nos assets

**O que é:**
Mesmo sendo dono de tudo dentro do BM, a Meta exige atribuição explícita de permissões em cada asset (Página, Conta de Anúncios, Instagram). Sem isso, pode ter tudo criado mas não conseguir rodar anúncios.

**Passo a passo:**
1. No BM, ir em Configurações → Pessoas
2. Clicar no próprio nome/usuário
3. Atribuir "Controle total" nos assets:
   - Página do Facebook do negócio
   - Conta de anúncios
   - Conta do Instagram
4. Se tiver mais alguém que vai gerenciar (VA, gestor), adicionar e dar permissões adequadas

**Roles por tipo de ativo:**

| Ativo | Roles disponíveis |
|-------|-------------------|
| Facebook Page | Admin, Editor, Moderator, Advertiser, Analyst |
| Conta de Anúncios | Admin, Advertiser, Analyst |
| Instagram | Full Control (Admin), Partial Access (Content, Messages, Ads, Insights) |

**Validação do step:**
- [ ] Próprio nome aparece com "Controle total" ou "Admin" em cada asset
- [ ] Consegue criar rascunho de anúncio selecionando Página e Instagram
- [ ] Nenhum asset mostra "sem acesso" ou "permissão limitada"

**Erros comuns:**
- Achar que ser dono do BM já dá acesso automático a tudo → não dá, precisa atribuir
- Erro não é óbvio — o aluno pode travar na criação do anúncio sem entender por quê

**Referências:**
- [WhiteBunnie — Assign Roles & Permissions (2025)](https://whitebunnie.com/blog/how-to-assign-roles-and-permissions-in-meta-business-manager/)
- [Extensão Digital — Estrutura de permissões 2026](https://extensaodigital.com/meta-business-suite-2026/)

---

## Step 6: Verificar BM com CNPJ

**O que é:**
Verificação é provar pra Meta que a empresa é real. Enviar documentos (CNPJ, comprovante de endereço) e a Meta valida. Desbloqueia funcionalidades avançadas e dá estabilidade à conta.

**Por que fazer:**
- Contas verificadas têm menos chance de bloqueio
- Desbloqueia limites maiores de gasto
- Acesso a funcionalidades avançadas (públicos especiais, CAPI completo)
- Mais confiança pro algoritmo da Meta

**Documentos necessários:**
1. Cartão CNPJ (baixar em servicos.receita.fazenda.gov.br)
2. Contrato Social ou Alvará de Funcionamento
3. Comprovante de endereço em nome da empresa

**Passo a passo:**
1. No BM, ir em Configurações → Central de Segurança → Verificação da empresa
2. Selecionar país: Brasil
3. Selecionar tipo de documento
4. Preencher: nome legal (EXATAMENTE como no CNPJ), número do CNPJ, endereço, telefone
5. Enviar documentos (CNPJ + comprovante)
6. Escolher método de confirmação: e-mail (precisa ser do mesmo domínio do site) ou telefone
7. Inserir código de verificação recebido
8. Aguardar análise: 10 minutos a 14 dias úteis (média: 2-3 dias)

**IMPORTANTE:** O aluno já pode anunciar enquanto espera a verificação. Usar esse tempo pra aquecer a conta com campanhas de baixo orçamento.

**Validação do step:**
- [ ] Verificação submetida (status: "em análise" ou "verificada")
- [ ] Se aprovada: badge de verificação aparece na Central de Segurança

**Erros que causam REJEIÇÃO:**
- Razão social digitada diferente do cartão CNPJ (até acentos contam)
- Site sem CNPJ, razão social e endereço visíveis (Meta cruza dados com o site!)
- Documentos com baixa qualidade de imagem ou mal escaneados
- Endereço do comprovante diferente do endereço no CNPJ
- E-mail de confirmação com domínio diferente do site da empresa
- CNPJ com situação cadastral irregular na Receita Federal

**Referências:**
- [Meta Help Center — Sobre verificação](https://pt-br.facebook.com/business/help/1095661473946872)
- [Meta Help Center — Verificar empresa](https://www.facebook.com/business/help/2058515294227817)
- [We Ramp — Guia verificação 2025](https://weramp.com.br/guia-verificacao-meta-api-whatsapp)
- [Whatsflow — Guia prático + erros comuns](https://whatsflow.com.br/como-verificar-sua-empresa-na-meta-guia-pratico/)
- [SleekFlow — Troubleshooting verificação](https://sleekflow.io/pt-br/blog/como-verificar-sua-empresa-no-facebook-business-manager)
- [HelenaCRM — Tutorial com screenshots](https://docs.helena.app/atalhos/faq/como-verificar-uma-business-manager-bm-na-meta)

---

## Step 7: Configurar públicos básicos

**O que é:**
Públicos são os grupos de pessoas pra quem os anúncios vão aparecer. A Meta permite criar públicos baseados em interesses, dados próprios ou dados do algoritmo.

**Tipos de público:**

1. **Público salvo** — definir interesses, idade, localização manualmente
   - Ex: "Mulheres 30-50 anos interessadas em coaching"
   - Bom pra começar quando não tem dados

2. **Público personalizado** — baseado em dados reais
   - Lista de e-mails/clientes (upload CSV)
   - Visitantes do site (via Pixel)
   - Engajamento no Instagram/Facebook
   - Formato upload: CSV ou TXT. Só email já funciona, mais dados = melhor match

3. **Público semelhante (lookalike)** — Meta encontra pessoas parecidas com um público existente
   - Mínimo 100 pessoas no público-fonte (recomendado 1.000-5.000)
   - Escala de 1% (mais preciso) a 10% (mais amplo)
   - Leva 6-24 horas pra popular
   - Lookalike por LTV (valor gasto) > lookalike por pageviews

**O que configurar agora:**
1. Criar 2-3 públicos salvos com interesses do nicho do aluno
2. Se já tiver lista de e-mails/clientes, subir como público personalizado
3. Públicos semelhantes: criar depois quando tiver dados suficientes

**Passo a passo (público salvo):**
1. No Ads Manager, ir em menu "Ativos" → "Públicos"
2. Clicar "Criar público" → "Público Salvo"
3. Definir localização, idade, gênero
4. Adicionar interesses relevantes ao nicho
5. Salvar com nome descritivo

**Passo a passo (público personalizado — lista):**
1. Em "Públicos" → "Criar público" → "Público Personalizado"
2. Selecionar "Lista de clientes"
3. Fazer upload do arquivo CSV/TXT
4. Mapear colunas (email, telefone, nome, etc.)
5. Nomear o público e criar

**Validação do step:**
- [ ] Pelo menos 2 públicos salvos criados
- [ ] Se tinha lista de clientes: público personalizado criado
- [ ] Públicos aparecem na lista de públicos do Ads Manager

**Referências:**
- [Meta Help Center — Público personalizado](https://www.facebook.com/business/help/170456843145568)
- [Meta Help Center — Público semelhante](https://pt-br.facebook.com/business/help/465262276878947)
- [Pedro Sobral — Público certo Meta Ads 2025](https://pedrosobral.com.br/blog/c/introducao-ao-trafego-pago/como-anunciar-para-o-publico-certo-no-meta-ads-em-2025)
- [RD Station — Segmentação Facebook Ads](https://www.rdstation.com/blog/marketing/segmentacao-facebook-ads/)

---

## Step 8: Configurar Pixel e CAPI

### Step 8a: Criar Pixel (Conjunto de Dados / Dataset)

**O que é:**
O Pixel é um código que se instala no site/página de vendas pra rastrear o que as pessoas fazem — visita, clique, compra. Desde 2023-2024, a Meta unificou Pixel + CAPI no menu "Conjunto de Dados" (Dataset). Criar o Dataset já dá automaticamente 1 Pixel + 1 CAPI.

**Passo a passo:**
1. No BM, ir em Gerenciador de Eventos → Conectar fontes de dados → Web
2. Selecionar "Pixel da Meta" (ou "Conjunto de Dados")
3. Dar nome ao Pixel (ex: "Pixel [Nome do Negócio]")
4. Copiar o ID do Pixel (15-16 dígitos)
5. Instalar na página de vendas:
   - **Hotmart:** Ferramentas → Pixel de Rastreamento → selecionar produto → Facebook → colar ID do Pixel
   - **WordPress:** instalar plugin ou colar código no `<head>`
   - **Página própria:** colar snippet JavaScript no `<head>` de todas as páginas
6. Configurar eventos padrão: PageView (visita), Purchase (compra), Lead (cadastro)

**Validação:**
- [ ] Pixel aparece no Gerenciador de Eventos
- [ ] Status: ativo (pontos verdes)
- [ ] Extensão Chrome "Meta Pixel Helper" confirma que o Pixel dispara na página

**Referências:**
- [Meta Help Center — Configurar Pixel (PT-BR)](https://pt-br.facebook.com/business/help/952192354843755)
- [Trafius — Pixel Meta Ads guia completo (abril 2026)](https://trafius.com.br/blog/pixel-meta-ads-guia-completo)
- [Hotmart Help — Configurar Pixel do Facebook](https://help.hotmart.com/pt-br/article/115004826368/como-configurar-o-pixel-do-facebook-)
- [Vídeo PT-BR: Criar Pixel Facebook 2024 (Dataset)](https://www.youtube.com/watch?v=SxH-tdRpy48)

### Step 8b: Configurar CAPI (Conversions API)

**O que é:**
O CAPI envia eventos do servidor direto pra Meta, sem depender do navegador. Complementa o Pixel — que perde dados por bloqueadores e restrições do iOS. Juntos, garantem rastreamento completo.

**Por que é importante:**
- Pixel sozinho perde 20-40% dos dados (bloqueadores, iOS, cookies)
- CAPI envia pelo servidor, bypassa tudo isso
- Empresas veem 15-30% de melhoria em conversões atribuídas após CAPI
- Meta objetivo: Event Match Quality acima de 6.0/10

**Passo a passo (integração Hotmart):**
1. No BM, ir em Gerenciador de Eventos → selecionar o Pixel → Configurações
2. Rolar até "API de Conversões"
3. Clicar "Gerar token de acesso"
4. Copiar o token gerado
5. Na Hotmart: Ferramentas → Pixel de Rastreamento → selecionar produto → Facebook
6. Método de envio: selecionar "API de conversão" ou "Ambos" (recomendado)
7. Colar o token + ID do Pixel + nomes dos eventos
8. Clicar "Verificar token"
9. Testar via "Test Events" no Gerenciador de Eventos do Facebook

**ALERTA CRÍTICO — Deduplicação:**
Usar o mesmo `event_id` no Pixel e na CAPI pra não contar conversão 2 vezes. A Hotmart faz isso automaticamente quando se usa "Ambos". Se for implementação manual, configurar deduplicação.

**Validação:**
- [ ] Token CAPI gerado e salvo no 1Password
- [ ] CAPI aparece como fonte de dados no Gerenciador de Eventos
- [ ] Eventos de teste aparecem na aba "Test Events"
- [ ] Event Match Quality acima de 6.0

**Referências:**
- [Meta Developers — Conversions API (PT-BR)](https://developers.facebook.com/docs/marketing-api/conversions-api/get-started?locale=pt_BR)
- [Hotmart Help — Configurar Pixel (seção CAPI)](https://help.hotmart.com/pt-br/article/115004826368/como-configurar-o-pixel-do-facebook-)
- [Portal Insights — API de conversão na Hotmart](https://www.portalinsights.com.br/perguntas-frequentes/como-configurar-api-de-conversao-na-hotmart)
- [Cometly — CAPI Setup 2026 (7 passos)](https://www.cometly.com/post/facebook-conversion-api-setup)
- [Triple Whale — CAPI 2026](https://www.triplewhale.com/blog/facebook-capi)

> Nota: Meta descontinuou Offline Conversions API em maio 2025. Tudo agora via Conversions API padrão.

---

## Step 9: Configurar acesso API da Meta

**O que é:**
O acesso API permite que o Claude Code (via Squad de Tráfego / Trafego Meta Ads) se conecte diretamente à conta da Meta pra ler dados, criar públicos, gerenciar campanhas e otimizar anúncios. Transforma o Squad de consultor em operador.

**Passo a passo:**
1. No BM, ir em Configurações → Usuários → Usuários do sistema
2. Clicar "Adicionar" → criar novo Usuário do sistema
3. Nome: "Auroq" ou "Squad Tráfego"
4. Tipo: Admin
5. Atribuir acesso aos assets:
   - Conta de anúncios → Controle total
   - Pixel → Controle total
   - Página → Controle total
6. Gerar token de acesso com permissões:
   - `ads_management` (criar/editar/deletar campanhas)
   - `ads_read` (ler dados e métricas)
   - `business_management` (acessar assets do BM)
   - `pages_read_engagement` (ler métricas da Página)
7. Copiar e salvar o token no 1Password

**INSIGHT CRÍTICO — System User token vs Long-lived token:**
- System User token: gerado no BM, **NUNCA EXPIRA** (a menos que revogado). Set and forget.
- Long-lived token: expira em 60 dias, precisa renovar.
- **Pra automação: SEMPRE usar System User token.**

**Sobre permissões:**
Standard Access é suficiente pra gerenciar a própria conta. NÃO precisa de App Review (Advanced Access) — isso só é necessário pra gerenciar contas de terceiros.

**Validação do step:**
- [ ] System User criado e aparece na lista
- [ ] Assets atribuídos com controle total
- [ ] Token gerado e salvo no 1Password
- [ ] Token funciona (testar no Graph Explorer: graph.facebook.com)

**Referências:**
- [Meta Developers — System Users](https://developers.facebook.com/docs/business-management-apis/system-users/)
- [AdManage.ai — Meta Ads API Setup 2026](https://admanage.ai/blog/meta-ads-api)
- [Sovran.ai — Meta Ads API Guide 2026](https://sovran.ai/blog/api-facebook-ads)
- [AdPulse — Setup Meta System User](https://support.adpulse.app/en/articles/12566831-how-to-set-up-a-meta-system-user)

---

## Step 10: Validação final — Checklist completo

O agente deve verificar TODOS estes itens antes de considerar o setup completo:

### Steps 1-3: BM, Página e Instagram
- [ ] Business Manager criado e acessível
- [ ] Página do Facebook com nome, logo, capa e descrição
- [ ] Instagram profissional (Business) vinculado à Página
- [ ] Instagram adicionado como asset no BM

### Steps 4-6: Conta, Permissões e Verificação
- [ ] Conta de anúncios criada (fuso: America/Sao_Paulo, moeda: BRL)
- [ ] Método de pagamento configurado
- [ ] Permissões atribuídas: Controle total em Página, Conta de Anúncios e Instagram
- [ ] Verificação BM submetida (pode estar em análise — não bloqueia)

### Step 7: Públicos
- [ ] Pelo menos 2 públicos salvos criados
- [ ] Público personalizado criado (se tinha lista de clientes)

### Step 8: Pixel e CAPI
- [ ] Pixel/Dataset criado e ativo
- [ ] Pixel instalado na página de vendas (Hotmart ou site)
- [ ] CAPI configurado com token
- [ ] Eventos disparando: PageView, Purchase, Lead
- [ ] Deduplicação ativa (mesmo event_id no Pixel e CAPI)

### Step 9: Acesso API
- [ ] System User criado (tipo Admin)
- [ ] Assets atribuídos ao System User
- [ ] Token gerado e salvo no 1Password
- [ ] Token testado e funcional

### Status geral
- [ ] **CONTA PRONTA PRA ANUNCIAR E CONECTADA AO CLAUDE CODE** ✓

---

## Comportamento do agente

### Tom e abordagem
- Guiar passo a passo, um step por vez
- Perguntar antes de avançar: "Conseguiu? Quer que eu explique melhor?"
- Pedir prints quando relevante pra validar visualmente
- Adaptar ao ritmo do aluno — tem gente que vai rápido, tem gente que precisa de mais contexto
- Se o aluno travar, oferecer alternativas ou links de referência

### Fluxo de conversa
1. Identificar em que fase o aluno está (pode ter algumas coisas já feitas)
2. Começar da fase/step adequado
3. Guiar cada step com instruções claras
4. Validar antes de avançar
5. Ao final de cada fase, confirmar que tudo está ok
6. Validação final com checklist completo

### Quando NÃO conseguir ajudar
- Se a interface da Meta mudou e as instruções não batem, avisar honestamente e sugerir referências
- Se o aluno encontrar erro que o agente não reconhece, escalar pro Fred Dias
- NUNCA inventar um caminho que não tem certeza que funciona

---

*KB criada em 08/04/2026. Atualizada em 05/05/2026 (validada contra Graph API v21).*

## Referências externas úteis (links públicos)

Documentação oficial Meta — sempre que mudar UI ou aparecer dúvida em algum step, esses são os pontos canônicos:

| Tópico | Documentação oficial Meta |
|--------|---------------------------|
| Criar Business Manager | https://www.facebook.com/business/help/1710077379203657 |
| Adicionar Página ao BM | https://www.facebook.com/business/help/720478807965744 |
| Adicionar Instagram ao BM | https://www.facebook.com/business/help/620548115562686 |
| Criar Conta de Anúncios | https://pt-br.facebook.com/business/help/407323696966570 |
| Verificação da empresa (CNPJ) | https://pt-br.facebook.com/business/help/1095661473946872 |
| Pixel + CAPI (Conjunto de Dados) | https://pt-br.facebook.com/business/help/952192354843755 |
| Conversions API (CAPI) | https://developers.facebook.com/docs/marketing-api/conversions-api/get-started?locale=pt_BR |
| System Users (token API) | https://developers.facebook.com/docs/business-management-apis/system-users/ |
| Marketing API geral | https://developers.facebook.com/docs/marketing-api/get-started/ |
| Permissions Reference | https://developers.facebook.com/docs/permissions/ |

**Observação:** a Meta renomeou "Gerenciador de Negócios" para **"Portfólio Empresarial"** dentro do Meta Business Suite. Mesma coisa, nome novo.
