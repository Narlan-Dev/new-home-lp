import { useCallback } from 'react';

// third-party
import { useMutation } from '@tanstack/react-query';

// project-imports
import client from './client';
import { getFirebaseAuth } from './client/firebase';
import { ApiError } from './client/http-client';

// types
import { LoginInput } from 'types/auth';

/** a conta existe no projeto, mas não está em /chaCasaNova/admins */
export class NotAdminError extends Error {
  constructor() {
    super('Conta sem acesso de administrador');
    this.name = 'NotAdminError';
  }
}

// o Firebase não diferencia "e-mail inexistente" de "senha errada" nas versões novas; a tela também não revela qual foi
const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'admin.login.error.invalidCredentials',
  'auth/invalid-email': 'admin.login.error.invalidCredentials',
  'auth/user-not-found': 'admin.login.error.invalidCredentials',
  'auth/wrong-password': 'admin.login.error.invalidCredentials',
  'auth/too-many-requests': 'admin.login.error.tooManyRequests',
  'auth/user-disabled': 'admin.login.error.disabled',
  'auth/network-request-failed': 'error.network'
};

/** id da mensagem (em utils/locales) que explica ao usuário por que o login falhou */
export function getLoginErrorMessageId(error: unknown): string {
  if (error instanceof NotAdminError) return 'admin.login.error.forbidden';
  if (error instanceof ApiError) return error.code === 'network' ? 'error.network' : 'admin.login.error.generic';

  const code = typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string' ? error.code : undefined;
  return (code && LOGIN_ERROR_MESSAGES[code]) || 'admin.login.error.generic';
}

export const useLoginMutation = () =>
  useMutation<void, Error, LoginInput>({
    mutationFn: async ({ email, password }) => {
      const [auth, { signInWithEmailAndPassword, signOut }] = await Promise.all([getFirebaseAuth(), import('firebase/auth')]);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // o login vale para qualquer conta do projeto Firebase; quem manda aqui é a lista /admins
      let isAdmin = false;
      try {
        isAdmin = await client.admins.isAdmin(user.uid);
      } finally {
        if (!isAdmin) await signOut(auth);
      }
      if (!isAdmin) throw new NotAdminError();
    },
    // o formulário mostra o motivo ao lado dos campos, sem toast
    meta: { suppressErrorToast: true }
  });

export function useLogout() {
  return useCallback(async () => {
    const [auth, { signOut }] = await Promise.all([getFirebaseAuth(), import('firebase/auth')]);
    await signOut(auth);
  }, []);
}
