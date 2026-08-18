#!/bin/bash
# =============================================================
# DEPLOY — MRTN Prospector
# 1. git push para versionar no GitHub
# 2. Deploy via API direto pro Netlify (site atualiza em 30s)
#
# Uso:
#   ./deploy.sh                       (mensagem automática)
#   ./deploy.sh "ajustei aba ligar"   (mensagem custom)
#   ./deploy.sh --skip-git            (só Netlify, pula git)
#   ./deploy.sh --skip-netlify        (só git, pula Netlify)
# =============================================================

set -e
cd "$(dirname "$0")"

# Cores
G='\033[0;32m'; Y='\033[0;33m'; R='\033[0;31m'; B='\033[0;36m'; N='\033[0m'

# Flags
SKIP_GIT=false
SKIP_NETLIFY=false
MSG=""
for arg in "$@"; do
  case "$arg" in
    --skip-git) SKIP_GIT=true ;;
    --skip-netlify) SKIP_NETLIFY=true ;;
    *) MSG="$arg" ;;
  esac
done

echo -e "${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"
echo -e "${B}🚀 DEPLOY MRTN${N}"
echo -e "${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"

# =============================================================
# PARTE 1 — GIT (versionamento)
# =============================================================
if [ "$SKIP_GIT" = false ]; then
  echo -e "\n${B}📚 PARTE 1 — Git (GitHub)${N}"

  if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${Y}⚠ Não é repo git, pulando…${N}"
  elif git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard | grep -v -E '^(\.netlify-|\.claude/|\.claude-plugin/|.*\.bak$|prospector-medicos - )')" ]; then
    echo -e "${Y}⚠ Nada para commitar.${N}"
  else
    echo -e "${Y}Mudanças:${N}"
    git status --short | head -15

    # Adiciona arquivos relevantes
    git add prospector-medicos.html 2>/dev/null || true
    git add relatorios.html 2>/dev/null || true
    git add index.html 2>/dev/null || true
    git add contratos/ 2>/dev/null || true
    git add netlify.toml 2>/dev/null || true
    git add manifest.json 2>/dev/null || true
    git add sw.js 2>/dev/null || true
    git add icon.svg 2>/dev/null || true
    git add _redirects 2>/dev/null || true
    git add CLAUDE.md 2>/dev/null || true
    git add deploy.sh 2>/dev/null || true
    git add .gitignore 2>/dev/null || true
    git add skills/ 2>/dev/null || true

    if git diff --cached --quiet; then
      echo -e "${Y}⚠ Nenhum arquivo relevante para commitar.${N}"
    else
      if [ -z "$MSG" ]; then
        DATE=$(date "+%d/%m/%Y %H:%M")
        MSG="Atualização $DATE"
      fi
      echo -e "${B}📝 Commit: ${N}${MSG}"
      git commit -m "$MSG" >/dev/null
      echo -e "${B}⬆ git push…${N}"
      git push origin main 2>&1 | tail -3
      echo -e "${G}✓ GitHub atualizado${N}"
    fi
  fi
else
  echo -e "${Y}⊘ Pulando git (--skip-git)${N}"
fi

# =============================================================
# PARTE 2 — NETLIFY (publicação)
# =============================================================
if [ "$SKIP_NETLIFY" = false ]; then
  echo -e "\n${B}🌐 PARTE 2 — Netlify (publicação)${N}"

  if [ ! -f .netlify-token ] || [ ! -f .netlify-site-id ]; then
    echo -e "${R}❌ Faltam credenciais. Esperado:${N}"
    echo -e "   .netlify-token    (Personal Access Token)"
    echo -e "   .netlify-site-id  (Site ID do Netlify)"
    exit 1
  fi

  TOKEN=$(cat .netlify-token)
  SITE_ID=$(cat .netlify-site-id)

  # Cria ZIP
  echo -e "${B}📦 Empacotando…${N}"
  rm -f .netlify-deploy.zip
  # Inclui arquivos estáticos, contratos e netlify/functions (necessário para assinatura digital)
  zip -q .netlify-deploy.zip netlify.toml _redirects manifest.json sw.js icon.svg index.html prospector-medicos.html relatorios.html 2>/dev/null || true
  [ -d contratos ] && zip -q -r .netlify-deploy.zip contratos/
  [ -d netlify/functions ] && zip -q -r .netlify-deploy.zip netlify/functions/
  SIZE=$(wc -c < .netlify-deploy.zip | tr -d ' ')
  echo -e "   ZIP: $(($SIZE / 1024)) KB"

  # POST pro Netlify
  echo -e "${B}⬆ Enviando para Netlify…${N}"
  RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/zip" \
    --data-binary @.netlify-deploy.zip \
    "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys")

  DEPLOY_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)
  STATE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('state',''))" 2>/dev/null)

  if [ -z "$DEPLOY_ID" ]; then
    echo -e "${R}❌ Erro no deploy:${N}"
    echo "$RESPONSE" | head -c 500
    rm -f .netlify-deploy.zip
    exit 1
  fi

  echo -e "   Deploy ID: $DEPLOY_ID"
  echo -e "   State inicial: $STATE"

  # Aguarda processamento
  echo -ne "${B}⏳ Processando${N}"
  for i in 1 2 3 4 5 6 7 8 9 10; do
    sleep 3
    echo -ne "."
    STATE=$(curl -s -H "Authorization: Bearer $TOKEN" \
      "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys/$DEPLOY_ID" \
      | python3 -c "import sys,json; print(json.load(sys.stdin).get('state','?'))" 2>/dev/null)
    if [ "$STATE" = "ready" ] || [ "$STATE" = "error" ]; then break; fi
  done
  echo ""

  rm -f .netlify-deploy.zip

  if [ "$STATE" = "ready" ]; then
    LIVE_SIZE=$(curl -s -o /dev/null -w "%{size_download}" "https://martinelle-pro.netlify.app/?nocache=$(date +%s)")
    LOCAL_SIZE=$(wc -c < prospector-medicos.html | tr -d ' ')
    echo -e "${G}✓ Netlify publicado${N}"
    echo -e "   Local:  $LOCAL_SIZE bytes"
    echo -e "   Online: $LIVE_SIZE bytes"
  elif [ "$STATE" = "error" ]; then
    echo -e "${R}❌ Build com erro. Veja em app.netlify.com${N}"
    exit 1
  else
    echo -e "${Y}⏳ Ainda processando (state: $STATE). Confira em ~30s.${N}"
  fi
else
  echo -e "${Y}⊘ Pulando Netlify (--skip-netlify)${N}"
fi

# =============================================================
# RESUMO
# =============================================================
echo ""
echo -e "${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"
echo -e "${G}✅ DEPLOY COMPLETO${N}"
echo -e "${G}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}"
echo -e "🌐 Site:    ${B}https://martinelle-pro.netlify.app${N}"
echo -e "📊 Admin:   ${B}https://app.netlify.com${N}"
echo -e "📦 GitHub:  ${B}https://github.com/jefersonaraujo1528/martinelle-pro${N}"
echo ""
