import { RouterProvider } from 'react-router/dom';

// third-party
import { Toaster } from 'sonner';

// project-imports
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import QueryProvider from 'framework/rest/client/query-provider';

// ==============================|| APP - THEME, ROUTER, LOCAL, DATA  ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <Locales>
        <QueryProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </Locales>
    </ThemeCustomization>
  );
}
