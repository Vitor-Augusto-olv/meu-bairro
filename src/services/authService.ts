import { MODO_LOCAL } from '../config';
import { LoginResposta } from '../types';
import { api } from './api';
import * as local from './local';

export async function entrar(email: string, senha: string) {
  if (MODO_LOCAL) return local.entrar(email, senha);
  const { data } = await api.post<LoginResposta>('/auth/login', {
    email: email.trim().toLowerCase(),
    senha,
  });
  return data;
}

export async function registrar(nome: string, email: string, senha: string) {
  if (MODO_LOCAL) return local.registrar(nome, email, senha);
  await api.post('/auth/register', {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
  });
}
