import { StyleSheet, Text, View } from 'react-native';

import { STATUS_ROTULO } from '../constants/categorias';
import { colors, fonts } from '../theme/colors';
import { StatusOcorrencia } from '../types';

const COR: Record<StatusOcorrencia, string> = {
  ABERTA: colors.vermelho,
  EM_ANALISE: colors.amarelo,
  RESOLVIDA: colors.verde,
};

export function StatusBadge({ status }: { status: StatusOcorrencia }) {
  return (
    <View style={[styles.caixa, { backgroundColor: COR[status] }]}>
      <Text style={[styles.texto, status === 'EM_ANALISE' && { color: colors.asfalto }]}>
        {STATUS_ROTULO[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  texto: { fontFamily: fonts.textoForte, fontSize: 13, color: colors.branco },
});
