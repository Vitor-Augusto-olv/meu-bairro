import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CATEGORIAS } from '../constants/categorias';
import { colors, fonts } from '../theme/colors';
import { Categoria, OcorrenciaFormDados } from '../types';
import { validarOcorrencia } from '../utils/validators';
import { Button } from './Button';
import { Input } from './Input';

interface Props {
  inicial?: Partial<OcorrenciaFormDados>;
  rotuloBotao: string;
  carregando: boolean;
  onEnviar: (dados: OcorrenciaFormDados) => void;
}

export function OcorrenciaForm({ inicial, rotuloBotao, carregando, onEnviar }: Props) {
  const [titulo, setTitulo] = useState(inicial?.titulo ?? '');
  const [descricao, setDescricao] = useState(inicial?.descricao ?? '');
  const [categoria, setCategoria] = useState<Categoria>(inicial?.categoria ?? 'BURACO');
  const [endereco, setEndereco] = useState(inicial?.endereco ?? '');
  const [coords, setCoords] = useState({
    latitude: inicial?.latitude ?? null,
    longitude: inicial?.longitude ?? null,
  });
  const [fotoUri, setFotoUri] = useState<string | null>(inicial?.fotoUri ?? null);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [buscandoLocal, setBuscandoLocal] = useState(false);

  async function escolherFoto(camera: boolean) {
    const pedir = camera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;
    const permissao = await pedir();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Libere o acesso nas configurações do celular.');
      return;
    }
    const abrir = camera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const resultado = await abrir({ mediaTypes: ['images'], quality: 0.6 });
    if (!resultado.canceled) setFotoUri(resultado.assets[0].uri);
  }

  async function usarLocalizacao() {
    setBuscandoLocal(true);
    try {
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert('Permissão necessária', 'Digite o endereço ou libere a localização.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      const [lugar] = await Location.reverseGeocodeAsync(pos.coords);
      if (lugar) {
        setEndereco([lugar.street, lugar.streetNumber, lugar.district].filter(Boolean).join(', '));
      }
    } catch {
      Alert.alert('Não foi possível obter a localização', 'Digite o endereço manualmente.');
    } finally {
      setBuscandoLocal(false);
    }
  }

  function enviar() {
    const e = validarOcorrencia(titulo, descricao, endereco);
    setErros(e);
    if (Object.keys(e).length) return;
    onEnviar({ titulo, descricao, categoria, endereco, ...coords, fotoUri });
  }

  return (
    <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Input rotulo="Título" value={titulo} onChangeText={setTitulo} erro={erros.titulo} />
      <Text style={styles.rotulo}>Tipo de problema</Text>
      <View style={styles.chips}>
        {CATEGORIAS.map((c) => (
          <Pressable
            key={c.valor}
            accessibilityRole="radio"
            accessibilityState={{ selected: categoria === c.valor }}
            onPress={() => setCategoria(c.valor)}
            style={[styles.chip, categoria === c.valor && styles.chipAtivo]}
          >
            <Text style={[styles.chipTexto, categoria === c.valor && styles.chipTextoAtivo]}>
              {c.rotulo}
            </Text>
          </Pressable>
        ))}
      </View>
      <Input
        rotulo="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        erro={erros.descricao}
        multiline
        style={styles.multilinha}
      />
      <Input rotulo="Rua e bairro" value={endereco} onChangeText={setEndereco} erro={erros.endereco} />
      <View style={styles.espaco}>
        <Button
          titulo="Usar minha localização"
          onPress={usarLocalizacao}
          carregando={buscandoLocal}
          variante="secundario"
        />
      </View>
      {fotoUri ? <Image source={{ uri: fotoUri }} style={styles.foto} /> : null}
      <View style={styles.linha}>
        <Pressable style={styles.fotoBotao} onPress={() => escolherFoto(true)}>
          <Ionicons name="camera" size={20} color={colors.asfalto} />
          <Text style={styles.fotoTexto}>Tirar foto</Text>
        </Pressable>
        <Pressable style={styles.fotoBotao} onPress={() => escolherFoto(false)}>
          <Ionicons name="images" size={20} color={colors.asfalto} />
          <Text style={styles.fotoTexto}>Galeria</Text>
        </Pressable>
      </View>
      <Button titulo={rotuloBotao} onPress={enviar} carregando={carregando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 20, paddingBottom: 40 },
  rotulo: { fontFamily: fonts.textoForte, fontSize: 15, color: colors.asfalto, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.borda,
    backgroundColor: colors.branco,
  },
  chipAtivo: { backgroundColor: colors.asfalto, borderColor: colors.asfalto },
  chipTexto: { fontFamily: fonts.texto, fontSize: 15, color: colors.asfalto },
  chipTextoAtivo: { color: colors.branco },
  multilinha: { minHeight: 100, textAlignVertical: 'top', paddingTop: 10 },
  espaco: { marginBottom: 14 },
  foto: { width: '100%', height: 190, borderRadius: 6, marginBottom: 10 },
  linha: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  fotoBotao: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.asfalto,
  },
  fotoTexto: { fontFamily: fonts.textoForte, fontSize: 15, color: colors.asfalto },
});
