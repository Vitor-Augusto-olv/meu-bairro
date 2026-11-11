import axios, { isAxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

export const TOKEN_KEY = 'meubairro.token';
export const USUARIO_KEY = 'meubairro.usuario';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let aoExpirarSessao: (() => void) | null = null;
export const definirAoExpirarSessao = (fn: () => void) => {
  aoExpirarSessao = fn;
};

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const url: string = erro.config?.url ?? '';
    if (erro.response?.status === 401 && !url.startsWith('/auth')) aoExpirarSessao?.();
    return Promise.reject(erro);
  },
);

export function mensagemDeErro(erro: unknown): string {
  if (isAxiosError(erro)) {
    if (!erro.response) return 'Sem conexão com o servidor. Tente de novo.';
    const dados = erro.response.data;
    const campos = dados?.fields;
    if (Array.isArray(campos) && campos.length) return campos.map((c: { message: string }) => c.message).join('\n');
    const msg = typeof dados === 'string' ? dados : (dados?.message ?? dados?.detail);
    if (msg) return String(msg);
    if (erro.response.status === 401) return 'E-mail ou senha incorretos.';
    if (erro.response.status === 403) return 'Você não tem permissão para isso.';
    if (erro.response.status === 404) return 'Não encontrado.';
    if (erro.response.status === 429) return 'Muitas tentativas. Aguarde um instante.';
  }
  return 'Algo deu errado. Tente novamente.';
}
