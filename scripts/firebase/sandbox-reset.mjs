// Deixa o EMULADOR local (o "sandbox") num estado conhecido: banco limpo, uma conta de casal com acesso de administrador
// e os 8 presentes de exemplo. Chamado por "yarn sandbox" logo depois de subir os emuladores.
//
// Só mexe no emulador: este script não tem como apontar para o projeto real.
import { ServerValue } from 'firebase-admin/database';
import { giftRecord, SEED_GIFTS } from './gifts-seed.mjs';
import { connect, fail, ROOT } from './lib.mjs';

// conta de teste do sandbox (existe só no emulador; não é a conta real do casal)
const SANDBOX_LOGIN = { email: 'casal@exemplo.com', password: 'senha-12345' };

const reachable = await fetch('http://127.0.0.1:9000/', { signal: AbortSignal.timeout(3000) }).then(
  () => true,
  () => false
);
if (!reachable) fail('os emuladores não estão no ar. Use "yarn sandbox" (sobe tudo) ou rode "yarn emulators" antes.');

const { db, auth } = connect({ emulator: true });

await db.ref('/').remove();
const { users } = await auth.listUsers(1000);
if (users.length) await auth.deleteUsers(users.map((user) => user.uid));

const user = await auth.createUser({ ...SANDBOX_LOGIN, emailVerified: true });
await db.ref(`${ROOT}/admins/${user.uid}`).set(true);
for (const [index, gift] of SEED_GIFTS.entries()) await db.ref(`${ROOT}/gifts/${gift[0]}`).set(giftRecord(gift, index, ServerValue.TIMESTAMP));

console.log('\n┌─ SANDBOX pronto (emulador local: nada aqui chega ao banco real)');
console.log(`│  ${SEED_GIFTS.length} presentes de exemplo · painel em /admin`);
console.log(`│  login: ${SANDBOX_LOGIN.email}  senha: ${SANDBOX_LOGIN.password}`);
console.log('└─ os dados somem ao encerrar (Ctrl+C) e voltam zerados na próxima vez\n');
await db.app.delete();
