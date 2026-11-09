import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { OcorrenciaForm } from '../../../src/components/OcorrenciaForm';
import { mensagemDeErro } from '../../../src/services/api';
import * as ocorrenciaService from '../../../src/services/ocorrenciaService';
import { OcorrenciaFormDados } from '../../../src/types';

export default function NovaOcorrencia() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function criar(dados: OcorrenciaFormDados) {
    setCarregando(true);
    try {
      await ocorrenciaService.criar(dados);
      Alert.alert('Ocorrência registrada', 'Obrigado por avisar!');
      router.replace('/');
    } catch (e) {
      Alert.alert('Não foi possível registrar', mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }

  return <OcorrenciaForm rotuloBotao="Registrar ocorrência" carregando={carregando} onEnviar={criar} />;
}
