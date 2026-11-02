import { API_ENDPOINTS } from './client/api-endpoints';

export const queryKeys = {
  gifts: {
    all: [API_ENDPOINTS.GIFTS] as const,
    list: () => [API_ENDPOINTS.GIFTS, 'list'] as const,
    detail: (id: string) => [API_ENDPOINTS.GIFTS, { id }] as const
  }
};
