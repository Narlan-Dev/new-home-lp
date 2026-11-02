// Cadastra os 8 presentes de exemplo do protótipo da landing no banco.
// Só cria os que ainda não existem: nunca sobrescreve o que você editou no painel.
//
// uso:  node scripts/firebase/seed-gifts.mjs            (simulação)
//       node scripts/firebase/seed-gifts.mjs --apply    (grava)
//       acrescente --emulator para usar os emuladores locais (yarn emulators)
import { ServerValue } from 'firebase-admin/database';
import { giftRecord, SEED_GIFTS } from './gifts-seed.mjs';
import { connect, printBanner, readArgs, ROOT } from './lib.mjs';

const { values } = readArgs();
const connection = connect(values);
printBanner(connection, values.apply);

const gifts = connection.db.ref(`${ROOT}/gifts`);
const existing = (await gifts.get()).val() ?? {};

let created = 0;
for (const [index, gift] of SEED_GIFTS.entries()) {
  const [id, name, price] = gift;

  if (id in existing) {
    console.log(`= ${id.padEnd(15)} já existe, mantido`);
    continue;
  }

  console.log(`+ ${id.padEnd(15)} ${name} — R$ ${price.toFixed(2).replace('.', ',')}`);
  created++;
  if (values.apply) await gifts.child(id).set(giftRecord(gift, index, ServerValue.TIMESTAMP));
}

console.log(`\n${values.apply ? 'Gravados' : 'Seriam gravados'}: ${created} · já existentes: ${SEED_GIFTS.length - created}`);
if (!values.apply && created) console.log('Rode de novo com --apply para gravar.');
await connection.db.app.delete();
