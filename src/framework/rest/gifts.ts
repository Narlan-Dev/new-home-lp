import { useCallback } from 'react';

// third-party
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// project-imports
import client from './client';
import { getLocalizedMessage } from './client/locale-messages';
import { queryKeys } from './query-keys';
import { filterGifts } from 'utils/gifts';
import { isValidDatabaseKey } from 'utils/isValidDatabaseKey';

// types
import { CreateGift, Gift, GiftQueryOptions, UpdateGift } from 'types/gifts';

const NO_GIFTS: Gift[] = [];

// ==============================|| REST - GIFTS ||============================== //

export function useGift({ id }: { id: string | undefined }) {
  const { data, isLoading, error, isFetching, refetch } = useQuery<Gift, Error>({
    queryKey: queryKeys.gifts.detail(id ?? ''),
    queryFn: () => client.gifts.get({ id: id! }),
    enabled: isValidDatabaseKey(id)
  });

  return { gift: data, isLoading, error, isFetching, refetch };
}

export function useGifts(options?: GiftQueryOptions) {
  const search = options?.search;
  // a lista inteira fica em cache numa chave só; a busca por nome é só um recorte dela
  const select = useCallback((gifts: Gift[]) => filterGifts(gifts, search), [search]);

  const { data, isLoading, error, isFetching, refetch } = useQuery<Gift[], Error>({
    queryKey: queryKeys.gifts.list(),
    queryFn: () => client.gifts.all(),
    select
  });

  return { gifts: data ?? NO_GIFTS, isLoading, error, isFetching, refetch };
}

export const useCreateGiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, CreateGift>({
    mutationFn: client.gifts.create,
    meta: { errorMessage: getLocalizedMessage('toast.gifts.createError') },
    onSuccess: () => {
      toast.success(getLocalizedMessage('toast.gifts.createSuccess'));
      queryClient.invalidateQueries({ queryKey: queryKeys.gifts.all });
    }
  });
};

export const useUpdateGiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, UpdateGift & { id: string }>({
    mutationFn: client.gifts.update,
    meta: { errorMessage: getLocalizedMessage('toast.gifts.updateError') },
    onSuccess: () => {
      toast.success(getLocalizedMessage('toast.gifts.updateSuccess'));
      // `all` é prefixo das chaves da lista e do detalhe: atualiza as duas
      queryClient.invalidateQueries({ queryKey: queryKeys.gifts.all });
    }
  });
};

export const useDeleteGiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { id: string }>({
    mutationFn: client.gifts.delete,
    mutationKey: ['gifts', 'delete'],
    meta: { errorMessage: getLocalizedMessage('toast.gifts.deleteError') },
    onSuccess: (_response, { id }) => {
      toast.success(getLocalizedMessage('toast.gifts.deleteSuccess'));
      queryClient.removeQueries({ queryKey: queryKeys.gifts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.gifts.all });
    }
  });
};
