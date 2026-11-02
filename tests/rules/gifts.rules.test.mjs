// Testes das regras de segurança do Realtime Database (database.rules.json) no emulador.
// Rodar com: yarn test:rules
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, describe, it } from 'node:test';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

const ROOT = 'chaCasaNova';
const SERVER_TIME = { '.sv': 'timestamp' };
const ADMIN_UID = 'admin-uid';
const USER_UID = 'user-uid';

/** presente válido, como o app grava ao criar */
const validGift = (overrides = {}) => ({
  name: 'Air fryer',
  price: 399,
  url: 'https://loja.example.com/air-fryer',
  order: 2,
  createdAt: SERVER_TIME,
  updatedAt: SERVER_TIME,
  ...overrides
});

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-cha-casa-nova',
    database: { rules: readFileSync('database.rules.json', 'utf8') }
  });
});

after(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearDatabase();
  // dados iniciais, gravados com as regras desligadas: um admin e um presente existente
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.database();
    await db.ref(`${ROOT}/admins/${ADMIN_UID}`).set(true);
    await db.ref(`${ROOT}/gifts/g1`).set({
      name: 'Jogo de panelas',
      price: 389.9,
      url: 'https://loja.example.com/panelas',
      order: 1,
      createdAt: 1700000000000,
      updatedAt: 1700000000000
    });
  });
});

const anonymous = () => env.unauthenticatedContext().database();
const asUser = () => env.authenticatedContext(USER_UID).database();
const asAdmin = () => env.authenticatedContext(ADMIN_UID).database();

describe('leitura', () => {
  it('qualquer pessoa lê a lista de presentes e um presente', async () => {
    await assertSucceeds(anonymous().ref(`${ROOT}/gifts`).get());
    await assertSucceeds(anonymous().ref(`${ROOT}/gifts/g1`).get());
  });

  it('ninguém lê a raiz do banco nem outros caminhos', async () => {
    await assertFails(anonymous().ref('/').get());
    await assertFails(asAdmin().ref('/').get());
    await assertFails(anonymous().ref(`${ROOT}/reservations`).get());
    await assertFails(asAdmin().ref(`${ROOT}/segredo`).get());
  });

  it('a lista de administradores não é legível; cada pessoa só lê o próprio registro', async () => {
    await assertFails(anonymous().ref(`${ROOT}/admins`).get());
    await assertFails(asUser().ref(`${ROOT}/admins`).get());
    await assertFails(anonymous().ref(`${ROOT}/admins/${ADMIN_UID}`).get());
    await assertFails(asUser().ref(`${ROOT}/admins/${ADMIN_UID}`).get());
    await assertSucceeds(asUser().ref(`${ROOT}/admins/${USER_UID}`).get());
    await assertSucceeds(asAdmin().ref(`${ROOT}/admins/${ADMIN_UID}`).get());
  });
});

describe('escrita de presentes', () => {
  it('visitante anônimo não escreve nem apaga', async () => {
    await assertFails(anonymous().ref(`${ROOT}/gifts/novo`).set(validGift()));
    await assertFails(anonymous().ref(`${ROOT}/gifts/g1/name`).set('Hackeado'));
    await assertFails(anonymous().ref(`${ROOT}/gifts/g1`).remove());
  });

  it('usuário logado que não é admin não escreve nem apaga', async () => {
    await assertFails(asUser().ref(`${ROOT}/gifts/novo`).set(validGift()));
    await assertFails(asUser().ref(`${ROOT}/gifts/g1`).remove());
  });

  it('admin cria, edita parcialmente e apaga', async () => {
    const db = asAdmin();
    await assertSucceeds(db.ref(`${ROOT}/gifts/novo`).set(validGift()));
    await assertSucceeds(db.ref(`${ROOT}/gifts/novo`).update({ name: 'Air fryer 5L', price: 429.9, updatedAt: SERVER_TIME }));
    await assertSucceeds(db.ref(`${ROOT}/gifts/novo`).update({ image: 'https://cdn.example.com/air-fryer.jpg', updatedAt: SERVER_TIME }));
    await assertSucceeds(db.ref(`${ROOT}/gifts/novo`).remove());
  });

  it('admin remove a foto de um presente (image: null) sem apagar o resto', async () => {
    const db = asAdmin();
    await assertSucceeds(db.ref(`${ROOT}/gifts/g1`).update({ image: 'https://cdn.example.com/panelas.jpg', updatedAt: SERVER_TIME }));
    await assertSucceeds(db.ref(`${ROOT}/gifts/g1`).update({ image: null, updatedAt: SERVER_TIME }));

    const snapshot = await db.ref(`${ROOT}/gifts/g1`).get();
    assert.equal(snapshot.hasChild('image'), false);
    assert.equal(snapshot.child('name').val(), 'Jogo de panelas');
  });

  it('admin não consegue promover ninguém nem escrever fora de gifts', async () => {
    const db = asAdmin();
    await assertFails(db.ref(`${ROOT}/admins/${USER_UID}`).set(true));
    await assertFails(db.ref(`${ROOT}/admins/${ADMIN_UID}`).set(false));
    await assertFails(db.ref(`${ROOT}/outro`).set('x'));
    await assertFails(db.ref('/raiz').set('x'));
  });
});

describe('validação dos dados (mesmo como admin)', () => {
  const rejects = (titulo, gift) =>
    it(`rejeita ${titulo}`, async () => {
      await assertFails(asAdmin().ref(`${ROOT}/gifts/novo`).set(gift));
    });

  rejects('preço negativo', validGift({ price: -1 }));
  rejects('preço acima do limite', validGift({ price: 1000001 }));
  rejects('preço como texto', validGift({ price: '399' }));
  rejects('nome vazio', validGift({ name: '' }));
  rejects('nome com mais de 120 caracteres', validGift({ name: 'a'.repeat(121) }));
  rejects('link javascript:', validGift({ url: 'javascript:alert(1)' }));
  rejects('link ftp://', validGift({ url: 'ftp://loja.example.com' }));
  rejects('link vazio', validGift({ url: '' }));
  rejects('imagem em data: URL', validGift({ image: 'data:image/png;base64,AAAA' }));
  rejects('campo desconhecido', validGift({ admin: true }));
  rejects('ordem como texto', validGift({ order: 'primeiro' }));
  rejects('reserved que não é booleano', validGift({ reserved: 'sim' }));
  rejects('createdAt forjado', validGift({ createdAt: 123 }));
  rejects('updatedAt forjado', validGift({ updatedAt: 123 }));

  it('rejeita presente sem um campo obrigatório', async () => {
    const { url: _url, ...semUrl } = validGift();
    await assertFails(asAdmin().ref(`${ROOT}/gifts/novo`).set(semUrl));
  });

  it('rejeita alterar o createdAt de um presente existente', async () => {
    await assertFails(asAdmin().ref(`${ROOT}/gifts/g1`).update({ createdAt: 1, updatedAt: SERVER_TIME }));
  });

  it('rejeita atualização com updatedAt que não é a hora do servidor', async () => {
    await assertFails(asAdmin().ref(`${ROOT}/gifts/g1`).update({ name: 'Novo nome', updatedAt: 1700000000001 }));
  });

  it('aceita link com https e com http', async () => {
    const db = asAdmin();
    await assertSucceeds(db.ref(`${ROOT}/gifts/a`).set(validGift({ url: 'https://exemplo.com.br/p?id=1&cor=azul' })));
    await assertSucceeds(db.ref(`${ROOT}/gifts/b`).set(validGift({ url: 'http://exemplo.com.br/produto' })));
  });
});
