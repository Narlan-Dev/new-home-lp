// types
import { Gift, ReserveGiftValues } from 'types/gifts';

// ==============================|| REST - RESERVATIONS ||============================== //

// reserva simulada: gravar de verdade no banco (com regras de segurança próprias) fica para a próxima rodada
export async function reserveGift(gift: Gift, values: ReserveGiftValues): Promise<{ reservationId: string }> {
  void gift;
  void values;

  await new Promise((resolve) => setTimeout(resolve, 500));
  return { reservationId: crypto.randomUUID() };
}
