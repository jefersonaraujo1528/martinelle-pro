#!/bin/bash
# Busca médicos e envia formatado para Telegram
# Uso: ./send-doctors-telegram.sh <especialidade> <quantidade> <header>

ESPEC="${1:-dermatologista}"
QTD="${2:-8}"
HEADER="${3:-Medicos do dia}"
BOT="8369473496:AAEnOecCYlSX34AlIc0S3gV8Ri-7AnpGYPw"
CHAT="6879863552"

DIR="$(cd "$(dirname "$0")" && pwd)"
JSON=$("$DIR/find-doctors.sh" "$ESPEC" "$QTD")

MSG=$(python3 <<PYEOF
import json, os
from datetime import datetime

doctors = json.loads('''$JSON''')
header = "$HEADER"
espec = "$ESPEC".capitalize()

dias = ['Domingo','Segunda','Terca','Quarta','Quinta','Sexta','Sabado']
hoje = dias[datetime.now().weekday() + 1 if datetime.now().weekday() < 6 else 0]
data = datetime.now().strftime('%d/%m')

out = [f"<b>🏥 {header} — {hoje} {data}</b>"]
out.append(f"<i>Especialidade: {espec} | {len(doctors)} medicos</i>\n")

altos = [d for d in doctors if d['score']=='ALTO']
medios = [d for d in doctors if d['score']=='MEDIO']

if altos:
    out.append("<b>🔥 PRIORIDADE ALTA</b>")
    for d in altos:
        emoji = '🚶' if d['acao']=='VISITAR' else '📞'
        out.append(f"\n{emoji} <b>{d['name']}</b>")
        if d['phone']: out.append(f"  📞 {d['phone']}")
        if d['address']: out.append(f"  📍 {d['address']}")
        if d['neighborhood']: out.append(f"  🏢 {d['neighborhood']}")
        out.append(f"  ➜ <b>{d['acao']}</b>")

if medios:
    out.append("\n<b>🟡 MEDIA PRIORIDADE</b>")
    for d in medios:
        emoji = '🚶' if d['acao']=='VISITAR' else '📞'
        out.append(f"\n{emoji} <b>{d['name']}</b>")
        if d['phone']: out.append(f"  📞 {d['phone']}")
        if d['address']: out.append(f"  📍 {d['address']}")
        out.append(f"  ➜ <b>{d['acao']}</b>")

out.append("\n<i>💡 Aparecer como REPRESENTANTE da Martinelle.\nNa recepcao: pergunte quando o medico recebe representantes.</i>")
out.append("\n<i>Hermano — Agencia Martinelle</i>")
print("\n".join(out))
PYEOF
)

curl -s -X POST "https://api.telegram.org/bot${BOT}/sendMessage" \
  --data-urlencode "chat_id=${CHAT}" \
  --data-urlencode "parse_mode=HTML" \
  --data-urlencode "text=${MSG}"
