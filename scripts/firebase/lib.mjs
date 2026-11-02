// Utilitários dos scripts de administração do banco (Admin SDK).
// Rodam só na sua máquina: a chave do Admin SDK ignora as regras de segurança e NUNCA pode ir para o navegador nem para o repositório.
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

// todos os dados do app ficam sob este prefixo (ver database.rules.json)
export const ROOT = 'chaCasaNova';

const EMULATOR = {
  projectId: 'demo-cha-casa-nova',
  databaseURL: 'http://127.0.0.1:9000?ns=demo-cha-casa-nova-default-rtdb',
  databaseHost: '127.0.0.1:9000',
  authHost: '127.0.0.1:9099'
};
const DEFAULT_CREDENTIALS = path.join(homedir(), '.config', 'arnexs', 'serviceAccount.json');

export function fail(message) {
  console.error(`Erro: ${message}`);
  process.exit(1);
}

/** opções comuns a todos os scripts; `extra` acrescenta as de cada um */
export function readArgs(extra = {}) {
  try {
    return parseArgs({
      allowPositionals: true,
      options: {
        apply: { type: 'boolean', default: false },
        emulator: { type: 'boolean', default: false },
        'database-url': { type: 'string' },
        credentials: { type: 'string' },
        ...extra
      }
    });
  } catch (error) {
    return fail(error.message);
  }
}

function databaseUrlFromEnv() {
  try {
    process.loadEnvFile('.env');
  } catch {
    // sem .env: vale só o que veio por argumento ou variável de ambiente
  }
  return process.env.VITE_APP_FIREBASE_DATABASE_URL;
}

/** conecta ao emulador (--emulator) ou ao projeto real, com a chave do Admin SDK (nunca é impressa) */
export function connect(values) {
  if (values.emulator) {
    process.env.FIREBASE_DATABASE_EMULATOR_HOST = EMULATOR.databaseHost;
    process.env.FIREBASE_AUTH_EMULATOR_HOST = EMULATOR.authHost;
    const app = initializeApp({ projectId: EMULATOR.projectId, databaseURL: EMULATOR.databaseURL });
    return { db: getDatabase(app), auth: getAuth(app), target: `emulador local (${EMULATOR.projectId})` };
  }

  const credentialsPath = values.credentials ?? process.env.GOOGLE_APPLICATION_CREDENTIALS ?? DEFAULT_CREDENTIALS;
  if (!existsSync(credentialsPath)) fail(`chave do Admin SDK não encontrada em ${credentialsPath} (use --credentials <arquivo>)`);

  const key = JSON.parse(readFileSync(credentialsPath, 'utf8'));
  const databaseURL = values['database-url'] ?? databaseUrlFromEnv();
  if (!databaseURL) fail('informe a URL do banco com --database-url ou defina VITE_APP_FIREBASE_DATABASE_URL no .env');
  if (!databaseURL.includes(key.project_id)) fail(`a chave é do projeto "${key.project_id}", mas a URL do banco (${databaseURL}) parece ser de outro`);

  const app = initializeApp({ credential: cert(key), databaseURL });
  return { db: getDatabase(app), auth: getAuth(app), target: `PRODUÇÃO (${key.project_id})` };
}

export function printBanner({ target }, apply) {
  console.log(`Alvo: ${target}`);
  console.log(apply ? 'Modo: GRAVAR (--apply)\n' : 'Modo: simulação — nada será gravado (use --apply para gravar)\n');
}
