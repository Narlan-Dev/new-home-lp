import ptBr from 'utils/locales/pt-br.json';

// os callbacks de useMutation rodam fora da árvore do React, onde os hooks do react-intl não existem;
// reaproveita o mesmo catálogo que o IntlProvider carrega (ver components/Locales.tsx)
const CATALOG: Record<string, string> = ptBr;

export function getLocalizedMessage(id: string, values?: Record<string, string>): string {
  const template = CATALOG[id] ?? id;
  return Object.entries(values ?? {}).reduce((message, [key, value]) => message.replaceAll(`{${key}}`, value), template);
}
