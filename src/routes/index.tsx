import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

// project-imports
import Loadable from 'components/Loadable';
import SimpleLayout from 'layout/Simple';

// render - pages
const PagesLanding = Loadable(lazy(() => import('pages/landing')));
const MaintenanceError404 = Loadable(lazy(() => import('pages/maintenance/404')));

// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SimpleLayout />,
      children: [
        {
          index: true,
          element: <PagesLanding />
        },
        {
          path: '*',
          element: <MaintenanceError404 />
        }
      ]
    }
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
