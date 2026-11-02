// types
import { Gift, ReserveGiftValues } from 'types/gifts';

// ==============================|| REST - GIFTS ||============================== //

/**
 * Reserva um presente em nome da pessoa.
 *
 * ATENÇÃO: ainda não existe back-end definido para as reservas, então esta função só simula o envio
 * (nada é gravado nem enviado a ninguém). Substitua o corpo por uma chamada real quando o destino
 * (API, planilha, WhatsApp...) estiver decidido; o restante da interface não precisa mudar.
 */
export async function reserveGift(gift: Gift, values: ReserveGiftValues): Promise<{ reservationId: string }> {
  void gift;
  void values;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return { reservationId: crypto.randomUUID() };
}
