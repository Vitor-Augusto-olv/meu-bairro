#!/usr/bin/env bash
# Cria commits pequenos e em ordem lógica. Uso: bash scripts/fazer-commits.sh [N]
# Sem argumento faz todos; com N faz só o passo N (ideal para commitar aos poucos).
set -e
passo() { # $1=numero $2=mensagem $3...=caminhos
  local n=$1 msg=$2; shift 2
  if [ -n "$ONLY" ] && [ "$ONLY" != "$n" ]; then return; fi
  git add -- "$@" && git diff --cached --quiet || git commit -m "$msg"
}
ONLY=$1
passo 1  "chore: inicializa projeto Expo com TypeScript e Expo Router" package.json app.json tsconfig.json .gitignore .env.example
passo 2  "chore: configura ESLint e Prettier" eslint.config.js .prettierrc
passo 3  "feat: adiciona tema (cores e fontes), tipos e categorias" src/theme src/types src/constants/categorias.ts
passo 4  "feat: adiciona camada de serviços com Axios e interceptor de token" src/services src/utils
passo 5  "feat: adiciona AuthContext com sessão no SecureStore" src/contexts
passo 6  "feat: cria componentes base (Button, Input, Loader, Aviso)" src/components/Button.tsx src/components/Input.tsx src/components/Loader.tsx src/components/Aviso.tsx
passo 7  "feat: telas de login e cadastro com redirecionamento de rotas" app/_layout.tsx "app/(auth)"
passo 8  "feat: lista de ocorrências com filtro, refresh e estado vazio" "app/(app)/_layout.tsx" "app/(app)/(tabs)/_layout.tsx" "app/(app)/(tabs)/index.tsx" src/components/CardOcorrencia.tsx src/components/StatusBadge.tsx
passo 9  "feat: formulário e tela de registro de ocorrência (foto e localização)" src/components/OcorrenciaForm.tsx "app/(app)/(tabs)/nova.tsx"
passo 10 "feat: detalhe, edição e exclusão de ocorrência" "app/(app)/ocorrencia" "app/(app)/editar"
passo 11 "feat: perfil com logout e tela Sobre com hash do commit" "app/(app)/(tabs)/perfil.tsx" "app/(app)/sobre.tsx" scripts/gerar-commit-hash.js src/constants/commit.ts
passo 12 "chore: adiciona API mock para desenvolvimento" mock-api
passo 13 "docs: adiciona README e pendências das outras matérias" README.md PENDENCIAS_OUTRAS_MATERIAS.md scripts/fazer-commits.sh
echo "Feito. Veja: git log --oneline"
