export interface GiftFormValues {
  name: string;
  /** texto digitado, em reais (ex.: "1.299,90") */
  price: string;
  url: string;
  /** vazio = sem foto */
  image: string;
  /** vazio = vai para o fim da lista */
  order: string;
}

export type GiftFormField = keyof GiftFormValues;

/** mapa campo -> id da mensagem de erro em utils/locales */
export type GiftFormErrors = Partial<Record<GiftFormField, string>>;
