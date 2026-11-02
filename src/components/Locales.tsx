import { ReactNode, Suspense, use } from 'react';

// third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';

// project-imports
import Loader from './Loader';
import config from 'config';

// types
import { I18n } from 'types/config';

type Messages = Record<string, string> | Record<string, MessageFormatElement[]>;

// load locales files
const localeLoaders: Record<I18n, () => Promise<{ default: Messages }>> = {
  'pt-br': () => import('utils/locales/pt-br.json')
};

const localeCache = new Map<I18n, Promise<{ default: Messages }>>();

const loadLocaleData = (locale: I18n) => {
  if (!localeCache.has(locale)) localeCache.set(locale, localeLoaders[locale]());
  return localeCache.get(locale)!;
};

function LocaleProvider({ locale, children }: { locale: I18n; children: ReactNode }) {
  const { default: messages } = use(loadLocaleData(locale));

  return (
    <IntlProvider locale={locale} defaultLocale="pt-br" messages={messages}>
      {children}
    </IntlProvider>
  );
}

// ==============================|| LOCALIZATION ||============================== //

export default function Locales({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader />}>
      <LocaleProvider locale={config.i18n}>{children}</LocaleProvider>
    </Suspense>
  );
}
