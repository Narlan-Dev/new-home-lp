// project-imports
import colors from './theme/default';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

export function buildPalette() {
  return {
    mode: 'light' as const,
    common: { black: '#000', white: colors.white, overlay: colors.overlay },
    primary: { main: colors.navy, contrastText: colors.white },
    secondary: { main: colors.accent, contrastText: colors.white },
    // estilo "Claro" dos botões do design: fundo branco com texto escuro (usado sobre fundos escuros)
    light: { main: colors.white, contrastText: colors.ink },
    text: { primary: colors.ink, secondary: colors.slate, disabled: colors.placeholder },
    divider: colors.divider,
    background: { default: colors.white, paper: colors.white, soft: colors.soft, media: colors.media }
  };
}
