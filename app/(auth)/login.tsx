import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuth } from '../../src/contexts/AuthContext';
import { mensagemDeErro } from '../../src/services/api';
import { colors, fonts } from '../../src/theme/colors';
import { validarLogin } from '../../src/utils/validators';

export default function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    const e = validarLogin(email, senha);
    setErros(e);
    setErroApi('');
    if (Object.keys(e).length) return;
    setCarregando(true);
    try {
      await entrar(email, senha);
    } catch (erro) {
      setErroApi(mensagemDeErro(erro));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.marca}>Meu Bairro</Text>
        <Text style={styles.subtitulo}>Avise a prefeitura do que precisa de conserto na sua rua.</Text>
        <Input
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          erro={erros.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input rotulo="Senha" value={senha} onChangeText={setSenha} erro={erros.senha} secureTextEntry />
        {erroApi ? <Text style={styles.erroApi}>{erroApi}</Text> : null}
        <Button titulo="Entrar" onPress={enviar} carregando={carregando} />
        <Link href="/cadastro" style={styles.link}>
          Ainda não tem conta? Criar conta
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.concreto },
  conteudo: { padding: 24, paddingTop: 90 },
  marca: { fontFamily: fonts.titulo, fontSize: 56, color: colors.asfalto },
  subtitulo: { fontFamily: fonts.texto, fontSize: 17, color: colors.cinza, marginBottom: 28 },
  erroApi: { fontFamily: fonts.textoForte, color: colors.vermelho, marginBottom: 12 },
  link: { fontFamily: fonts.textoForte, fontSize: 16, color: colors.asfalto, marginTop: 20, textAlign: 'center' },
});
