import { LoginResposta } from '../types';
import { api } from './api';

export async function entrar(email: string, senha: string) {
  const { data } = await api.post<LoginResposta>('/auth/login', {
    email: email.trim().toLowerCase(),
    senha,
  });
  return data;
}

export async function registrar(nome: string, email: string, senha: string) {
  await api.post('/auth/register', {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
  });
}
