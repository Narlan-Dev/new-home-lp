// Marca (ou desmarca) uma conta do Firebase Auth como administradora do app: /chaCasaNova/admins/<uid> = true.
// É o único jeito de dar acesso ao painel: as regras do banco não deixam o navegador escrever em /admins.
//
// uso:  node scripts/firebase/set-admin.mjs <e-mail ou uid>            (simulação)
//       node scripts/firebase/set-admin.mjs <e-mail ou uid> --apply    (grava)
//       node scripts/firebase/set-admin.mjs <e-mail ou uid> --remove --apply   (revoga o acesso)
//       acrescente --emulator para usar os emuladores locais (yarn emulators)
import { connect, fail, printBanner, readArgs, ROOT } from './lib.mjs';

const { values, positionals } = readArgs({ remove: { type: 'boolean', default: false } });
const [who] = positionals;
if (!who) fail('informe o e-mail ou o UID da conta. Ex.: node scripts/firebase/set-admin.mjs casal@email.com --apply');

const connection = connect(values);
printBanner(connection, values.apply);

// confere no Auth que a conta existe (evita gravar um UID digitado errado)
let user;
try {
  user = who.includes('@') ? await connection.auth.getUserByEmail(who) : await connection.auth.getUser(who);
} catch (error) {
  fail(`conta não encontrada no Firebase Auth (${who}): ${error.code ?? error.message}`);
}

const ref = connection.db.ref(`${ROOT}/admins/${user.uid}`);
const current = (await ref.get()).val() === true;
const wanted = !values.remove;

console.log(`Conta: ${user.email ?? '(sem e-mail)'} · uid ${user.uid}`);
console.log(`Administrador agora: ${current ? 'sim' : 'não'} → ${wanted ? 'sim' : 'não'}`);

if (current === wanted) {
  console.log('\nNada a fazer.');
} else if (values.apply) {
  if (wanted) await ref.set(true);
  else await ref.remove();
  console.log(`\n${wanted ? 'Acesso concedido.' : 'Acesso revogado.'}`);
} else {
  console.log('\nRode de novo com --apply para gravar.');
}

await connection.db.app.delete();
