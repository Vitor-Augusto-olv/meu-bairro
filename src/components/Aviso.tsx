import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../theme/colors';
import { Button } from './Button';

interface Props {
  titulo: string;
  texto?: string;
  acao?: { rotulo: string; onPress: () => void };
}

/** Estado vazio ou de erro, sempre com um próximo passo. */
export function Aviso({ titulo, texto, acao }: Props) {
  return (
    <View style={styles.caixa}>
      <Text style={styles.titulo}>{titulo}</Text>
      {texto ? <Text style={styles.texto}>{texto}</Text> : null}
      {acao ? <Button titulo={acao.rotulo} onPress={acao.onPress} variante="secundario" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  titulo: { fontFamily: fonts.titulo, fontSize: 26, color: colors.asfalto },
  texto: { fontFamily: fonts.texto, fontSize: 16, color: colors.cinza },
});
