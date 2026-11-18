import { Alert, Platform } from 'react-native';

// Alert.alert não faz nada no navegador, então a web usa window.alert e window.confirm.
export function avisar(titulo: string, mensagem?: string) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}

export function confirmar(
  titulo: string,
  mensagem: string,
  rotuloConfirmar: string,
  aoConfirmar: () => void,
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) aoConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: rotuloConfirmar, style: 'destructive', onPress: aoConfirmar },
  ]);
}
