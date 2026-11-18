import AsyncStorage from '@react-native-async-storage/async-storage';

import { USUARIO_KEY, USUARIO_TESTE } from '../config';
import {
  HistoricoItem,
  LoginResposta,
  Ocorrencia,
  OcorrenciaFormDados,
  Triagem,
  Usuario,
} from '../types';
import { ErroLocal } from './erroLocal';
import { armazenamento } from './storage';

const CHAVES = {
  usuarios: '@meubairro/usuarios',
  ocorrencias: '@meubairro/ocorrencias',
  historico: '@meubairro/historico',
  semeado: '@meubairro/semeado',
};

type UsuarioLocal = Usuario & { senha: string };
type HistoricoLocal = HistoricoItem & { ocorrenciaId: number | string };

async function ler<T>(chave: string): Promise<T[]> {
  const bruto = await AsyncStorage.getItem(chave);
  return bruto ? (JSON.parse(bruto) as T[]) : [];
}

async function gravar(chave: string, valor: unknown) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    throw new ErroLocal(
      'Sem espaço no armazenamento local. Tente uma foto menor ou sem foto.',
    );
  }
}

const proximoId = (lista: { id: number | string }[]) =>
  lista.reduce((maior, item) => Math.max(maior, Number(item.id)), 0) + 1;

/** Cria o usuário de teste e duas ocorrências de exemplo na primeira execução. */
async function preparar() {
  if (await AsyncStorage.getItem(CHAVES.semeado)) return;
  const agora = new Date().toISOString();
  const usuario: UsuarioLocal = { id: 1, nome: 'Usuário de Teste', ...USUARIO_TESTE };
  const ocorrencias: Ocorrencia[] = [
    {
      id: 1,
      titulo: 'Buraco na Rua das Acácias',
      descricao: 'Buraco grande no meio da pista, perigoso para motos e carros.',
      categoria: 'BURACO',
      status: 'ABERTA',
      endereco: 'Rua das Acácias, Centro',
      latitude: null,
      longitude: null,
      fotoUrl: null,
      criadoEm: agora,
      usuarioId: 1,
    },
    {
      id: 2,
      titulo: 'Poste apagado na Avenida Brasil',
      descricao: 'O poste em frente à padaria está sem luz há uma semana.',
      categoria: 'ILUMINACAO',
      status: 'EM_ANALISE',
      endereco: 'Avenida Brasil, 120',
      latitude: null,
      longitude: null,
      fotoUrl: null,
      criadoEm: agora,
      usuarioId: 1,
    },
  ];
  const historico: HistoricoLocal[] = [
    {
      id: 1,
      ocorrenciaId: 1,
      tipo: 'CRIACAO',
      descricao: 'Ocorrência registrada.',
      dataRegistro: agora,
    },
    {
      id: 2,
      ocorrenciaId: 2,
      tipo: 'CRIACAO',
      descricao: 'Ocorrência registrada.',
      dataRegistro: agora,
    },
    {
      id: 3,
      ocorrenciaId: 2,
      tipo: 'STATUS',
      descricao: 'Status alterado para Em análise.',
      dataRegistro: agora,
    },
  ];
  await gravar(CHAVES.usuarios, [usuario]);
  await gravar(CHAVES.ocorrencias, ocorrencias);
  await gravar(CHAVES.historico, historico);
  await AsyncStorage.setItem(CHAVES.semeado, '1');
}

async function usuarioAtual(): Promise<Usuario> {
  const bruto = await armazenamento.obter(USUARIO_KEY);
  if (!bruto) throw new ErroLocal('Sessão expirada. Entre de novo.');
  return JSON.parse(bruto) as Usuario;
}

async function registrarHistorico(
  ocorrenciaId: number | string,
  tipo: string,
  descricao: string,
) {
  const historico = await ler<HistoricoLocal>(CHAVES.historico);
  await gravar(CHAVES.historico, [
    ...historico,
    {
      id: proximoId(historico),
      ocorrenciaId,
      tipo,
      descricao,
      dataRegistro: new Date().toISOString(),
    },
  ]);
}

function exigirAutorEmAberto(ocorrencia: Ocorrencia, usuario: Usuario) {
  if (String(ocorrencia.usuarioId) !== String(usuario.id)) {
    throw new ErroLocal('Só o autor pode alterar esta ocorrência.');
  }
  if (ocorrencia.status !== 'ABERTA') {
    throw new ErroLocal('Só é possível alterar ocorrências com status Aberta.');
  }
}

