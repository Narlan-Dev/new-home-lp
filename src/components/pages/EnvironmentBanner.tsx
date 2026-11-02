// material-ui
import Box from '@mui/material/Box';

// project-imports
import SafeFormattedMessage from 'components/@extended/SafeFormattedMessage';
import { FIREBASE_USE_EMULATOR } from 'config';

// só existe fora de produção: no sandbox (emulador) ou no servidor de desenvolvimento ligado ao banco REAL.
// Em um site publicado (build de produção) as duas condições são falsas e nada aparece.
const environment = FIREBASE_USE_EMULATOR ? 'sandbox' : import.meta.env.DEV ? 'live' : null;

// ==============================|| COMPONENT: ENVIRONMENT BANNER ||============================== //

// lembra, em todas as telas da área do casal, em qual banco as alterações vão parar
export default function EnvironmentBanner() {
  if (!environment) return null;

  return (
    <Box
      role="status"
      data-environment={environment}
      sx={{
        flexShrink: 0,
        px: 2,
        py: '6px',
        textAlign: 'center',
        fontSize: '0.8125rem',
        fontWeight: 500,
        lineHeight: 1.4,
        // âmbar para o banco real (cuidado), azul do tema para o sandbox (pode mexer à vontade)
        bgcolor: environment === 'live' ? 'warning.dark' : 'secondary.main',
        color: 'common.white'
      }}
    >
      <SafeFormattedMessage id={`admin.env.${environment}`} />
    </Box>
  );
}
