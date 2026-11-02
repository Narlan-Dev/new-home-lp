// material-ui
import { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - LINK ||============================== //

export default function Link(theme: Theme) {
  return {
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: {
          color: 'inherit',
          '&:focus-visible': { outline: `2px solid ${theme.vars.palette.secondary.main}`, outlineOffset: 3, borderRadius: 2 }
        }
      }
    }
  };
}
