import { Outlet } from 'react-router';

// material-ui
import Box from '@mui/material/Box';

// project-imports
import ConfirmProvider from 'components/modal/ConfirmProvider';
import EnvironmentBanner from 'components/pages/EnvironmentBanner';
import AuthProvider from 'contexts/auth/AuthProvider';

// ==============================|| LAYOUT - ADMIN ROOT ||============================== //

// o que toda a área do casal compartilha: o login (Firebase Auth, carregado só aqui), o diálogo de confirmação
// e a faixa que avisa em qual banco se está (só fora de produção)
export default function AdminRoot() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        {/* a área do casal não deve aparecer em buscadores */}
        <meta name="robots" content="noindex" />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <EnvironmentBanner />
          {/* as telas preenchem o resto da altura (flex: 1) com ou sem a faixa */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </Box>
        </Box>
      </ConfirmProvider>
    </AuthProvider>
  );
}
