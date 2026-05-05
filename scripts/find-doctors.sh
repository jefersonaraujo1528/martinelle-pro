#!/bin/bash
# Encontra médicos em Teresina-PI via Doctoralia
# Uso: ./find-doctors.sh <especialidade> <quantidade>
# Ex:  ./find-doctors.sh dermatologista 8

export ESPEC="${1:-dermatologista}"
export QTD="${2:-8}"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

mkdir -p /tmp/martinelle
LIST_FILE="/tmp/martinelle/list-${ESPEC}.html"

curl -s -A "$UA" "https://www.doctoralia.com.br/pesquisa?q=${ESPEC}&loc=teresina-pi" -o "$LIST_FILE"

python3 <<'PYEOF'
import re, json, subprocess, os

ESPEC = os.environ.get("ESPEC", "dermatologista")
QTD = int(os.environ.get("QTD", "8"))
LIST_FILE = f"/tmp/martinelle/list-{ESPEC}.html"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

with open(LIST_FILE) as f:
    html = f.read()

ld_blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)

physicians = []
def collect(node):
    if isinstance(node, dict):
        t = str(node.get("@type", ""))
        if "Physician" in t or "Doctor" in t:
            physicians.append(node)
        for k, v in node.items():
            if k != "@type":
                collect(v)
    elif isinstance(node, list):
        for x in node:
            collect(x)

for block in ld_blocks:
    try:
        collect(json.loads(block))
    except Exception:
        pass

doctors = []
seen = set()
for p in physicians:
    name = (p.get("name") or "").strip()
    if not name or name in seen:
        continue
    if not name.lower().startswith(("dr", "dra")):
        continue
    seen.add(name)

    address = ""
    addr = p.get("address")
    if isinstance(addr, dict):
        address = ", ".join([x for x in [addr.get("streetAddress"), addr.get("addressLocality")] if x])
    elif isinstance(addr, list) and addr and isinstance(addr[0], dict):
        a = addr[0]
        address = ", ".join([x for x in [a.get("streetAddress"), a.get("addressLocality")] if x])

    url = p.get("url", "")
    if url and not url.startswith("http"):
        url = "https://www.doctoralia.com.br" + url

    doctors.append({"name": name, "address": address, "url": url, "specialty": ESPEC.capitalize()})
    if len(doctors) >= QTD * 2:
        break

# Para cada médico, busca telefone na página individual
result = []
for d in doctors[:QTD]:
    phone = ""
    page = ""
    if d["url"]:
        try:
            r = subprocess.run(["curl", "-s", "-A", UA, "--max-time", "10", d["url"]],
                               capture_output=True, text=True, timeout=15)
            page = r.stdout
            m = re.search(r'\((\d{2})\)\s*(\d{4,5})-?(\d{4})', page)
            if m:
                phone = f"({m.group(1)}) {m.group(2)}-{m.group(3)}"
        except Exception:
            pass

    neighborhood = ""
    for b in ["Diamond Center", "Fátima", "Ininga", "Jóquei", "Centro Norte", "Centro", "Zona Leste", "Manhattan"]:
        if b.lower() in d["address"].lower() or b.lower() in page.lower():
            neighborhood = b
            break

    if phone and neighborhood:
        score, acao = "ALTO", "VISITAR"
    elif phone and d["address"]:
        score, acao = "MEDIO", "VISITAR"
    elif phone:
        score, acao = "MEDIO", "LIGAR"
    else:
        score, acao = "BAIXO", "PESQUISAR"

    result.append({**d, "phone": phone, "neighborhood": neighborhood, "score": score, "acao": acao})

print(json.dumps(result, ensure_ascii=False, indent=2))
PYEOF
