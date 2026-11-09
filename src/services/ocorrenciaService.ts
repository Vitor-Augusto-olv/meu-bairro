import { Ocorrencia, OcorrenciaFormDados } from '../types';
import { api } from './api';

function montarFormData(dados: OcorrenciaFormDados) {
  const form = new FormData();
  form.append('titulo', dados.titulo.trim());
  form.append('descricao', dados.descricao.trim());
  form.append('categoria', dados.categoria);
  form.append('endereco', dados.endereco.trim());
  if (dados.latitude != null) form.append('latitude', String(dados.latitude));
  if (dados.longitude != null) form.append('longitude', String(dados.longitude));
  if (dados.fotoUri && !dados.fotoUri.startsWith('http')) {
    form.append('foto', { uri: dados.fotoUri, name: 'foto.jpg', type: 'image/jpeg' } as any);
  }
  return form;
}

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

export async function listar() {
  const { data } = await api.get<Ocorrencia[]>('/ocorrencias');
  return data;
}

export async function buscar(id: string) {
  const { data } = await api.get<Ocorrencia>(`/ocorrencias/${id}`);
  return data;
}

export async function criar(dados: OcorrenciaFormDados) {
  const { data } = await api.post<Ocorrencia>('/ocorrencias', montarFormData(dados), multipart);
  return data;
}

export async function atualizar(id: string, dados: OcorrenciaFormDados) {
  const { data } = await api.put<Ocorrencia>(
    `/ocorrencias/${id}`,
    montarFormData(dados),
    multipart,
  );
  return data;
}

export async function excluir(id: string) {
  await api.delete(`/ocorrencias/${id}`);
}
