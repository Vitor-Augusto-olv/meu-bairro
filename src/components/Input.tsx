import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, fonts } from '../theme/colors';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string;
}

export function Input({ rotulo, erro, style, ...resto }: Props) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={colors.cinza}
        style={[styles.campo, erro ? styles.campoErro : null, style]}
        {...resto}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { marginBottom: 14 },
  rotulo: { fontFamily: fonts.textoForte, fontSize: 15, color: colors.asfalto, marginBottom: 6 },
  campo: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.borda,
    borderRadius: 6,
    backgroundColor: colors.branco,
    paddingHorizontal: 12,
    fontFamily: fonts.texto,
    fontSize: 16,
    color: colors.asfalto,
  },
  campoErro: { borderColor: colors.vermelho },
  erro: { fontFamily: fonts.texto, fontSize: 14, color: colors.vermelho, marginTop: 4 },
});
