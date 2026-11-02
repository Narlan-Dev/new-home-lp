// types
import { Gift } from 'types/gifts';

// ==============================|| UTILS - GIFTS ||============================== //

/** ordem da lista: posição, depois quem foi cadastrado primeiro, depois o nome */
export const compareGifts = (a: Gift, b: Gift) => a.order - b.order || a.createdAt - b.createdAt || a.name.localeCompare(b.name, 'pt-BR');

/** posição de um presente novo: logo depois do último */
export const nextGiftOrder = (gifts: Gift[]) => gifts.reduce((last, gift) => Math.max(last, gift.order), 0) + 1;

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR');

/** filtra pelo nome, sem diferenciar maiúsculas nem acentos */
export function filterGifts(gifts: Gift[], search = '') {
  const term = normalize(search.trim());
  return term ? gifts.filter((gift) => normalize(gift.name).includes(term)) : gifts;
}
