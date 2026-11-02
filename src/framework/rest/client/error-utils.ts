// third-party
import { toast } from 'sonner';

// project-imports
import { ApiError, ApiErrorCode } from './http-client';
import { getLocalizedMessage } from './locale-messages';

export function getApiErrorCode(error: unknown): ApiErrorCode | undefined {
  return error instanceof ApiError ? error.code : undefined;
}

// o banco responde em inglês e com termos técnicos: a interface mostra só as mensagens do catálogo
export function getApiErrorMessage(error: unknown, fallback: string): string {
  switch (getApiErrorCode(error)) {
    case 'permission-denied':
      return getLocalizedMessage('error.permissionDenied');
    case 'network':
      return getLocalizedMessage('error.network');
    default:
      return fallback;
  }
}

export function showApiErrorToast(error: unknown, fallback: string): void {
  toast.error(getApiErrorMessage(error, fallback));
}
