#!/usr/bin/env python3
"""
md2pdf — converte Markdown em PDF com a identidade da Consultoria MRTN.

    python3 ferramentas/md2pdf.py entrada.md [saida.pdf]

Convenções suportadas
---------------------
  # Título / ## Subtítulo   nas duas primeiras linhas  -> vira CAPA com logo
  ## ###                    seções e subseções
  - item / 1. item          listas
  **negrito**  *itálico*  `código`  [link](url)
  > texto                   bloco de script (fala pronta, fundo azul)
  !> texto                  bloco de atenção (fundo âmbar)
  =| texto                  faixa de regra de ouro (fundo escuro)
  | a | b |                 tabela
  ---                       linha divisória
  <!--pagebreak-->          quebra de página
"""
import re
import sys
import pathlib

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (BaseDocTemplate, Frame, HRFlowable, Image,
                                ListFlowable, ListItem, NextPageTemplate, PageBreak,
                                PageTemplate, Paragraph, Spacer, Table, TableStyle)

RAIZ = pathlib.Path(__file__).resolve().parent.parent
LOGO = RAIZ / "logo-preto.png"

AZUL = colors.HexColor("#2f6bff")
AZUL_ESC = colors.HexColor("#1c3f9e")
TINTA = colors.HexColor("#15181f")
GRAFITE = colors.HexColor("#3d4351")
CINZA = colors.HexColor("#7a8194")
CLARO = colors.HexColor("#eef3ff")
AMBAR = colors.HexColor("#fff6e5")
AMBAR_L = colors.HexColor("#b06a00")
BORDA = colors.HexColor("#dbe2f2")


def estilos():
    b = getSampleStyleSheet()
    s = {}
    s["capa_t"] = ParagraphStyle("capa_t", parent=b["Title"], fontName="Helvetica-Bold",
                                 fontSize=30, leading=35, textColor=TINTA,
                                 alignment=TA_CENTER, spaceAfter=6)
    s["capa_s"] = ParagraphStyle("capa_s", parent=b["Normal"], fontName="Helvetica",
                                 fontSize=12.5, leading=18, textColor=GRAFITE,
                                 alignment=TA_CENTER)
    s["capa_r"] = ParagraphStyle("capa_r", parent=b["Normal"], fontName="Helvetica",
                                 fontSize=8.6, leading=13, textColor=CINZA,
                                 alignment=TA_CENTER)
    s["h2"] = ParagraphStyle("h2", parent=b["Heading2"], fontName="Helvetica-Bold",
                             fontSize=14.5, leading=18, textColor=AZUL,
                             spaceBefore=17, spaceAfter=7)
    s["h3"] = ParagraphStyle("h3", parent=b["Heading3"], fontName="Helvetica-Bold",
                             fontSize=11, leading=14, textColor=TINTA,
                             spaceBefore=13, spaceAfter=5)
    s["p"] = ParagraphStyle("p", parent=b["BodyText"], fontName="Helvetica",
                            fontSize=9.7, leading=14.8, textColor=GRAFITE,
                            alignment=TA_JUSTIFY, spaceAfter=7)
    s["li"] = ParagraphStyle("li", parent=s["p"], spaceAfter=4, alignment=0)
    s["script"] = ParagraphStyle("script", parent=s["p"], leftIndent=11, rightIndent=8,
                                 fontName="Helvetica-Oblique", textColor=AZUL_ESC,
                                 alignment=0, spaceBefore=12, spaceAfter=12,
                                 borderPadding=(9, 9, 9, 11), backColor=CLARO)
    s["alerta"] = ParagraphStyle("alerta", parent=s["script"], textColor=AMBAR_L,
                                 fontName="Helvetica", backColor=AMBAR)
    s["regra"] = ParagraphStyle("regra", parent=s["p"], fontName="Helvetica-Bold",
                                fontSize=11, leading=15.5, textColor=colors.white,
                                alignment=TA_CENTER, spaceBefore=13, spaceAfter=13,
                                borderPadding=(11, 11, 11, 11), backColor=TINTA)
    s["th"] = ParagraphStyle("th", parent=s["p"], fontName="Helvetica-Bold", fontSize=8.7,
                             leading=11.6, textColor=colors.white, alignment=0, spaceAfter=0)
    s["td"] = ParagraphStyle("td", parent=s["p"], fontSize=8.7, leading=11.6,
                             alignment=0, spaceAfter=0, textColor=GRAFITE)
    return s


def inline(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"(?<![\w*])\*([^*\n]+?)\*(?![\w*])", r"<i>\1</i>", t)
    t = re.sub(r"`(.+?)`", r'<font face="Courier" size="8.7">\1</font>', t)
    t = re.sub(r"\[(.+?)\]\((.+?)\)", r'<link href="\2" color="#2f6bff">\1</link>', t)
    return t.replace("→", "&#8594;")


