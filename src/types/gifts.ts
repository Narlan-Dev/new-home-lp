export interface Gift {
  /** identificador estável; também compõe a chave do nome em utils/locales */
  id: string;
  /** preço em reais */
  price: number;
  /** link do presente na loja */
  url: string;
  /** foto do presente (opcional) */
  image?: string;
}

export interface ReserveGiftValues {
  name: string;
  whatsapp: string;
  email: string;
  message: string;
  anonymous: boolean;
}
