// project-imports
import { compareGifts } from 'utils/gifts';
import { isValidDatabaseKey } from 'utils/isValidDatabaseKey';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './crud-factory';
import { ApiError, HttpClient } from './http-client';

// types
import { CreateGift, Gift, UpdateGift } from 'types/gifts';

class Client {
  gifts = crudFactory<Gift, CreateGift, UpdateGift>(API_ENDPOINTS.GIFTS, { compare: compareGifts });
  admins = {
    /** as regras deixam cada pessoa ler só o próprio registro; só quem tem `true` ali administra o app */
    isAdmin: async (uid: string) => {
      if (!isValidDatabaseKey(uid)) throw new ApiError('not-found', 'Identificador inválido');
      return (await HttpClient.get<boolean | null>(`${API_ENDPOINTS.ADMINS}/${uid}`)) === true;
    }
  };
}

export default new Client();
