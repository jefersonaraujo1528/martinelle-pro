#!/usr/bin/env python3
# Gera os PNGs do logo Consultoria MRTN a partir do mesmo desenho do SVG.
# Transparente, alta resolução, recortado no conteúdo.
import math
from PIL import Image, ImageDraw, ImageFont

BLUE = (47, 107, 255, 255)          # #2F6BFF
ARIAL_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
ARIAL      = "/System/Library/Fonts/Supplemental/Arial.ttf"
S = 4                                # escala sobre o viewBox 560x170

def P(x, y):                         # ponto do SVG -> pixel
    return (x * S, y * S)

def make(neutral, out):
    W, H = 560 * S, 200 * S
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # --- pico sólido (contraste) ---
    d.polygon([P(50,142), P(94,142), P(72,72)], fill=neutral)

    # --- linha de crescimento azul (com juntas arredondadas + caps) ---
    pts = [P(16,142), P(50,80), P(80,108), P(118,42)]
    wln = 17 * S
    d.line(pts, fill=BLUE, width=wln, joint="curve")
    r = wln // 2
    for (x, y) in (pts[0], pts[-1]):
        d.ellipse([x-r, y-r, x+r, y+r], fill=BLUE)

    # --- seta na ponta, orientada pela direção do último segmento ---
    ex, ey = P(118, 42)
    px, py = P(80, 108)
    dx, dy = ex - px, ey - py
    L = math.hypot(dx, dy); ux, uy = dx/L, dy/L; nx, ny = -uy, ux
    tip  = (ex + ux*70, ey + uy*70)
    bc   = (ex - ux*26, ey - uy*26)
    hw   = 72
    b1   = (bc[0] + nx*hw, bc[1] + ny*hw)
    b2   = (bc[0] - nx*hw, bc[1] - ny*hw)
    d.polygon([tip, b1, b2], fill=BLUE)

    # --- wordmark ---
    f_mrtn = ImageFont.truetype(ARIAL_BOLD, 88 * S)
    f_cons = ImageFont.truetype(ARIAL, 23 * S)

    # CONSULTORIA — tracking manual
    cx, cy = P(184, 60)
    gap = 8 * S
    for ch in "CONSULTORIA":
        d.text((cx, cy), ch, font=f_cons, fill=neutral, anchor="ls")
        cx += d.textlength(ch, font=f_cons) + gap

    # MRTN — "MRT" neutro + "N" azul
    mx, my = P(180, 140)
    d.text((mx, my), "MRT", font=f_mrtn, fill=neutral, anchor="ls")
    mx += d.textlength("MRT", font=f_mrtn) + 2 * S
    d.text((mx, my), "N", font=f_mrtn, fill=BLUE, anchor="ls")

    # recorta ao conteúdo, com leve respiro
    bbox = img.getbbox()
    pad = 10 * S
    bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(W, bbox[2]+pad), min(H, bbox[3]+pad))
    img.crop(bbox).save(out)
    print("ok:", out, img.crop(bbox).size)

make((255, 255, 255, 255), "logo-branco.png")
make((14, 19, 32, 255),    "logo-preto.png")
make((14, 19, 32, 255),    "contratos/logo-martinelle.png")
