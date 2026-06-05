#!/bin/bash
# =============================================
#  Agência Martinelle — Gerador de Contratos
#  Duplo clique para abrir no navegador
# =============================================

cd "$(dirname "$0")"

echo ""
echo "  ======================================"
echo "  Agência Martinelle — Contratos"
echo "  ======================================"
echo ""

# Encontrar Node.js (tenta vários lugares comuns)
NODE=""
CANDIDATES=(
  "node"
  "/opt/homebrew/bin/node"
  "/usr/local/bin/node"
  "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  "/usr/local/nvm/versions/node/*/bin/node"
)
for candidate in "${CANDIDATES[@]}"; do
  # expande globs para nvm
  for expanded in $candidate; do
    if [ -x "$expanded" ] 2>/dev/null; then
      NODE="$expanded"; break 2
    fi
    if command -v "$expanded" &>/dev/null 2>/dev/null; then
      NODE="$expanded"; break 2
    fi
  done
done

# Tenta via NVM
if [ -z "$NODE" ] && [ -d "$HOME/.nvm" ]; then
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh" 2>/dev/null
  NODE=$(command -v node 2>/dev/null)
fi

if [ -z "$NODE" ] || [ ! -f "$NODE" -a -z "$(command -v $NODE 2>/dev/null)" ]; then
  echo "  ❌ Node.js não encontrado."
  echo ""
  echo "  Instale o Node.js em: https://nodejs.org/pt-br/"
  echo "  (versão LTS, gratuito)"
  echo ""
  read -p "  Pressione Enter para fechar..."
  exit 1
fi

echo "  ✅ Node.js: $NODE"

# Encerrar servidor anterior na porta 3765
lsof -ti:3765 | xargs kill -9 2>/dev/null
sleep 1

# Iniciar servidor
echo "  Iniciando servidor..."
"$NODE" servidor-local.js &
SERVER_PID=$!

# Aguardar servidor subir (máx 8s)
STARTED=0
for i in 1 2 3 4 5 6 7 8; do
  sleep 1
  if curl -s --max-time 1 http://localhost:3765/ > /dev/null 2>&1; then
    STARTED=1; break
  fi
done

if [ $STARTED -eq 0 ]; then
  echo "  ⚠️  Servidor demorou para iniciar. Tentando abrir mesmo assim..."
fi

# Abrir navegador
open "http://localhost:3765/contratos/index.html"

echo ""
echo "  ======================================"
echo "  ✅ Gerador de Contratos aberto!"
echo ""
echo "  URL: http://localhost:3765/contratos/index.html"
echo ""
echo "  Mantenha esta janela aberta."
echo "  Para encerrar: feche esta janela."
echo "  ======================================"
echo ""

# Aguarda o servidor (mantém o processo vivo)
wait $SERVER_PID
