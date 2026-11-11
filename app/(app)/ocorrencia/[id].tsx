import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Aviso } from '../../../src/components/Aviso';
import { Button } from '../../../src/components/Button';
import { Loader } from '../../../src/components/Loader';
import { StatusBadge } from '../../../src/components/StatusBadge';
import { rotuloCategoria } from '../../../src/constants/categorias';
import { useAuth } from '../../../src/contexts/AuthContext';
import { mensagemDeErro } from '../../../src/services/api';
import * as ocorrenciaService from '../../../src/services/ocorrenciaService';
import { colors, fonts } from '../../../src/theme/colors';
import { HistoricoItem, Ocorrencia, Prioridade, Triagem } from '../../../src/types';

const ROTULO_PRIORIDADE: Record<Prioridade, string> = { BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta' };

export default function DetalheOcorrencia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [triagem, setTriagem] = useState<Triagem | null>(null);
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        ocorrenciaService.buscar(id),
        ocorrenciaService.historico(id).catch(() => [] as HistoricoItem[]),
        ocorrenciaService.triagem(id).catch(() => null),
      ])
        .then(([o, h, t]) => {
          setOcorrencia(o);
          setHistorico(h);
          setTriagem(t);
        })
        .catch((e) => setErro(mensagemDeErro(e)));
    }, [id]),
  );

  function confirmarExclusao() {
    Alert.alert('Excluir ocorrência?', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          setExcluindo(true);
          try {
            await ocorrenciaService.excluir(id);
            router.back();
          } catch (e) {
            Alert.alert('Não foi possível excluir', mensagemDeErro(e));
            setExcluindo(false);
          }
        },
      },
    ]);
  }

  if (erro) return <Aviso titulo="Ocorrência indisponível" texto={erro} acao={{ rotulo: 'Voltar', onPress: () => router.back() }} />;
  if (!ocorrencia) return <Loader />;

  const dono = String(ocorrencia.usuarioId) === String(usuario?.id);
  const editavel = dono && ocorrencia.status === 'ABERTA';

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      {ocorrencia.fotoUrl ? <Image source={{ uri: ocorrencia.fotoUrl }} style={styles.foto} /> : null}
      <View style={styles.linha}>
        <StatusBadge status={ocorrencia.status} />
        {triagem ? <Text style={styles.prioridade}>Prioridade {ROTULO_PRIORIDADE[triagem.prioridade]}</Text> : null}
      </View>
      <Text style={styles.titulo}>{ocorrencia.titulo}</Text>
      <Text style={styles.meta}>
        {rotuloCategoria(ocorrencia.categoria)} · {ocorrencia.endereco}
      </Text>
      <Text style={styles.descricao}>{ocorrencia.descricao}</Text>

      {triagem?.statusAnaliseIa === 'CONCLUIDA' && triagem.justificativa ? (
        <View style={styles.caixa}>
          <Text style={styles.secao}>Análise da IA</Text>
          <Text style={styles.textoHistorico}>{triagem.justificativa}</Text>
        </View>
      ) : null}

      {historico.length ? (
        <View style={styles.caixa}>
          <Text style={styles.secao}>Andamento</Text>
          {historico.map((h) => (
            <View key={h.id} style={styles.itemHistorico}>
              <Text style={styles.dataHistorico}>{new Date(h.dataRegistro).toLocaleString('pt-BR')}</Text>
              <Text style={styles.textoHistorico}>{h.descricao}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {editavel ? (
        <View style={styles.botoes}>
          <Button titulo="Editar" variante="secundario" onPress={() => router.push(`/editar/${id}`)} />
          <Button titulo="Excluir" variante="perigo" carregando={excluindo} onPress={confirmarExclusao} />
        </View>
      ) : dono ? (
        <Text style={styles.aviso}>Só é possível editar ou excluir ocorrências com status Aberta.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 20, gap: 10 },
  foto: { width: '100%', height: 220, borderRadius: 6 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  prioridade: { fontFamily: fonts.textoForte, fontSize: 14, color: colors.asfalto },
  titulo: { fontFamily: fonts.titulo, fontSize: 34, color: colors.asfalto },
  meta: { fontFamily: fonts.textoForte, fontSize: 15, color: colors.cinza },
  descricao: { fontFamily: fonts.texto, fontSize: 17, color: colors.asfalto, lineHeight: 24 },
  caixa: { backgroundColor: colors.branco, borderRadius: 6, padding: 14, gap: 8, marginTop: 6 },
  secao: { fontFamily: fonts.titulo, fontSize: 22, color: colors.asfalto },
  itemHistorico: { borderLeftWidth: 3, borderLeftColor: colors.amarelo, paddingLeft: 10 },
  dataHistorico: { fontFamily: fonts.texto, fontSize: 13, color: colors.cinza },
  textoHistorico: { fontFamily: fonts.texto, fontSize: 15, color: colors.asfalto },
  botoes: { marginTop: 20, gap: 12 },
  aviso: { fontFamily: fonts.texto, fontSize: 14, color: colors.cinza, marginTop: 12 },
});
