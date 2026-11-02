export const ROUTES = {
  HOME: '/',
  ADMIN: {
    ROOT: '/admin',
    LOGIN: '/admin/login',
    GIFTS: '/admin/gifts',
    GIFT_NEW: '/admin/gifts/new',
    giftEdit: (id: string) => `/admin/gifts/${id}`
  }
} as const;

// âncoras das seções da landing (usadas no menu e nos botões)
export const SECTION_IDS = {
  EVENT: 'evento',
  ABOUT: 'sobre',
  SCHEDULE: 'programacao',
  GIFTS: 'presentes',
  FAQ: 'duvidas',
  CONTACT: 'contato'
} as const;
