// material-ui
import { alpha, Theme } from '@mui/material/styles';

// project-imports
import colors from '../theme/default';

// ==============================|| OVERRIDES - OUTLINED INPUT ||============================== //

// campo de formulário do design: 52px de altura, raio 12, borda de 1px e rótulo fora do campo
export default function OutlinedInput(theme: Theme) {
  const { palette } = theme.vars;

  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: palette.common.white,
          '&:not(.MuiInputBase-multiline)': { height: 52 },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.inputBorder, borderWidth: 1 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.secondary.main },
          '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}` },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: palette.primary.main, borderWidth: 1 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: palette.error.main }
        },
        input: {
          padding: '0 16px',
          height: '100%',
          '&::placeholder': { color: palette.text.disabled, opacity: 1 }
        },
        multiline: { padding: 16, alignItems: 'flex-start', minHeight: 116 },
        inputMultiline: { padding: 0, height: 'auto' }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          ...theme.typography.body2,
          fontWeight: 500,
          fontSize: '0.875rem',
          color: palette.text.primary,
          '&.Mui-focused': { color: palette.text.primary },
          '&.Mui-error': { color: palette.text.primary }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          ...theme.typography.caption,
          margin: '8px 0 0',
          color: palette.text.secondary,
          '&.Mui-error': { color: palette.error.main }
        }
      }
    }
  };
}
