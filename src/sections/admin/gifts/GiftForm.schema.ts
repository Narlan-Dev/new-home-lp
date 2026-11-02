// project-imports
import { GIFT_LIMITS } from 'constants/gifts';

// types
import { CreateGift, Gift, UpdateGift } from 'types/gifts';
import { GiftFormErrors, GiftFormValues } from './GiftForm.types';

const PRICE_FORMAT = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "389,90", "1.299,90", "389.90" ou "R$ 389,9" -> reais; `null` quando não dá para entender o valor */
export function parsePrice(text: string): number | null {
  const cleaned = text.replace(/R\$|\s/g, '');
  if (!/^\d[\d.,]*$/.test(cleaned)) return null;

  let normalized = cleaned;
  const commaAt = cleaned.indexOf(',');
  if (commaAt >= 0) {
    // com vírgula, ela é o separador decimal e os pontos são de milhar ("1.299,90")
    if (cleaned.indexOf(',', commaAt + 1) >= 0 || cleaned.lastIndexOf('.') > commaAt) return null;
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    // só pontos: "389.90" é decimal, mas "1.299" e "1.299.000" são milhares (grupos de 3 dígitos depois do primeiro)
    const [first, ...rest] = cleaned.split('.');
    if (first !== '0' && rest.every((group) => group.length === 3)) normalized = [first, ...rest].join('');
    else if (rest.length > 1) return null;
  }

  const decimals = normalized.split('.')[1] ?? '';
  if (decimals.length > 2) return null;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** 1299.9 -> "1.299,90" */
export const formatPriceInput = (value: number) => PRICE_FORMAT.format(value);

/** campo em branco = automático (`undefined`); texto que não é número vira `NaN` e é recusado na validação */
const parseOrder = (text: string) => {
  const trimmed = text.trim();
  return trimmed ? Number(trimmed.replace(',', '.')) : undefined;
};

/** mesma exigência das regras do banco (começa com http:// ou https://), mais a conferência de que é um endereço de verdade */
export function isHttpUrl(value: string) {
  if (value.length > GIFT_LIMITS.urlMax || !/^https?:\/\/.+/.test(value)) return false;
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
}

export function validateGiftForm(values: GiftFormValues): GiftFormErrors {
  const errors: GiftFormErrors = {};

  const name = values.name.trim();
  if (!name || name.length > GIFT_LIMITS.nameMax) errors.name = 'admin.gifts.form.error.name';

  const price = parsePrice(values.price);
  if (price === null || price <= 0 || price > GIFT_LIMITS.priceMax) errors.price = 'admin.gifts.form.error.price';

  if (!isHttpUrl(values.url.trim())) errors.url = 'admin.gifts.form.error.url';

  const image = values.image.trim();
  if (image && !isHttpUrl(image)) errors.image = 'admin.gifts.form.error.image';

  const order = parseOrder(values.order);
  if (order !== undefined && !Number.isFinite(order)) errors.order = 'admin.gifts.form.error.order';

  return errors;
}

// as conversões abaixo supõem valores já validados; `fallbackOrder` vale quando a posição foi deixada em branco
export function toCreateGift(values: GiftFormValues, fallbackOrder: number): CreateGift {
  const image = values.image.trim();

  return {
    name: values.name.trim(),
    price: parsePrice(values.price) ?? 0,
    url: values.url.trim(),
    ...(image ? { image } : {}),
    order: parseOrder(values.order) ?? fallbackOrder
  };
}

/** na edição a foto em branco apaga a anterior (`null` remove o campo no banco) */
export function toUpdateGift(values: GiftFormValues, fallbackOrder: number): UpdateGift {
  return { ...toCreateGift(values, fallbackOrder), image: values.image.trim() || null };
}

export function giftToFormValues(gift: Gift): GiftFormValues {
  return {
    name: gift.name,
    price: formatPriceInput(gift.price),
    url: gift.url,
    image: gift.image ?? '',
    order: String(gift.order)
  };
}
