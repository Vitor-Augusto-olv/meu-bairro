import { Link } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuth } from '../../src/contexts/AuthContext';
import { mensagemDeErro } from '../../src/services/api';
import { colors, fonts } from '../../src/theme/colors';
import { validarCadastro } from '../../src/utils/validators';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    const e = validarCadastro(nome, email, senha);
    setErros(e);
    setErroApi('');
    if (Object.keys(e).length) return;
    setCarregando(true);
    try {
      await cadastrar(nome, email, senha);
    } catch (erro) {
      setErroApi(mensagemDeErro(erro));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Criar conta</Text>
      <Input rotulo="Nome completo" value={nome} onChangeText={setNome} erro={erros.nome} />
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
      <Button titulo="Criar conta" onPress={enviar} carregando={carregando} />
      <Link href="/login" style={styles.link}>
        Já tenho conta
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: colors.concreto },
  conteudo: { padding: 24, paddingTop: 80 },
  titulo: { fontFamily: fonts.titulo, fontSize: 42, color: colors.asfalto, marginBottom: 24 },
  erroApi: { fontFamily: fonts.textoForte, color: colors.vermelho, marginBottom: 12 },
  link: { fontFamily: fonts.textoForte, fontSize: 16, color: colors.asfalto, marginTop: 20, textAlign: 'center' },
});