def tabela(linhas, s, largura):
    linhas = [l for l in linhas if not re.match(r"^\|[\s:|-]+\|$", l.strip())]
    dados = [[c.strip() for c in l.strip().strip("|").split("|")] for l in linhas]
    if not dados:
        return None
    ncol = max(len(r) for r in dados)
    dados = [r + [""] * (ncol - len(r)) for r in dados]
    corpo = [[Paragraph(inline(c), s["th"]) for c in dados[0]]]
    corpo += [[Paragraph(inline(c), s["td"]) for c in r] for r in dados[1:]]

    PAD = 16
    limpa = lambda x: re.sub(r"[*`]", "", x)

    def peso(c):
        ts = [limpa(r[c]) for r in dados]
        return max(3.0, min(max(len(t) for t in ts),
                            sum(len(t) for t in ts) / len(ts) * 2.2 + 6))

    def piso(c):
        ts = [limpa(r[c]) for r in dados]
        curtos = max((stringWidth(t, "Helvetica-Bold", 8.7) for t in ts if len(t) <= 12), default=0)
        palavra = max((stringWidth(p, "Helvetica-Bold", 8.7) for t in ts for p in t.split()), default=0)
        return min(largura * 0.42, max(curtos, palavra) + PAD + 2)

    pesos = [peso(c) for c in range(ncol)]
    pisos = [piso(c) for c in range(ncol)]
    tot = sum(pesos)
    w = [max(pisos[c], largura * pesos[c] / tot) for c in range(ncol)]
    if sum(w) > largura:
        exc, folga = sum(w) - largura, [w[c] - pisos[c] for c in range(ncol)]
        disp = sum(folga)
        if disp > 0:
            w = [w[c] - exc * folga[c] / disp for c in range(ncol)]
    else:
        w[pesos.index(max(pesos))] += largura - sum(w)

    t = Table(corpo, colWidths=w, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), AZUL),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f6f8fe")]),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDA),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDA),
    ]))
    return t


def logo_flowable(altura_mm):
    if not LOGO.exists():
        return None
    from PIL import Image as PILImage
    with PILImage.open(LOGO) as im:
        prop = im.width / im.height
    h = altura_mm * mm
    return Image(str(LOGO), width=h * prop, height=h)


def construir(md, s, largura, tem_capa):
    fluxo, linhas = [], md.split("\n")
    i = 0

    if tem_capa:
        titulo = linhas[0][2:].strip()
        sub = next((l[3:].strip() for l in linhas[1:6] if l.startswith("## ")), "")
        lg = logo_flowable(17)
        fluxo.append(Spacer(1, 42 * mm))
        if lg:
            lg.hAlign = "CENTER"
            fluxo.append(lg)
            fluxo.append(Spacer(1, 20 * mm))
        fluxo.append(Paragraph(inline(titulo), s["capa_t"]))
        fluxo.append(Spacer(1, 3 * mm))
        fluxo.append(HRFlowable(width="26%", thickness=2.2, color=AZUL, hAlign="CENTER"))
        fluxo.append(Spacer(1, 5 * mm))
        if sub:
            fluxo.append(Paragraph(inline(sub), s["capa_s"]))
        fluxo.append(Spacer(1, 60 * mm))
        fluxo.append(Paragraph("Consultoria MRTN · Jeferson Araujo Martinelle<br/>"
                               "Documento interno — não distribuir", s["capa_r"]))
        fluxo.append(NextPageTemplate("interna"))
        fluxo.append(PageBreak())
        # pula título e subtítulo já usados
        i = 1
        while i < len(linhas) and (not linhas[i].strip() or linhas[i].startswith("## ")
                                   or linhas[i].strip() == "---"):
            if linhas[i].startswith("## "):
                i += 1
                break
            i += 1

    while i < len(linhas):
        ln, t = linhas[i], linhas[i].strip()

        if t == "<!--pagebreak-->":
            fluxo.append(PageBreak()); i += 1; continue
        if not t:
            i += 1; continue
        if re.match(r"^(---+|\*\*\*+)$", t):
            fluxo.append(Spacer(1, 4))
            fluxo.append(HRFlowable(width="100%", thickness=0.6, color=BORDA))
            fluxo.append(Spacer(1, 8)); i += 1; continue

        if t.startswith("=| "):
            fluxo.append(Paragraph(inline(t[3:]), s["regra"])); i += 1; continue
        if t.startswith("!> "):
            bloco = []
            while i < len(linhas) and linhas[i].strip().startswith("!> "):
                bloco.append(linhas[i].strip()[3:]); i += 1
            fluxo.append(Paragraph(inline(" ".join(bloco)), s["alerta"])); continue
        if t.startswith(">"):
            bloco = []
            while i < len(linhas) and linhas[i].strip().startswith(">"):
                bloco.append(linhas[i].strip().lstrip(">").strip()); i += 1
            fluxo.append(Paragraph(inline(" ".join(bloco)), s["script"])); continue

        if t.startswith("### "):
            fluxo.append(Paragraph(inline(t[4:]), s["h3"])); i += 1; continue
        if t.startswith("## "):
            fluxo.append(Paragraph(inline(t[3:]), s["h2"])); i += 1; continue
        if t.startswith("# "):
            fluxo.append(Paragraph(inline(t[2:]), s["h2"])); i += 1; continue

        if t.startswith("|"):
            bloco = []
            while i < len(linhas) and linhas[i].strip().startswith("|"):
                bloco.append(linhas[i]); i += 1
            tb = tabela(bloco, s, largura)
            if tb:
                fluxo += [Spacer(1, 3), tb, Spacer(1, 11)]
            continue

        if re.match(r"^([-*]|\d+\.)\s+", t):
            itens, ordenada = [], bool(re.match(r"^\d+\.", t))
            while i < len(linhas):
                cur = linhas[i].strip()
                if not re.match(r"^([-*]|\d+\.)\s+", cur):
                    if cur and linhas[i].startswith(("  ", "\t")) and itens:
                        itens[-1] += " " + cur; i += 1; continue
                    break
                itens.append(re.sub(r"^([-*]|\d+\.)\s+", "", cur)); i += 1
            fluxo.append(ListFlowable(
                [ListItem(Paragraph(inline(x), s["li"]), leftIndent=16,
                          value=n + 1 if ordenada else None) for n, x in enumerate(itens)],
                bulletType="1" if ordenada else "bullet",
                start="1" if ordenada else "•",
                bulletFormat="%s." if ordenada else None,
                bulletFontSize=9.6, bulletOffsetY=0 if ordenada else -0.6,
                bulletColor=AZUL, leftIndent=16, bulletDedent=10,
                bulletFontName="Helvetica-Bold"))
            fluxo.append(Spacer(1, 8)); continue

        bloco = []
        while i < len(linhas) and linhas[i].strip() and not re.match(
                r"^(#{1,3} |\||>|!>|=\| |[-*] |\d+\.\s|---+$|<!--pagebreak-->)", linhas[i].strip()):
            bloco.append(linhas[i].strip()); i += 1
        if bloco:
            fluxo.append(Paragraph(inline(" ".join(bloco)), s["p"]))
    return fluxo


