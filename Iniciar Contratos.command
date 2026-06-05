#!/bin/bash
cd "$(dirname "$0")"

# Encerra instância anterior se houver
lsof -ti:3765 | xargs kill -9 2>/dev/null

# Node do Claude Code (funciona nesta máquina)
NODE="/Users/marciolinhares/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

# Fallback para node do sistema
[ ! -x "$NODE" ] && NODE=$(command -v node 2>/dev/null)
[ ! -x "$NODE" ] && NODE=$(ls /opt/homebrew/bin/node /usr/local/bin/node 2>/dev/null | head -1)

if [ -z "$NODE" ]; then
  osascript -e 'display alert "Node.js não encontrado." message "Instale em: nodejs.org/pt-br" buttons {"OK"}'
  exit 1
fi

"$NODE" servidor-local.js
