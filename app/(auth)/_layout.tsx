import { Redirect, Stack } from 'expo-router';

import { Loader } from '../../src/components/Loader';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AuthLayout() {
  const { token, carregando } = useAuth();
  if (carregando) return <Loader />;
  if (token) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
