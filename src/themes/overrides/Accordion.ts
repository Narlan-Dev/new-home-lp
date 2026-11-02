// material-ui
import { Theme } from '@mui/material/styles';

// project-imports
import { BREAKPOINTS } from 'config';

const mdUp = `@media (min-width:${BREAKPOINTS.md}px)`;

// ==============================|| OVERRIDES - ACCORDION ||============================== //

// item de FAQ do design: apenas uma linha divisória inferior, sem cartão nem sombra
export default function Accordion(theme: Theme) {
  const { palette } = theme.vars;

  return {
    MuiAccordion: {
      defaultProps: { disableGutters: true, square: true, elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderBottom: `1px solid ${palette.divider}`,
          '&::before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '22px 0',
          minHeight: 0,
          gap: 16,
          transition: 'padding-bottom 200ms ease',
          [mdUp]: { padding: '28px 0' },
          '&.Mui-expanded': { minHeight: 0, paddingBottom: 12 },
          '&.Mui-focusVisible': { backgroundColor: 'transparent', outline: `2px solid ${palette.secondary.main}`, outlineOffset: 2 }
        },
        content: { margin: 0, '&.Mui-expanded': { margin: 0 } },
        // o design usa um "+" fixo (sem girar) tanto aberto quanto fechado
        expandIconWrapper: { color: palette.secondary.main, '&.Mui-expanded': { transform: 'none' } }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: { root: { padding: '0 0 22px', [mdUp]: { paddingBottom: 28 } } }
    }
  };
}
