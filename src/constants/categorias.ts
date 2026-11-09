import { Categoria, StatusOcorrencia } from '../types';

export const CATEGORIAS: { valor: Categoria; rotulo: string }[] = [
  { valor: 'BURACO', rotulo: 'Buraco' },
  { valor: 'ILUMINACAO', rotulo: 'Poste / luz' },
  { valor: 'LIXO', rotulo: 'Lixo' },
  { valor: 'ALAGAMENTO', rotulo: 'Alagamento' },
  { valor: 'CALCADA', rotulo: 'Calçada' },
  { valor: 'OUTRO', rotulo: 'Outro' },
];

export const STATUS_ROTULO: Record<StatusOcorrencia, string> = {
  ABERTA: 'Aberta',
  EM_ANALISE: 'Em análise',
  RESOLVIDA: 'Resolvida',
};

export const rotuloCategoria = (c: Categoria) =>
  CATEGORIAS.find((x) => x.valor === c)?.rotulo ?? c;
