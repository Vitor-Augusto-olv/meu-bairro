import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Aviso } from '../../../src/components/Aviso';
import { CardOcorrencia } from '../../../src/components/CardOcorrencia';
import { Loader } from '../../../src/components/Loader';
import { useAuth } from '../../../src/contexts/AuthContext';
import { mensagemDeErro } from '../../../src/services/api';
import * as ocorrenciaService from '../../../src/services/ocorrenciaService';
import { colors, fonts } from '../../../src/theme/colors';
import { Ocorrencia } from '../../../src/types';

export default function ListaOcorrencias() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [lista, setLista] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');
  const [soMinhas, setSoMinhas] = useState(false);

  const carregar = useCallback(async (puxar = false) => {
    puxar ? setAtualizando(true) : setCarregando(true);
    setErro('');
    try {
      setLista(await ocorrenciaService.listar());
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const dados = soMinhas ? lista.filter((o) => String(o.usuarioId) === String(usuario?.id)) : lista;

  if (carregando) return <Loader />;
  if (erro) {
    return <Aviso titulo="Não deu para carregar" texto={erro} acao={{ rotulo: 'Tentar de novo', onPress: () => carregar() }} />;
  }

  return (
    <View style={styles.tela}>
      <View style={styles.filtro}>
        {[false, true].map((minhas) => (
          <Pressable
            key={String(minhas)}
            accessibilityRole="radio"
            accessibilityState={{ selected: soMinhas === minhas }}
            onPress={() => setSoMinhas(minhas)}
            style={[styles.aba, soMinhas === minhas && styles.abaAtiva]}
          >
            <Text style={[styles.abaTexto, soMinhas === minhas && styles.abaTextoAtivo]}>
              {minhas ? 'Minhas' : 'Todas'}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={dados}
        keyExtractor={(o) => String(o.id)}
        refreshing={atualizando}
        onRefresh={() => carregar(true)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <CardOcorrencia ocorrencia={item} onPress={() => router.push(`/ocorrencia/${item.id}`)} />
        )}
        ListEmptyComponent={
          <Aviso
            titulo="Nenhuma ocorrência por aqui"
            texto="Viu algo quebrado no bairro? Registre e ajude a consertar."
            acao={{ rotulo: 'Registrar problema', onPress: () => router.push('/nova') }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.concreto },
  filtro: { flexDirection: 'row', padding: 12, gap: 8 },
  aba: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: colors.asfalto },
  abaAtiva: { backgroundColor: colors.asfalto },
  abaTexto: { fontFamily: fonts.textoForte, color: colors.asfalto },
  abaTextoAtivo: { color: colors.branco },
  lista: { paddingHorizontal: 12, paddingBottom: 20, flexGrow: 1 },
});
