// material-ui
import { alpha, Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - DIALOG ||============================== //

// modais do design: raio 24 e véu escuro (#111a2e a 62%) atrás
export default function Dialog(theme: Theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        root: { '& .MuiBackdrop-root': { backgroundColor: alpha(theme.palette.common.overlay, 0.62) } },
        paper: { borderRadius: 24, backgroundImage: 'none' },
        paperFullScreen: { borderRadius: 0 }
      }
    }
  };
}
