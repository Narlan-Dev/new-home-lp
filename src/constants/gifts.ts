// types
import { Gift } from 'types/gifts';

// link de loja usado no protótipo do design; troque pelo link real de cada presente
export const GIFT_PLACEHOLDER_URL = 'https://example.com/link-do-presente';

// o nome de cada presente fica em utils/locales (`landing.gifts.items.<id>`); `image` é opcional
export const GIFTS: Gift[] = [
  { id: 'panelas', price: 389.9, url: GIFT_PLACEHOLDER_URL },
  { id: 'jantar', price: 459, url: GIFT_PLACEHOLDER_URL },
  { id: 'cafeteira', price: 219.9, url: GIFT_PLACEHOLDER_URL },
  { id: 'toalhas', price: 149.9, url: GIFT_PLACEHOLDER_URL },
  { id: 'airfryer', price: 399, url: GIFT_PLACEHOLDER_URL },
  { id: 'tacas', price: 129.9, url: GIFT_PLACEHOLDER_URL },
  { id: 'liquidificador', price: 189.9, url: GIFT_PLACEHOLDER_URL },
  { id: 'facas', price: 169.9, url: GIFT_PLACEHOLDER_URL }
];

// quantos presentes aparecem antes de "Ver mais presentes"
export const GIFTS_PREVIEW_COUNT = 8;
