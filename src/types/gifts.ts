export interface Gift {
  /** chave do registro no banco (gerada pelo Firebase) */
  id: string;
  name: string;
  /** preço em reais */
  price: number;
  /** link do presente na loja */
  url: string;
  /** foto do presente: link de imagem (opcional) */
  image?: string;
  /** posição na lista: o menor número aparece primeiro */
  order: number;
  /** já reservado por um convidado (a reserva real chega na próxima rodada) */
  reserved?: boolean;
  /** milissegundos desde 1970, gravados pelo servidor */
  createdAt: number;
  updatedAt: number;
}

/** o que a pessoa administradora informa; `createdAt` e `updatedAt` são gravados pelo servidor */
export interface CreateGift {
  name: string;
  price: number;
  url: string;
  image?: string;
  order: number;
}

/** na edição só vão os campos alterados; `image: null` apaga a foto */
export type UpdateGift = Partial<Omit<CreateGift, 'image'>> & { image?: string | null };

export interface GiftQueryOptions {
  /** filtra pelo nome, sem diferenciar maiúsculas nem acentos */
  search?: string;
}

export interface ReserveGiftValues {
  name: string;
  whatsapp: string;
  email: string;
  message: string;
  anonymous: boolean;
}
