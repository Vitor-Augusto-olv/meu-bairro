import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { Aviso } from '../../../src/components/Aviso';
import { Loader } from '../../../src/components/Loader';
import { OcorrenciaForm } from '../../../src/components/OcorrenciaForm';
import { mensagemDeErro } from '../../../src/services/api';
import * as ocorrenciaService from '../../../src/services/ocorrenciaService';
import { Ocorrencia, OcorrenciaFormDados } from '../../../src/types';

export default function EditarOcorrencia() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    ocorrenciaService
      .buscar(id)
      .then(setOcorrencia)
      .catch((e) => setErro(mensagemDeErro(e)));
  }, [id]);

  async function salvar(dados: OcorrenciaFormDados) {
    setSalvando(true);
    try {
      await ocorrenciaService.atualizar(id, dados);
      router.back();
    } catch (e) {
      Alert.alert('Não foi possível salvar', mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  if (erro) return <Aviso titulo="Não deu para carregar" texto={erro} acao={{ rotulo: 'Voltar', onPress: () => router.back() }} />;
  if (!ocorrencia) return <Loader />;

  return (
    <OcorrenciaForm
      inicial={{ ...ocorrencia, fotoUri: ocorrencia.fotoUrl }}
      rotuloBotao="Salvar alterações"
      carregando={salvando}
      onEnviar={salvar}
    />
  );
}
