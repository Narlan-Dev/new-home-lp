import { lazy } from 'react';
import { Navigate } from 'react-router';

// project-imports
import Loadable from 'components/Loadable';
import { ROUTES } from 'constants/routes';
import AdminGuard from 'utils/route-guard/AdminGuard';
import GuestGuard from 'utils/route-guard/GuestGuard';

// render - admin (tudo em chunks separados: quem só visita a landing não baixa nada daqui, nem o SDK do Firebase)
const AdminRoot = Loadable(lazy(() => import('layout/Admin/Root')));
const AdminLayout = Loadable(lazy(() => import('layout/Admin')));
const AdminLogin = Loadable(lazy(() => import('pages/admin/login')));
const AdminGiftList = Loadable(lazy(() => import('pages/admin/gifts/list')));
const AdminGiftCreate = Loadable(lazy(() => import('pages/admin/gifts/create')));
const AdminGiftEdit = Loadable(lazy(() => import('pages/admin/gifts/edit')));

// ==============================|| ROUTES - ADMIN ||============================== //

const AdminRoutes = {
  path: ROUTES.ADMIN.ROOT,
  element: <AdminRoot />,
  children: [
    {
      index: true,
      element: <Navigate to={ROUTES.ADMIN.GIFTS} replace />
    },
    {
      path: 'login',
      element: (
        <GuestGuard>
          <AdminLogin />
        </GuestGuard>
      )
    },
    {
      element: (
        <AdminGuard>
          <AdminLayout />
        </AdminGuard>
      ),
      children: [
        { path: 'gifts', element: <AdminGiftList /> },
        { path: 'gifts/new', element: <AdminGiftCreate /> },
        { path: 'gifts/:id', element: <AdminGiftEdit /> }
      ]
    }
  ]
};

export default AdminRoutes;
