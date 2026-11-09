# O que o mobile precisa das outras matérias

## Java Advanced OU .NET — API (CRÍTICO: 30 pts de CRUD + 20 pts de auth no Mobile)
Base URL = `EXPO_PUBLIC_API_URL`. O app espera exatamente este contrato:

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| POST | /auth/register | JSON `{nome, email, senha}` | 201 |
| POST | /auth/login | JSON `{email, senha}` | `{token, usuario:{id,nome,email}}` (401 se inválido) |
| GET | /ocorrencias | — | lista de ocorrências |
| GET | /ocorrencias/{id} | — | ocorrência |
| POST | /ocorrencias | multipart: titulo, descricao, categoria, endereco, latitude?, longitude?, foto? | ocorrência criada |
| PUT | /ocorrencias/{id} | mesmo multipart | ocorrência atualizada |
| DELETE | /ocorrencias/{id} | — | 204 |

Ocorrência: `{id, titulo, descricao, categoria, status, endereco, latitude, longitude, fotoUrl, criadoEm, usuarioId}`
- categoria: BURACO, ILUMINACAO, LIXO, ALAGAMENTO, CALCADA, OUTRO
- status: ABERTA, EM_ANALISE, RESOLVIDA (nasce ABERTA)
- Rotas /ocorrencias protegidas por JWT (`Authorization: Bearer`); só o dono edita/exclui (403).
- `fotoUrl` precisa ser uma URL pública (https) acessível pelo celular.
- Erros em JSON com campo `message` (o app exibe esse texto).
- Se a API usar rate limiting, retornar 429.

## DevOps (deploy)
- API publicada em URL HTTPS e **no ar durante todo o período de avaliação** (exigência do Mobile).
- Pipeline CI/CD e variáveis/segredos fora do repositório.

## Banco de dados (Relational / NoSQL)
- Tabelas/coleções: usuário e ocorrência (campos acima), com índice por usuarioId e status.
- Estratégia para guardar as fotos (disco do servidor, blob storage ou base64 — decidir com o time).

## IoT / IA Generativa
- Endpoint de IA que o app possa chamar, por exemplo `POST /ocorrencias/classificar` (foto → categoria,
  descrição sugerida e urgência). Quando existir, eu ligo na tela de Registrar.
- README da matéria com arquitetura, métricas e limitações (exigido na disciplina).

## Testes / Qualidade
- Casos de teste dos fluxos de login e CRUD (para o time de QA usar no app).

## Do grupo (não é código)
- Cadastrar o grupo até **13/11**; entrega **19/11 às 23h55**.
- E-mail do professor como colaborador do GitHub e tester no Firebase.
- Vídeo de até 5 min no YouTube; .txt com nome do grupo, integrantes, link do vídeo e do repositório.
