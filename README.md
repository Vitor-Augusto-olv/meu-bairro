# Meu Bairro — aplicativo mobile

Global Solution 2026/2 · CitizenTech · Mobile Application Development · FIAP

**Grupo C.A.V**

## Integrantes

- RM564227 — Vitor Augusto Oliveira de Abreu
- RM564662 — André Bellandi Vital Rodrigues
- RM563298 — Gabriel Garcia Mayo Delatore

## Vídeo de demonstração

<!-- COLAR AQUI o link do YouTube (máx. 3 min) -->

## A solução CitizenTech

**Meu Bairro** é um aplicativo de zeladoria colaborativa: o morador registra problemas do bairro (buraco,
poste ou iluminação, lixo, alagamento, calçada danificada), com foto e localização, e acompanha o andamento
até a resolução. Para a prefeitura, os registros chegam padronizados e com localização; para o morador, o
problema deixa de se perder em canais informais.

## Stack escolhida

**React Native com Expo e TypeScript**, com Expo Router na navegação e **AsyncStorage** na persistência local.

| Biblioteca                                | Uso                                                             |
| ----------------------------------------- | --------------------------------------------------------------- |
| Expo (SDK 58) + React Native + TypeScript | Base do app, com tipagem estática                               |
| Expo Router                               | Navegação baseada em arquivos, com rotas públicas e protegidas  |
| @react-native-async-storage/async-storage | Persistência local de usuários, ocorrências, histórico e sessão |
| expo-image-picker                         | Foto da ocorrência (câmera ou galeria)                          |
| expo-location                             | Localização para preencher o endereço                           |
| @expo-google-fonts (Barlow)               | Identidade visual                                               |
| ESLint + Prettier                         | Padronização e qualidade do código                              |

## Como executar

Requer Node (22.13 ou superior).

```bash
npm install
npx expo start
```

No terminal do Expo, pressione **`w`** para abrir no navegador (também funciona no Expo Go e no emulador
Android). Não é necessário configurar nada: sem variáveis de ambiente o app roda em **modo local**.

O arquivo `.npmrc` ativa `legacy-peer-deps`, porque o `react-dom` (usado só na versão web) conflita com a
versão do `react` no SDK 58 durante a instalação.

## Usuário de teste

| E-mail                | Senha       |
| --------------------- | ----------- |
| `teste@meubairro.com` | `Teste@123` |

Na primeira execução o app cria esse usuário e duas
ocorrências de exemplo. Também é possível criar uma conta nova pelo cadastro.

## Telas

| Tela                   | Função                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| Login                  | Entrada com e-mail e senha                                            |
| Cadastro               | Criação de conta, com validação dos campos                            |
| Ocorrências (lista)    | Lista com filtro Todas/Minhas e estados de erro e vazio               |
| Registrar (formulário) | Cadastra ocorrência com tipo, descrição, endereço, foto e localização |
| Detalhe (consulta)     | Foto, status, prioridade e histórico de andamento                     |
| Editar                 | Altera uma ocorrência (apenas do autor e com status Aberta)           |
| Perfil                 | Dados do usuário e logout                                             |
| Sobre o app            | Versão, origem dos dados e hash do commit de referência               |

## Persistência local

Os dados ficam no **AsyncStorage** do aparelho (no navegador, o `localStorage`): usuários, ocorrências,
histórico e sessão. Os dados persistem ao recarregar a página ou reabrir o app, e dá para limpar pelo menu do
navegador. Dois cuidados do modo local, adotados só para demonstração: as senhas ficam sem criptografia, e as
fotos são guardadas em base64, então o navegador limita a quantidade (use fotos pequenas).

## Arquitetura

```
app/              rotas (Expo Router): (auth) público e (app) protegido por login
src/services/     local (AsyncStorage), api (Axios), authService e ocorrenciaService
src/contexts/     AuthContext (sessão)
src/components/   componentes reutilizáveis
src/theme/        cores e fontes
src/types/        tipos TypeScript
src/utils/        validações e diálogos (web e celular)
src/constants/    categorias, status e hash do commit
```

As telas só falam com `authService` e `ocorrenciaService`, que escolhem entre o armazenamento local e a API.

## Integração opcional com a API Java

O projeto também tem uma API em Java/Spring Boot (<!-- COLAR AQUI o link do repositório da API -->). Se
`EXPO_PUBLIC_API_URL` estiver definida (veja `.env.example`), o app usa a API em vez do AsyncStorage. Essa
integração é opcional e funciona no Expo Go e no emulador; para avaliação, use o modo local.

## Identidade visual

Inspirada na sinalização urbana: asfalto (`#1E2A32`) e amarelo de alerta (`#F2B705`), com verde e vermelho
para o status. Fontes Barlow e Barlow Condensed. Ícone e splash em `assets/`.

## Qualidade do código

`npm run lint` e `npm run format`. O hash exibido na tela "Sobre o app" é gerado por `npm run commit-hash`
(último commit de código; o commit seguinte só atualiza esse valor).

## Uso de IA generativa

Claude (Anthropic) foi usado como apoio na estrutura inicial do projeto, nos componentes e na documentação. O
grupo executou, testou, revisou e adaptou o código.
