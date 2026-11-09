export type Categoria =
  | 'BURACO'
  | 'ILUMINACAO'
  | 'LIXO'
  | 'ALAGAMENTO'
  | 'CALCADA'
  | 'OUTRO';

export type StatusOcorrencia = 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA';

export interface Usuario {
  id: number | string;
  nome: string;
  email: string;
}

export interface Ocorrencia {
  id: number | string;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  status: StatusOcorrencia;
  endereco: string;
  latitude?: number | null;
  longitude?: number | null;
  fotoUrl?: string | null;
  criadoEm: string;
  usuarioId: number | string;
}

export interface OcorrenciaFormDados {
  titulo: string;
  descricao: string;
  categoria: Categoria;
  endereco: string;
  latitude?: number | null;
  longitude?: number | null;
  fotoUri?: string | null;
}

export interface LoginResposta {
  token: string;
  usuario: Usuario;
}
