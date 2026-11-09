import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../theme/colors';

interface Props {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  variante?: 'primario' | 'secundario' | 'perigo';
}

export function Button({ titulo, onPress, carregando, variante = 'primario' }: Props) {
  const estilo = [styles.base, styles[variante], carregando && styles.desativado];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      disabled={carregando}
      onPress={onPress}
      style={estilo}
    >
      {carregando ? (
        <ActivityIndicator color={variante === 'primario' ? colors.asfalto : colors.branco} />
      ) : (
        <Text style={[styles.texto, variante === 'primario' && styles.textoPrimario]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  primario: { backgroundColor: colors.amarelo },
  secundario: { backgroundColor: colors.asfalto },
  perigo: { backgroundColor: colors.vermelho },
  desativado: { opacity: 0.7 },
  texto: { fontFamily: fonts.textoForte, fontSize: 17, color: colors.branco },
  textoPrimario: { color: colors.asfalto },
});
