import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../src/components/Button';
import { useAuth } from '../../../src/contexts/AuthContext';
import { colors, fonts } from '../../../src/theme/colors';

export default function Perfil() {
  const router = useRouter();
  const { usuario, sair } = useAuth();

  return (
    <View style={styles.tela}>
      <Text style={styles.nome}>{usuario?.nome}</Text>
      <Text style={styles.email}>{usuario?.email}</Text>
      <View style={styles.botoes}>
        <Button titulo="Sobre o app" variante="secundario" onPress={() => router.push('/sobre')} />
        <Button titulo="Sair da conta" variante="perigo" onPress={sair} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, padding: 24, backgroundColor: colors.concreto },
  nome: { fontFamily: fonts.titulo, fontSize: 36, color: colors.asfalto },
  email: { fontFamily: fonts.texto, fontSize: 17, color: colors.cinza },
  botoes: { marginTop: 32, gap: 12 },
});
