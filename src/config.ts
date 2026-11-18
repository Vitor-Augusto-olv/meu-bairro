// Sem EXPO_PUBLIC_API_URL o app roda em modo local (AsyncStorage); com ela, usa a API Java.
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim();
export const MODO_LOCAL = API_URL === '';

export const TOKEN_KEY = 'meubairro.token';
export const USUARIO_KEY = 'meubairro.usuario';

export const USUARIO_TESTE = { email: 'teste@meubairro.com', senha: 'Teste@123' };
