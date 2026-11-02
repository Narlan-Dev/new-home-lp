// dados do casal e do evento, usados em mais de um ponto da página (os textos da interface ficam em utils/locales)
const FIRST_NAME = 'Luarnderson';
const SECOND_NAME = 'Paty';

export const COUPLE = {
  // o hero mostra os dois nomes em duas linhas ("Luarnderson" / "& Paty")
  first: FIRST_NAME,
  second: SECOND_NAME,
  // textos corridos (assinatura, créditos, calendário, mensagens de WhatsApp): "Luarnderson & Paty"
  names: `${FIRST_NAME} & ${SECOND_NAME}`,
  // monograma da logo: "L & P"
  initials: `${FIRST_NAME[0]} & ${SECOND_NAME[0]}`
};

export const EVENT = {
  // fuso de Brasília (UTC-3)
  startsAt: '2026-12-12T15:00:00-03:00',
  endsAt: '2026-12-12T19:00:00-03:00',
  // endereço do design (placeholder): usado no link "Ver no mapa" e no evento do calendário
  address: 'Rua das Flores, 123, Bairro'
} as const;

// fotos do casal (opcionais): enquanto estiverem vazias, a página mostra os placeholders do design
export const ABOUT_PHOTO: string | undefined = undefined;
