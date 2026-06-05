# Site Agência Martinelle — Guia rápido

## 📁 O que está pronto
- `index.html` — site completo, 1 página com seções para Médicos e Negócios Locais.
- `assets/` — pasta onde ficam as imagens.

## 🖼️ PASSO 1 — Colocar as imagens (você precisa fazer)

Salve os 3 arquivos que você me mandou dentro da pasta `site/assets/` com estes nomes **exatos**:

1. `logo-white.png` — o logo com fundo preto/branco (versão que aparece em fundo escuro).
2. `logo-black.png` — o logo com fundo branco (versão preta).
3. `jeferson.jpg` — sua foto no escritório.

Depois disso, abra o arquivo `index.html` no navegador (dois cliques) pra ver o site funcionando.

## 📬 PASSO 2 — Ativar o formulário (receber leads por e-mail)

O site já tem formulário pronto, mas precisa conectar num serviço que te manda os leads por e-mail. Recomendo o **Formspree** (gratuito até 50 leads/mês):

1. Vá em https://formspree.io e crie conta com seu e-mail.
2. Crie um novo formulário → pegue o link/ID que aparece (tipo `https://formspree.io/f/abcd1234`).
3. No arquivo `index.html`, procure por `SEU_ID_AQUI` e troque por esse ID.

Pronto. Cada lead que preencher o site cai no seu e-mail.

## 🌐 PASSO 3 — Domínio (o endereço do site)

Sugestões de domínio:
- `agenciamartinelle.com.br` (principal recomendado)
- `martinelle.com.br` (mais curto, se estiver livre)
- `agenciamartinelle.com`

**Onde comprar:** registro.br (R$ 40/ano, domínios .com.br)
**Como:** acessa o site → pesquisa o nome → paga via PIX → pronto.

## 🚀 PASSO 4 — Hospedagem (colocar o site no ar)

Mais fácil e **gratuito**: **Vercel**

1. Acesse https://vercel.com e crie conta com Google/GitHub.
2. Clique em "Add New → Project".
3. Arraste a pasta `site/` inteira para lá (ou conecte via GitHub se preferir).
4. Pronto. O site fica no ar em segundos num endereço tipo `agenciamartinelle.vercel.app`.
5. Depois você conecta seu domínio do registro.br nas configurações da Vercel (tem tutorial oficial).

**Alternativa igualmente boa:** Netlify (mesma coisa, arrasta a pasta).

## ✏️ Como editar texto depois

Abra `index.html` em qualquer editor (até o bloco de notas funciona) e mude os textos. Me avisa que eu faço pra você também.

## 📋 Checklist pra subir no ar
- [ ] Imagens salvas em `assets/` com os nomes certos
- [ ] Formspree conectado (ID trocado no HTML)
- [ ] Domínio comprado no registro.br
- [ ] Conta na Vercel criada
- [ ] Pasta subida na Vercel
- [ ] Domínio apontado na Vercel

Qualquer passo travar, me chama.