def gerar(md_path, pdf_path):
    md = pathlib.Path(md_path).read_text(encoding="utf-8")
    s = estilos()
    linhas = md.split("\n")
    tem_capa = linhas[0].startswith("# ")
    titulo = linhas[0][2:].strip() if tem_capa else "Documento"

    ME, MDIR, MT, MB = 20 * mm, 18 * mm, 22 * mm, 20 * mm
    largura = A4[0] - ME - MDIR

    def capa_deco(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(AZUL)
        canvas.rect(0, A4[1] - 9 * mm, A4[0], 9 * mm, stroke=0, fill=1)
        canvas.setFillColor(TINTA)
        canvas.rect(0, 0, A4[0], 5 * mm, stroke=0, fill=1)
        canvas.restoreState()

    def interna_deco(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(AZUL)
        canvas.rect(0, A4[1] - 5 * mm, A4[0], 5 * mm, stroke=0, fill=1)
        if LOGO.exists():                      # logo discreto no topo
            try:
                from PIL import Image as PILImage
                with PILImage.open(LOGO) as im:
                    prop = im.width / im.height
                h = 5.6 * mm
                canvas.drawImage(str(LOGO), ME, A4[1] - MT + 6 * mm, width=h * prop,
                                 height=h, mask="auto")
            except Exception:
                pass
        canvas.setFont("Helvetica", 7.3)
        canvas.setFillColor(CINZA)
        canvas.drawRightString(A4[0] - MDIR, A4[1] - MT + 7.6 * mm, titulo)
        canvas.setStrokeColor(BORDA); canvas.setLineWidth(0.4)
        canvas.line(ME, A4[1] - MT + 3.5 * mm, A4[0] - MDIR, A4[1] - MT + 3.5 * mm)
        canvas.line(ME, 14 * mm, A4[0] - MDIR, 14 * mm)
        canvas.drawString(ME, 10.5 * mm, "Consultoria MRTN — uso interno")
        canvas.setFont("Helvetica-Bold", 7.6)
        canvas.setFillColor(AZUL)
        canvas.drawRightString(A4[0] - MDIR, 10.5 * mm, str(doc.page))
        canvas.restoreState()

    doc = BaseDocTemplate(str(pdf_path), pagesize=A4, leftMargin=ME, rightMargin=MDIR,
                          topMargin=MT, bottomMargin=MB, title=titulo,
                          author="Consultoria MRTN")
    quadro = Frame(ME, MB, largura, A4[1] - MT - MB, id="c",
                   leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([
        PageTemplate(id="capa", frames=[quadro], onPage=capa_deco if tem_capa else interna_deco),
        PageTemplate(id="interna", frames=[quadro], onPage=interna_deco),
    ])
    doc.build(construir(md, s, largura, tem_capa))
    return pdf_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__.strip()); sys.exit(1)
    ent = pathlib.Path(sys.argv[1])
    sai = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else ent.with_suffix(".pdf")
    gerar(ent, sai)
    print(f"PDF gerado: {sai}  ({sai.stat().st_size/1024:.0f} KB)")
