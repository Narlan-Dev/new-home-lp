// third-party (só tipos: o SDK do Firebase é carregado sob demanda, para a landing não pagar por ele)
import type { Auth } from 'firebase/auth';

// project-imports
import { FIREBASE_API, FIREBASE_AUTH_EMULATOR_URL, FIREBASE_USE_EMULATOR } from 'config';
import { setAuthTokenProvider } from './http-client';

let authPromise: Promise<Auth> | undefined;

// ==============================|| FIREBASE - AUTH (CARREGADO SOB DEMANDA) ||============================== //

// só a área do casal chama esta função; os visitantes leem a lista de presentes pela REST, sem login
export function getFirebaseAuth(): Promise<Auth> {
  authPromise ??= (async () => {
    const [{ initializeApp }, { getAuth, connectAuthEmulator }] = await Promise.all([import('firebase/app'), import('firebase/auth')]);

    const auth = getAuth(initializeApp(FIREBASE_API));
    if (FIREBASE_USE_EMULATOR) connectAuthEmulator(auth, FIREBASE_AUTH_EMULATOR_URL, { disableWarnings: true });

    // o SDK renova o token sozinho quando falta pouco para vencer
    setAuthTokenProvider(async () => (auth.currentUser ? auth.currentUser.getIdToken() : null));
    return auth;
  })().catch((error: unknown) => {
    authPromise = undefined; // permite tentar de novo (ex.: o arquivo do SDK não carregou)
    throw error;
  });

  return authPromise;
}
