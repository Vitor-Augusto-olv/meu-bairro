import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { MODO_LOCAL } from '../config';

// SecureStore não existe no navegador; no modo local tudo fica no AsyncStorage.
const usarSeguro = Platform.OS !== 'web' && !MODO_LOCAL;

export const armazenamento = {
  obter: (chave: string) =>
    usarSeguro ? SecureStore.getItemAsync(chave) : AsyncStorage.getItem(chave),
  salvar: (chave: string, valor: string) =>
    usarSeguro
      ? SecureStore.setItemAsync(chave, valor)
      : AsyncStorage.setItem(chave, valor),
  remover: (chave: string) =>
    usarSeguro ? SecureStore.deleteItemAsync(chave) : AsyncStorage.removeItem(chave),
};
