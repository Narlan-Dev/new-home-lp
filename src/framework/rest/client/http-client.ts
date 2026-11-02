// project-imports
import { FIREBASE_API } from 'config';

// ==============================|| HTTP CLIENT - REALTIME DATABASE (REST) ||============================== //

/** `permission-denied` cobre também dados recusados pela validação das regras (o banco responde igual) */
export type ApiErrorCode = 'permission-denied' | 'not-found' | 'network' | 'config' | 'unknown';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;

  constructor(code: ApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;

/** registrado pelo módulo de login (carregado sob demanda); sem ele as chamadas seguem sem usuário */
export function setAuthTokenProvider(provider: TokenProvider | null) {
  tokenProvider = provider;
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  /** `print=silent`: o banco não devolve o corpo (204), poupando tráfego quando só importa o resultado */
  silent?: boolean;
}

const isNetworkAuthError = (error: unknown) =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'auth/network-request-failed';

async function toApiError(response: Response): Promise<ApiError> {
  let detail: string | undefined;
  try {
    const data: unknown = await response.json();
    if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') detail = data.error;
  } catch {
    // corpo vazio ou que não é JSON
  }

  const code: ApiErrorCode =
    response.status === 401 || response.status === 403 ? 'permission-denied' : response.status === 404 ? 'not-found' : 'unknown';
  return new ApiError(code, detail ?? `HTTP ${response.status}`, response.status);
}

async function request<T>({ method, path, body, silent }: RequestOptions): Promise<T> {
  const databaseURL = FIREBASE_API.databaseURL;
  if (!databaseURL) throw new ApiError('config', 'VITE_APP_FIREBASE_DATABASE_URL não está configurada');

  // a URL do banco pode trazer parâmetros próprios (no emulador: ?ns=<banco>), por isso o caminho é montado com URL
  const url = new URL(databaseURL);
  url.pathname = `${url.pathname.replace(/\/+$/, '')}${path}.json`;
  if (silent) url.searchParams.set('print', 'silent');

  try {
    const token = await tokenProvider?.();
    if (token) url.searchParams.set('auth', token);
  } catch (error) {
    throw isNetworkAuthError(error)
      ? new ApiError('network', 'Sem conexão para renovar o login')
      : new ApiError('permission-denied', 'Não foi possível renovar o login');
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      cache: 'no-store',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new ApiError('network', 'Sem conexão com o banco');
  }

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export class HttpClient {
  static get<T>(path: string) {
    return request<T>({ method: 'GET', path });
  }

  /** o banco devolve `{ name: <chave gerada> }` */
  static post<T>(path: string, data: unknown) {
    return request<T>({ method: 'POST', path, body: data });
  }

  static patch(path: string, data: unknown) {
    return request<void>({ method: 'PATCH', path, body: data, silent: true });
  }

  static delete(path: string) {
    return request<void>({ method: 'DELETE', path, silent: true });
  }
}
