import { RouterProvider } from 'react-router/dom';

// project-imports
import router from 'routes';
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <Locales>
        <RouterProvider router={router} />
      </Locales>
    </ThemeCustomization>
  );
}
