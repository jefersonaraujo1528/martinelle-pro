#!/bin/bash
# =============================================================
# DEPLOY — Martinelle Prospector
# Faz commit + push do prospector-medicos.html (e relacionados)
# para o GitHub. Netlify deploya automaticamente em ~1 min.
#
# Uso:
#   ./deploy.sh                       (mensagem automática)
#   ./deploy.sh "ajustei a aba ligar" (mensagem custom)
# =============================================================

set -e
cd "$(dirname "$0")"

# Cores
G='\033[0;32m'; Y='\033[0;33m'; R='\033[0;31m'; B='\033[0;36m'; N='\033[0m'

echo -e "${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"
echo -e "${B}🚀 DEPLOY MARTINELLE${N}"
echo -e "${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"

# 1. Verifica se está em um repo git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${R}❌ Não é um repositório git${N}"
  exit 1
fi

# 2. Verifica se há mudanças
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo -e "${Y}⚠ Nenhuma mudança detectada. Nada para enviar.${N}"
  exit 0
fi

# 3. Mostra o que vai ser enviado
echo -e "\n${Y}📋 Mudanças detectadas:${N}"
git status --short | head -20

# 4. Confirma antes de fazer push
echo ""
read -p "$(echo -e ${Y}Enviar essas mudanças para o Netlify? [s/N]:${N} )" confirm
if [[ ! "$confirm" =~ ^[sSyY]$ ]]; then
  echo -e "${R}✕ Cancelado.${N}"
  exit 0
fi

# 5. Adiciona arquivos relevantes (NÃO faz add . por segurança)
echo -e "\n${B}📦 Adicionando arquivos…${N}"
git add prospector-medicos.html 2>/dev/null || true
git add netlify.toml 2>/dev/null || true
git add manifest.json 2>/dev/null || true
git add sw.js 2>/dev/null || true
git add icon.svg 2>/dev/null || true
git add _redirects 2>/dev/null || true
git add CLAUDE.md 2>/dev/null || true
git add crm-pipeline.json 2>/dev/null || true
git add deploy.sh 2>/dev/null || true
git add .gitignore 2>/dev/null || true
git add skills/ 2>/dev/null || true
git add .claude/ 2>/dev/null || true
git add .claude-plugin/ 2>/dev/null || true

# 6. Mensagem de commit
if [ -n "$1" ]; then
  MSG="$1"
else
  DATE=$(date "+%d/%m/%Y %H:%M")
  MSG="Atualização $DATE"
fi

# 7. Commit
echo -e "${B}📝 Commit: ${N}${MSG}"
git commit -m "$MSG" || {
  echo -e "${Y}⚠ Nada de novo para commitar.${N}"
  exit 0
}

# 8. Push
echo -e "\n${B}⬆ Enviando para o GitHub…${N}"
git push origin main

# 9. Sucesso
echo ""
echo -e "${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"
echo -e "${G}✅ DEPLOY ENVIADO!${N}"
echo -e "${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"
echo ""
echo -e "Netlify vai publicar em ~1 minuto."
echo -e "Acompanhe: ${B}https://app.netlify.com${N}"
echo -e "Site:      ${B}https://martinelle-pro.netlify.app${N}"
echo ""
