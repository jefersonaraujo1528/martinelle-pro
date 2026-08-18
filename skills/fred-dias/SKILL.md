---
name: fred-dias
description: Base do Método Agência Customizada (Fred Dias). Use para reconstruir, revisar ou expandir a documentação oficial dos pacotes Pro — propostas, contratos, briefings, e-mails e workflows.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
---

# /fred-dias — Base de Documentação Oficial

> **Fonte única de preços: `CLAUDE.md`, seção 4.** Se algum número aqui divergir de lá, o CLAUDE.md vence — e corrija este arquivo.

Fonte de verdade: `/Users/marciolinhares/AGÊNCIA MARTINELLE/FRED DIAS/Documentação da Agência Customizada/`
(pastas "1" e "2" são idênticas — usar sempre a "1"). É o material do curso/consultoria do Fred Dias
que Jeferson usa como base jurídica e comercial pra construir a documentação oficial da MRTN.

**Regra de ouro:** nada do que sai dessa pasta vai pro cliente sem passar pelo checklist de rebranding
abaixo primeiro. O conteúdo original é da Agência TREX (copyright, cláusulas, preços) — serve de
esqueleto, nunca de produto final.

## Checklist de Rebranding (aplicar sempre)

1. **Copyright** — trocar "Agência TREX" por "Consultoria MRTN", CNPJ 49.561.800/0001-70, Teresina/PI
2. **Público** — o texto original assume "negócios locais". Google/Meta/YouTube Ads Pro na MRTN são
   pra **médico** — reescrever a abertura pro público certo, nunca deixar o genérico da TREX
3. **CFM 2.336/2023** — remover toda promessa de resultado ("aumento do ROI", "vendemos resultado",
   "ROI médio de X%"). Ver [[project_ofertas_precos]] e a filosofia em `skills/hermano/knowledge/00-filosofia-base.md`
4. **Google Meu Negócio é do cliente** — nunca usar cláusula de "propriedade" da agência sobre o GMN
   (PJ ou PF). Só a estratégia/criativos são IP da CONTRATADA.
5. **Foco no básico** — só os 3 pacotes (Google/Meta/YouTube Ads Pro). Cortar upsells fantasma tipo
   "Setup Google Ads Extreme" que não existem no catálogo MRTN.
6. **Prazo editável** — contrato sempre com opção 6 ou 12 meses. 12 meses tem benefício maior.
7. **Preço — ancoragem, não desconto recorrente** — não usar "desconto de pontualidade mensal" em
   nenhum lugar (contratos, propostas, skills, gerador `assinar.html`/`index.html`). Usar o modelo de
   **preço protagonista**: taxa de tabela (12 meses) vs. preço protagonista (fechamento na apresentação,
   também 12 meses) — a escassez real é a decisão na hora da apresentação, não um desconto
   inventado. **Nenhum contrato MRTN tem cláusula de exclusividade** — Jeferson atende todos; exclusividade
   só por Termo Aditivo pago à parte. Números confirmados por Jeferson (01/08/2026): Google/Meta Ads Pro R$1.500 → R$1.200;
   YouTube Ads Pro R$4.500 → R$3.500. Ver `propostas/modelos/pitch-google-ads-pro.html` (a revelação
   ao vivo) e `propostas/modelos/google-ads-pro.html` (a proposta formal).
8. **Asaas é sempre manual** — nunca criar cobrança automática via API/Edge Function a partir do
   gerador de contratos. `contratos/index.html` só mostra os dados formatados para Jeferson cadastrar
   ele mesmo no painel do Asaas.

## Mapa de Documentos — Status por Pacote

| Documento | Fonte (Fred Dias) | Destino MRTN | Status |
|---|---|---|---|
| Contrato Google Ads Pro | `Modelo de Contrato de Prestação de Serviços Google Ads Pro I/II.docx` | `contratos/modelos/google-ads-pro.html` | ✅ Corrigido (31/07–01/08/2026): copyright, exclusividade real, preço protagonista, bug do bloco de testemunhas |
| Proposta Google Ads Pro | `Modelo de Proposta Google Ads Pro I/II.docx` | `propostas/modelos/google-ads-pro.html` | ✅ Criada do zero (não existia como documento visual, só texto na skill `/proposta`) |
| Pitch de fechamento Google Ads Pro | — (não existe no Fred Dias, é peça nova) | `propostas/modelos/pitch-google-ads-pro.html` | ✅ Apresentação em tela cheia, fundo branco, ancoragem progressiva de preço (mercado → metodologia → tabela → protagonista). Mostrado ANTES da proposta formal, ao vivo na consultoria |
| Briefing Google Ads Pro | `Modelo de Briefing Google Ads Pro.docx` | — | ⏳ Pendente |
| Contrato Meta Ads Pro | `Modelo de Contrato de Prestação de Serviços Meta Ads Pro.docx` | `contratos/modelos/meta-ads-pro.html` | ⏳ Existe no sistema — não auditado ainda com o checklist acima |
| Proposta Meta Ads Pro | `Modelo de Proposta Meta Ads Pro.docx` | `propostas/modelos/meta-ads-pro.html` | ✅ Criada (02/08/2026) — padrão do Google Ads Pro, conteúdo extraído do docx original + contrato MRTN. Bônus: Setup Meta R$2.000 + Website Smart Links R$1.500 = R$3.500 |
| Briefing Meta Ads Pro | `Modelo de Briefing Meta Ads Pro.docx` | — | ⏳ Pendente |
| Contrato YouTube Ads Pro | `Modelo Contrato... YouTube Ads Pro Cliente 6/12 meses.docx` | `contratos/modelos/youtube-ads-pro.html` | ⏳ Existe no sistema — não auditado ainda |
| Proposta YouTube Ads Pro | `Modelo Pacote YouTube Ads Pro - Nome do Cliente.docx` | `propostas/modelos/youtube-ads-pro.html` | ✅ Criada (02/08/2026) — mesmo padrão. Bônus: Setup YouTube R$6.000 + Setup Google Search R$4.000 + GMN R$950 = R$10.950. Reunião SEMANAL (não mensal). Vídeos são fornecidos pelo cliente |
| E-mails padrão (boas-vindas, boleto, ativação, atraso) | `EMAIL PADRÃO - *.docx` | — | ⏳ Não auditados — conferir alinhamento com o sistema de pontualidade/cobrança atual |
| Workflow operacional | `WORKFLOW GOOGLE ADS PRO.pdf` / `WORKFLOW META ADS PRO.pdf` | — | ⏳ Referência, ainda não incorporado a nenhum painel |
| Exemplos de relatório | `Exemplo do Relatório - *.pdf` | `relatorios.html` (sistema já existe) | ✅ Sistema próprio já supera o exemplo do Fred Dias |

## Como usar

- Jeferson pede pra "ajeitar" ou "conferir" a documentação de um pacote → ler o arquivo fonte na pasta
  Fred Dias, aplicar o checklist de rebranding, comparar com o que já existe em `contratos/modelos/` e
  `propostas/modelos/`, sinalizar toda inconsistência encontrada (ex.: contrato promete X, proposta
  promete Y diferente) antes de editar.
- Sempre extrair texto de `.docx` com `python-docx` (já disponível no ambiente) em vez de abrir/adivinhar.
- Nunca aplicar uma mudança estrutural (cláusula legal, exclusividade, prazo) sem confirmar com
  Jeferson — são compromissos reais do negócio, não só formatação.
