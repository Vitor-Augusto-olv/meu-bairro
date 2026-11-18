import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { TOKEN_KEY, USUARIO_KEY } from '../config';
import { definirAoExpirarSessao } from '../services/api';
import * as authService from '../services/authService';
import { armazenamento } from '../services/storage';
import { Usuario } from '../types';

interface AuthContextDados {
  usuario: Usuario | null;
  token: string | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextDados | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  const sair = useCallback(async () => {
    await armazenamento.remover(TOKEN_KEY);
    await armazenamento.remover(USUARIO_KEY);
    setToken(null);
    setUsuario(null);
  }, []);

  useEffect(() => {
    definirAoExpirarSessao(sair);
    (async () => {
      const t = await armazenamento.obter(TOKEN_KEY);
      const u = await armazenamento.obter(USUARIO_KEY);
      if (t && u) {
        setToken(t);
        setUsuario(JSON.parse(u));
      }
      setCarregando(false);
    })();
  }, [sair]);

  const entrar = async (email: string, senha: string) => {
    const resposta = await authService.entrar(email, senha);
    await armazenamento.salvar(TOKEN_KEY, resposta.token);
    await armazenamento.salvar(USUARIO_KEY, JSON.stringify(resposta.usuario));
    setToken(resposta.token);
    setUsuario(resposta.usuario);
  };

  const cadastrar = async (nome: string, email: string, senha: string) => {
    await authService.registrar(nome, email, senha);
    await entrar(email, senha);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
