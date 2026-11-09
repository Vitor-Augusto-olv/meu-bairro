import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors, fonts } from '../../../src/theme/colors';

const icone = (nome: keyof typeof Ionicons.glyphMap) =>
  function Icone({ color, size }: { color: string; size: number }) {
    return <Ionicons name={nome} color={color} size={size} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.asfalto },
        headerTintColor: colors.branco,
        headerTitleStyle: { fontFamily: fonts.titulo, fontSize: 22 },
        tabBarActiveTintColor: colors.asfalto,
        tabBarInactiveTintColor: colors.cinza,
        tabBarActiveBackgroundColor: colors.amarelo,
        tabBarLabelStyle: { fontFamily: fonts.textoForte, fontSize: 13 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Ocorrências', tabBarIcon: icone('list') }} />
      <Tabs.Screen name="nova" options={{ title: 'Registrar', tabBarIcon: icone('add-circle') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icone('person') }} />
    </Tabs>
  );
}
