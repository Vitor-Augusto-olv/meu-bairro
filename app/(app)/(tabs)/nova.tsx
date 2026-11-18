import { useRouter } from 'expo-router';
import { useState } from 'react';

import { OcorrenciaForm } from '../../../src/components/OcorrenciaForm';
import { mensagemDeErro } from '../../../src/services/api';
import * as ocorrenciaService from '../../../src/services/ocorrenciaService';
import { OcorrenciaFormDados } from '../../../src/types';
import { avisar } from '../../../src/utils/dialogo';

export default function NovaOcorrencia() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  // A aba continua montada depois de salvar; mudar a chave recria o formulário em branco.
  const [chave, setChave] = useState(0);

  async function criar(dados: OcorrenciaFormDados) {
    setCarregando(true);
    try {
      await ocorrenciaService.criar(dados);
      setChave((c) => c + 1);
      avisar('Ocorrência registrada', 'Obrigado por avisar!');
      router.replace('/');
    } catch (e) {
      avisar('Não foi possível registrar', mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <OcorrenciaForm
      key={chave}
      rotuloBotao="Registrar ocorrência"
      carregando={carregando}
      onEnviar={criar}
    />
  );
}
