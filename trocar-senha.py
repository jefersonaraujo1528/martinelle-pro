#!/usr/bin/env python3
"""
Troca a senha da equipe nas 4 páginas de uma vez.

A senha NUNCA entra no código: o que fica gravado é só o hash SHA-256 dela.
Assim, quem abrir o código-fonte do site não consegue ler a sua senha.

COMO USAR
---------
1) Gere o hash da senha que VOCÊ escolheu (a senha não sai do seu computador):

       printf '%s' 'MINHA_SENHA_NOVA' | shasum -a 256 | cut -d' ' -f1

2) Rode este script com o hash que apareceu:

       python3 trocar-senha.py <hash-de-64-caracteres>

3) Publique:

       git add -A && git commit -m "Troca a senha da equipe" && git push origin HEAD:main

IMPORTANTE: isto tira a senha do código, mas NÃO protege os dados sozinho.
Quem protege é o RLS do Supabase — veja SEGURANCA-URGENTE.md.
"""
import re
import sys
import pathlib

ARQUIVOS = [
    "index.html",
    "prospector-medicos.html",
    "relatorios.html",
    "contratos/index.html",
]

# Onde a senha (ou o hash antigo) pode estar declarada em cada página.
PADROES = [
    re.compile(r"""(const\s+TEAM_PASS_HASH\s*=\s*')[0-9a-f]{64}(')"""),
    re.compile(r"""(const\s+TEAM_PASSWORD\s*=\s*')[^']*(')"""),
    re.compile(r"""(var\s+SENHA_HASH\s*=\s*')[0-9a-f]{64}(')"""),
    re.compile(r"""(var\s+SENHA\s*=\s*')[^']*(')"""),
]


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 1

    novo = sys.argv[1].strip().lower()
    if not re.fullmatch(r"[0-9a-f]{64}", novo):
        print("❌ Isso não parece um hash SHA-256.")
        print("   Esperado: 64 caracteres, só números e letras de a-f.")
        print(f"   Recebido: {len(novo)} caractere(s).")
        print()
        print("   Gere assim (troque pela sua senha):")
        print("     printf '%s' 'MINHA_SENHA_NOVA' | shasum -a 256 | cut -d' ' -f1")
        return 1

    raiz = pathlib.Path(__file__).parent
    total = 0

    for nome in ARQUIVOS:
        caminho = raiz / nome
        if not caminho.exists():
            print(f"·  {nome} — não encontrado, pulando")
            continue

        texto = caminho.read_text(encoding="utf-8")
        original = texto
        trocas = 0

        for padrao in PADROES:
            texto, n = padrao.subn(rf"\g<1>{novo}\g<2>", texto)
            trocas += n

        # Renomeia as constantes antigas para o nome novo, se ainda existirem.
        texto = texto.replace("const TEAM_PASSWORD =", "const TEAM_PASS_HASH =")
        texto = texto.replace("TEAM_PASSWORD", "TEAM_PASS_HASH")
        texto = texto.replace("var SENHA =", "var SENHA_HASH =")

        if texto != original:
            caminho.write_text(texto, encoding="utf-8")
            print(f"✅ {nome} — atualizado ({trocas} ocorrência(s))")
            total += trocas
        else:
            print(f"·  {nome} — nada para trocar")

    if total:
        print()
        print(f"Pronto: {total} ocorrência(s) trocadas.")
        print("Agora publique:")
        print("  git add -A && git commit -m 'Troca a senha da equipe' && git push origin HEAD:main")
    else:
        print()
        print("⚠️  Nenhuma troca feita — confira se as páginas já usam TEAM_PASS_HASH.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
