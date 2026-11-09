import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { COMMIT_HASH } from '../../src/constants/commit';
import { colors, fonts } from '../../src/theme/colors';

export default function Sobre() {
  const linhas = [
    ['Versão', Constants.expoConfig?.version ?? '-'],
    ['Commit de referência', COMMIT_HASH],
    ['API', process.env.EXPO_PUBLIC_API_URL ?? '-'],
  ];

  return (
    <View style={styles.tela}>
      <Text style={styles.titulo}>Meu Bairro</Text>
      <Text style={styles.texto}>Global Solution 2026/2 · CitizenTech · FIAP</Text>
      {linhas.map(([rotulo, valor]) => (
        <View key={rotulo} style={styles.linha}>
          <Text style={styles.rotulo}>{rotulo}</Text>
          <Text style={styles.valor}>{valor}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 24, backgroundColor: colors.concreto },
  titulo: { fontFamily: fonts.titulo, fontSize: 40, color: colors.asfalto },
  texto: { fontFamily: fonts.texto, fontSize: 16, color: colors.cinza, marginBottom: 24 },
  linha: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borda },
  rotulo: { fontFamily: fonts.texto, fontSize: 14, color: colors.cinza },
  valor: { fontFamily: fonts.textoForte, fontSize: 18, color: colors.asfalto },
});
