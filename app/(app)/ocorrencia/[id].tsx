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
import { Ocorrencia } from '../../../src/types';

export default function DetalheOcorrencia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { usuario } = useAuth();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  useFocusEffect(
    useCallback(() => {
      ocorrenciaService
        .buscar(id)
        .then(setOcorrencia)
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

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      {ocorrencia.fotoUrl ? <Image source={{ uri: ocorrencia.fotoUrl }} style={styles.foto} /> : null}
      <StatusBadge status={ocorrencia.status} />
      <Text style={styles.titulo}>{ocorrencia.titulo}</Text>
      <Text style={styles.meta}>
        {rotuloCategoria(ocorrencia.categoria)} · {ocorrencia.endereco}
      </Text>
      <Text style={styles.descricao}>{ocorrencia.descricao}</Text>
      {dono ? (
        <View style={styles.botoes}>
          <Button titulo="Editar" variante="secundario" onPress={() => router.push(`/editar/${id}`)} />
          <Button titulo="Excluir" variante="perigo" carregando={excluindo} onPress={confirmarExclusao} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 20, gap: 10 },
  foto: { width: '100%', height: 220, borderRadius: 6 },
  titulo: { fontFamily: fonts.titulo, fontSize: 34, color: colors.asfalto },
  meta: { fontFamily: fonts.textoForte, fontSize: 15, color: colors.cinza },
  descricao: { fontFamily: fonts.texto, fontSize: 17, color: colors.asfalto, lineHeight: 24 },
  botoes: { marginTop: 20, gap: 12 },
});
