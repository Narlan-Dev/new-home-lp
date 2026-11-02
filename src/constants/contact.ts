// project-imports
import { COUPLE } from 'constants/event';

// contatos do design (placeholders): troque pelos dados reais do casal
export const CONTACT = {
  phoneDisplay: '(00) 90000-0000',
  // WhatsApp em formato internacional, só dígitos (55 + DDD + número)
  whatsappNumber: '5500900000000',
  email: 'luarnderson.paty@email.com',
  instagram: 'luarnderson.e.paty'
} as const;

export const PIX = {
  key: 'luarnderson.paty@email.com',
  // placeholder: use o nome completo de quem recebe o Pix
  holder: `${COUPLE.first} e ${COUPLE.second}`
} as const;
