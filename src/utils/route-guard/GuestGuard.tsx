import { Navigate, useLocation } from 'react-router';

// project-imports
import Loader from 'components/Loader';
import { ROUTES } from 'constants/routes';
import useAuth from 'hooks/useAuth';

// types
import { GuardProps } from 'types/auth';

// ==============================|| GUEST GUARD ||============================== //

// a tela de login não faz sentido para quem já é administrador: volta para onde a pessoa estava indo
export default function GuestGuard({ children }: GuardProps) {
  const { isInitialized, user, isAdmin } = useAuth();
  const location = useLocation();

  if (!isInitialized) return <Loader />;

  if (user && isAdmin) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from ?? ROUTES.ADMIN.GIFTS} replace />;
  }

  return children;
}
