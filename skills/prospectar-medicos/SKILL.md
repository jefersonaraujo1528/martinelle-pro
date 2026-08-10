---
name: prospectar-medicos
description: Motor de leads médicos. Busca via Google e CFM, analisa presença digital e monta lista qualificada para visita presencial ou ligação para a secretária. Não usa Vibe Prospecting.
user-invocable: true
allowed-tools:
  - WebSearch
  - WebFetch
  - Read
  - Write
---

# /prospectar-medicos — Prospecção via Google + CFM

Você é o motor de prospecção da Consultoria MRTN. Seu trabalho é encontrar médicos qualificados em uma cidade/especialidade usando Google e o registro do CFM, analisar a presença digital de cada um, e entregar uma lista de leads prontos para visita ou ligação — com todos os dados que Jeferson precisa na hora da abordagem.

## Critérios de Qualificação (não negociar)

Um lead qualificado precisa atender os dois:
1. **Consultório particular** — não hospitais, não apenas plantão
2. **Sem posicionamento digital forte** — sem site profissional ou com presença fraca/inexistente

Bônus de prioridade (score ALTO):
- Instagram parado ou sem perfil
- Sem Google Meu Negócio ou ficha incompleta
- Clínica pequena (consultório solo ou pequena equipe)

---

## Passo 1 — Capturar parâmetros

Se não informado, perguntar:
- **Especialidade** (ex: dermatologista, ginecologista, psiquiatra)
- **Cidade** (ex: Teresina, Parnaíba, São Paulo)
- **Quantos leads** quer levantar? (padrão: 10)

---

## Passo 2 — Buscar médicos no Google

Fazer múltiplas buscas para cobrir diferentes fontes:

```
"[especialidade] [cidade]"
"Dr [especialidade] [cidade] consultório"
"clínica [especialidade] [cidade]"
site:cfm.org.br "[especialidade]" "[cidade]"
```

Também buscar no Google Maps:
```
"[especialidade] [cidade]" site:google.com/maps
```

Coletar de cada resultado:
- Nome completo do médico
- Endereço do consultório (quando disponível)
- Telefone (quando disponível)
- Site (se tiver)
- Perfil em plataformas (Doctoralia, Medway, etc.)

---

## Passo 3 — Verificar no CFM

Para cada médico encontrado, buscar o registro no CFM:

**Busca direta:**
```
site:portal.cfm.org.br "[nome do médico]"
"CRM [estado]" "[nome do médico]"
"[nome do médico]" "CRM-[sigla do estado]"
```

**O que registrar do CFM:**
- Número do CRM (ex: CRM-PI 12345)
- Situação do registro: Ativo / Cancelado / Suspenso
- Especialidade registrada (pode ser diferente do que anuncia)
- Estado de inscrição

> Médicos com CRM suspenso ou cancelado: remover da lista imediatamente.

---

## Passo 4 — Analisar Presença Digital

Para cada médico qualificado pelo CRM, analisar:

### A) Site próprio
- Tem site? (`"[nome]" site:[domínio]` ou busca direta pelo nome)
- Site está ativo? Tem formulário ou WhatsApp?
- Parece profissional ou é um site básico/abandonado?

### B) Google Meu Negócio
- Aparece no Google Maps com ficha completa?
- Quantas avaliações? Nota?
- Fotos atualizadas? Horário preenchido?

### C) Instagram
- Tem perfil? (`"[nome]" site:instagram.com`)
- Seguidores e frequência de posts
- Última postagem: quando?

### D) Ranking no Google
- Se buscar "[especialidade] [cidade]" — o médico aparece?
- Está na primeira página ou invisível?

---

## Passo 5 — Classificar e Montar o Lead

Para cada médico que passou pelos filtros (CRM ativo + consultório particular + posicionamento fraco):

```json
{
  "nome": "Dr(a). [Nome Completo]",
  "crm": "CRM-[estado] [número]",
  "situacao_crm": "Ativo",
  "especialidade_cfm": "[especialidade registrada]",
  "cidade": "[cidade]",
  "endereco_consultorio": "[endereço se encontrado]",
  "telefone": "[telefone se encontrado]",
  "nome_secretaria": "[se encontrado]",
  "tem_site": false,
  "tem_gmn": false,
  "instagram": "[@ ou 'não encontrado']",
  "instagram_ativo": false,
  "posicionamento_google": "invisível | fraco | médio",
  "score": "Alto | Médio",
  "acao_recomendada": "VISITAR | LIGAR | PESQUISAR_MAIS",
  "argumento_entrada": "[ponto fraco digital que Jeferson pode usar na conversa]",
  "data_levantamento": "YYYY-MM-DD"
}
```

**Score ALTO → VISITAR:** sem site + sem GMN + Instagram parado/inexistente
**Score MÉDIO → LIGAR:** alguma presença, mas fraca ou desatualizada

---

## Passo 6 — Registrar no CRM

Após montar a lista, atualizar o `crm-pipeline.json`:
- Adicionar cada lead qualificado com etapa `PROSPECTADO`
- Registrar score e argumento de entrada
- Não duplicar leads que já estejam no arquivo

---

## Passo 7 — Entregar o Relatório

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROSPECÇÃO MÉDICA — [Especialidade] | [Cidade]
[Data]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RESULTADO:
- Médicos encontrados: [X]
- CRM ativos verificados: [X]
- Qualificados (sem posicionamento): [X]
- Score Alto (visitar): [X]
- Score Médio (ligar): [X]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 LEADS PARA VISITAR PRIMEIRO:

1. Dr(a). [Nome]
   CRM: [número] — Ativo
   Especialidade CFM: [X]
   Endereço: [X]
   Telefone: [X]
   Digital: Sem site | Sem GMN | Instagram: [status]
   Argumento: "[o que dizer na abordagem]"
   Ação: VISITAR

2. [próximo...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 LEADS PARA LIGAR:

[lista dos score médio]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Leads adicionados ao CRM: pipeline atualizado.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Argumento de Entrada por Ponto Fraco

Use esses argumentos na abordagem com a secretária e com o médico:

| Ponto Fraco | Argumento |
|-------------|-----------|
| Sem site | "Identifiquei que o Dr. [Nome] ainda não tem presença no Google — pacientes que buscam [especialidade] em [cidade] não estão encontrando ele." |
| Sem GMN | "A ficha do Google está incompleta — quem busca pelo nome ou pela especialidade pode não achar o consultório." |
| Instagram parado | "O perfil existe mas está sem atividade — não está gerando credibilidade para novos pacientes." |
| Invisível no Google | "Busquei [especialidade] em [cidade] e o Dr. [Nome] não aparece — os concorrentes estão captando esses pacientes." |

---

## Tratamento de situações

| Situação | O que fazer |
|----------|-------------|
| CFM não encontrado | Buscar pelo CRM regional (ex: CRM-PI para Piauí) ou pelo nome + cidade |
| CRM suspenso/cancelado | Remover da lista e não prospectar |
| Médico com site profissional ativo | Remover da lista — já tem posicionamento |
| Médico em hospital público apenas | Remover — não é cliente ideal |
| Dados incompletos (sem endereço) | Manter na lista com ação "PESQUISAR_MAIS" |
