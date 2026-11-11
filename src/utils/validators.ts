export const emailValido = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

export function validarCadastro(nome: string, email: string, senha: string) {
  const erros: Record<string, string> = {};
  if (nome.trim().length < 3) erros.nome = 'Informe seu nome completo.';
  else if (nome.trim().length > 100) erros.nome = 'O nome pode ter no máximo 100 caracteres.';
  if (!emailValido(email)) erros.email = 'Informe um e-mail válido.';
  if (senha.length < 6 || senha.length > 60) erros.senha = 'A senha precisa ter de 6 a 60 caracteres.';
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
  const t = titulo.trim().length;
  const d = descricao.trim().length;
  if (t < 5 || t > 120) erros.titulo = 'O título deve ter de 5 a 120 caracteres.';
  if (d < 10 || d > 1000) erros.descricao = 'A descrição deve ter de 10 a 1000 caracteres.';
  if (!endereco.trim()) erros.endereco = 'Informe a rua ou use sua localização.';
  else if (endereco.trim().length > 200) erros.endereco = 'O endereço pode ter no máximo 200 caracteres.';
  return erros;
}
