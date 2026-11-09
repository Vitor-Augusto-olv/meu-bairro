import { Redirect, Stack } from 'expo-router';

import { Loader } from '../../src/components/Loader';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors, fonts } from '../../src/theme/colors';

export default function AppLayout() {
  const { token, carregando } = useAuth();
  if (carregando) return <Loader />;
  if (!token) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.asfalto },
        headerTintColor: colors.branco,
        headerTitleStyle: { fontFamily: fonts.titulo, fontSize: 22 },
        contentStyle: { backgroundColor: colors.concreto },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ocorrencia/[id]" options={{ title: 'Ocorrência' }} />
      <Stack.Screen name="editar/[id]" options={{ title: 'Editar ocorrência' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o app' }} />
    </Stack>
  );
}
