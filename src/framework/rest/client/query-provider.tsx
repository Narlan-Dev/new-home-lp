import { lazy, ReactNode, Suspense, useState } from 'react';

// third-party
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// project-imports
import { getApiErrorCode, showApiErrorToast } from './error-utils';
import { getLocalizedMessage } from './locale-messages';

// as ferramentas de desenvolvimento nem entram no build de produção
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then((module) => ({ default: module.ReactQueryDevtools })))
  : null;

// repetir não adianta quando o banco recusou o acesso ou o registro não existe
const shouldRetry = (failureCount: number, error: Error) => {
  const code = getApiErrorCode(error);
  return code !== 'permission-denied' && code !== 'not-found' && code !== 'config' && failureCount < 1;
};

interface QueryProviderProps {
  children: ReactNode;
}

// ==============================|| REACT QUERY - PROVIDER ||============================== //

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // os dados mudam pouco: cada tela reaproveita o que já buscou por 30 s e atualiza ao voltar para a aba
            staleTime: 30_000,
            retry: shouldRetry
          },
          mutations: {
            onError: (error, _variables, _onMutateResult, context) => {
              if (context.meta?.suppressErrorToast) return;
              showApiErrorToast(error, context.meta?.errorMessage ?? getLocalizedMessage('error.generic'));
            }
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
