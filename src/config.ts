// types
import { ConfigStates } from 'types/config';

// ==============================|| THEME CONSTANT ||============================== //

export const CSS_VAR_PREFIX = '';

// `md` separa o layout mobile (frame 390) do layout desktop (frame 1440) do design
export const BREAKPOINTS = { xs: 0, sm: 768, md: 1024, lg: 1266, xl: 1440 };

// ==============================|| THEME CONFIG ||============================== //

const config: ConfigStates = {
  fontFamily: `'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  fontFamilyDisplay: `'Cormorant Garamond', Georgia, 'Times New Roman', serif`,
  i18n: 'pt-br'
};

// ==============================|| FIREBASE CONFIG ||============================== //

// identificadores públicos do app Web; quem protege os dados são as regras do banco (database.rules.json) e o Auth
export const FIREBASE_API = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID
};

// com "true" o app fala com os emuladores locais (yarn emulators) em vez do projeto real
export const FIREBASE_USE_EMULATOR = import.meta.env.VITE_APP_FIREBASE_USE_EMULATOR === 'true';
export const FIREBASE_AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

export default config;
