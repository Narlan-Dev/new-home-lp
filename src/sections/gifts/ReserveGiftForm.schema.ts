// types
import { ReserveGiftValues } from 'types/gifts';

export type ReserveGiftField = 'name' | 'whatsapp' | 'email';

/** mapa campo -> id da mensagem de erro em utils/locales */
export type ReserveGiftErrors = Partial<Record<ReserveGiftField, string>>;

export const emptyReserveGiftValues: ReserveGiftValues = { name: '', whatsapp: '', email: '', message: '', anonymous: false };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// DDD + número (10 ou 11 dígitos); aceita colar com o código do país (+55)
const whatsappDigits = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length > 11 && digits.startsWith('55') ? digits.slice(2) : digits;
};

/** máscara de telefone brasileiro enquanto a pessoa digita: (11) 91234-5678 */
export function formatWhatsapp(value: string) {
  const digits = whatsappDigits(value).slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validateReserveGift(values: ReserveGiftValues): ReserveGiftErrors {
  const errors: ReserveGiftErrors = {};

  if (values.name.trim().length < 2) errors.name = 'reserve.error.name';

  const digits = whatsappDigits(values.whatsapp);
  if (digits.length < 10 || digits.length > 11) errors.whatsapp = 'reserve.error.whatsapp';

  const email = values.email.trim();
  if (email && !EMAIL_PATTERN.test(email)) errors.email = 'reserve.error.email';

  return errors;
}

/** primeiro nome, usado na mensagem de agradecimento */
export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? '';
