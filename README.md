# Meu Bairro — app mobile (Global Solution 2026/2 · CitizenTech)

App React Native (Expo + TypeScript + Expo Router) para moradores registrarem problemas do
bairro (buraco, poste quebrado, lixo, alagamento...) e acompanharem o andamento.
Cidadão beneficiado: morador. ODS: 11 (Cidades e comunidades sustentáveis).

## Integrantes
<!-- RM, nome completo e turma de cada integrante -->

## Vídeo de demonstração
<!-- link do YouTube (máx. 5 min) -->

## Telas (7 + Sobre)
Login · Cadastro · Lista de ocorrências · Registrar · Detalhe · Editar · Perfil · Sobre o app

## Como rodar
```bash
npm install
npx expo install --fix      # alinha as versões das libs com o SDK
cp .env.example .env        # preencha EXPO_PUBLIC_API_URL
npx expo start
```

## Arquitetura
```
app/        rotas (Expo Router): (auth) público, (app) protegido por login
src/services/    acesso à API (Axios) — telas nunca chamam Axios direto
src/contexts/    AuthContext (sessão no SecureStore)
src/components/  componentes reutilizáveis
src/theme/       cores e fontes
src/types/       tipos TypeScript
```
Lint/format: `npm run lint` · `npm run format`.

## Publicação (Firebase App Distribution)
1. Faça o commit do código e rode `npm run commit-hash`; faça o build já com o hash gerado.
2. Gere o APK: `eas build -p android --profile preview` (ou `npx expo prebuild` + Gradle).
3. Firebase Console → App Distribution → envie o APK e adicione o e-mail do professor como tester.
4. Dê commit do `src/constants/commit.ts` atualizado. A tela "Sobre o app" mostra esse hash.

## Uso de IA generativa
<!-- Obrigatório declarar. Ex.: "Claude: estrutura inicial do projeto; revisado e adaptado pelo grupo." -->

## Desenvolvendo sem o backend (mock)
```bash
cd mock-api && npm install && npm start
```
No `.env`: `EXPO_PUBLIC_API_URL=http://IP-DO-SEU-PC:3333/api` (celular e PC na mesma rede).
Os dados ficam em memória e somem ao reiniciar. Para a entrega, aponte para a API real (HTTPS).
