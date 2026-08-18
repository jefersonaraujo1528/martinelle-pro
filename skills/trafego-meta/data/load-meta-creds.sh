#!/bin/bash
# load-meta-creds.sh — Carrega credenciais Meta API
# Detecta automaticamente: (A) env vars já populadas → (B) data/.env no squad → (C) 1Password CLI
# Uso: source ./data/load-meta-creds.sh
#
# Ver data/meta-api-credentials.md pra documentação completa.

# --- 1. Descobrir o diretório do próprio script (independente de onde foi sourced) ---
if [ -n "${BASH_SOURCE[0]}" ]; then
  _META_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
else
  _META_SCRIPT_DIR="$(cd "$(dirname "$0")" >/dev/null 2>&1 && pwd)"
fi

# --- 2. Tentar Opção A: env vars já populadas ---
if [ -n "$META_TOKEN" ] && [ -n "$META_ACCT_MAIN" ]; then
  _META_SOURCE="env"
fi

# --- 3. Se não, tentar Opção B: arquivo .env no diretório do script ---
if [ -z "$_META_SOURCE" ] && [ -f "${_META_SCRIPT_DIR}/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "${_META_SCRIPT_DIR}/.env"
  set +a
  if [ -n "$META_TOKEN" ]; then
    _META_SOURCE=".env"
  fi
fi

# --- 4. Se não, tentar Opção C: 1Password CLI ---
if [ -z "$_META_SOURCE" ] && command -v op >/dev/null 2>&1; then
  _META_VAULT="${META_OP_VAULT:-Private}"
  _META_ITEM="${META_OP_ITEM:-Meta API}"
  if op item get "$_META_ITEM" --vault "$_META_VAULT" >/dev/null 2>&1; then
    export META_TOKEN=$(op read "op://${_META_VAULT}/${_META_ITEM}/access_token" 2>/dev/null)
    export META_API_VERSION=$(op read "op://${_META_VAULT}/${_META_ITEM}/api_version" 2>/dev/null)
    export META_APP_ID=$(op read "op://${_META_VAULT}/${_META_ITEM}/app_id" 2>/dev/null)
    export META_BM_ID=$(op read "op://${_META_VAULT}/${_META_ITEM}/bm_id" 2>/dev/null)
    export META_ACCT_MAIN=$(op read "op://${_META_VAULT}/${_META_ITEM}/account_main" 2>/dev/null)
    export META_ACCT_ESCALA=$(op read "op://${_META_VAULT}/${_META_ITEM}/account_escala" 2>/dev/null)
    export META_ACCT_TESTE=$(op read "op://${_META_VAULT}/${_META_ITEM}/account_teste" 2>/dev/null)
    export META_PIXEL=$(op read "op://${_META_VAULT}/${_META_ITEM}/pixel_id" 2>/dev/null)
    export META_PAGE=$(op read "op://${_META_VAULT}/${_META_ITEM}/page_id" 2>/dev/null)
    export META_IG=$(op read "op://${_META_VAULT}/${_META_ITEM}/ig_user_id" 2>/dev/null)
    [ -n "$META_TOKEN" ] && _META_SOURCE="1Password (vault: $_META_VAULT)"
  fi
fi

# --- 5. Defaults pra valores opcionais ---
export META_API_VERSION="${META_API_VERSION:-v21.0}"

# --- 6. Validar e reportar ---
if [ -z "$META_TOKEN" ] || [ -z "$META_ACCT_MAIN" ]; then
  echo "ERRO: credenciais Meta não encontradas." >&2
  echo "Configure uma destas opções (ver data/meta-api-credentials.md):" >&2
  echo "  A) export META_TOKEN=... (env vars no shell)" >&2
  echo "  B) Crie ${_META_SCRIPT_DIR}/.env" >&2
  echo "  C) 1Password CLI: item 'Meta API' em vault \$META_OP_VAULT (default: Private)" >&2
  return 1 2>/dev/null || exit 1
fi

# Mascarar token no log (mostra primeiros 10 chars + ...)
_META_TOKEN_MASKED="${META_TOKEN:0:10}...${META_TOKEN: -4}"

echo "✓ Meta API creds carregadas (origem: ${_META_SOURCE})"
echo "  - API: ${META_API_VERSION}"
echo "  - BM: ${META_BM_ID:-?}"
echo "  - Main account: ${META_ACCT_MAIN}"
[ -n "$META_ACCT_ESCALA" ] && echo "  - Escala account: ${META_ACCT_ESCALA}"
[ -n "$META_ACCT_TESTE" ] && echo "  - Teste account: ${META_ACCT_TESTE}"
echo "  - Pixel: ${META_PIXEL:-?}"
echo "  - Page: ${META_PAGE:-?}"
echo "  - IG: ${META_IG:-?}"
echo "  - Token: ${_META_TOKEN_MASKED}"

unset _META_SCRIPT_DIR _META_SOURCE _META_VAULT _META_ITEM _META_TOKEN_MASKED
