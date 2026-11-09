export const emailValido = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

export function validarCadastro(nome: string, email: string, senha: string) {
  const erros: Record<string, string> = {};
  if (nome.trim().length < 3) erros.nome = 'Informe seu nome completo.';
  if (!emailValido(email)) erros.email = 'Informe um e-mail válido.';
  if (senha.length < 6) erros.senha = 'A senha precisa de 6 caracteres ou mais.';
  return erros;
}

export function validarLogin(email: string, senha: string) {
  const erros: Record<string, string> = {};
  if (!emailValido(email)) erros.email = 'Informe um e-mail válido.';
  if (!senha) erros.senha = 'Informe a senha.';
  return erros;
}

export function validarOcorrencia(titulo: string, descricao: string, endereco: string) {
  const erros: Record<string, string> = {};
  if (titulo.trim().length < 5) erros.titulo = 'Dê um título com 5 letras ou mais.';
  if (descricao.trim().length < 10) erros.descricao = 'Descreva o problema (10+ letras).';
  if (!endereco.trim()) erros.endereco = 'Informe a rua ou use sua localização.';
  return erros;
}
