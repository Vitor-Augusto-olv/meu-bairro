import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { rotuloCategoria } from '../constants/categorias';
import { colors, fonts } from '../theme/colors';
import { Ocorrencia } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  ocorrencia: Ocorrencia;
  onPress: () => void;
}

export function CardOcorrencia({ ocorrencia, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${ocorrencia.titulo}`}
      onPress={onPress}
      style={styles.card}
    >
      {ocorrencia.fotoUrl ? (
        <Image source={{ uri: ocorrencia.fotoUrl }} style={styles.foto} />
      ) : (
        <View style={[styles.foto, styles.semFoto]} />
      )}
      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={1}>
          {ocorrencia.titulo}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {rotuloCategoria(ocorrencia.categoria)} · {ocorrencia.endereco}
        </Text>
        <StatusBadge status={ocorrencia.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.branco,
    borderRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: colors.amarelo,
    padding: 10,
    gap: 12,
    marginBottom: 10,
  },
  foto: { width: 72, height: 72, borderRadius: 4 },
  semFoto: { backgroundColor: colors.concreto },
  info: { flex: 1, gap: 4, justifyContent: 'center' },
  titulo: { fontFamily: fonts.titulo, fontSize: 21, color: colors.asfalto },
  meta: { fontFamily: fonts.texto, fontSize: 14, color: colors.cinza },
});
