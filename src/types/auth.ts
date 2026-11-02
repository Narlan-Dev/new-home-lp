import { ReactNode } from 'react';

export interface AuthUser {
  uid: string;
  email: string | null;
}

export interface AuthState {
  /** o Firebase já informou se há alguém logado e, havendo, o acesso de administrador foi conferido */
  isInitialized: boolean;
  user: AuthUser | null;
  /** a conta tem `true` em /chaCasaNova/admins/<uid> */
  isAdmin: boolean;
  /** não foi possível conferir o acesso (ex.: sem rede); `retry` tenta de novo */
  hasError: boolean;
}

export interface AuthContextValue extends AuthState {
  retry: () => void;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GuardProps {
  children: ReactNode;
}
