import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// project-imports
import client from 'framework/rest/client';
import { getFirebaseAuth } from 'framework/rest/client/firebase';
import { AuthContext } from './AuthContext';

// types
import { AuthState, AuthUser } from 'types/auth';

const INITIAL_STATE: AuthState = { isInitialized: false, user: null, isAdmin: false, hasError: false };

// ==============================|| AUTH - PROVIDER ||============================== //

// acompanha o login do Firebase (carregado sob demanda) e confere, a cada mudança, se a conta consta em /chaCasaNova/admins
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const [attempt, setAttempt] = useState(0);
  const lastCheck = useRef(0);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    // se várias conferências se sobrepuserem (entrar e sair em seguida), vale só a última
    const verify = async (user: AuthUser | null) => {
      const check = ++lastCheck.current;

      let next: AuthState = { isInitialized: true, user: null, isAdmin: false, hasError: false };
      if (user) {
        try {
          next = { isInitialized: true, user, isAdmin: await client.admins.isAdmin(user.uid), hasError: false };
        } catch {
          next = { isInitialized: true, user, isAdmin: false, hasError: true };
        }
      }

      if (active && check === lastCheck.current) setState(next);
    };

    Promise.all([getFirebaseAuth(), import('firebase/auth')])
      .then(([auth, { onAuthStateChanged }]) => {
        if (!active) return;
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          void verify(firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null);
        });
      })
      .catch(() => {
        if (active) setState({ isInitialized: true, user: null, isAdmin: false, hasError: true });
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState(INITIAL_STATE);
    setAttempt((count) => count + 1);
  }, []);

  const value = useMemo(() => ({ ...state, retry }), [state, retry]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
