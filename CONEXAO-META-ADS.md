# Conexão automática com o Meta Ads — Consultoria MRTN

Este guia liga o **relatorios.html** direto na **Meta Marketing API**, para puxar
números, público e o ranking de criativos sem copiar e colar. O token do Meta
**nunca** vai para o navegador — ele fica em segredo numa **Edge Function do
Supabase** (`meta-insights`), o mesmo padrão já usado nos contratos.

```
Navegador (relatorios.html)
   │  POST {accountId, período}
   ▼
Edge Function meta-insights  ──(token em segredo)──►  Graph API do Meta
   │  { atual, anterior, publico, criativos }
   ▼
Relatório preenchido automaticamente
```

---

## Passo 1 — Criar o token do Meta (System User)

Token de System User **não expira** — ideal para a automação.

1. Acesse **business.facebook.com** → **Configurações do Negócio**.
2. Menu **Usuários → Usuários do sistema** → **Adicionar** → crie um System User
   (função **Admin**). Ex.: "MRTN Relatórios".
3. Em **Ativos atribuídos**, adicione as **contas de anúncios** dos clientes que
   você gerencia e dê acesso de **Ver desempenho** (leitura).
   - As contas dos clientes precisam estar no seu Gerenciador de Negócios
     (como próprias ou compartilhadas via parceria).
4. Clique em **Gerar novo token**:
   - Selecione o seu **App** (se não tiver, crie um App tipo *Business* em
     **developers.facebook.com** — não precisa de Análise do App para ler contas
     às quais o System User já tem acesso).
   - Permissões: marque **`ads_read`** e **`read_insights`**.
   - Copie o token gerado (guarde com cuidado — ele dá acesso de leitura às contas).

> Você também vai precisar do **ID de cada conta** (número que aparece no
> Gerenciador de Anúncios, ex.: `1234567890` — sem o prefixo `act_`).

---

## Passo 2 — Guardar o token como segredo no Supabase

No painel do Supabase do projeto (`wtirdmwrttoxpljxsoci`):

**Edge Functions → Secrets** (ou via CLI):

```bash
supabase secrets set META_ACCESS_TOKEN="SEU_TOKEN_AQUI"
# opcional — fixar a versão da Graph API (padrão atual: v25.0):
supabase secrets set META_API_VERSION="v25.0"
# opcional (recomendado) — trava de segurança: só estas contas podem ser consultadas
# (IDs separados por vírgula). Sem isso, qualquer ID acessível pelo token é permitido.
supabase secrets set META_ALLOWED_ACCOUNTS="1234567890,9876543210"
```

O token fica só no servidor. O código público nunca o vê.

> **Versão da API:** o Meta aposenta versões a cada ~6 meses. Quando sair uma nova
> (v26, v27…), basta atualizar o segredo `META_API_VERSION` — não precisa mexer no código.

---

## Passo 3 — Publicar a função

```bash
# na raiz do projeto, com a Supabase CLI logada:
supabase functions deploy meta-insights
```

(Ou pelo painel: **Edge Functions → Deploy** apontando para
`supabase/functions/meta-insights`.) O `verify_jwt = false` já está em
`supabase/config.toml`.

---

## Passo 4 — Usar no relatório

1. Em **Relatórios → cliente → ✏️ Editar**, preencha
   **"Conta de anúncios do Meta"** com o ID da conta (ex.: `1234567890`).
2. Abra um relatório, defina o **período (de / até)**.
3. Na aba **Meta Ads**, clique em **🔄 Puxar dados do Meta**.
4. Pronto: números, público (idade/gênero) e a **hierarquia de criativos
   (1º/2º/3º)** vêm preenchidos. O período anterior também é puxado para a
   comparação (▲▼ vs. anterior).

---

## O que a função entrega

| Bloco | Origem na Graph API |
|-------|---------------------|
| Investimento, alcance, impressões, cliques, visualizações de página, leads/conversas, compras e valor | `act_<id>/insights` (level=account) |
| Período anterior (comparação) | mesma chamada com `prevSince/prevUntil` |
| Público — % mulheres/homens e faixas etárias | `insights` com `breakdowns=age,gender` |
| Hierarquia de criativos (top 5 por leads → cliques, com CPL/CTR) | `insights` (level=ad, `ad_name`) |

## Observações

- **Google Ads** não está incluído aqui: a API do Google exige OAuth + developer
  token + aprovação de MCC (bem mais burocrática). Por enquanto o Google continua
  pela importação de Excel/CSV/PDF. Dá para fazer numa segunda fase se quiser.
- Se aparecer erro **"META_ACCESS_TOKEN não configurado"**, o segredo do Passo 2
  ainda não foi setado/deployado.
- Se aparecer erro de permissão da conta, confirme que aquela conta foi atribuída
  ao System User (Passo 1.3).
