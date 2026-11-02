// material-ui
import { alpha, Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - BUTTON ||============================== //

// botão "pílula" do design em 4 estilos:
// Escuro = contained/primary · Claro = contained/light · Contorno escuro = outlined/primary · Contorno claro = outlined/light
export default function Button(theme: Theme) {
  const { palette } = theme.vars;
  const focusRing = { outline: `2px solid ${palette.secondary.main}`, outlineOffset: 2 };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '16px 32px',
          gap: 8,
          boxShadow: 'none',
          // como no design, o rótulo nunca quebra: em botões estreitos ele transborda o padding, centralizado
          whiteSpace: 'nowrap',
          '&:focus-visible': focusRing
        },
        // botões dentro dos cards de presente (altura 44/46 no design); o texto segue em 15px como nos demais
        sizeSmall: { padding: '12px 32px', fontSize: theme.typography.button.fontSize },
        // o contorno é de 1px e conta no tamanho do botão (54px de altura no design)
        outlined: { borderWidth: 1, '&:hover': { borderWidth: 1 } }
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: { '&:hover': { backgroundColor: palette.primary.light } }
        },
        {
          props: { variant: 'contained', color: 'light' },
          style: { '&:hover': { backgroundColor: palette.background.soft } }
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: palette.primary.main,
            '&:hover': { borderColor: palette.primary.main, backgroundColor: alpha(theme.palette.primary.main, 0.06) }
          }
        },
        {
          props: { variant: 'outlined', color: 'light' },
          style: {
            color: palette.light.main,
            borderColor: palette.light.main,
            '&:hover': { borderColor: palette.light.main, backgroundColor: alpha(theme.palette.light.main, 0.12) }
          }
        }
      ]
    }
  };
}
