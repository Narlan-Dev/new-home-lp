import { ReactNode } from 'react';

// material-ui
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// project-imports
import { buildPalette } from './palette';
import Typography from './typography';
import componentsOverride from './overrides';
import config, { BREAKPOINTS, CSS_VAR_PREFIX } from 'config';

// types
import type {} from './extend-theme-types';

type ThemeCustomizationProps = {
  children: ReactNode;
};

const baseTheme = createTheme({
  breakpoints: { values: BREAKPOINTS },
  shape: { borderRadius: 12 },
  typography: Typography(config.fontFamily, config.fontFamilyDisplay),
  colorSchemes: { light: { palette: buildPalette() } },
  cssVariables: { cssVarPrefix: CSS_VAR_PREFIX }
});

const theme = createTheme(baseTheme, { components: componentsOverride(baseTheme) });

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

export default function ThemeCustomization({ children }: ThemeCustomizationProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider disableTransitionOnChange theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