const fotoDosDados = (dados: OcorrenciaFormDados) =>
  dados.fotoBase64 ? `data:image/jpeg;base64,${dados.fotoBase64}` : null;

export async function entrar(email: string, senha: string): Promise<LoginResposta> {
  await preparar();
  const usuarios = await ler<UsuarioLocal>(CHAVES.usuarios);
  const u = usuarios.find(
    (x) => x.email === email.trim().toLowerCase() && x.senha === senha,
  );
  if (!u) throw new ErroLocal('E-mail ou senha incorretos.');
  return { token: `local-${u.id}`, usuario: { id: u.id, nome: u.nome, email: u.email } };
}

export async function registrar(nome: string, email: string, senha: string) {
  await preparar();
  const usuarios = await ler<UsuarioLocal>(CHAVES.usuarios);
  const emailNormalizado = email.trim().toLowerCase();
  if (usuarios.some((x) => x.email === emailNormalizado)) {
    throw new ErroLocal('E-mail já cadastrado.');
  }
  await gravar(CHAVES.usuarios, [
    ...usuarios,
    { id: proximoId(usuarios), nome: nome.trim(), email: emailNormalizado, senha },
  ]);
}

export async function listar() {
  await preparar();
  return (await ler<Ocorrencia>(CHAVES.ocorrencias)).reverse();
}

export async function buscar(id: string) {
  await preparar();
  const ocorrencia = (await ler<Ocorrencia>(CHAVES.ocorrencias)).find(
    (o) => String(o.id) === id,
  );
  if (!ocorrencia) throw new ErroLocal('Ocorrência não encontrada.');
  return ocorrencia;
}

export async function criar(dados: OcorrenciaFormDados) {
  await preparar();
  const usuario = await usuarioAtual();
  const todas = await ler<Ocorrencia>(CHAVES.ocorrencias);
  const nova: Ocorrencia = {
    id: proximoId(todas),
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    categoria: dados.categoria,
    status: 'ABERTA',
    endereco: dados.endereco.trim(),
    latitude: dados.latitude ?? null,
    longitude: dados.longitude ?? null,
    fotoUrl: fotoDosDados(dados),
    criadoEm: new Date().toISOString(),
    usuarioId: usuario.id,
  };
  await gravar(CHAVES.ocorrencias, [...todas, nova]);
  await registrarHistorico(nova.id, 'CRIACAO', 'Ocorrência registrada.');
  return nova;
}

export async function atualizar(id: string, dados: OcorrenciaFormDados) {
  await preparar();
  const usuario = await usuarioAtual();
  const todas = await ler<Ocorrencia>(CHAVES.ocorrencias);
  const i = todas.findIndex((o) => String(o.id) === id);
  if (i < 0) throw new ErroLocal('Ocorrência não encontrada.');
  exigirAutorEmAberto(todas[i], usuario);
  todas[i] = {
    ...todas[i],
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim(),
    categoria: dados.categoria,
    endereco: dados.endereco.trim(),
    latitude: dados.latitude ?? todas[i].latitude,
    longitude: dados.longitude ?? todas[i].longitude,
    fotoUrl: fotoDosDados(dados) ?? todas[i].fotoUrl,
  };
  await gravar(CHAVES.ocorrencias, todas);
  await registrarHistorico(id, 'ATUALIZACAO', 'Dados da ocorrência atualizados.');
  return todas[i];
}

export async function excluir(id: string) {
  await preparar();
  const usuario = await usuarioAtual();
  const todas = await ler<Ocorrencia>(CHAVES.ocorrencias);
  const alvo = todas.find((o) => String(o.id) === id);
  if (!alvo) throw new ErroLocal('Ocorrência não encontrada.');
  exigirAutorEmAberto(alvo, usuario);
  await gravar(
    CHAVES.ocorrencias,
    todas.filter((o) => String(o.id) !== id),
  );
  const historico = await ler<HistoricoLocal>(CHAVES.historico);
  await gravar(
    CHAVES.historico,
    historico.filter((h) => String(h.ocorrenciaId) !== id),
  );
}

export async function historico(id: string): Promise<HistoricoItem[]> {
  await preparar();
  const todos = await ler<HistoricoLocal>(CHAVES.historico);
  return todos
    .filter((h) => String(h.ocorrenciaId) === id)
    .map(({ id: itemId, tipo, descricao, dataRegistro }) => ({
      id: itemId,
      tipo,
      descricao,
      dataRegistro,
    }));
}

export async function triagem(): Promise<Triagem | null> {
  return null; // a triagem por IA só existe na API Java
}
