// Cópia de segurança dos dados do app (/chaCasaNova) em um arquivo local, e restauração dos PRESENTES a partir dele.
// O plano gratuito do Firebase não faz backup automático do Realtime Database: use isto antes de testar no banco real.
//
// uso:  node scripts/firebase/backup.mjs                               salva em backups/chaCasaNova-<data e hora>.json
//       node scripts/firebase/backup.mjs --restore <arquivo>           simulação: mostra o que mudaria nos presentes
//       node scripts/firebase/backup.mjs --restore <arquivo> --apply   substitui TODOS os presentes pelos do arquivo
//       acrescente --emulator para usar os emuladores locais
//
// A restauração mexe só em /chaCasaNova/gifts; a lista de administradores nunca é restaurada por aqui (use set-admin).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { connect, fail, printBanner, readArgs, ROOT } from './lib.mjs';

const GIFT_KEY = /^[\w-]{1,128}$/;
const NUMBER_FIELDS = ['price', 'order', 'createdAt', 'updatedAt'];

const { values } = readArgs({ restore: { type: 'string' } });
const connection = connect(values);
const count = (node) => Object.keys(node ?? {}).length;

if (!values.restore) {
  // ---- cópia de segurança (só lê o banco; grava apenas o arquivo local)
  console.log(`Alvo: ${connection.target}`);
  const data = (await connection.db.ref(ROOT).get()).val() ?? {};

  const exportedAt = new Date().toISOString();
  const file = path.resolve('backups', `chaCasaNova-${exportedAt.replace(/[:.]/g, '-')}.json`);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify({ exportedAt, target: connection.target, data }, null, 2));

  console.log(`Presentes: ${count(data.gifts)} · administradores: ${count(data.admins)}`);
  console.log(`Salvo em ${path.relative(process.cwd(), file)}`);
} else {
  // ---- restauração dos presentes
  const backup = JSON.parse(readFileSync(path.resolve(values.restore), 'utf8'));
  const saved = backup?.data?.gifts ?? {};

  // o Admin SDK ignora as regras do banco: confere o formato aqui para nunca gravar lixo
  const invalid = Object.entries(saved)
    .filter(([id, gift]) => !GIFT_KEY.test(id) || typeof gift?.name !== 'string' || typeof gift?.url !== 'string' || NUMBER_FIELDS.some((field) => typeof gift[field] !== 'number'))
    .map(([id]) => id);
  if (invalid.length) fail(`o arquivo tem presentes fora do formato do app (${invalid.join(', ')}); nada foi alterado`);

  printBanner(connection, values.apply);
  console.log(`Backup de ${backup.exportedAt ?? 'data desconhecida'} (origem: ${backup.target ?? 'desconhecida'})\n`);

  const ref = connection.db.ref(`${ROOT}/gifts`);
  const current = (await ref.get()).val() ?? {};
  const added = Object.keys(saved).filter((id) => !(id in current));
  const removed = Object.keys(current).filter((id) => !(id in saved));
  const changed = Object.keys(saved).filter((id) => id in current && !isDeepStrictEqual(saved[id], current[id]));

  const list = (label, ids, source) => ids.length && console.log(`${label} ${ids.length}: ${ids.map((id) => source[id].name).join(', ')}`);
  list('+ voltam a existir  ', added, saved);
  list('- deixam de existir ', removed, current);
  list('~ voltam ao que eram', changed, saved);

  if (!added.length && !removed.length && !changed.length) {
    console.log('Nada a restaurar: os presentes já estão iguais ao backup.');
  } else if (values.apply) {
    await ref.set(saved);
    console.log(`\nRestaurado: o banco agora tem os ${count(saved)} presentes do backup.`);
  } else {
    console.log('\nRode de novo com --apply para restaurar.');
  }
}

await connection.db.app.delete();
