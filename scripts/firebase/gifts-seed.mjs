// Presentes de exemplo do protótipo da landing: usados pelo seed (banco real) e pelo sandbox (emulador).

// link de loja do protótipo: troque pelo link real de cada presente no painel (/admin/gifts)
export const PLACEHOLDER_URL = 'https://example.com/link-do-presente';

// [id estável, nome, preço em reais]; a posição na lista é a ordem deste array
export const SEED_GIFTS = [
  ['panelas', 'Jogo de panelas', 389.9],
  ['jantar', 'Aparelho de jantar', 459],
  ['cafeteira', 'Cafeteira elétrica', 219.9],
  ['toalhas', 'Jogo de toalhas', 149.9],
  ['airfryer', 'Air fryer', 399],
  ['tacas', 'Kit de taças', 129.9],
  ['liquidificador', 'Liquidificador', 189.9],
  ['facas', 'Conjunto de facas', 169.9]
];

/** registro como o app grava: `timestamp` troca o valor pela hora do servidor (ServerValue.TIMESTAMP) */
export const giftRecord = ([, name, price], index, timestamp) => ({
  name,
  price,
  url: PLACEHOLDER_URL,
  order: index + 1,
  createdAt: timestamp,
  updatedAt: timestamp
});
