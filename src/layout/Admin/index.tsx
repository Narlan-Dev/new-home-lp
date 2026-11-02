import { Link as RouterLink, Outlet } from 'react-router';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { COUPLE } from 'constants/event';
import { ROUTES } from 'constants/routes';
import { useLogout } from 'framework/rest/auth';
import useAuth from 'hooks/useAuth';

// assets
import { ExternalLinkIcon, LogoutIcon } from 'assets/icons';

// os botões do tema são grandes (feitos para a landing); na barra do painel ficam mais compactos
const headerButtonSx = { px: 2.5, py: 1 };

// ==============================|| LAYOUT - ADMIN ||============================== //

export default function AdminLayout() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <Box sx={{ flex: 1, bgcolor: 'background.soft' }}>
      <Box component="header" sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 2 }}>
          <Link
            component={RouterLink}
            to={ROUTES.ADMIN.GIFTS}
            underline="none"
            aria-label={COUPLE.names}
            sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, color: 'text.primary' }}
          >
            <Typography
              component="span"
              variant="h4"
              sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, lineHeight: { xs: 1.211, md: 1.211 } }}
            >
              {COUPLE.initials}
            </Typography>
            <Typography component="span" sx={{ display: { xs: 'none', sm: 'inline' }, color: 'text.secondary', fontSize: '0.9375rem' }}>
              <SafeFormattedMessage id="admin.title" />
            </Typography>
          </Link>

          <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {user?.email && (
              <Typography component="span" sx={{ display: { xs: 'none', md: 'inline' }, color: 'text.secondary', fontSize: '0.875rem' }}>
                {user.email}
              </Typography>
            )}
            <Button
              component={RouterLink}
              to={ROUTES.HOME}
              size="small"
              variant="outlined"
              endIcon={<ExternalLinkIcon size={16} />}
              sx={headerButtonSx}
            >
              <SafeFormattedMessage id="admin.viewSite" />
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<LogoutIcon size={16} />}
              onClick={() => void logout()}
              sx={{ ...headerButtonSx, color: 'text.primary' }}
            >
              <SafeFormattedMessage id="action.logout" />
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
