import { Navigate, useLocation } from 'react-router';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import ErrorState from 'components/ErrorState';
import Loader from 'components/Loader';
import { ROUTES } from 'constants/routes';
import useAuth from 'hooks/useAuth';

// types
import { GuardProps } from 'types/auth';

// ==============================|| ADMIN GUARD ||============================== //

// só entra quem está logado E consta em /chaCasaNova/admins (login e permissão, como AuthGuard + RoleGuard da cinova-portal)
export default function AdminGuard({ children }: GuardProps) {
  const { isInitialized, user, isAdmin, hasError, retry } = useAuth();
  const location = useLocation();

  if (!isInitialized) return <Loader />;

  if (hasError) {
    return (
      <ErrorState message={<SafeFormattedMessage id="admin.auth.error" />} onRetry={retry} sx={{ flex: 1, justifyContent: 'center' }} />
    );
  }

  if (!user || !isAdmin) return <Navigate to={ROUTES.ADMIN.LOGIN} replace state={{ from: location.pathname }} />;

  return children;
}
